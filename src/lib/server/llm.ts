import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { GeneratedPathSchema } from "@/lib/schema";
import { ollamaBaseUrl } from "./ollama";

/**
 * Server-only adapters for the three AI engines. Each streams text through `onDelta` and resolves with the
 * full text and how it stopped. They never log API keys.
 */

/** What every engine needs to write a path. */
export type GenerateArgs = {
  system: string;
  user: string;
  signal: AbortSignal;
  onDelta: (text: string) => void;
};

/** How generation ended: normally, refused by the model's safety checks, or cut off at the length limit. */
export type GenerateOutcome = { text: string; stop: "end" | "refusal" | "length" };

/** An error whose message is already safe and friendly to show the user. */
export class UserFacingError extends Error {}

/**
 * Writes a path with Claude (Anthropic API), streaming structured JSON.
 * @param {string} apiKey The Anthropic API key (the user's own, or the server's).
 * @param {string} model A Claude model ID, e.g. "claude-opus-5".
 * @param {GenerateArgs} args Prompts, abort signal and the delta callback.
 * @returns {Promise<GenerateOutcome>} The full JSON text and stop reason.
 */
export async function generateWithClaude(apiKey: string, model: string, args: GenerateArgs): Promise<GenerateOutcome> {
  const client = new Anthropic({ apiKey });
  const isOpus5 = model === "claude-opus-5";
  const stream = client.beta.messages.stream(
    {
      model,
      max_tokens: 32000, // room for stages, quizzes and course picks
      // Effort isn't supported on Haiku 4.5; Opus 5 and Sonnet 5 use "medium" for a quick, structured task.
      output_config: {
        format: betaZodOutputFormat(GeneratedPathSchema),
        ...(model === "claude-haiku-4-5" ? {} : { effort: "medium" as const }),
      },
      // On Opus 5, if a safety classifier declines, Anthropic retries on its recommended fallback model.
      ...(isOpus5 ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
      system: args.system,
      messages: [{ role: "user", content: args.user }],
    },
    { signal: args.signal },
  );

  let text = "";
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      text += event.delta.text;
      args.onDelta(event.delta.text);
    }
  }
  const message = await stream.finalMessage();
  const stop = message.stop_reason === "refusal" ? "refusal" : message.stop_reason === "max_tokens" ? "length" : "end";
  return { text, stop };
}

/**
 * Writes a path with an OpenAI model (Responses API), streaming structured JSON.
 * @param {string} apiKey The user's OpenAI API key.
 * @param {string} model An OpenAI model ID, e.g. "gpt-6.1-sol".
 * @param {GenerateArgs} args Prompts, abort signal and the delta callback.
 * @returns {Promise<GenerateOutcome>} The full JSON text and stop reason.
 */
export async function generateWithOpenAI(apiKey: string, model: string, args: GenerateArgs): Promise<GenerateOutcome> {
  const client = new OpenAI({ apiKey });
  const stream = await client.responses.create(
    {
      model,
      instructions: args.system,
      input: args.user,
      text: { format: zodTextFormat(GeneratedPathSchema, "learning_path") },
      max_output_tokens: 32000,
      stream: true,
    },
    { signal: args.signal },
  );

  let text = "";
  let stop: GenerateOutcome["stop"] = "end";
  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      text += event.delta;
      args.onDelta(event.delta);
    } else if (event.type === "response.refusal.delta") {
      stop = "refusal";
    } else if (event.type === "response.incomplete") {
      stop = event.response.incomplete_details?.reason === "content_filter" ? "refusal" : "length";
    } else if (event.type === "response.failed") {
      throw new UserFacingError("OpenAI couldn't finish this request. Please retry.");
    }
  }
  return { text, stop };
}

/** JSON Schema for Ollama's structured output, built once from the zod schema. */
const OLLAMA_FORMAT = (() => {
  const { $schema: _ignored, ...schema } = z.toJSONSchema(GeneratedPathSchema) as Record<string, unknown>;
  void _ignored;
  return schema;
})();

/**
 * Writes a path with a local open-source model through Ollama, streaming structured JSON.
 * @param {string} model An installed Ollama model name, e.g. "qwen3.5:4b".
 * @param {GenerateArgs} args Prompts, abort signal and the delta callback.
 * @returns {Promise<GenerateOutcome>} The full JSON text and stop reason.
 */
export async function generateWithOllama(model: string, args: GenerateArgs): Promise<GenerateOutcome> {
  let res: Response;
  try {
    res = await fetch(`${ollamaBaseUrl()}/api/chat`, {
      method: "POST",
      signal: args.signal,
      body: JSON.stringify({
        model,
        stream: true,
        format: OLLAMA_FORMAT,
        think: false, // faster; "thinking" models otherwise spend minutes reasoning on a CPU
        options: { temperature: 0.4, num_ctx: 8192, num_predict: 7000 },
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: args.user },
        ],
      }),
    });
  } catch (err) {
    if (args.signal.aborted) throw err;
    throw new UserFacingError("Couldn't reach Ollama. Make sure it's installed and running, then retry.");
  }
  if (!res.ok || !res.body) {
    const detail = ((await res.json().catch(() => null)) as { error?: string } | null)?.error ?? "";
    if (/not found/i.test(detail)) {
      throw new UserFacingError(`The model "${model}" isn't downloaded yet. Download it in AI settings, then retry.`);
    }
    throw new UserFacingError(`Ollama returned an error${detail ? `: ${detail}` : ""}. Please retry.`);
  }

  let text = "";
  let stop: GenerateOutcome["stop"] = "end";
  let buffer = "";
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const chunk = JSON.parse(line) as { message?: { content?: string }; done?: boolean; done_reason?: string; error?: string };
      if (chunk.error) throw new UserFacingError(`Ollama error: ${chunk.error}`);
      const piece = chunk.message?.content ?? "";
      if (piece) {
        text += piece;
        args.onDelta(piece);
      }
      if (chunk.done && chunk.done_reason === "length") stop = "length";
    }
  }
  return { text, stop };
}

/**
 * Turns an error from any engine into a message that is safe to show users. API keys never appear in it.
 * @param {unknown} err The caught error.
 * @param {string} engine Name of the engine, e.g. "Anthropic" or "OpenAI", for the message.
 * @returns {string} A short, user-friendly explanation.
 */
export function describeLlmError(err: unknown, engine: string): string {
  if (err instanceof UserFacingError) return err.message;
  if (err instanceof Anthropic.AuthenticationError || err instanceof OpenAI.AuthenticationError) {
    return `The ${engine} API key was rejected. Check it in AI settings.`;
  }
  if (err instanceof Anthropic.RateLimitError || err instanceof OpenAI.RateLimitError) {
    return `${engine} is rate-limiting requests (or the account is out of credit). Wait a moment and retry.`;
  }
  if (err instanceof Anthropic.APIConnectionError || err instanceof OpenAI.APIConnectionError) {
    return `Couldn't reach ${engine}. Check your internet connection.`;
  }
  if (err instanceof Anthropic.NotFoundError || err instanceof OpenAI.NotFoundError) {
    return `${engine} doesn't recognise the selected model, or your key can't use it. Pick another model in AI settings.`;
  }
  if (err instanceof Anthropic.APIError || err instanceof OpenAI.APIError) {
    // Log only the status: provider error messages can echo part of the key.
    console.error(`${engine} API error`, err.status);
    return `${engine} returned an error${err.status ? ` (${err.status})` : ""}. Please retry.`;
  }
  console.error("Generation error", err instanceof Error ? err.name : typeof err);
  return "Something went wrong while generating the path. Please retry.";
}
