"use client";

import { useState } from "react";
import type { PathRequest } from "@/lib/schema";

const field =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900";

/**
 * Form for the topic and the optional level, hours per week and goal.
 * @param {Object} props
 * @param {(req: PathRequest) => void} props.onSubmit Called with the cleaned-up request when the form is submitted.
 * @param {boolean} props.disabled Disables the submit button (while a path is being generated).
 * @returns {JSX.Element} The form.
 */
export function PathForm({ onSubmit, disabled }: { onSubmit: (req: PathRequest) => void; disabled: boolean }) {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [hours, setHours] = useState("");
  const [goal, setGoal] = useState("");

  /**
   * Converts the form fields into a `PathRequest` (empty options become `undefined`, hours are clamped to 1–80).
   * @param {React.FormEvent} e The submit event; its default page reload is prevented.
   * @returns {void}
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    const hoursNum = Number(hours);
    onSubmit({
      topic: topic.trim(),
      level: (level || undefined) as PathRequest["level"],
      hoursPerWeek: hours && hoursNum > 0 ? Math.min(80, Math.round(hoursNum)) : undefined,
      goal: (goal || undefined) as PathRequest["goal"],
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder='What do you want to learn? e.g. "guitar", "machine learning"'
          aria-label="Skill or topic"
          maxLength={120}
          className={`${field} flex-1 py-3 text-base`}
          autoFocus
        />
        <button
          type="submit"
          disabled={disabled || !topic.trim()}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Generating…" : "Find my path"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Current level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
            <option value="">Not specified</option>
            <option value="none">None</option>
            <option value="some">Some</option>
            <option value="intermediate">Intermediate</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Hours per week</span>
          <input
            type="number"
            min={1}
            max={80}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 5"
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Goal</span>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={field}>
            <option value="">Not specified</option>
            <option value="hobby">Hobby</option>
            <option value="job">Job</option>
            <option value="exam">Exam</option>
          </select>
        </label>
      </div>
    </form>
  );
}
