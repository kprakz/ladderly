import { AiSettingsSchema, type AiSettings } from "@/lib/ai/models";
import { getDemoPath, isDemoMode } from "@/lib/demo";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import { LearningPathSchema, PathRequestSchema, repairGeneratedPath, type StreamEvent } from "@/lib/schema";
import {
  describeLlmError,
  generateWithClaude,
  generateWithOllama,
  generateWithOpenAI,
  type GenerateArgs,
  type GenerateOutcome,
} from "@/lib/server/llm";
import { isLocalServer } from "@/lib/server/ollama";
import { rejectCrossSite } from "@/lib/server/requestGuard";

/** An engine chosen for one request: what to call it, and how to run it. */
type Engine = { name: string; run: (args: GenerateArgs) => Promise<GenerateOutcome>; compact: boolean };

/**
 * `POST /api/path`: validates the request, picks the AI engine from the user's settings, then streams a learning
 * path back as NDJSON events (`delta` chunks, then one `done` or `error`). Engines: the free demo, a local Ollama
 * model (only when this server runs on the user's computer), or Claude / OpenAI with the user's own key (or the
 * server's key, if it has one).
 * @param {Request} req HTTP request whose JSON body is a `PathRequest` plus an optional `ai` settings object.
 * @returns {Promise<Response>} A 400 JSON error for invalid input, otherwise a streaming `application/x-ndjson` response.
 */
export async function POST(req: Request): Promise<Response> {
  const blocked = rejectCrossSite(req);
  if (blocked) return blocked;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const parsed = PathRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  const ai = AiSettingsSchema.safeParse(body?.ai ?? {});
  if (!ai.success) return Response.json({ error: "Invalid AI settings. Open AI settings and check them." }, { status: 400 });

  const choice = chooseEngine(ai.data);
  if (choice === "demo") return demoResponse(parsed.data.topic);
  if (typeof choice === "string") return Response.json({ error: choice }, { status: 400 });

  const engine = choice;
  const stream = new ReadableStream({
    async start(controller) {
      /**
       * Writes one event to the response stream.
       * @param {StreamEvent} event The `delta`, `done` or `error` event.
       * @returns {void}
       */
      const send = (event: StreamEvent) => controller.enqueue(encodeEvent(event));

      try {
        const { text, stop } = await engine.run({
          system: buildSystemPrompt(engine.compact),
          user: buildUserPrompt(parsed.data),
          signal: req.signal,
          onDelta: (t) => send({ type: "delta", text: t }),
        });

        if (stop === "refusal") {
          send({ type: "error", message: `${engine.name} declined to create a path for this topic. Try rephrasing it.` });
        } else if (stop === "length") {
          send({ type: "error", message: "The response was cut off before it finished. Please retry." });
        } else {
          const result = LearningPathSchema.safeParse(repairGeneratedPath(safeJsonParse(text)));
          if (result.success) send({ type: "done", path: result.data });
          else
            send({
              type: "error",
              message: engine.compact
                ? `${engine.name} returned an incomplete path. Small local models sometimes do; retry, or try a larger model.`
                : `${engine.name} returned a path in an unexpected format. Please retry.`,
            });
        }
      } catch (err) {
        if (!req.signal.aborted) send({ type: "error", message: describeLlmError(err, engine.name) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: NDJSON_HEADERS });
}

/**
 * Picks the engine for a request from the user's AI settings.
 * @param {AiSettings} ai The validated settings sent by the browser.
 * @returns {Engine | "demo" | string} An engine to run, "demo" for sample data, or an error message to return.
 */
function chooseEngine(ai: AiSettings): Engine | "demo" | string {
  switch (ai.provider) {
    case "demo":
      return "demo";
    case "ollama": {
      if (!isLocalServer()) {
        return "Local models only work in the Ladderly desktop app (or when you run Ladderly on your own computer). Choose another engine in AI settings.";
      }
      if (!ai.ollamaModel) return "Choose a local model in AI settings first.";
      const model = ai.ollamaModel;
      return { name: "The local model", compact: true, run: (args) => generateWithOllama(model, args) };
    }
    case "anthropic": {
      const key = ai.anthropicKey || process.env.ANTHROPIC_API_KEY;
      if (!key) return "Add your Anthropic API key in AI settings first.";
      const model = ai.anthropicModel ?? "claude-opus-5";
      return { name: "Claude", compact: false, run: (args) => generateWithClaude(key, model, args) };
    }
    case "openai": {
      const key = ai.openaiKey || process.env.OPENAI_API_KEY;
      if (!key) return "Add your OpenAI API key in AI settings first.";
      const model = ai.openaiModel ?? "gpt-6.1-sol";
      return { name: "OpenAI", compact: false, run: (args) => generateWithOpenAI(key, model, args) };
    }
    default: {
      // "auto": the server's own setup decides (its Anthropic key if it has one, otherwise the free demo).
      if (isDemoMode()) return "demo";
      const key = process.env.ANTHROPIC_API_KEY as string;
      return { name: "Claude", compact: false, run: (args) => generateWithClaude(key, "claude-opus-5", args) };
    }
  }
}

const NDJSON_HEADERS = { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" };
const encoder = new TextEncoder();

/**
 * Encodes one stream event as a line of newline-delimited JSON.
 * @param {StreamEvent} event The `delta`, `done` or `error` event to send.
 * @returns {Uint8Array} UTF-8 bytes of the JSON line, ending with a newline.
 */
function encodeEvent(event: StreamEvent): Uint8Array {
  return encoder.encode(JSON.stringify(event) + "\n");
}

/**
 * Waits for a given time.
 * @param {number} ms Delay in milliseconds.
 * @returns {Promise<void>} Resolves after the delay.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Demo mode: streams a sample path in small chunks so the loading preview behaves like the real thing.
 * @param {string} topic The requested topic, used to pick the sample.
 * @returns {Response} A streaming NDJSON response ending in a `done` event.
 */
function demoResponse(topic: string): Response {
  const path = LearningPathSchema.parse(getDemoPath(topic));
  const json = JSON.stringify(path);
  const stream = new ReadableStream({
    async start(controller) {
      /**
       * Writes one event to the response stream.
       * @param {StreamEvent} event The `delta`, `done` or `error` event.
       * @returns {void}
       */
      const send = (event: StreamEvent) => controller.enqueue(encodeEvent(event));
      await sleep(600); // simulate "thinking"
      for (let i = 0; i < json.length; i += 120) {
        send({ type: "delta", text: json.slice(i, i + 120) });
        await sleep(25);
      }
      send({ type: "done", path });
      controller.close();
    },
  });
  return new Response(stream, { headers: NDJSON_HEADERS });
}

/**
 * Parses JSON without throwing.
 * @param {string} text Text that should contain JSON.
 * @returns {unknown} The parsed value, or `null` if the text is not valid JSON.
 */
function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
