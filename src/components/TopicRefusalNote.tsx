"use client";

import type { TopicRefusal } from "@/lib/topic";

/**
 * Explains why Ladderly won't make a path for a topic (see lib/topic.ts). Self-harm gets a calm, caring box with a
 * helpline; other topics get a short reason. With `onPick`, it also offers safer topics to start instead.
 * @param {Object} props
 * @param {TopicRefusal} props.refusal Why the topic was turned down.
 * @param {(topic: string) => void} [props.onPick] Starts a path for one of the suggested topics.
 * @returns {JSX.Element} The note.
 */
export function TopicRefusalNote({ refusal, onPick }: { refusal: TopicRefusal; onPick?: (topic: string) => void }) {
  return (
    <div
      role="status"
      className={`rounded-xl border p-4 ${
        refusal.reason === "self-harm"
          ? "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/40"
          : "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
      }`}
    >
      <p className="text-base">{refusal.message}</p>
      {onPick && (
        <>
          <p className="mt-2 text-xs text-zinc-500">{refusal.reason === "self-harm" ? "If you'd like something calming to learn:" : "Try one of these instead:"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {refusal.alternatives.map((alt) => (
              <button
                key={alt}
                type="button"
                onClick={() => onPick(alt)}
                className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:border-indigo-400 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-indigo-300"
              >
                {alt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
