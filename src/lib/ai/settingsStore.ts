import { useSyncExternalStore } from "react";
import { AiSettingsSchema, type AiSettings } from "./models";

const KEY = "ladderly:ai";
const DEFAULTS: AiSettings = { provider: "auto" };

// A tiny localStorage-backed store for the AI engine choice, read through useSyncExternalStore.
// Settings (including any API keys) stay on this device; they're only sent with the user's own requests.
let cache: AiSettings | null = null;
const listeners = new Set<() => void>();

/**
 * Reads AI settings from localStorage, falling back to the defaults if they're missing or invalid.
 * @returns {AiSettings} The saved settings.
 */
function read(): AiSettings {
  try {
    const parsed = AiSettingsSchema.safeParse(JSON.parse(localStorage.getItem(KEY) ?? "null"));
    return parsed.success ? parsed.data : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

/**
 * Returns the current AI settings, reading localStorage only on first use.
 * @returns {AiSettings} The cached settings (same object until they change).
 */
export function getAiSettings(): AiSettings {
  cache ??= read();
  return cache;
}

/**
 * Registers a callback that runs whenever the AI settings change.
 * @param {() => void} listener Called after every update.
 * @returns {() => boolean} A function that unsubscribes the listener.
 */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Merges changes into the AI settings, saves them and notifies subscribers.
 * @param {Partial<AiSettings>} changes Fields to change, e.g. `{ provider: "ollama", ollamaModel: "qwen3.5:4b" }`.
 * @returns {void}
 */
export function updateAiSettings(changes: Partial<AiSettings>): void {
  cache = { ...getAiSettings(), ...changes };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable: settings last for this session only.
  }
  listeners.forEach((l) => l());
}

/**
 * React hook giving the AI settings and re-rendering when they change.
 * @returns {AiSettings} The current settings (the defaults during server rendering).
 */
export function useAiSettings(): AiSettings {
  return useSyncExternalStore(subscribe, getAiSettings, () => DEFAULTS);
}
