"use client";

import { READY_TRANSITIONS } from "@/lib/readyTransitions";

/**
 * "Ready-made transitions" for Transition: hand-written career switches, grouped, that open with one tap. Like the
 * ready-made paths, they're built in, so they're free, open instantly and work offline in the desktop app, whichever
 * AI engine is chosen.
 * @param {Object} props
 * @param {(from: string, to: string) => void} props.onPick Opens the ready-made transition.
 * @param {boolean} props.disabled Disables the buttons while a path is loading.
 * @returns {JSX.Element} The picker.
 */
export function ReadyTransitions({ onPick, disabled }: { onPick: (from: string, to: string) => void; disabled: boolean }) {
  return (
    <section aria-labelledby="ready-transitions-title" className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/30">
      <h2 id="ready-transitions-title" className="text-base font-semibold text-blue-900 dark:text-blue-200">
        <span aria-hidden="true">📦 </span>Ready-made transitions
      </h2>
      <p className="mt-0.5 text-sm text-blue-900/70 dark:text-blue-200/70">
        Free and instant, with videos for every stage, quizzes and courses. They work offline in the desktop app.
      </p>
      <div className="mt-3 space-y-3">
        {READY_TRANSITIONS.map((group) => (
          <div key={group.label}>
            <h3 className="text-xs font-medium text-blue-900/80 dark:text-blue-200/80">{group.label}</h3>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {group.items.map((t) => (
                <li key={`${t.from}-${t.to}`}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onPick(t.from, t.to)}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition first-letter:uppercase hover:border-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-blue-300"
                  >
                    {t.label ?? `${t.from} → ${t.to}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
