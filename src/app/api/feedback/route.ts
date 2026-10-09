import { normaliseCountry } from "@/lib/server/downloadStats";
import { allowSend, feedbackStorageReady, FeedbackInputSchema, isFeedbackAdmin, listFeedback, saveFeedback } from "@/lib/server/feedback";
import { isLocalServer } from "@/lib/server/ollama";
import { rejectCrossSite } from "@/lib/server/requestGuard";

/** The public website, where the desktop app sends feedback (its own local server has no database). */
const SITE_URL = (process.env.LADDERLY_SITE_URL || "https://ladderly.vercel.app").replace(/\/$/, "");

/**
 * POST /api/feedback — saves feedback from the website or the app. On the desktop app's local server (no
 * database), it passes the message on to the public website instead. Rejects cross-site posts, bots (hidden trap
 * field) and more than 5 messages per sender in 10 minutes. Stores no IP address.
 * @param {Request} req JSON body matching `FeedbackInputSchema`.
 * @returns {Promise<Response>} `{ ok: true }`, or `{ error }` with 400/403/429/503.
 */
export async function POST(req: Request) {
  const blocked = rejectCrossSite(req);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "That didn't look like feedback." }, { status: 400 });
  }
  const parsed = FeedbackInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 400 });
  }
  // Bots fill in the hidden field; pretend it worked so they don't adapt.
  if (parsed.data.website) return Response.json({ ok: true });

  if (!feedbackStorageReady()) {
    if (!isLocalServer()) return Response.json({ error: "Feedback isn't switched on yet. Please try again later." }, { status: 503 });
    return forwardToSite(parsed.data);
  }

  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
    if (!(await allowSend(ip))) {
      return Response.json({ error: "Thanks! You've sent a lot of feedback just now. Please try again in a few minutes." }, { status: 429 });
    }
    await saveFeedback(parsed.data, normaliseCountry(req.headers.get("x-vercel-ip-country")));
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Could not save feedback:", err instanceof Error ? err.message : "unknown error");
    return Response.json({ error: "Couldn't send your feedback right now. Please try again later." }, { status: 503 });
  }
}

/**
 * Passes feedback from the desktop app on to the public website.
 * @param {unknown} data The validated feedback.
 * @returns {Promise<Response>} The website's answer, or a friendly error when offline.
 */
async function forwardToSite(data: unknown): Promise<Response> {
  try {
    const res = await fetch(`${SITE_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json().catch(() => ({ error: "Couldn't send your feedback right now." }));
    return Response.json(json, { status: res.status });
  } catch {
    return Response.json({ error: "Couldn't reach Ladderly's website. Check your internet connection and try again." }, { status: 503 });
  }
}

/**
 * GET /api/feedback — the newest feedback, for the maker only (Authorization: Bearer FEEDBACK_ADMIN_TOKEN).
 * @param {Request} req The request.
 * @returns {Promise<Response>} `{ entries }`, or 401.
 */
export async function GET(req: Request) {
  if (!isFeedbackAdmin(req.headers.get("authorization"))) {
    return Response.json({ error: "Wrong password." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  if (!feedbackStorageReady()) return Response.json({ entries: [], ready: false }, { headers: { "Cache-Control": "no-store" } });
  try {
    return Response.json({ entries: await listFeedback(), ready: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Couldn't load feedback." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
