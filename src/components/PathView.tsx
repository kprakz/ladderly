"use client";

import { suggestNextTopics } from "@/lib/nextTopics";
import { pathTitle } from "@/lib/schema";
import { checkKey, progressOf, type SavedPath } from "@/lib/storage";
import { Disclosure } from "./Disclosure";
import { LearningLinks } from "./LearningLinks";
import { ProgressBar } from "./ProgressBar";
import { StageCard } from "./StageCard";
import { WhatsNext } from "./WhatsNext";

/**
 * A full learning path, kept calm: title, one-line summary and progress; for a career transition, what the learner
 * already brings; videos and courses folded; the stages as fold-out cards with only the current one open; then the
 * final project and (folded) common pitfalls.
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
        {request.from && <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">🔀 Career transition</p>}
        <h2 className="text-2xl font-bold capitalize">{pathTitle(request)}</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{path.summary}</p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar percent={progress.percent} className="flex-1" />
          <span className="text-sm tabular-nums text-zinc-500">{progress.percent}%</span>
        </div>
      </div>

      {path.isTemplate && (
        <p role="note" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          This is a general plan. For a detailed plan {request.from ? `for moving from ${request.from} to ${request.topic}` : `on ${request.topic}`}, pick
          another AI in ⚙️ Settings.
        </p>
      )}

      {path.transferableSkills && path.transferableSkills.length > 0 && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            🎒 What you already bring
          </h3>
          <ul className="mt-2 space-y-2">
            {path.transferableSkills.map((t) => (
              <li key={t.skill} className="text-sm">
                <span className="font-medium">{t.skill}</span>
                <span className="block text-zinc-600 dark:text-zinc-300">{t.use}</span>
              </li>
            ))}
          </ul>
        </section>
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
