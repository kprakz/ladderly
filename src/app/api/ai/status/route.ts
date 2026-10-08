import type { AiStatus } from "@/lib/ai/models";
import { isDemoMode } from "@/lib/demo";
import { isLocalServer, ollamaStatus, systemInfo } from "@/lib/server/ollama";

/**
 * `GET /api/ai/status`: what the AI settings screen needs to know about this server. On a local server
 * (desktop app or dev) it also reports Ollama's installed models, free disk space and memory; on a hosted
 * server those are `null`, since a website can't use the visitor's Ollama.
 * @returns {Promise<Response>} JSON `AiStatus`.
 */
export async function GET(): Promise<Response> {
  const local = isLocalServer();
  const [ollama, system] = local ? await Promise.all([ollamaStatus(), systemInfo()]) : [null, null];
  const status: AiStatus = { local, serverDefault: isDemoMode() ? "demo" : "claude", ollama, system };
  return Response.json(status, { headers: { "Cache-Control": "no-store" } });
}
