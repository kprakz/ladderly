// The open-source model that runs inside the browser (WebGPU, via WebLLM). Everything happens on the learner's
// device: the model downloads once into the browser's storage, and paths are written locally with no server.
// The WebLLM library is large, so it's only loaded (in a background worker) when this engine is actually used.
import type { WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import { z } from "zod";
import { BROWSER_MODELS, type BrowserModelId } from "./models";
import { buildSystemPrompt, buildUserPrompt } from "../prompt";
import { GeneratedPathSchema, type LearningPath, LearningPathSchema, type PathRequest, repairGeneratedPath } from "../schema";

/** What this device's browser can do. */
export type WebGpuSupport = { supported: boolean; f16: boolean; mobile: boolean; reason?: string };

/** Room for the compact prompt plus a full compact path (the default 4k is too tight). */
const CONTEXT_WINDOW = 8192;
const MAX_OUTPUT_TOKENS = 4096;

/**
 * Checks whether this browser can run models with WebGPU, and whether the graphics chip supports 16-bit maths.
 * @returns {Promise<WebGpuSupport>} What's supported, with a reason when it isn't.
 */
export async function detectWebGpu(): Promise<WebGpuSupport> {
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<{ features: Set<string> } | null> } }).gpu;
  if (!gpu) return { supported: false, f16: false, mobile, reason: "This browser doesn't support WebGPU yet. Try the latest Chrome or Edge on a laptop." };
  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) return { supported: false, f16: false, mobile, reason: "WebGPU is available but no graphics chip could be used." };
    return { supported: true, f16: adapter.features.has("shader-f16"), mobile };
  } catch {
    return { supported: false, f16: false, mobile, reason: "WebGPU couldn't start on this device." };
  }
}

/**
 * Suggests a model for this device: the lighter one on phones, the best one elsewhere.
 * @param {WebGpuSupport} support From `detectWebGpu`.
 * @returns {BrowserModelId} The suggested model.
 */
export function recommendBrowserModel(support: WebGpuSupport): BrowserModelId {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return support.mobile || (memory !== undefined && memory <= 4) ? "qwen2.5-1.5b" : "qwen2.5-3b";
}

/**
 * The WebLLM model id for a catalog model on this device (f16 build when supported, else f32).
 * @param {BrowserModelId} id Catalog id.
 * @param {boolean} f16 Whether the graphics chip supports 16-bit maths.
 * @returns {string} The WebLLM model id.
 */
export function webllmModelId(id: BrowserModelId, f16: boolean): string {
  const model = BROWSER_MODELS.find((m) => m.id === id) ?? BROWSER_MODELS[0];
  return f16 ? model.f16 : model.f32;
}

/**
 * Starts the background worker that hosts the model (bundled from webllm.worker.ts).
 * @returns {Worker} The worker.
 */
function createWorker(): Worker {
  return new Worker(new URL("./webllm.worker.ts", import.meta.url), { type: "module" });
}

let engine: WebWorkerMLCEngine | null = null;
let loadedModel: string | null = null;
let loading: Promise<WebWorkerMLCEngine> | null = null;

/**
 * Loads a model (downloading it the first time), reusing the one already loaded when possible.
 * @param {string} modelId WebLLM model id.
 * @param {(fraction: number, text: string) => void} [onProgress] Download/loading progress, 0–1.
 * @returns {Promise<WebWorkerMLCEngine>} The ready engine.
 */
export async function loadBrowserModel(modelId: string, onProgress?: (fraction: number, text: string) => void): Promise<WebWorkerMLCEngine> {
  if (engine && loadedModel === modelId) return engine;
  if (loading) await loading.catch(() => null);
  if (engine && loadedModel === modelId) return engine;
  loading = (async () => {
    const { CreateWebWorkerMLCEngine } = await import("@mlc-ai/web-llm");
    const initProgressCallback = (r: { progress: number; text: string }) => onProgress?.(r.progress, r.text);
    if (engine) {
      engine.setInitProgressCallback(initProgressCallback);
      await engine.reload(modelId, { context_window_size: CONTEXT_WINDOW });
    } else {
      engine = await CreateWebWorkerMLCEngine(createWorker(), modelId, { initProgressCallback }, { context_window_size: CONTEXT_WINDOW });
    }
    loadedModel = modelId;
    return engine;
  })();
  try {
    return await loading;
  } finally {
    loading = null;
  }
}

/**
 * Whether a model is already downloaded in this browser.
 * @param {string} modelId WebLLM model id.
 * @returns {Promise<boolean>} True if it's in the browser's storage.
 */
export async function isBrowserModelDownloaded(modelId: string): Promise<boolean> {
  const { hasModelInCache } = await import("@mlc-ai/web-llm");
  return hasModelInCache(modelId).catch(() => false);
}

/**
 * Deletes a downloaded model from the browser's storage (and unloads it if it's in use).
 * @param {string} modelId WebLLM model id.
 * @returns {Promise<void>}
 */
export async function removeBrowserModel(modelId: string): Promise<void> {
  if (engine && loadedModel === modelId) {
    await engine.unload().catch(() => {});
    loadedModel = null;
  }
  const { deleteModelAllInfoInCache } = await import("@mlc-ai/web-llm");
  await deleteModelAllInfoInCache(modelId);
}

/**
 * Writes a learning path with the in-browser model. Uses the compact prompt (small models, limited room) and forces
 * the output to match Ladderly's path format, then cleans it up and validates it like any other engine's output.
 * @param {PathRequest} request The topic and options.
 * @param {BrowserModelId} model Which catalog model to use.
 * @param {boolean} f16 Whether the graphics chip supports 16-bit maths.
 * @param {(textSoFar: string) => void} onText Called with all the text written so far, as it streams.
 * @param {(message: string) => void} onStatus Called with notes while the model loads (e.g. download progress).
 * @param {AbortSignal} [signal] Stops writing when aborted.
 * @returns {Promise<LearningPath>} The validated path.
 * @throws {Error} With a friendly message if the model can't load or writes an incomplete path.
 */
export async function generateInBrowser(
  request: PathRequest,
  model: BrowserModelId,
  f16: boolean,
  onText: (textSoFar: string) => void,
  onStatus: (message: string) => void,
  signal?: AbortSignal,
): Promise<LearningPath> {
  const modelId = webllmModelId(model, f16);
  const label = BROWSER_MODELS.find((m) => m.id === model)?.label ?? "the model";
  onStatus(`Getting ${label} ready on this device…`);
  let ready: WebWorkerMLCEngine;
  try {
    ready = await loadBrowserModel(modelId, (fraction) => onStatus(`Getting ${label} ready on this device… ${Math.round(fraction * 100)}%`));
  } catch {
    throw new Error(`${label} couldn't start in this browser. Try a smaller model in ⚙️ Settings, or close other tabs to free up memory.`);
  }
  if (signal?.aborted) throw new Error("Cancelled.");

  const onAbort = () => ready.interruptGenerate();
  signal?.addEventListener("abort", onAbort);
  const { $schema: _ignored, ...schema } = z.toJSONSchema(GeneratedPathSchema) as Record<string, unknown>;
  void _ignored;
  let text = "";
  try {
    const stream = await ready.chat.completions.create({
      messages: [
        { role: "system", content: buildSystemPrompt(true) },
        { role: "user", content: buildUserPrompt(request) },
      ],
      stream: true,
      temperature: 0.4,
      max_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: "json_object", schema: JSON.stringify(schema) },
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        text += delta;
        onText(text);
      }
    }
  } finally {
    signal?.removeEventListener("abort", onAbort);
  }
  if (signal?.aborted) throw new Error("Cancelled.");

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Handled below.
  }
  const result = LearningPathSchema.safeParse(repairGeneratedPath(parsed));
  if (!result.success) {
    throw new Error(`${label} wrote an incomplete path. Small models sometimes do; try again, or pick a larger model in ⚙️ Settings.`);
  }
  return result.data;
}
