/**
 * Rejects requests that come from a different website. Browsers attach an `Origin` header to cross-site POSTs,
 * so this stops another site the user visits from silently driving Ladderly's local server (downloading or
 * deleting models, or spending the server's API credit).
 * @param {Request} req The incoming request.
 * @returns {Response | null} A 403 response for a cross-site request, or `null` if it may proceed.
 */
export function rejectCrossSite(req: Request): Response | null {
  const origin = req.headers.get("origin");
  if (!origin) return null; // Same-origin requests from some clients, or non-browser tools.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (host && new URL(origin).host === host) return null;
  } catch {
    // Malformed Origin header: treat as cross-site.
  }
  return Response.json({ error: "Cross-site requests aren't allowed." }, { status: 403 });
}
