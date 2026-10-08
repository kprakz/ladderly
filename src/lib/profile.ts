import { useSyncExternalStore } from "react";
import { z } from "zod";

const KEY = "ladderly:profile";

/** The learner's profile, kept only on this device. */
const ProfileSchema = z.object({
  name: z.string().trim().max(40).optional(),
  /** True if they chose not to give a name (so we don't keep asking). */
  skipped: z.boolean().optional(),
  /** Learning actions ("rungs") per day they aim for. */
  dailyGoal: z.union([z.literal(1), z.literal(3), z.literal(5)]).default(3),
  createdAt: z.number().optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

const EMPTY: Profile = { dailyGoal: 3 };

let cache: Profile | null = null;
/** Whether a profile already existed when this visit started (so we greet with "Welcome back"). */
let existedBeforeThisVisit: boolean | null = null;
const listeners = new Set<() => void>();

/**
 * Reads the profile from localStorage, and notes whether one existed before this visit.
 * @returns {Profile} The saved profile, or an empty one.
 */
function read(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    existedBeforeThisVisit ??= raw !== null;
    const parsed = ProfileSchema.safeParse(JSON.parse(raw ?? "null"));
    return parsed.success ? parsed.data : EMPTY;
  } catch {
    existedBeforeThisVisit ??= false;
    return EMPTY;
  }
}

/**
 * Returns the current profile, reading localStorage only on first use.
 * @returns {Profile} The cached profile.
 */
export function getProfile(): Profile {
  cache ??= read();
  return cache;
}

/**
 * Registers a callback that runs whenever the profile changes.
 * @param {() => void} listener Called after every update.
 * @returns {() => boolean} A function that unsubscribes the listener.
 */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Merges changes into the profile, saves it and notifies subscribers.
 * @param {Partial<Profile>} changes Fields to change, e.g. `{ name: "Karthik" }`.
 * @returns {void}
 */
export function updateProfile(changes: Partial<Profile>): void {
  const current = getProfile();
  cache = { ...current, createdAt: current.createdAt ?? Date.now(), ...changes };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable: the profile lasts for this session only.
  }
  listeners.forEach((l) => l());
}

/**
 * React hook giving the profile and re-rendering when it changes.
 * @returns {Profile | null} The profile, or `null` during server rendering and before hydration.
 */
export function useProfile(): Profile | null {
  return useSyncExternalStore(subscribe, getProfile, () => null);
}

/**
 * Whether this is a returning visit, for "Welcome back" vs "Welcome".
 * @returns {boolean} True if a profile was saved before this page load.
 */
export function isReturningVisit(): boolean {
  getProfile();
  return existedBeforeThisVisit === true;
}
