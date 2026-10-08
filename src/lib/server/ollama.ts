import { statfs } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Server-only helpers for talking to a local Ollama install and reading this computer's disk and memory.
 * Ollama is only used when the server runs on the user's own machine (see `isLocalServer`). Its address
 * comes from the OLLAMA_HOST setting on the server, never from the browser.
 */

/**
 * Tells whether this server runs on the user's own computer (desktop app, local dev or a self-hosted local
 * install), in which case it can use a local Ollama install and report disk/memory.
 * @returns {boolean} True for the desktop app (LADDERLY_LOCAL=1) or `npm run dev`.
 */
export function isLocalServer(): boolean {
  return process.env.LADDERLY_LOCAL === "1" || process.env.NODE_ENV === "development";
}

/**
 * The base URL of the local Ollama server.
 * @returns {string} OLLAMA_HOST (with "http://" added if missing), or http://127.0.0.1:11434 by default.
 */
export function ollamaBaseUrl(): string {
  const host = process.env.OLLAMA_HOST?.trim() || "127.0.0.1:11434";
  const withScheme = /^https?:\/\//.test(host) ? host : `http://${host}`;
  // "0.0.0.0" is a listen address, not one you can connect to.
  return withScheme.replace("//0.0.0.0", "//127.0.0.1").replace(/\/+$/, "");
}

/**
 * Asks Ollama for its version and installed models.
 * @returns {Promise<{ reachable: boolean, version?: string, models: { name: string, sizeGB: number }[] }>}
 *   `reachable: false` (and no models) when Ollama isn't running or installed.
 */
export async function ollamaStatus(): Promise<{ reachable: boolean; version?: string; models: { name: string; sizeGB: number }[] }> {
  try {
    const base = ollamaBaseUrl();
    const [versionRes, tagsRes] = await Promise.all([
      fetch(`${base}/api/version`, { signal: AbortSignal.timeout(2500) }),
      fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(2500) }),
    ]);
    if (!versionRes.ok || !tagsRes.ok) return { reachable: false, models: [] };
    const version = ((await versionRes.json()) as { version?: string }).version;
    const tags = (await tagsRes.json()) as { models?: { name: string; size: number }[] };
    const models = (tags.models ?? []).map((m) => ({ name: m.name, sizeGB: Math.round((m.size / 1e9) * 100) / 100 }));
    return { reachable: true, version, models };
  } catch {
    return { reachable: false, models: [] };
  }
}

/**
 * Finds the folder where Ollama stores models, to measure the free space there.
 * @returns {string} OLLAMA_MODELS if set, otherwise ~/.ollama/models (or the home folder if that doesn't exist yet).
 */
function ollamaModelsDir(): string {
  return process.env.OLLAMA_MODELS?.trim() || path.join(os.homedir(), ".ollama", "models");
}

/**
 * Measures free disk space where models are stored, and total memory.
 * @returns {Promise<{ freeDiskGB: number, totalRamGB: number }>} Both rounded to 0.1 GB.
 */
export async function systemInfo(): Promise<{ freeDiskGB: number; totalRamGB: number }> {
  let freeBytes = 0;
  for (const dir of [ollamaModelsDir(), os.homedir()]) {
    try {
      const s = await statfs(dir);
      freeBytes = s.bavail * s.bsize;
      break;
    } catch {
      // Folder doesn't exist yet: try the next one.
    }
  }
  return {
    freeDiskGB: Math.round((freeBytes / 1e9) * 10) / 10,
    totalRamGB: Math.round((os.totalmem() / 1e9) * 10) / 10,
  };
}
