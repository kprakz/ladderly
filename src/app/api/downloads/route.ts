import { getDownloadStats } from "@/lib/server/downloadStats";

/**
 * GET /api/downloads — download totals per country, for the website's map. Cached briefly at the edge.
 * @returns {Promise<Response>} JSON `{ enabled, total, countries: { "IN": 12, ... } }`.
 */
export async function GET() {
  const stats = await getDownloadStats();
  return Response.json(stats, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
