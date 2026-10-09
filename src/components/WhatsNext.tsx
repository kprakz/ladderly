import type { NextTopic } from "@/lib/nextTopics";

/**
 * Shown when every checkpoint in a path is ticked: a short celebration and three suggested skills to learn next,
 * each with a reason and a button that starts a new path for it.
 * @param {Object} props
 * @param {string} props.topic The finished path's topic.
 * @param {NextTopic[]} props.topics The suggestions (AI-written, or hand-picked for older paths).
 * @param {(topic: string) => void} props.onStart Starts a new path for a suggestion.
 * @returns {JSX.Element} The section.
 */
export function WhatsNext({ topic, topics, onStart }: { topic: string; topics: NextTopic[]; onStart: (topic: string) => void }) {
  return (
    <section aria-labelledby="whats-next-title" className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-900 dark:bg-zinc-900">
      <p aria-hidden="true" className="text-3xl">
        🎉
      </p>
      <h3 id="whats-next-title" className="mt-1 text-lg font-semibold">
        You&apos;ve reached the top of this ladder!
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        You finished every step of <span className="capitalize">{topic}</span>. Ready for the next climb? Here&apos;s
        where you could go from here.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {topics.map((t) => (
          <li key={t.topic} className="flex flex-col rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="font-medium">{t.topic}</p>
            <p className="mt-1 flex-1 text-sm text-zinc-600 dark:text-zinc-400">{t.why}</p>
            <button
              onClick={() => onStart(t.topic)}
              className="mt-3 self-start rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Start this path →
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
