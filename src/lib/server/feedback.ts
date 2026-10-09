import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { pipeline, redisConfig } from "./redis";

const LIST_KEY = "ladderly:feedback";
/** Keep the newest entries only, so storage stays well inside the free tier. */
const MAX_ENTRIES = 5000;
/** At most this many messages per sender per window (see `allowSend`). */
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 600;

/** What the feedback form sends. `website` is a hidden trap field: people leave it empty, bots fill it in. */
export const FeedbackInputSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  message: z.string().trim().min(3, "Please write a few words.").max(2000, "Please keep it under 2,000 characters."),
  email: z.union([z.literal(""), z.string().trim().email("That email doesn't look right.").max(200)]).optional(),
  source: z.enum(["website", "app", "desktop"]),
  version: z.string().max(20).optional(),
  page: z.string().max(200).optional(),
  website: z.string().max(500).optional(),
});
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

/** A stored feedback entry. */
export type FeedbackEntry = Omit<FeedbackInput, "website"> & { id: string; at: string; country: string };

/**
 * Whether feedback can be stored on this server.
 * @returns {boolean} True when the Redis database is connected.
 */
export function feedbackStorageReady(): boolean {
  return redisConfig() !== null;
}

/**
 * A short, one-way fingerprint of the sender for rate limiting. The IP address itself is never stored, and the key
 * expires after the rate-limit window.
 * @param {string} ip The sender's IP address.
 * @returns {string} 16 hex characters.
 */
function senderKey(ip: string): string {
  const secret = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "ladderly";
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 16);
}

/**
 * Counts this message against the sender's limit.
 * @param {string} ip The sender's IP address ("" when unknown).
 * @returns {Promise<boolean>} True if they may send it.
 */
export async function allowSend(ip: string): Promise<boolean> {
  if (!ip) return true;
  const key = `${LIST_KEY}:rl:${senderKey(ip)}`;
  const [count] = await pipeline([
    ["INCR", key],
    ["EXPIRE", key, RATE_WINDOW_SECONDS, "NX"],
  ]);
  return Number(count) <= RATE_LIMIT;
}

/**
 * Stores one feedback entry (newest first).
 * @param {FeedbackInput} input The validated form.
 * @param {string} country Two-letter country code, or "XX".
 * @returns {Promise<void>}
 */
export async function saveFeedback(input: FeedbackInput, country: string): Promise<void> {
  const entry: FeedbackEntry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    rating: input.rating,
    message: input.message,
    email: input.email || undefined,
    source: input.source,
    version: input.version,
    page: input.page,
    country,
  };
  await pipeline([
    ["LPUSH", LIST_KEY, JSON.stringify(entry)],
    ["LTRIM", LIST_KEY, 0, MAX_ENTRIES - 1],
  ]);
}

/**
 * Reads the newest feedback.
 * @param {number} [limit=500] How many entries to return.
 * @returns {Promise<FeedbackEntry[]>} Newest first.
 */
export async function listFeedback(limit = 500): Promise<FeedbackEntry[]> {
  const [raw] = await pipeline([["LRANGE", LIST_KEY, 0, limit - 1]]);
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    try {
      return [JSON.parse(String(item)) as FeedbackEntry];
    } catch {
      return [];
    }
  });
}

/**
 * Checks the admin password for reading feedback (FEEDBACK_ADMIN_TOKEN), in constant time.
 * @param {string | null} authorization The request's Authorization header, "Bearer <token>".
 * @returns {boolean} True if it matches. Always false when no admin token is configured.
 */
export function isFeedbackAdmin(authorization: string | null): boolean {
  const expected = process.env.FEEDBACK_ADMIN_TOKEN;
  const given = authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!expected || expected.length < 12 || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
