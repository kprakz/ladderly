// Download and browser-learner counts per country, kept in Upstash Redis through its REST API (free tier; added to a
// Vercel project from the Marketplace, which sets the env vars below). Only an ISO country code and a number are
// stored: no IP addresses, no user agents, nothing that identifies a person.

import { pipeline, redisConfig } from "./redis";

/** What's counted: Windows app downloads, and people who open the app in a browser. */
export type CountKind = "downloads" | "web";

const KEYS: Record<CountKind, { countries: string; total: string }> = {
  downloads: { countries: "ladderly:downloads:countries", total: "ladderly:downloads:total" },
  web: { countries: "ladderly:web:countries", total: "ladderly:web:total" },
};

/** Totals for one kind of count. */
export type CountTotals = { total: number; countries: Record<string, number> };

/** Totals for the website's map: downloads at the top level (as before), browser learners under `web`. */
export type DownloadStats = { enabled: boolean } & CountTotals & { web: CountTotals };

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
 * Adds one to a country's count. Does nothing (and never throws) when counting isn't set up or Redis is down, so a
 * stats problem can never block a download or the app.
 * @param {CountKind} kind "downloads" or "web".
 * @param {string} country Two-letter country code (or "XX" for unknown).
 * @returns {Promise<void>}
 */
export async function recordCount(kind: CountKind, country: string): Promise<void> {
  if (!redisConfig()) return;
  try {
    await pipeline([
      ["HINCRBY", KEYS[kind].countries, country, 1],
      ["INCR", KEYS[kind].total],
    ]);
  } catch (err) {
    console.error(`Could not record ${kind}:`, err instanceof Error ? err.message : "unknown error");
  }
}

/**
 * Adds one download for a country (see `recordCount`).
 * @param {string} country Two-letter country code (or "XX" for unknown).
 * @returns {Promise<void>}
 */
export function recordDownload(country: string): Promise<void> {
  return recordCount("downloads", country);
}

/**
 * Turns a Redis HGETALL reply (a flat [key, value, key, value…] list) into an object of numbers.
 * @param {unknown} flat The reply.
 * @returns {Record<string, number>} Counts per country.
 */
function toCounts(flat: unknown): Record<string, number> {
  const counts: Record<string, number> = {};
  if (Array.isArray(flat)) for (let i = 0; i + 1 < flat.length; i += 2) counts[String(flat[i])] = Number(flat[i + 1]) || 0;
  return counts;
}

/**
 * Reads the download and browser-learner totals.
 * @returns {Promise<DownloadStats>} Totals per country; `enabled: false` (and zeros) when counting isn't set up.
 */
export async function getDownloadStats(): Promise<DownloadStats> {
  const empty: CountTotals = { total: 0, countries: {} };
  if (!redisConfig()) return { enabled: false, ...empty, web: empty };
  try {
    const [dl, dlTotal, web, webTotal] = await pipeline([
      ["HGETALL", KEYS.downloads.countries],
      ["GET", KEYS.downloads.total],
      ["HGETALL", KEYS.web.countries],
      ["GET", KEYS.web.total],
    ]);
    return {
      enabled: true,
      total: Number(dlTotal) || 0,
      countries: toCounts(dl),
      web: { total: Number(webTotal) || 0, countries: toCounts(web) },
    };
  } catch (err) {
    console.error("Could not read stats:", err instanceof Error ? err.message : "unknown error");
    return { enabled: true, ...empty, web: empty };
  }
}
