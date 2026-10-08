"use client";

import { useSyncExternalStore } from "react";

/** A short celebration message. */
type Toast = { id: number; icon: string; text: string };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

/**
 * Notifies the toaster that the list of toasts changed.
 * @returns {void}
 */
function emit() {
  listeners.forEach((l) => l());
}

/**
 * Shows a celebration toast for a few seconds.
 * @param {string} icon An emoji, e.g. "🔥".
 * @param {string} text The message, e.g. "4-day streak!".
 * @returns {void}
 */
export function showToast(icon: string, text: string): void {
  const toast = { id: nextId++, icon, text };
  toasts = [...toasts, toast].slice(-3);
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== toast.id);
    emit();
  }, 4500);
}

/**
 * Registers a callback that runs whenever toasts change.
 * @param {() => void} listener Called after every change.
 * @returns {() => boolean} A function that unsubscribes the listener.
 */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Server snapshot: no toasts during server rendering. */
const NONE: Toast[] = [];

/**
 * Renders the current toasts in the bottom-right corner, announced politely to screen readers.
 * @returns {JSX.Element} The toast stack.
 */
export function Toaster() {
  const list = useSyncExternalStore(subscribe, () => toasts, () => NONE);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-16 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-4">
      {list.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex animate-[fadeIn_0.3s_ease-out] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <span aria-hidden="true" className="text-xl">
            {t.icon}
          </span>
          {t.text}
        </div>
      ))}
    </div>
  );
}
