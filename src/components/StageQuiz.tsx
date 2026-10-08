"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/schema";

type Props = {
  questions: QuizQuestion[];
  unlocked: boolean;
  best?: { correct: number; total: number };
  onFinish: (correct: number, total: number) => void;
};

/** Where the quiz is: not started, on a question (with or without an answer picked), or finished. */
type QuizState =
  | { step: "intro" }
  | { step: "question"; index: number; picked: number | null; correct: number }
  | { step: "done"; correct: number };

/**
 * A short multiple-choice quiz for one stage, unlocked once all the stage's checkpoints are ticked.
 * Shows one question at a time; after each answer it reveals whether it was right, with an explanation.
 * @param {Props} props
 * @param {QuizQuestion[]} props.questions The stage's quiz questions.
 * @param {boolean} props.unlocked Whether the stage is complete (the quiz is locked otherwise).
 * @param {{ correct: number, total: number }} [props.best] Best saved score for this stage, if any.
 * @param {(correct: number, total: number) => void} props.onFinish Called with the score when the quiz is finished.
 * @returns {JSX.Element} The quiz section.
 */
export function StageQuiz({ questions, unlocked, best, onFinish }: Props) {
  const [state, setState] = useState<QuizState>({ step: "intro" });
  const total = questions.length;

  if (!unlocked) {
    return (
      <p className="text-sm text-zinc-500">
        🔒 Finish the checklist to unlock a {total}-question quiz.
      </p>
    );
  }

  if (state.step === "intro") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setState({ step: "question", index: 0, picked: null, correct: 0 })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          {best ? "Retake the quiz" : `Take the quiz · ${total} questions`}
        </button>
        {best && (
          <span className="text-sm text-zinc-500">
            Best score: {best.correct}/{best.total}
          </span>
        )}
      </div>
    );
  }

  if (state.step === "done") {
    const perfect = state.correct === total;
    return (
      <div className="flex flex-wrap items-center gap-3" aria-live="polite">
        <p className="text-sm font-medium">
          {perfect ? "🎉 " : ""}You got {state.correct} of {total} right.
          {!perfect && <span className="font-normal text-zinc-500"> Review the stage and try again any time.</span>}
        </p>
        <button
          onClick={() => setState({ step: "question", index: 0, picked: null, correct: 0 })}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Retake
        </button>
      </div>
    );
  }

  const q = questions[state.index];
  const answered = state.picked !== null;
  const isLast = state.index === total - 1;

  /**
   * Records the chosen option for the current question (only the first pick counts).
   * @param {number} option Index of the chosen option.
   * @returns {void}
   */
  function pick(option: number) {
    if (state.step !== "question" || state.picked !== null) return;
    setState({ ...state, picked: option, correct: state.correct + (option === q.answer ? 1 : 0) });
  }

  /**
   * Moves to the next question, or finishes the quiz and reports the score after the last one.
   * @returns {void}
   */
  function next() {
    if (state.step !== "question") return;
    if (isLast) {
      setState({ step: "done", correct: state.correct });
      onFinish(state.correct, total);
    } else {
      setState({ step: "question", index: state.index + 1, picked: null, correct: state.correct });
    }
  }

  return (
    <div>
      <p className="text-xs text-zinc-500">
        Question {state.index + 1} of {total}
      </p>
      <p className="mt-1 font-medium">{q.question}</p>
      <ul className="mt-2 space-y-1.5" role="list">
        {q.options.map((option, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === state.picked;
          const tone = !answered
            ? "border-zinc-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-zinc-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40"
            : isAnswer
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
              : isPicked
                ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40"
                : "border-zinc-200 opacity-60 dark:border-zinc-700";
          return (
            <li key={i}>
              <button
                onClick={() => pick(i)}
                disabled={answered}
                aria-pressed={isPicked}
                className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition disabled:cursor-default ${tone}`}
              >
                <span className="font-mono text-zinc-500">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{option}</span>
                {answered && isAnswer && <span aria-label="correct answer">✓</span>}
                {answered && isPicked && !isAnswer && <span aria-label="your answer, incorrect">✗</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
          <p className="text-sm">
            <span className={state.picked === q.answer ? "font-medium text-emerald-700 dark:text-emerald-400" : "font-medium text-red-700 dark:text-red-400"}>
              {state.picked === q.answer ? "Correct. " : "Not quite. "}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">{q.explanation}</span>
          </p>
          <button
            onClick={next}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            {isLast ? "See score" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
