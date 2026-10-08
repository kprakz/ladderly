"use client";

import { useEffect, useId, useState } from "react";
import type { Stage } from "@/lib/schema";
import { checkKey } from "@/lib/storage";
import { Disclosure } from "./Disclosure";
import { StageQuiz } from "./StageQuiz";
import { VideoRow } from "./VideoRow";

/** Window event that asks a stage card to open, e.g. from the "Next step" card. `detail` is the stage index. */
export const OPEN_STAGE_EVENT = "ladderly:open-stage";

type Props = {
  topic: string;
  stage: Stage;
  index: number;
  isLast: boolean;
  isCurrent: boolean;
  checked: Set<string>;
  quizBest?: { correct: number; total: number };
  onToggle: (key: string) => void;
  onQuizFinish: (stageIndex: number, correct: number, total: number) => void;
};

/**
 * One stage in the timeline, as a fold-out card so the page stays calm: only the current stage starts open.
 * Closed, it shows the number, title, duration and how many checkpoints are done. Open, it shows what to learn,
 * what to practise, the checklist, videos and resources (folded), and the quiz once the checklist is complete.
 * @param {Props} props
 * @param {string} props.topic The path's topic, used for the video search when the stage has none of its own.
 * @param {Stage} props.stage The stage content.
 * @param {number} props.index Zero-based stage position (shown as index + 1, and used in checkbox keys).
 * @param {boolean} props.isLast Hides the connecting timeline line after the final stage.
 * @param {boolean} props.isCurrent The first unfinished stage: starts open.
 * @param {Set<string>} props.checked Keys of all checked checkpoint items in the path.
 * @param {{ correct: number, total: number }} [props.quizBest] Best saved quiz score for this stage, if any.
 * @param {(key: string) => void} props.onToggle Called with a checkpoint key when its checkbox changes.
 * @param {(stageIndex: number, correct: number, total: number) => void} props.onQuizFinish Called when the quiz is finished.
 * @returns {JSX.Element} A timeline list item.
 */
export function StageCard({ topic, stage, index, isLast, isCurrent, checked, quizBest, onToggle, onQuizFinish }: Props) {
  const [open, setOpen] = useState(isCurrent);
  const bodyId = useId();
  const done = stage.checkpoint.filter((_, i) => checked.has(checkKey(index, i))).length;
  const total = stage.checkpoint.length;
  const complete = done === total;

  // Open when asked to (the "Next step" card's "Open" button).
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent<number>).detail === index) setOpen(true);
    };
    window.addEventListener(OPEN_STAGE_EVENT, handler);
    return () => window.removeEventListener(OPEN_STAGE_EVENT, handler);
  }, [index]);

  return (
    <li className="relative flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <div
          className={`z-10 mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-zinc-50 dark:ring-zinc-950 ${
            complete ? "bg-emerald-500 text-white" : isCurrent ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {complete ? "✓" : index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800" />}
      </div>

      <article id={`stage-${index}`} className="mb-3 min-w-0 flex-1 scroll-mt-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <h3>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={bodyId}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{stage.title}</span>
              <span className="block text-xs text-zinc-500">
                {stage.duration} · {done}/{total} done
              </span>
            </span>
            <span aria-hidden="true" className={`text-zinc-400 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>
        </h3>

        {open && (
          <div id={bodyId} className="space-y-5 px-4 pb-4 pt-1">
            <div className="grid gap-5 sm:grid-cols-2">
              <Section title="Learn">
                <List items={stage.concepts} />
              </Section>
              <Section title="Practise">
                <List items={stage.practice} />
              </Section>
            </div>

            <Section title="Checklist">
              <ul className="space-y-1.5">
                {stage.checkpoint.map((item, i) => {
                  const key = checkKey(index, i);
                  const isChecked = checked.has(key);
                  return (
                    <li key={key}>
                      <label className="-m-1 flex cursor-pointer items-start gap-2.5 rounded-md p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
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

            <Disclosure title="Videos & resources" icon="▶">
              <VideoRow videos={stage.videos ?? []} searchQuery={stage.videoSearch ?? `${topic} ${stage.title} lesson`} />
              <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-zinc-600 marker:text-zinc-400 dark:text-zinc-300">
                {stage.resources.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Disclosure>

            {stage.quiz && stage.quiz.length > 0 && (
              <Section title="Quiz">
                <StageQuiz
                  questions={stage.quiz}
                  unlocked={complete}
                  best={quizBest}
                  onFinish={(correct, totalQs) => onQuizFinish(index, correct, totalQs)}
                />
              </Section>
            )}
          </div>
        )}
      </article>
    </li>
  );
}

/**
 * A titled block inside a stage card.
 * @param {Object} props
 * @param {string} props.title Short heading.
 * @param {React.ReactNode} props.children The section content.
 * @returns {JSX.Element} The section.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-1.5 text-sm font-medium text-zinc-500">{title}</h4>
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
