import { rejectCrossSite } from "@/lib/server/requestGuard";
import { isLocalServer, ollamaBaseUrl, ollamaStatus } from "@/lib/server/ollama";

/**
 * `POST /api/ai/ollama/delete`: removes a downloaded model from the local Ollama install to free disk space.
 * Only works on a local server, and only for a model that is actually installed.
 * @param {Request} req JSON body `{ model: string }`.
 * @returns {Promise<Response>} JSON `{ ok: true }`, or a JSON error (403 / 400 / 502).
 */
export async function POST(req: Request): Promise<Response> {
  const blocked = rejectCrossSite(req);
  if (blocked) return blocked;
  if (!isLocalServer()) return Response.json({ error: "Local models only work in the desktop app." }, { status: 403 });
  const { model } = ((await req.json().catch(() => ({}))) ?? {}) as { model?: string };
  const status = await ollamaStatus();
  if (!status.reachable) return Response.json({ error: "Couldn't reach Ollama." }, { status: 502 });
  if (!status.models.some((m) => m.name === model)) {
    return Response.json({ error: "That model isn't installed." }, { status: 400 });
  }
  const res = await fetch(`${ollamaBaseUrl()}/api/delete`, { method: "DELETE", body: JSON.stringify({ model }) });
  if (!res.ok) return Response.json({ error: `Ollama couldn't delete it (${res.status}).` }, { status: 502 });
  return Response.json({ ok: true });
}
