"use client";

import { useState } from "react";
import { READY_CATEGORIES, readyTopicText } from "@/lib/readyPaths";

const select =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950";

/**
 * Picker for Ladderly's ready-made paths, in place of the old demo banner: category → grade (students only) →
 * topic, then "Open path". These paths are built in, so they're free, open instantly and work offline in the
 * desktop app, whichever AI engine is chosen.
 * @param {Object} props
 * @param {(topic: string) => void} props.onPick Opens the ready-made path for a topic text (e.g. "Class 12 Physics").
 * @param {boolean} props.disabled Disables the button while a path is loading.
 * @returns {JSX.Element} The picker.
 */
export function ReadyPaths({ onPick, disabled }: { onPick: (topic: string) => void; disabled: boolean }) {
  const [categoryId, setCategoryId] = useState("");
  const [grade, setGrade] = useState("");
  const [topicLabel, setTopicLabel] = useState("");
  const category = READY_CATEGORIES.find((c) => c.id === categoryId);
  const topic = category?.topics.find((t) => t.label === topicLabel);
  const needsGrade = !!category?.grades;
  const ready = !!category && !!topic && (!needsGrade || !!grade);

  return (
    <section aria-labelledby="ready-title" className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/30">
      <h2 id="ready-title" className="text-base font-semibold text-blue-900 dark:text-blue-200">
        <span aria-hidden="true">📦 </span>Ready-made paths
      </h2>
      <p className="mt-0.5 text-sm text-blue-900/70 dark:text-blue-200/70">Free and instant, with videos, quizzes and free resources. They work offline in the desktop app.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (category && topic) onPick(readyTopicText(category, topic, grade));
        }}
        className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto]"
      >
        <label className="sr-only" htmlFor="ready-category">
          Category
        </label>
        <select
          id="ready-category"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setGrade("");
            setTopicLabel("");
          }}
          className={select}
        >
          <option value="">Choose a category…</option>
          {READY_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {needsGrade ? (
          <>
            <label className="sr-only" htmlFor="ready-grade">
              Grade
            </label>
            <select id="ready-grade" value={grade} onChange={(e) => setGrade(e.target.value)} className={`${select} sm:w-36`}>
              <option value="">Grade…</option>
              {category.grades!.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </>
        ) : (
          <span className="hidden sm:block" />
        )}

        <label className="sr-only" htmlFor="ready-topic">
          Topic
        </label>
        <select id="ready-topic" value={topicLabel} onChange={(e) => setTopicLabel(e.target.value)} disabled={!category} className={select}>
          <option value="">{category ? "Choose a topic…" : "Pick a category first"}</option>
          {category?.topics.map((t) => (
            <option key={t.label} value={t.label}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!ready || disabled}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-base font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Open path
        </button>
      </form>
      {needsGrade && (
        <p className="mt-2 text-xs text-blue-900/70 dark:text-blue-200/70">
          Each subject follows the CBSE 2025–26 syllabus across Classes 11 and 12, in order; Class 12 stages are marked.
        </p>
      )}
    </section>
  );
}
