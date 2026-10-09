// Download counts per country, kept in Upstash Redis through its REST API (free tier; added to a Vercel project
// from the Marketplace, which sets the env vars below). Only an ISO country code and a number are stored:
// no IP addresses, no user agents, nothing that identifies a person.

import { pipeline, redisConfig } from "./redis";

const COUNTRIES_KEY = "ladderly:downloads:countries";
const TOTAL_KEY = "ladderly:downloads:total";

/** Download totals for the website's map. */
export type DownloadStats = { enabled: boolean; total: number; countries: Record<string, number> };

/**
 * Normalises a country code from the hosting platform's geolocation header.
 * @param {string | null} code e.g. "IN" from `x-vercel-ip-country`.
 * @returns {string} A two-letter uppercase code, or "XX" when unknown.
 */
export function normaliseCountry(code: string | null): string {
  const c = (code ?? "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : "XX";
}

/**
 * Adds one download for a country. Does nothing (and never throws) when counting isn't set up or Redis is down,
 * so a stats problem can never block a download.
 * @param {string} country Two-letter country code (or "XX" for unknown).
 * @returns {Promise<void>}
 */
export async function recordDownload(country: string): Promise<void> {
  if (!redisConfig()) return;
  try {
    await pipeline([
      ["HINCRBY", COUNTRIES_KEY, country, 1],
      ["INCR", TOTAL_KEY],
    ]);
  } catch (err) {
    console.error("Could not record download:", err instanceof Error ? err.message : "unknown error");
  }
}

/**
 * Reads the download totals.
 * @returns {Promise<DownloadStats>} Totals per country; `enabled: false` (and zeros) when counting isn't set up.
 */
export async function getDownloadStats(): Promise<DownloadStats> {
  if (!redisConfig()) return { enabled: false, total: 0, countries: {} };
  try {
    const [flat, total] = await pipeline([["HGETALL", COUNTRIES_KEY], ["GET", TOTAL_KEY]]);
    const countries: Record<string, number> = {};
    if (Array.isArray(flat)) {
      for (let i = 0; i + 1 < flat.length; i += 2) countries[String(flat[i])] = Number(flat[i + 1]) || 0;
    }
    return { enabled: true, total: Number(total) || 0, countries };
  } catch (err) {
    console.error("Could not read download stats:", err instanceof Error ? err.message : "unknown error");
    return { enabled: true, total: 0, countries: {} };
  }
}
