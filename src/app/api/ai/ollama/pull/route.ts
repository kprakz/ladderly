import { OLLAMA_CATALOG } from "@/lib/ai/models";
import { rejectCrossSite } from "@/lib/server/requestGuard";
import { isLocalServer, ollamaBaseUrl } from "@/lib/server/ollama";

/**
 * `POST /api/ai/ollama/pull`: downloads a catalog model into the local Ollama install, streaming progress as
 * NDJSON lines `{ status, completed?, total? }` and finally `{ status: "success" }` or `{ error }`.
 * Only works on a local server, and only for models in Ladderly's catalog.
 * @param {Request} req JSON body `{ model: string }`.
 * @returns {Promise<Response>} A streaming NDJSON response, or a JSON error (403 / 400 / 502).
 */
export async function POST(req: Request): Promise<Response> {
  const blocked = rejectCrossSite(req);
  if (blocked) return blocked;
  if (!isLocalServer()) return Response.json({ error: "Local models only work in the desktop app." }, { status: 403 });
  const { model } = ((await req.json().catch(() => ({}))) ?? {}) as { model?: string };
  if (!OLLAMA_CATALOG.some((m) => m.id === model)) {
    return Response.json({ error: "That model isn't in Ladderly's list." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${ollamaBaseUrl()}/api/pull`, {
      method: "POST",
      body: JSON.stringify({ model, stream: true }),
      signal: req.signal,
    });
  } catch {
    return Response.json({ error: "Couldn't reach Ollama. Is it installed and running?" }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return Response.json({ error: `Ollama couldn't start the download (${upstream.status}).` }, { status: 502 });
  }
  // Ollama already streams NDJSON progress lines; pass them straight through.
  return new Response(upstream.body, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
