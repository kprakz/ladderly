import { getAiSettings } from "./ai/settingsStore";
import type { LearningPath, PathRequest, StreamEvent } from "./schema";

/**
 * Requests a learning path from `/api/path` (with the user's AI engine settings) and reads the streamed NDJSON response.
 * @param {PathRequest} request Topic plus optional level, hours per week and goal.
 * @param {(textSoFar: string) => void} onText Called on every chunk with all the raw JSON text received so far (for the live preview).
 * @param {AbortSignal} [signal] Optional signal to cancel the request.
 * @param {(message: string) => void} [onStatus] Called with progress notes before writing starts (e.g. "Searching the web…").
 * @returns {Promise<LearningPath>} The validated path. Rejects with an `Error` holding a user-friendly message on failure.
 */
export async function generatePath(
  request: PathRequest,
  onText: (textSoFar: string) => void,
  signal?: AbortSignal,
  onStatus?: (message: string) => void,
): Promise<LearningPath> {
  const res = await fetch("/api/path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // The user's AI engine choice (and their own API key, if they added one) goes with the request.
    body: JSON.stringify({ ...request, ai: getAiSettings() }),
    signal,
  });

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let text = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as StreamEvent;
      if (event.type === "status") {
        onStatus?.(event.message);
      } else if (event.type === "delta") {
        text += event.text;
        onText(text);
      } else if (event.type === "done") {
        return event.path;
      } else {
        throw new Error(event.message);
      }
    }
  }

  throw new Error("The connection closed before the path was finished. Please retry.");
}

/**
 * Pulls stage titles out of incomplete JSON so the loading panel can show progress.
 * Only looks inside the `"stages"` section, so titles of featured videos or courses aren't mistaken for stages.
 * @param {string} partialJson The raw JSON text received so far (may be cut off mid-way).
 * @returns {string[]} Every complete stage `"title"` value found, in order.
 */
export function stageTitlesSoFar(partialJson: string): string[] {
  const start = partialJson.indexOf('"stages"');
  if (start === -1) return [];
  // The stages section ends where the next top-level field begins (the order varies, so take the earliest).
  const ends = ['"finishLine"', '"pitfalls"', '"courses"', '"featured"', '"summary"']
    .map((key) => partialJson.indexOf(key, start))
    .filter((i) => i !== -1);
  const section = partialJson.slice(start, ends.length ? Math.min(...ends) : undefined);
  return [...section.matchAll(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => {
    try {
      return JSON.parse(`"${m[1]}"`) as string;
    } catch {
      return m[1];
    }
  });
}
