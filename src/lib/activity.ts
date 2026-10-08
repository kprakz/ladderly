import { useSyncExternalStore } from "react";
import { dayKey } from "./dates";
import type { ActivityDays } from "./streaks";

const KEY = "ladderly:activity";
const PATHS_KEY = "ladderly:paths";

// A tiny localStorage-backed log of learning actions per day ("rungs climbed"), read through useSyncExternalStore.
let cache: ActivityDays | null = null;
const listeners = new Set<() => void>();

/**
 * Reads the activity log. The very first time (no log yet), it seeds one from saved paths' creation dates,
 * so people who already used Ladderly don't start with an empty heatmap.
 * @returns {ActivityDays} Actions per day.
 */
function read(): ActivityDays {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? (parsed as ActivityDays) : {};
    }
    const seeded: ActivityDays = {};
    const paths = JSON.parse(localStorage.getItem(PATHS_KEY) ?? "[]");
    if (Array.isArray(paths)) {
      for (const p of paths) {
        if (typeof p?.createdAt === "number") {
          const k = dayKey(new Date(p.createdAt));
          seeded[k] = (seeded[k] ?? 0) + 1;
        }
      }
    }
    localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return {};
  }
}

/**
 * Returns the activity log, reading localStorage only on first use.
 * @returns {ActivityDays} Actions per day (same object until it changes).
 */
export function getActivity(): ActivityDays {
  cache ??= read();
  return cache;
}

/**
 * Registers a callback that runs whenever the activity log changes.
 * @param {() => void} listener Called after every update.
 * @returns {() => boolean} A function that unsubscribes the listener.
 */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Adds (or removes) learning actions for today: +1 for ticking a checkpoint, finishing a quiz or starting a path;
 * -1 for unticking a checkpoint (never below zero), so ticking and unticking can't inflate the count.
 * @param {number} delta How many actions to add (negative to remove).
 * @returns {void}
 */
export function recordActivity(delta: number): void {
  const today = dayKey();
  const days = { ...getActivity() };
  days[today] = Math.max(0, (days[today] ?? 0) + delta);
  cache = days;
  try {
    localStorage.setItem(KEY, JSON.stringify(days));
  } catch {
    // Storage unavailable: activity lasts for this session only.
  }
  listeners.forEach((l) => l());
}

/**
 * React hook giving the activity log and re-rendering when it changes.
 * @returns {ActivityDays | null} Actions per day, or `null` during server rendering and before hydration.
 */
export function useActivity(): ActivityDays | null {
  return useSyncExternalStore(subscribe, getActivity, () => null);
}
