import { useSyncExternalStore } from "react";
import { z } from "zod";
import { LearningPathSchema, PathRequestSchema } from "./schema";

const KEY = "ladderly:paths";
/** Key used before the app was renamed from Pathfinder; read once so existing progress carries over. */
const LEGACY_KEY = "pathfinder:paths";

const SavedPathSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  request: PathRequestSchema,
  path: LearningPathSchema,
  /** Checked checkpoint items, keyed "stageIndex-itemIndex". */
  checked: z.array(z.string()),
});

export type SavedPath = z.infer<typeof SavedPathSchema>;

// A tiny localStorage-backed store, read through useSyncExternalStore.
let cache: SavedPath[] | null = null;
const listeners = new Set<() => void>();

/**
 * Reads saved paths from localStorage, dropping any entries that no longer match the schema.
 * Falls back to the pre-rename key when the current key has never been written.
 * @returns {SavedPath[]} The valid saved paths (newest first), or `[]` if storage is empty or unreadable.
 */
function read(): SavedPath[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    // Drop anything that no longer matches the schema instead of crashing.
    return raw.flatMap((item) => {
      const result = SavedPathSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
}

/**
 * Returns the current saved paths, reading localStorage only on first use.
 * @returns {SavedPath[]} The cached list; the same array instance until it changes (required by useSyncExternalStore).
 */
function getSnapshot(): SavedPath[] {
  cache ??= read();
  return cache;
}

/**
 * Registers a callback that runs whenever the saved paths change.
 * @param {() => void} listener Called after every update.
 * @returns {() => boolean} A function that unsubscribes the listener.
 */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Changes the saved paths, writes them to localStorage and notifies subscribed components.
 * @param {(prev: SavedPath[]) => SavedPath[]} update Receives the current list and returns the new one (must not mutate it).
 * @returns {void}
 */
export function updatePaths(update: (prev: SavedPath[]) => SavedPath[]): void {
  cache = update(getSnapshot());
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable (e.g. private mode): progress just won't persist.
  }
  listeners.forEach((l) => l());
}

/**
 * React hook giving the saved paths and re-rendering when they change.
 * @returns {SavedPath[] | null} The saved paths, or `null` during server rendering and before hydration.
 */
export function useSavedPaths(): SavedPath[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/**
 * Builds the key that identifies one checkpoint item in `SavedPath.checked`.
 * @param {number} stageIndex Zero-based stage position.
 * @param {number} itemIndex Zero-based checkpoint item position within the stage.
 * @returns {string} A key like `"2-0"`.
 */
export function checkKey(stageIndex: number, itemIndex: number): string {
  return `${stageIndex}-${itemIndex}`;
}

/**
 * Calculates overall progress for a saved path across all checkpoint items.
 * @param {SavedPath} saved The saved path with its checked items.
 * @returns {{ done: number, total: number, percent: number }} Checked items, total items and a rounded 0–100 percentage.
 */
export function progressOf(saved: SavedPath): { done: number; total: number; percent: number } {
  const total = saved.path.stages.reduce((sum, s) => sum + s.checkpoint.length, 0);
  return { done: saved.checked.length, total, percent: total ? Math.round((saved.checked.length / total) * 100) : 0 };
}
