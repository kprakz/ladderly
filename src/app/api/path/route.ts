import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getDemoPath, isDemoMode } from "@/lib/demo";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { LearningPathSchema, PathRequestSchema, type StreamEvent } from "@/lib/schema";

// The SDK reads ANTHROPIC_API_KEY from the environment (.env.local). This file only runs on the server.
const client = new Anthropic();

/**
 * `POST /api/path`: validates the request, then streams a learning path back as NDJSON events
 * (`delta` chunks, then one `done` or `error`). Serves sample data in demo mode, otherwise calls Claude.
 * @param {Request} req HTTP request whose JSON body is a `PathRequest`.
 * @returns {Promise<Response>} A 400 JSON error for invalid input, otherwise a streaming `application/x-ndjson` response.
 */
export async function POST(req: Request): Promise<Response> {
  const body = await req.json().catch(() => null);
  const parsed = PathRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  if (isDemoMode()) return demoResponse(parsed.data.topic);

  const stream = new ReadableStream({
    async start(controller) {
      /**
       * Writes one event to the response stream.
       * @param {StreamEvent} event The `delta`, `done` or `error` event.
       * @returns {void}
       */
      const send = (event: StreamEvent) => controller.enqueue(encodeEvent(event));

      try {
        const claude = client.beta.messages.stream(
          {
            model: "claude-opus-5",
            max_tokens: 16000,
            output_config: { effort: "medium", format: betaZodOutputFormat(LearningPathSchema) },
            // If a safety classifier declines, retry server-side on Anthropic's recommended fallback model.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: buildUserPrompt(parsed.data) }],
          },
          { signal: req.signal },
        );

        let text = "";
        for await (const event of claude) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            text += event.delta.text;
            send({ type: "delta", text: event.delta.text });
          }
        }

        const message = await claude.finalMessage();
        if (message.stop_reason === "refusal") {
          send({ type: "error", message: "Claude declined to create a path for this topic. Try rephrasing it." });
        } else if (message.stop_reason === "max_tokens") {
          send({ type: "error", message: "The response was cut off before it finished. Please retry." });
        } else {
          const result = LearningPathSchema.safeParse(safeJsonParse(text));
          if (result.success) send({ type: "done", path: result.data });
          else send({ type: "error", message: "Claude returned a path in an unexpected format. Please retry." });
        }
      } catch (err) {
        if (!req.signal.aborted) send({ type: "error", message: describeError(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: NDJSON_HEADERS });
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
      for (let i = 0; i < json.length; i += 60) {
        send({ type: "delta", text: json.slice(i, i + 60) });
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

/**
 * Turns an error from the Anthropic SDK (or anything else) into a message that is safe to show users.
 * @param {unknown} err The caught error.
 * @returns {string} A short, user-friendly explanation.
 */
function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return "The Anthropic API key is invalid. Check your API key settings.";
  if (err instanceof Anthropic.RateLimitError) return "Rate limited by the Anthropic API. Wait a moment and retry.";
  if (err instanceof Anthropic.APIConnectionError) return "Couldn't reach the Anthropic API. Check your connection.";
  if (err instanceof Anthropic.APIError) {
    console.error("Anthropic API error", err.status, err.message);
    return `The Anthropic API returned an error${err.status ? ` (${err.status})` : ""}. Please retry.`;
  }
  console.error(err);
  return "Something went wrong while generating the path. Please retry.";
}
