import { stageTitlesSoFar } from "@/lib/generate";

/**
 * Loading state: a spinner, then the stage titles as they stream in.
 * @param {Object} props
 * @param {string} props.topic The topic being generated.
 * @param {string} props.partial The raw JSON text received so far (empty before the first chunk).
 * @returns {JSX.Element} The loading panel.
 */
export function LoadingPanel({ topic, partial }: { topic: string; partial: string }) {
  const titles = stageTitlesSoFar(partial);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="font-medium">
          {partial ? "Mapping your path to" : "Thinking about"} <span className="capitalize">{topic}</span>…
        </p>
      </div>
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
