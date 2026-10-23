"use client";

import { useState } from "react";
import type { PathRequest } from "@/lib/schema";
import { suggestSpelling } from "@/lib/spelling";
import { checkTopic, skillFromTopic, type TopicRefusal } from "@/lib/topic";

const field =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900";

/**
 * Form for the topic, then a clear "Personalise" button for the optional level, hours per week and goal, then
 * "Find my path" (which shows a spinner, not a different label, while a path is being written). If the topic looks
 * misspelled ("puthon"), it first asks "Did you mean python?" and lets the learner pick either spelling. Questions
 * like "How to learn Python?" become just the skill ("Python"), and topics Ladderly won't make a path for (see
 * lib/topic.ts) get a short explanation and safer topics to try instead.
 * @param {Object} props
 * @param {(req: PathRequest) => void} props.onSubmit Called with the cleaned-up request when the form is submitted.
 * @param {boolean} props.disabled Disables the submit button (while a path is being generated).
 * @param {(topic: string) => void} [props.onTopicChange] Called as the topic is typed (for the topic background).
 * @returns {JSX.Element} The form.
 */
export function PathForm({
  onSubmit,
  disabled,
  onTopicChange,
}: {
  onSubmit: (req: PathRequest) => void;
  disabled: boolean;
  onTopicChange?: (topic: string) => void;
}) {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [hours, setHours] = useState("");
  const [goal, setGoal] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  /** A suggested spelling waiting for an answer, e.g. "python" for "puthon". */
  const [suggestion, setSuggestion] = useState<string | null>(null);
  /** Bumped when Enter is pressed while the question is showing, to replay a small "please choose" nudge. */
  const [nudge, setNudge] = useState(0);
  /** Why the topic was turned down, shown instead of making a path. */
  const [refusal, setRefusal] = useState<TopicRefusal | null>(null);
  const optionCount = [level, hours, goal].filter(Boolean).length;

  /**
   * Sends the request for a topic (empty options become `undefined`, hours are clamped to 1–80).
   * @param {string} text The topic to use.
   * @returns {void}
   */
  function send(text: string) {
    setSuggestion(null);
    const hoursNum = Number(hours);
    onSubmit({
      topic: skillFromTopic(text),
      level: (level || undefined) as PathRequest["level"],
      hoursPerWeek: hours && hoursNum > 0 ? Math.min(80, Math.round(hoursNum)) : undefined,
      goal: (goal || undefined) as PathRequest["goal"],
    });
  }

  /**
   * Handles "Find my path" (button or Enter): asks "Did you mean…?" first when the topic looks misspelled, otherwise
   * sends it. While the question is showing, submitting again doesn't choose for the learner: it just nudges the
   * question, so they pick "Yes" or "No" themselves.
   * @param {React.FormEvent} e The submit event; its default page reload is prevented.
   * @returns {void}
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    if (suggestion) {
      setNudge((n) => n + 1);
      return;
    }
    const turnedDown = checkTopic(topic);
    setRefusal(turnedDown);
    if (turnedDown) return;
    const fix = suggestSpelling(topic);
    if (fix) setSuggestion(fix);
    else send(topic);
  }

  /**
   * Accepts the suggested spelling: puts it in the box and sends it.
   * @returns {void}
   */
  function acceptSuggestion() {
    if (!suggestion) return;
    setTopic(suggestion);
    onTopicChange?.(suggestion);
    send(suggestion);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={topic}
        onChange={(e) => {
          setTopic(e.target.value);
          onTopicChange?.(e.target.value);
          setSuggestion(null);
          setRefusal(null);
        }}
        placeholder='What do you want to learn? e.g. "guitar", "machine learning"'
        aria-label="Skill or topic"
        maxLength={120}
        className={`${field} w-full py-3 text-base`}
        autoFocus
      />

      {refusal && (
        <div
          role="status"
          className={`rounded-xl border p-4 ${
            refusal.reason === "self-harm"
              ? "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/40"
              : "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
          }`}
        >
          <p className="text-base">{refusal.message}</p>
          <p className="mt-2 text-xs text-zinc-500">{refusal.reason === "self-harm" ? "If you'd like something calming to learn:" : "Try one of these instead:"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {refusal.alternatives.map((alt) => (
              <button
                key={alt}
                type="button"
                onClick={() => {
                  setRefusal(null);
                  setTopic(alt);
                  onTopicChange?.(alt);
                  send(alt);
                }}
                className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:border-indigo-400 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-indigo-300"
              >
                {alt}
              </button>
            ))}
          </div>
        </div>
      )}

      {suggestion && (
        <div
          key={nudge}
          role="alert"
          className={`rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40 ${nudge ? "animate-[nudge_0.35s_ease-in-out] motion-reduce:animate-none" : ""}`}
        >
          <p className="text-base">
            Did you mean <strong className="font-semibold">{suggestion}</strong>?
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">Choose one to continue.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={acceptSuggestion}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Yes, use &ldquo;{suggestion}&rdquo;
            </button>
            <button
              type="button"
              onClick={() => send(topic)}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              No, search &ldquo;{topic.trim()}&rdquo;
            </button>
          </div>
        </div>
      )}

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
        Personalise: level, time and goal
        {optionCount > 0 && (
          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">{optionCount} set</span>
        )}
        <span aria-hidden="true" className={`transition-transform ${showOptions ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {showOptions && (
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Current level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
            <option value="">Not specified</option>
            <option value="none">None</option>
            <option value="some">Some</option>
            <option value="intermediate">Intermediate</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Hours per week</span>
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
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Goal</span>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={field}>
            <option value="">Not specified</option>
            <option value="hobby">Hobby</option>
            <option value="job">Job</option>
            <option value="exam">Exam</option>
          </select>
        </label>
      </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled || !topic.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {disabled && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          Find my path
        </button>
      </div>
    </form>
  );
}
