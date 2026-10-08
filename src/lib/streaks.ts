import { addDays, type DayKey, daysBetween } from "./dates";

/** Learning actions per day, e.g. { "2026-10-06": 4 }. */
export type ActivityDays = Record<DayKey, number>;

/** One rest day is earned for every this many active days in a row. */
export const DAYS_PER_REST_DAY = 7;
/** The most rest days you can hold at once. */
export const MAX_REST_DAYS = 2;

/** Everything the streak card needs. */
export type StreakStats = {
  /** Days in a row with learning (rest days keep it going but don't add to it). */
  current: number;
  longest: number;
  /** Rest days available to protect the streak. */
  restDays: number;
  /** Days that were missed but covered by a rest day. */
  restDaysUsed: DayKey[];
  /** Whether there's been any learning today. */
  todayDone: boolean;
  /** True when there's a streak going but nothing done yet today (it ends at midnight unless a rest day covers it). */
  atRisk: boolean;
};

/**
 * Works out streaks from the activity log, walking day by day from the first active day to today.
 * An active day adds one to the streak; every 7th active day in a row earns a rest day (max 2). A missed day uses a
 * rest day if one is available, otherwise the streak resets. Today never breaks the streak: it's still in progress.
 * @param {ActivityDays} days Actions per day.
 * @param {DayKey} today Today's day key.
 * @returns {StreakStats} Current and longest streak, rest days, and today's status.
 */
export function computeStreak(days: ActivityDays, today: DayKey): StreakStats {
  const active = Object.keys(days)
    .filter((k) => days[k] > 0 && k <= today)
    .sort();
  if (active.length === 0) {
    return { current: 0, longest: 0, restDays: 0, restDaysUsed: [], todayDone: false, atRisk: false };
  }

  let current = 0;
  let longest = 0;
  let restDays = 0;
  let activeRun = 0; // active days in a row, for earning rest days
  const restDaysUsed: DayKey[] = [];

  for (let day = active[0]; daysBetween(day, today) >= 0; day = addDays(day, 1)) {
    if ((days[day] ?? 0) > 0) {
      current += 1;
      activeRun += 1;
      if (activeRun % DAYS_PER_REST_DAY === 0) restDays = Math.min(MAX_REST_DAYS, restDays + 1);
    } else if (day === today) {
      // Today isn't over yet, so it can't break the streak.
    } else if (current > 0 && restDays > 0) {
      restDays -= 1;
      restDaysUsed.push(day);
    } else {
      current = 0;
      activeRun = 0;
    }
    longest = Math.max(longest, current);
  }

  const todayDone = (days[today] ?? 0) > 0;
  return { current, longest, restDays, restDaysUsed, todayDone, atRisk: current > 0 && !todayDone };
}

/** One square in the activity heatmap. */
export type HeatCell = { day: DayKey; count: number; level: 0 | 1 | 2 | 3 | 4; future: boolean };

/**
 * Builds the GitHub-style activity grid: whole weeks (Sunday to Saturday) ending with the current week.
 * @param {ActivityDays} days Actions per day.
 * @param {DayKey} today Today's day key.
 * @param {number} [weeks=53] How many weeks to show.
 * @returns {HeatCell[][]} One array per week (oldest first), each with 7 days from Sunday to Saturday.
 */
export function heatmapWeeks(days: ActivityDays, today: DayKey, weeks = 53): HeatCell[][] {
  const weekday = new Date(`${today}T12:00:00`).getDay(); // 0 = Sunday
  const start = addDays(today, -weekday - (weeks - 1) * 7);
  const grid: HeatCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const day = addDays(start, w * 7 + d);
      const count = days[day] ?? 0;
      week.push({ day, count, level: heatLevel(count), future: day > today });
    }
    grid.push(week);
  }
  return grid;
}

/**
 * Maps a day's action count to a colour level, like GitHub's contribution graph.
 * @param {number} count Actions that day.
 * @returns {0 | 1 | 2 | 3 | 4} 0 for none, then 1–2, 3–5, 6–9 and 10 or more.
 */
export function heatLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Totals for the heatmap caption.
 * @param {ActivityDays} days Actions per day.
 * @param {DayKey} today Today's day key.
 * @returns {{ lastYear: number, activeDays: number }} Actions and active days in the past 365 days.
 */
export function yearTotals(days: ActivityDays, today: DayKey): { lastYear: number; activeDays: number } {
  const from = addDays(today, -364);
  let lastYear = 0;
  let activeDays = 0;
  for (const [day, count] of Object.entries(days)) {
    if (day >= from && day <= today && count > 0) {
      lastYear += count;
      activeDays += 1;
    }
  }
  return { lastYear, activeDays };
}
