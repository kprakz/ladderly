"use client";

import { progressOf, type SavedPath } from "@/lib/storage";
import { LearningLinks } from "./LearningLinks";
import { ProgressBar } from "./ProgressBar";
import { StageCard } from "./StageCard";

/**
 * A full learning path: title, summary, overall progress, videos and courses, stage timeline (with quizzes),
 * finish line and pitfalls.
 * @param {Object} props
 * @param {SavedPath} props.saved The saved path, including which checkpoint items are checked and quiz scores.
 * @param {(key: string) => void} props.onToggle Called with a checkpoint key when a checkbox changes.
 * @param {(stageIndex: number, correct: number, total: number) => void} props.onQuizFinish Called when a stage quiz is finished.
 * @returns {JSX.Element} The path view.
 */
export function PathView({
  saved,
  onToggle,
  onQuizFinish,
}: {
  saved: SavedPath;
  onToggle: (key: string) => void;
  onQuizFinish: (stageIndex: number, correct: number, total: number) => void;
}) {
  const { path, request } = saved;
  const checked = new Set(saved.checked);
  const progress = progressOf(saved);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold capitalize">{request.topic}</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{path.summary}</p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar percent={progress.percent} className="flex-1" />
          <span className="text-sm tabular-nums text-zinc-500">{progress.percent}% complete</span>
        </div>
      </div>

      {path.isTemplate && (
        <div
          role="note"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <p className="font-semibold">This is a general template, not a detailed plan for {request.topic}.</p>
          <p className="mt-1">
            The free demo has detailed paths, with quizzes, for guitar, python, public speaking and machine learning.
            With an Anthropic API key, Ladderly writes a detailed path and quiz for any topic.
          </p>
        </div>
      )}

      <LearningLinks path={path} topic={request.topic} />

      <ol>
        {path.stages.map((stage, i) => (
          <StageCard
            key={i}
            topic={request.topic}
            stage={stage}
            index={i}
            isLast={i === path.stages.length - 1}
            checked={checked}
            quizBest={saved.quizScores?.[String(i)]}
            onToggle={onToggle}
            onQuizFinish={onQuizFinish}
          />
        ))}
      </ol>

      <section className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          🏁 Finish line
        </h3>
        <p className="mt-1 font-semibold">{path.finishLine.name}</p>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{path.finishLine.description}</p>
      </section>

      <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Common pitfalls
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-700 dark:text-zinc-300">
          {path.pitfalls.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
