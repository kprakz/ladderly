"use client";

import { useState } from "react";
import { BADGES, earnedBadgeIds } from "@/lib/badges";
import { addDays, type DayKey, fromDayKey } from "@/lib/dates";
import { type Profile, updateProfile } from "@/lib/profile";
import { checkKey, type SavedPath } from "@/lib/storage";
import { type ActivityDays, DAYS_PER_REST_DAY, MAX_REST_DAYS, type StreakStats } from "@/lib/streaks";
import { ActivityHeatmap } from "./ActivityHeatmap";

/** The next unticked checkpoint to suggest. */
export type NextStep = { path: SavedPath; stageIndex: number; itemIndex: number; text: string; stageTitle: string };

/**
 * Finds the next checkpoint to work on: the first unticked one in the preferred path (if it isn't finished),
 * otherwise in the most recent unfinished path.
 * @param {SavedPath[]} paths Saved paths, newest first.
 * @param {string | null} preferredId The path currently on screen, if any.
 * @returns {NextStep | null} The suggestion, or `null` if every path is finished (or there are none).
 */
export function findNextStep(paths: SavedPath[], preferredId: string | null): NextStep | null {
  const ordered = [...paths.filter((p) => p.id === preferredId), ...paths.filter((p) => p.id !== preferredId)];
  for (const path of ordered) {
    for (const [stageIndex, stage] of path.path.stages.entries()) {
      const itemIndex = stage.checkpoint.findIndex((_, j) => !path.checked.includes(checkKey(stageIndex, j)));
      if (itemIndex !== -1) return { path, stageIndex, itemIndex, text: stage.checkpoint[itemIndex], stageTitle: stage.title };
    }
  }
  return null;
}

type Props = {
  profile: Profile;
  returning: boolean;
  paths: SavedPath[];
  days: ActivityDays;
  streak: StreakStats;
  today: DayKey;
  next: NextStep | null;
  onTickNext: (step: NextStep) => void;
  onOpenStage: (pathId: string, stageIndex: number) => void;
  onChangeName: () => void;
};

const card = "rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";

/**
 * The learner's home strip, kept deliberately small: a greeting with two chips (streak and today's goal), the one
 * next step to do, and a "My progress" button that reveals the details (heatmap, week, goal, badges) on demand.
 * @param {Props} props
 * @param {Profile} props.profile Name and daily goal.
 * @param {boolean} props.returning True for "Welcome back", false on the first visit.
 * @param {SavedPath[]} props.paths Saved paths (for badges).
 * @param {ActivityDays} props.days Steps done per day.
 * @param {StreakStats} props.streak Current streak stats.
 * @param {DayKey} props.today Today's day key.
 * @param {NextStep | null} props.next Suggested next checkpoint, if any.
 * @param {(step: NextStep) => void} props.onTickNext Ticks the suggested checkpoint.
 * @param {(pathId: string, stageIndex: number) => void} props.onOpenStage Shows a path and scrolls to a stage.
 * @param {() => void} props.onChangeName Opens the name dialog.
 * @returns {JSX.Element} The dashboard section.
 */
export function ProgressDashboard({ profile, returning, paths, days, streak, today, next, onTickNext, onOpenStage, onChangeName }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const todayCount = days[today] ?? 0;
  const goal = profile.dailyGoal;
  const goalDone = todayCount >= goal;

  return (
    <section aria-labelledby="dashboard-title" className="mb-8 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="dashboard-title" className="text-lg font-semibold">
          {returning ? "Welcome back" : "Welcome"}
          {profile.name ? `, ${profile.name}` : ""} 👋
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <Chip title={`${streak.current}-day streak`}>
            <span aria-hidden="true" className={streak.current > 0 ? "" : "grayscale opacity-50"}>
              🔥
            </span>
            {streak.current} {streak.current === 1 ? "day" : "days"}
          </Chip>
          <Chip title={`Today: ${todayCount} of ${goal} steps`}>
            <span aria-hidden="true">{goalDone ? "✅" : "🎯"}</span>
            {Math.min(todayCount, 99)}/{goal} today
          </Chip>
          <button
            onClick={() => setShowDetails((s) => !s)}
            aria-expanded={showDetails}
            className="rounded-full px-3 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            My progress {showDetails ? "▴" : "▾"}
          </button>
        </div>
      </div>

      {next && <NextStepCard next={next} onTick={onTickNext} onOpen={onOpenStage} />}

      {showDetails && (
        <Details profile={profile} paths={paths} days={days} streak={streak} today={today} onChangeName={onChangeName} />
      )}
    </section>
  );
}

/**
 * A small rounded stat pill.
 * @param {Object} props
 * @param {string} props.title Tooltip and accessible description.
 * @param {React.ReactNode} props.children The pill content.
 * @returns {JSX.Element} The pill.
 */
function Chip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <span title={title} className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 tabular-nums dark:bg-zinc-800">
      {children}
    </span>
  );
}

/**
 * The one thing to do next: the next unticked checkpoint, with "Done" and "Open".
 * @param {Object} props
 * @param {NextStep} props.next The suggestion.
 * @param {(step: NextStep) => void} props.onTick Ticks it.
 * @param {(pathId: string, stageIndex: number) => void} props.onOpen Shows its stage.
 * @returns {JSX.Element} The card.
 */
function NextStepCard({ next, onTick, onOpen }: { next: NextStep; onTick: (s: NextStep) => void; onOpen: (pathId: string, stageIndex: number) => void }) {
  return (
    <div className={`${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-zinc-500">
          Next step · <span className="capitalize">{next.path.request.topic}</span>, stage {next.stageIndex + 1}
        </p>
        <p className="mt-0.5 font-medium">{next.text}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onOpen(next.path.id, next.stageIndex)}
          className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Open
        </button>
        <button onClick={() => onTick(next)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
          ✓ Done
        </button>
      </div>
    </div>
  );
}

/**
 * The details behind "My progress": this week, daily goal choice, the year heatmap and badges.
 * @param {Object} props
 * @param {Profile} props.profile Name and daily goal.
 * @param {SavedPath[]} props.paths Saved paths (for badges).
 * @param {ActivityDays} props.days Steps done per day.
 * @param {StreakStats} props.streak Streak stats.
 * @param {DayKey} props.today Today's day key.
 * @param {() => void} props.onChangeName Opens the name dialog.
 * @returns {JSX.Element} The panel.
 */
function Details({
  profile,
  paths,
  days,
  streak,
  today,
  onChangeName,
}: {
  profile: Profile;
  paths: SavedPath[];
  days: ActivityDays;
  streak: StreakStats;
  today: DayKey;
  onChangeName: () => void;
}) {
  const earned = new Set(earnedBadgeIds({ paths, days, streak }));
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  return (
    <div className={`${card} space-y-6 p-4 sm:p-5`}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium">This week</h3>
          <ol className="mt-2 flex gap-2" aria-label="Last 7 days">
            {week.map((day) => {
              const active = (days[day] ?? 0) > 0;
              const rested = streak.restDaysUsed.includes(day);
              const state = active ? "learned" : rested ? "rest day used" : day === today ? "not yet today" : "missed";
              return (
                <li key={day} className="flex flex-col items-center gap-1 text-[11px] text-zinc-500">
                  <span
                    aria-label={`${fromDayKey(day).toLocaleDateString(undefined, { weekday: "long" })}: ${state}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      active ? "bg-indigo-600 text-white" : rested ? "bg-sky-100 dark:bg-sky-950" : "bg-zinc-100 dark:bg-zinc-800"
                    } ${day === today ? "ring-2 ring-indigo-300 dark:ring-indigo-700" : ""}`}
                  >
                    {active ? "✓" : rested ? "❄️" : ""}
                  </span>
                  {fromDayKey(day).toLocaleDateString(undefined, { weekday: "narrow" })}
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-xs text-zinc-500">
            Best streak: {streak.longest} {streak.longest === 1 ? "day" : "days"} · ❄️ {streak.restDays} rest{" "}
            {streak.restDays === 1 ? "day" : "days"}
            <span className="block">Learn {DAYS_PER_REST_DAY} days in a row to earn a rest day (up to {MAX_REST_DAYS}). It saves your streak if you miss a day.</span>
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Daily goal</legend>
          <div className="mt-2 flex gap-2">
            {([1, 3, 5] as const).map((g) => (
              <label
                key={g}
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${
                  profile.dailyGoal === g
                    ? "border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                <input type="radio" name="daily-goal" checked={profile.dailyGoal === g} onChange={() => updateProfile({ dailyGoal: g })} className="sr-only" />
                {g} {g === 1 ? "step" : "steps"}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">A step is a ticked checkpoint, a finished quiz or a new path.</p>
        </fieldset>
      </div>

      <div>
        <h3 className="text-sm font-medium">Your year</h3>
        <div className="mt-2">
          <ActivityHeatmap days={days} today={today} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium">
          Badges <span className="font-normal text-zinc-500">· {earned.size} of {BADGES.length}</span>
        </h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {BADGES.map((b) => {
            const has = earned.has(b.id);
            return (
              <li
                key={b.id}
                title={`${b.title}: ${b.description}${has ? " (earned)" : ""}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${
                  has ? "bg-amber-100 dark:bg-amber-950/60" : "bg-zinc-100 grayscale opacity-40 dark:bg-zinc-800"
                }`}
              >
                <span aria-hidden="true">{b.icon}</span>
                <span className="sr-only">
                  {b.title}: {b.description}, {has ? "earned" : "not yet earned"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={onChangeName} className="text-xs text-zinc-500 hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
        {profile.name ? "Change your name" : "Add your name"}
      </button>
    </div>
  );
}
