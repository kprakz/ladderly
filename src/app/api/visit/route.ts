import { NextResponse } from "next/server";
import { normaliseCountry, recordCount } from "@/lib/server/downloadStats";
import { isLocalServer } from "@/lib/server/ollama";
import { rejectCrossSite } from "@/lib/server/requestGuard";

/** Cookie that marks a browser as already counted. */
const COUNTED_COOKIE = "ladderly_web";
/** Crawlers and previews that shouldn't count. */
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse/i;

/**
 * POST /api/visit — counts one person trying Ladderly in a browser, by country only (from the hosting platform's
 * geolocation header; no IP address or personal data is stored), once per browser. The desktop app's local server
 * never counts (those people are counted as downloads).
 * @param {Request} req The request (sent by the app page in the browser).
 * @returns {Promise<Response>} 204 No Content.
 */
export async function POST(req: Request) {
  const blocked = rejectCrossSite(req);
  if (blocked) return blocked;
  const res = new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  const counted = (req.headers.get("cookie") ?? "").split(/;\s*/).some((c) => c.startsWith(`${COUNTED_COOKIE}=`));
  if (counted || isLocalServer() || BOT.test(req.headers.get("user-agent") ?? "")) return res;
  await recordCount("web", normaliseCountry(req.headers.get("x-vercel-ip-country")));
  res.cookies.set(COUNTED_COOKIE, "1", { maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  return res;
}
