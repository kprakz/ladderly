"use client";

import { useEffect, useState } from "react";
import { stageTitlesSoFar } from "@/lib/generate";

/** Roughly how many characters a finished path is, used to estimate progress (compact local paths are shorter). */
const EXPECTED_CHARS = { full: 16000, compact: 9000 };

/**
 * Loading state: which engine is writing, a progress bar estimated from how much text has arrived, the elapsed
 * time, and the stage titles as they stream in. Local models get a note that they can take a few minutes.
 * @param {Object} props
 * @param {string} props.topic The topic being generated.
 * @param {string} props.partial The raw JSON text received so far (empty before the first chunk).
 * @param {string} props.engine Name of the engine writing the path, e.g. "Qwen 3.5 4B (local)".
 * @param {boolean} props.local True when a local model is writing (slower, compact output).
 * @returns {JSX.Element} The loading panel.
 */
export function LoadingPanel({ topic, partial, engine, local }: { topic: string; partial: string; engine: string; local: boolean }) {
  const titles = stageTitlesSoFar(partial);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const expected = local ? EXPECTED_CHARS.compact : EXPECTED_CHARS.full;
  // Never show 100% until the path is actually done.
  const percent = Math.min(95, Math.round((partial.length / expected) * 100));
  const elapsed = seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="flex-1 font-medium">
          {partial ? "Mapping your path to" : "Thinking about"} <span className="capitalize">{topic}</span>…
        </p>
        <span className="text-sm tabular-nums text-zinc-500">{elapsed}</span>
      </div>
      <div className="mt-3 flex items-center gap-3 pl-8">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.max(percent, 2)}%` }} />
        </div>
        <span className="text-xs tabular-nums text-zinc-500">{percent}%</span>
      </div>
      <p className="mt-1 pl-8 text-xs text-zinc-500">
        Written by {engine}
        {local && " · local models can take a few minutes on a laptop"}
      </p>
      {titles.length > 0 && (
        <ol className="mt-4 space-y-2 pl-8">
          {titles.map((t, i) => (
            <li key={i} className="animate-[fadeIn_0.3s_ease-out] text-sm text-zinc-600 dark:text-zinc-400">
              <span className="mr-2 text-zinc-400">{i + 1}.</span>
              {t}
            </li>
          ))}
        </ol>
      )}
      {!partial && (
        <div className="mt-4 space-y-2 pl-8">
          {[70, 55, 62].map((w) => (
            <div key={w} className="h-3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Error state with a message and a Retry button.
 * @param {Object} props
 * @param {string} props.message User-friendly error text.
 * @param {() => void} props.onRetry Called when Retry is clicked.
 * @returns {JSX.Element} The error panel (announced to screen readers as an alert).
 */
export function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-red-900 dark:bg-red-950/40"
    >
      <p className="text-sm text-red-800 dark:text-red-300">{message}</p>
      <button
        onClick={onRetry}
        className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
      >
        Retry
      </button>
    </div>
  );
}
