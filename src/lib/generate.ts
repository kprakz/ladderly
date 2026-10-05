import type { LearningPath, PathRequest, StreamEvent } from "./schema";

/**
 * Requests a learning path from `/api/path` and reads the streamed NDJSON response.
 * @param {PathRequest} request Topic plus optional level, hours per week and goal.
 * @param {(textSoFar: string) => void} onText Called on every chunk with all the raw JSON text received so far (for the live preview).
 * @param {AbortSignal} [signal] Optional signal to cancel the request.
 * @returns {Promise<LearningPath>} The validated path. Rejects with an `Error` holding a user-friendly message on failure.
 */
export async function generatePath(
  request: PathRequest,
  onText: (textSoFar: string) => void,
  signal?: AbortSignal,
): Promise<LearningPath> {
  const res = await fetch("/api/path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
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
      if (event.type === "delta") {
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
 * @param {string} partialJson The raw JSON text received so far (may be cut off mid-way).
 * @returns {string[]} Every complete `"title"` value found, in order.
 */
export function stageTitlesSoFar(partialJson: string): string[] {
  return [...partialJson.matchAll(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => {
    try {
      return JSON.parse(`"${m[1]}"`) as string;
    } catch {
      return m[1];
    }
  });
}
