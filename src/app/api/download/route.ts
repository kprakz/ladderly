import { NextResponse, type NextRequest } from "next/server";
import { normaliseCountry, recordDownload } from "@/lib/server/downloadStats";

/** Where the Windows installer lives: the latest GitHub release (overridable with LADDERLY_DOWNLOAD_URL). */
const DEFAULT_DOWNLOAD_URL = "https://github.com/kprakz/ladderly/releases/latest/download/Ladderly-Setup.exe";

/** Cookie that marks a browser as already counted, so repeat clicks don't inflate the numbers. */
const COUNTED_COOKIE = "ladderly_dl";

/** Crawlers and link previews that shouldn't count as downloads. */
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|curl|wget/i;

/**
 * GET /api/download — counts the download for the visitor's country (from the hosting platform's geolocation
 * header; no IP address or personal data is stored), once per browser, then redirects to the installer.
 * @param {NextRequest} request The incoming request.
 * @returns {Promise<NextResponse>} A 302 redirect to the installer.
 */
export async function GET(request: NextRequest) {
  const target = process.env.LADDERLY_DOWNLOAD_URL || DEFAULT_DOWNLOAD_URL;
  const response = NextResponse.redirect(target, 302);
  response.headers.set("Cache-Control", "no-store");

  const alreadyCounted = request.cookies.has(COUNTED_COOKIE);
  const isBot = BOT.test(request.headers.get("user-agent") ?? "");
  if (!alreadyCounted && !isBot) {
    await recordDownload(normaliseCountry(request.headers.get("x-vercel-ip-country")));
    response.cookies.set(COUNTED_COOKIE, "1", { maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  }
  return response;
}
