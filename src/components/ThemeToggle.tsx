"use client";

import { useSyncExternalStore } from "react";

const THEME_KEY = "ladderly:theme";

/**
 * Watches the `.dark` class on `<html>` (set before paint by the script in layout.tsx).
 * @param {() => void} onChange Called whenever the `<html>` class attribute changes.
 * @returns {() => void} A function that stops watching.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

/**
 * Button that switches between light and dark mode and remembers the choice.
 * @returns {JSX.Element} The toggle button (blank until the current theme is known in the browser).
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => null,
  );

  /**
   * Flips the theme and saves it to localStorage.
   * @returns {void}
   */
  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
    >
      {dark === null ? " " : dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
