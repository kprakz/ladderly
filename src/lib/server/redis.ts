// Upstash Redis over its REST API (free tier, added to a Vercel project from the Marketplace, which sets the env
// vars below). Used for download counts and feedback. Plain `fetch`, no extra dependency.

/**
 * Finds the Redis REST endpoint and token (Vercel's Upstash integration names first, then Upstash's own).
 * @returns {{ url: string, token: string } | null} The connection details, or `null` when counting isn't set up.
 */
export function redisConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

/**
 * Runs Redis commands in one round trip.
 * @param {(string | number)[][]} commands e.g. `[["INCR", "key"]]`.
 * @returns {Promise<unknown[]>} Each command's result, in order.
 * @throws {Error} If counting isn't set up or Redis returns an error.
 */
export async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const config = redisConfig();
  if (!config) throw new Error("Download stats storage is not configured.");
  const res = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded with HTTP ${res.status}.`);
  const results = (await res.json()) as { result?: unknown; error?: string }[];
  const failed = results.find((r) => r.error);
  if (failed) throw new Error("Redis command failed.");
  return results.map((r) => r.result);
}
