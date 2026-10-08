import { z } from "zod";

/** The AI engines Ladderly can use to write paths. */
export const PROVIDER_IDS = ["auto", "demo", "ollama", "anthropic", "openai"] as const;
export type ProviderId = (typeof PROVIDER_IDS)[number];

/** Claude models offered for a user's own Anthropic key. Claude Opus 5 is the default. */
export const ANTHROPIC_MODELS = [
  { id: "claude-opus-5", label: "Claude Opus 5", note: "Most capable (default)" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5", note: "Fast and capable, lower cost" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", note: "Fastest and cheapest" },
] as const;
export type AnthropicModelId = (typeof ANTHROPIC_MODELS)[number]["id"];

/** OpenAI models offered for a user's own OpenAI key (current models as listed in OpenAI's docs). */
export const OPENAI_MODELS = [
  { id: "gpt-6.1-sol", label: "GPT-6.1 Sol", note: "Balanced quality and cost (default)" },
  { id: "gpt-6-astra", label: "GPT-6 Astra", note: "Most capable, highest cost" },
  { id: "gpt-6-luna", label: "GPT-6 Luna", note: "Cheapest, for high volume" },
] as const;
export type OpenAiModelId = (typeof OPENAI_MODELS)[number]["id"];

/**
 * Open-source models from the Ollama library that Ladderly suggests, best quality first.
 * `sizeGB` is the exact download size of the default tag (from Ollama's registry). `ramGB` is the memory
 * needed to run it comfortably; `quality` ranks how well it writes detailed, valid paths (higher is better).
 */
export const OLLAMA_CATALOG = [
  { id: "gpt-oss:20b", label: "gpt-oss 20B", maker: "OpenAI", sizeGB: 13.79, ramGB: 20, quality: 9, note: "Excellent quality; needs a powerful machine" },
  { id: "qwen3.5:9b", label: "Qwen 3.5 9B", maker: "Alibaba", sizeGB: 6.55, ramGB: 12, quality: 8, note: "Great quality for 16 GB computers" },
  { id: "gemma3:12b", label: "Gemma 3 12B", maker: "Google", sizeGB: 8.15, ramGB: 14, quality: 8, note: "Strong writing, a little slower" },
  { id: "llama3.1:8b", label: "Llama 3.1 8B", maker: "Meta", sizeGB: 4.92, ramGB: 10, quality: 7, note: "Reliable all-rounder" },
  { id: "qwen3.5:4b", label: "Qwen 3.5 4B", maker: "Alibaba", sizeGB: 3.32, ramGB: 6, quality: 6, note: "Best balance for 8 GB computers" },
  { id: "gemma3:4b", label: "Gemma 3 4B", maker: "Google", sizeGB: 3.34, ramGB: 6, quality: 6, note: "Good writing at a small size" },
  { id: "llama3.2:3b", label: "Llama 3.2 3B", maker: "Meta", sizeGB: 2.02, ramGB: 4, quality: 5, note: "Fast on modest hardware" },
  { id: "qwen3.5:2b", label: "Qwen 3.5 2B", maker: "Alibaba", sizeGB: 2.68, ramGB: 4, quality: 4, note: "Small and quick; simpler paths" },
  { id: "gemma3:1b", label: "Gemma 3 1B", maker: "Google", sizeGB: 0.82, ramGB: 2, quality: 2, note: "Tiny; only for very old machines" },
] as const;
export type CatalogModel = (typeof OLLAMA_CATALOG)[number];

/** Free disk space to keep spare after a download, in GB. */
const DISK_HEADROOM_GB = 2;

/**
 * Tells whether a catalog model fits this computer.
 * @param {CatalogModel} model The model to check.
 * @param {number} freeDiskGB Free disk space where Ollama stores models, in GB.
 * @param {number} totalRamGB Total memory, in GB.
 * @param {boolean} installed Whether the model is already downloaded (then disk space doesn't matter).
 * @returns {{ fitsDisk: boolean, fitsRam: boolean }} Whether there's room to download it and memory to run it.
 */
export function modelFit(
  model: CatalogModel,
  freeDiskGB: number,
  totalRamGB: number,
  installed: boolean,
): { fitsDisk: boolean; fitsRam: boolean } {
  return {
    fitsDisk: installed || freeDiskGB >= model.sizeGB + DISK_HEADROOM_GB,
    fitsRam: totalRamGB >= model.ramGB,
  };
}

/**
 * Picks the best catalog model that fits this computer's memory and disk.
 * @param {number} freeDiskGB Free disk space where Ollama stores models, in GB.
 * @param {number} totalRamGB Total memory, in GB.
 * @param {string[]} [installedIds=[]] Model names already downloaded.
 * @returns {CatalogModel | null} The highest-quality model that fits, or `null` if none do.
 */
export function recommendOllamaModel(freeDiskGB: number, totalRamGB: number, installedIds: string[] = []): CatalogModel | null {
  return (
    OLLAMA_CATALOG.find((m) => {
      const fit = modelFit(m, freeDiskGB, totalRamGB, installedIds.includes(m.id));
      return fit.fitsDisk && fit.fitsRam;
    }) ?? null
  );
}

/** Ollama model names: letters, digits, dots, dashes, underscores and slashes, with an optional ":tag". */
export const OLLAMA_MODEL_NAME = /^[a-z0-9][\w.\-/]{0,63}(:[\w.\-]{1,40})?$/i;

/**
 * The user's AI engine choice, sent with each request. Keys are optional: without one the server's own key
 * (if any) is used. Everything is length- and pattern-limited before the server uses it.
 */
export const AiSettingsSchema = z.object({
  provider: z.enum(PROVIDER_IDS).default("auto"),
  ollamaModel: z.string().regex(OLLAMA_MODEL_NAME).optional(),
  anthropicKey: z.string().trim().max(300).optional(),
  anthropicModel: z.enum(ANTHROPIC_MODELS.map((m) => m.id) as [AnthropicModelId, ...AnthropicModelId[]]).optional(),
  openaiKey: z.string().trim().max(300).optional(),
  openaiModel: z.enum(OPENAI_MODELS.map((m) => m.id) as [OpenAiModelId, ...OpenAiModelId[]]).optional(),
});
export type AiSettings = z.infer<typeof AiSettingsSchema>;

/** What `/api/ai/status` reports about the server and (when local) Ollama and the computer. */
export type AiStatus = {
  /** True when the server runs on the user's own computer (desktop app or local dev), so Ollama can be used. */
  local: boolean;
  /** What "Default" means on this server: the free demo, or Claude with the server's own key. */
  serverDefault: "demo" | "claude";
  ollama: { reachable: boolean; version?: string; models: { name: string; sizeGB: number }[] } | null;
  system: { freeDiskGB: number; totalRamGB: number } | null;
};

/**
 * A short human-readable name for the engine a user has chosen.
 * @param {AiSettings} settings The user's settings.
 * @param {AiStatus | null} status Server status, used to describe the "Default" engine.
 * @returns {string} For example "Free demo", "Qwen 3.5 4B (local)" or "Claude Opus 5".
 */
export function engineLabel(settings: AiSettings, status: AiStatus | null): string {
  switch (settings.provider) {
    case "demo":
      return "Free demo";
    case "ollama": {
      const m = OLLAMA_CATALOG.find((c) => c.id === settings.ollamaModel);
      return `${m?.label ?? settings.ollamaModel ?? "Local model"} (local)`;
    }
    case "anthropic":
      return ANTHROPIC_MODELS.find((m) => m.id === settings.anthropicModel)?.label ?? "Claude Opus 5";
    case "openai":
      return OPENAI_MODELS.find((m) => m.id === settings.openaiModel)?.label ?? "GPT-6.1 Sol";
    default:
      return status?.serverDefault === "claude" ? "Claude (server)" : "Free demo";
  }
}
