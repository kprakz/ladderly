"use client";

import { useState } from "react";
import type { PathRequest } from "@/lib/schema";
import { careerFromText, checkTopic, type TopicRefusal } from "@/lib/topic";
import { TopicRefusalNote } from "./TopicRefusalNote";

const field =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900";

/** Career switches people often ask about; picking one fills in both boxes. */
const POPULAR: [string, string][] = [
  ["electronics engineer", "AI engineer"],
  ["mechanical engineer", "data analyst"],
  ["teacher", "instructional designer"],
  ["accountant", "data analyst"],
  ["sales executive", "product manager"],
  ["graphic designer", "UX designer"],
  ["customer support", "software tester"],
  ["civil engineer", "project manager"],
];

/**
 * Ladderly's "Transition": the learner's current career and the one they want, then optional experience and weekly
 * time, then "Map my transition". Popular switches fill both boxes with one tap. Both careers go through the same
 * safety check as topics (lib/topic.ts).
 * @param {Object} props
 * @param {(req: PathRequest) => void} props.onSubmit Called with the request (`from` = current career, `topic` = target).
 * @param {boolean} props.disabled True while a path is being written.
 * @param {(topic: string) => void} [props.onTopicChange] Called as the target career is typed (for the background).
 * @returns {JSX.Element} The form.
 */
export function TransitionForm({
  onSubmit,
  disabled,
  onTopicChange,
}: {
  onSubmit: (req: PathRequest) => void;
  disabled: boolean;
  onTopicChange?: (topic: string) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [level, setLevel] = useState("");
  const [hours, setHours] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [refusal, setRefusal] = useState<TopicRefusal | null>(null);
  const optionCount = [level, hours].filter(Boolean).length;
  const ready = from.trim() !== "" && to.trim() !== "";

  /**
   * Checks both careers, then sends the request (empty options become `undefined`, hours are clamped to 1–80).
   * @param {React.FormEvent} e The submit event; its default page reload is prevented.
   * @returns {void}
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    const turnedDown = checkTopic(from) ?? checkTopic(to);
    setRefusal(turnedDown);
    if (turnedDown) return;
    const hoursNum = Number(hours);
    onSubmit({
      from: careerFromText(from),
      topic: careerFromText(to),
      level: (level || undefined) as PathRequest["level"],
      hoursPerWeek: hours && hoursNum > 0 ? Math.min(80, Math.round(hoursNum)) : undefined,
      goal: "job",
    });
  }

  /**
   * Fills both boxes with a popular switch.
   * @param {string} current The current career.
   * @param {string} target The career to move into.
   * @returns {void}
   */
  function pick(current: string, target: string) {
    setFrom(current);
    setTo(target);
    setRefusal(null);
    onTopicChange?.(target);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">I&apos;m currently a…</span>
          <input
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setRefusal(null);
            }}
            placeholder="e.g. Electronics engineer"
            maxLength={80}
            className={`${field} w-full py-3 text-base`}
          />
        </label>
        <span aria-hidden="true" className="hidden pb-3 text-xl text-indigo-500 sm:block">
          →
        </span>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">I want to become a…</span>
          <input
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setRefusal(null);
              onTopicChange?.(e.target.value);
            }}
            placeholder="e.g. AI engineer"
            maxLength={80}
            className={`${field} w-full py-3 text-base`}
          />
        </label>
      </div>

      <div>
        <p className="text-xs text-zinc-500">Popular switches:</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {POPULAR.map(([current, target]) => (
            <button
              key={`${current}-${target}`}
              type="button"
              onClick={() => pick(current, target)}
              className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs first-letter:uppercase text-zinc-600 hover:border-indigo-400 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-indigo-300"
            >
              {current} → {target}
            </button>
          ))}
        </div>
      </div>

      {refusal && <TopicRefusalNote refusal={refusal} />}

      <button
        type="button"
        onClick={() => setShowOptions((o) => !o)}
        aria-expanded={showOptions}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
          showOptions || optionCount > 0
            ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
            : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        }`}
      >
        <span aria-hidden="true">🎚️</span>
        Personalise: experience and time
        {optionCount > 0 && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">{optionCount} set</span>}
        <span aria-hidden="true" className={`transition-transform ${showOptions ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {showOptions && (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Experience with the new career</span>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
              <option value="">Not specified</option>
              <option value="none">None yet</option>
              <option value="some">A little (courses or side projects)</option>
              <option value="intermediate">Solid, but not as my job</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Hours per week</span>
            <input type="number" min={1} max={80} value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 8" className={field} />
          </label>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled || !ready}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {disabled && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          Map my transition
        </button>
      </div>
    </form>
  );
}
