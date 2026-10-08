import { showToast } from "@/components/Toaster";
import { getActivity, recordActivity } from "./activity";
import { BADGES, earnedBadgeIds } from "./badges";
import { dayKey } from "./dates";
import { getProfile } from "./profile";
import { getSavedPaths } from "./storage";
import { computeStreak } from "./streaks";

/**
 * Takes a snapshot of everything a celebration depends on.
 * @returns {{ count: number, streak: import("./streaks").StreakStats, badges: Set<string> }} Today's count, streak and earned badges.
 */
function snapshot() {
  const today = dayKey();
  const days = getActivity();
  const paths = getSavedPaths();
  const streak = computeStreak(days, today);
  return { count: days[today] ?? 0, streak, badges: new Set(earnedBadgeIds({ paths, days, streak })) };
}

/**
 * Applies a learning action, logs it as rungs climbed today and shows toasts for anything worth celebrating:
 * the streak growing (first rung of the day), the daily goal being reached, a rest day earned or a new badge.
 * @param {number} delta Rungs to add (+1 tick, quiz or new path; -1 untick).
 * @param {() => void} [change] The change to saved paths (run first, so badges see it).
 * @returns {void}
 */
export function climb(delta: number, change?: () => void): void {
  const before = snapshot();
  change?.();
  if (delta !== 0) recordActivity(delta);
  const after = snapshot();
  if (delta <= 0) return;

  if (!before.streak.todayDone && after.streak.todayDone) {
    showToast("🔥", after.streak.current > 1 ? `${after.streak.current}-day streak! Keep climbing.` : "Streak started! Come back tomorrow to grow it.");
  }
  const goal = getProfile().dailyGoal;
  if (before.count < goal && after.count >= goal) showToast("🎯", "Daily goal reached. Nice work!");
  if (after.streak.restDays > before.streak.restDays) showToast("❄️", "Rest day earned. It'll protect your streak if you miss a day.");
  for (const badge of BADGES) {
    if (after.badges.has(badge.id) && !before.badges.has(badge.id)) showToast(badge.icon, `Badge earned: ${badge.title}`);
  }
}
