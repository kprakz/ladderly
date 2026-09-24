import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getDemoPath, isDemoMode } from "@/lib/demo";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { LearningPathSchema, PathRequestSchema, type StreamEvent } from "@/lib/schema";

// The SDK reads ANTHROPIC_API_KEY from the environment (.env.local). This file only runs on the server.
const client = new Anthropic();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PathRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  if (isDemoMode()) return demoResponse(parsed.data.topic);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

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

/** Demo mode: stream a canned path in small chunks so the loading preview behaves like the real thing. */
function demoResponse(topic: string) {
  const path = LearningPathSchema.parse(getDemoPath(topic));
  const json = JSON.stringify(path);
  const encoder = new TextEncoder();
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
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

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function describeError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return "The Anthropic API key is invalid. Check .env.local.";
  if (err instanceof Anthropic.RateLimitError) return "Rate limited by the Anthropic API. Wait a moment and retry.";
  if (err instanceof Anthropic.APIConnectionError) return "Couldn't reach the Anthropic API. Check your connection.";
  if (err instanceof Anthropic.APIError) {
    console.error("Anthropic API error", err.status, err.message);
    return `The Anthropic API returned an error${err.status ? ` (${err.status})` : ""}. Please retry.`;
  }
  console.error(err);
  return "Something went wrong while generating the path. Please retry.";
}
