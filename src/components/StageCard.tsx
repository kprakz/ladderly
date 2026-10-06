"use client";

import type { Stage } from "@/lib/schema";
import { checkKey } from "@/lib/storage";
import { Disclosure } from "./Disclosure";
import { ProgressBar } from "./ProgressBar";
import { StageQuiz } from "./StageQuiz";
import { VideoRow } from "./VideoRow";

type Props = {
  topic: string;
  stage: Stage;
  index: number;
  isLast: boolean;
  checked: Set<string>;
  quizBest?: { correct: number; total: number };
  onToggle: (key: string) => void;
  onQuizFinish: (stageIndex: number, correct: number, total: number) => void;
};

/**
 * One stage in the timeline: number marker, title, duration, stage progress, concepts, practice,
 * checkpoint checkboxes, resources, a "Videos for this week" dropdown (a Netflix-style row of previews plus a
 * YouTube search), and a quiz that unlocks when the stage is done.
 * @param {Props} props
 * @param {string} props.topic The path's topic, used for the video search when the stage has none of its own.
 * @param {Stage} props.stage The stage content.
 * @param {number} props.index Zero-based stage position (shown as index + 1, and used in checkbox keys).
 * @param {boolean} props.isLast Hides the connecting timeline line after the final stage.
 * @param {Set<string>} props.checked Keys of all checked checkpoint items in the path.
 * @param {{ correct: number, total: number }} [props.quizBest] Best saved quiz score for this stage, if any.
 * @param {(key: string) => void} props.onToggle Called with a checkpoint key when its checkbox changes.
 * @param {(stageIndex: number, correct: number, total: number) => void} props.onQuizFinish Called when the quiz is finished.
 * @returns {JSX.Element} A timeline list item.
 */
export function StageCard({ topic, stage, index, isLast, checked, quizBest, onToggle, onQuizFinish }: Props) {
  const done = stage.checkpoint.filter((_, i) => checked.has(checkKey(index, i))).length;
  const total = stage.checkpoint.length;
  const complete = done === total;
  const percent = Math.round((done / total) * 100);

  return (
    <li className="relative flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <div
          className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-zinc-50 dark:ring-zinc-950 ${
            complete ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
          }`}
        >
          {complete ? "✓" : index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-zinc-300 dark:bg-zinc-700" />}
      </div>

      <article className="mb-6 flex-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <header className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold">{stage.title}</h3>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {stage.duration}
          </span>
        </header>

        <div className="mt-2 flex items-center gap-3">
          <ProgressBar percent={percent} className="flex-1" />
          <span className="text-xs tabular-nums text-zinc-500">
            {done}/{total}
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Section title="Learn">
            <List items={stage.concepts} />
          </Section>
          <Section title="Practice">
            <List items={stage.practice} />
          </Section>
        </div>

        <Section title="You're ready to move on when…" className="mt-4">
          <ul className="space-y-1.5">
            {stage.checkpoint.map((item, i) => {
              const key = checkKey(index, i);
              const isChecked = checked.has(key);
              return (
                <li key={key}>
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-md p-1 -m-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(key)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500"
                    />
                    <span className={`text-sm ${isChecked ? "text-zinc-400 line-through" : ""}`}>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Resources" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {stage.resources.map((r) => (
              <span
                key={r}
                className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
              >
                {r}
              </span>
            ))}
          </div>
        </Section>

        <Disclosure
          title="Videos for this week"
          icon="▶"
          count={stage.videos?.length || undefined}
          className="mt-4"
        >
          <VideoRow videos={stage.videos ?? []} searchQuery={stage.videoSearch ?? `${topic} ${stage.title} lesson`} />
        </Disclosure>

        {stage.quiz && stage.quiz.length > 0 && (
          <Section title="Check your understanding" className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <StageQuiz
              questions={stage.quiz}
              unlocked={complete}
              best={quizBest}
              onFinish={(correct, totalQs) => onQuizFinish(index, correct, totalQs)}
            />
          </Section>
        )}
      </article>
    </li>
  );
}

/**
 * A titled block inside a stage card.
 * @param {Object} props
 * @param {string} props.title Small uppercase heading.
 * @param {string} [props.className] Extra CSS classes.
 * @param {React.ReactNode} props.children The section content.
 * @returns {JSX.Element} The section.
 */
function Section({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={className}>
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</h4>
      {children}
    </section>
  );
}

/**
 * A plain bulleted list.
 * @param {Object} props
 * @param {string[]} props.items The bullet texts.
 * @returns {JSX.Element} An unordered list.
 */
function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-4 text-sm marker:text-zinc-400">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
