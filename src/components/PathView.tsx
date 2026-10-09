"use client";

import { suggestNextTopics } from "@/lib/nextTopics";
import { checkKey, progressOf, type SavedPath } from "@/lib/storage";
import { Disclosure } from "./Disclosure";
import { LearningLinks } from "./LearningLinks";
import { ProgressBar } from "./ProgressBar";
import { StageCard } from "./StageCard";
import { WhatsNext } from "./WhatsNext";

/**
 * A full learning path, kept calm: title, one-line summary and progress; videos and courses folded; the stages as
 * fold-out cards with only the current one open; then the final project and (folded) common pitfalls.
 * @param {Object} props
 * @param {SavedPath} props.saved The saved path, including which checkpoint items are checked and quiz scores.
 * @param {(key: string) => void} props.onToggle Called with a checkpoint key when a checkbox changes.
 * @param {(stageIndex: number, correct: number, total: number) => void} props.onQuizFinish Called when a stage quiz is finished.
 * @param {(topic: string) => void} props.onStartTopic Starts a new path for a suggested next topic (shown once the path is complete).
 * @returns {JSX.Element} The path view.
 */
export function PathView({
  saved,
  onToggle,
  onQuizFinish,
  onStartTopic,
}: {
  saved: SavedPath;
  onToggle: (key: string) => void;
  onQuizFinish: (stageIndex: number, correct: number, total: number) => void;
  onStartTopic: (topic: string) => void;
}) {
  const { path, request } = saved;
  const checked = new Set(saved.checked);
  const progress = progressOf(saved);
  // The first stage with an unticked checkpoint is "current" and starts open.
  const current = path.stages.findIndex((s, i) => s.checkpoint.some((_, j) => !checked.has(checkKey(i, j))));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold capitalize">{request.topic}</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{path.summary}</p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar percent={progress.percent} className="flex-1" />
          <span className="text-sm tabular-nums text-zinc-500">{progress.percent}%</span>
        </div>
      </div>

      {path.isTemplate && (
        <p role="note" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          This is a general plan. For a detailed plan on {request.topic}, pick another AI in ⚙️ Settings.
        </p>
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
            isCurrent={i === current}
            checked={checked}
            quizBest={saved.quizScores?.[String(i)]}
            onToggle={onToggle}
            onQuizFinish={onQuizFinish}
          />
        ))}
      </ol>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-medium text-zinc-500">🏁 Final project</h3>
        <p className="mt-1 font-semibold">{path.finishLine.name}</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{path.finishLine.description}</p>
      </section>

      {progress.percent === 100 && (
        <WhatsNext topic={request.topic} topics={path.nextTopics ?? suggestNextTopics(request.topic)} onStart={onStartTopic} />
      )}

      <Disclosure title="Common mistakes to avoid" icon="⚠️" className="bg-white dark:bg-zinc-900">
        <ul className="list-disc space-y-1 pl-4 text-sm text-zinc-600 dark:text-zinc-300">
          {path.pitfalls.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Disclosure>
    </div>
  );
}
