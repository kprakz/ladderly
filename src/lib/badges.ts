import { checkKey, progressOf, type SavedPath } from "./storage";
import type { ActivityDays, StreakStats } from "./streaks";

/** What badges are judged on. */
export type BadgeContext = { paths: SavedPath[]; days: ActivityDays; streak: StreakStats };

/** A milestone badge: shown greyed out until earned. */
export type Badge = { id: string; icon: string; title: string; description: string; earned: (ctx: BadgeContext) => boolean };

/**
 * Counts all learning actions ever logged.
 * @param {ActivityDays} days Actions per day.
 * @returns {number} The total.
 */
function totalActions(days: ActivityDays): number {
  return Object.values(days).reduce((sum, n) => sum + Math.max(0, n), 0);
}

/**
 * Tells whether any stage of any path has all its checkpoints ticked.
 * @param {SavedPath[]} paths Saved paths.
 * @returns {boolean} True if at least one stage is complete.
 */
function anyStageComplete(paths: SavedPath[]): boolean {
  return paths.some((p) => p.path.stages.some((s, i) => s.checkpoint.every((_, j) => p.checked.includes(checkKey(i, j)))));
}

/** All badges, in the order they're shown (roughly easiest first). */
export const BADGES: Badge[] = [
  { id: "first-path", icon: "🪜", title: "First path", description: "Create your first learning path", earned: ({ paths }) => paths.length >= 1 },
  { id: "stage-done", icon: "✅", title: "Stage cleared", description: "Tick every checkpoint in a stage", earned: ({ paths }) => anyStageComplete(paths) },
  {
    id: "quiz-ace",
    icon: "🎯",
    title: "Quiz ace",
    description: "Get every question right in a stage quiz",
    earned: ({ paths }) => paths.some((p) => Object.values(p.quizScores ?? {}).some((s) => s.total > 0 && s.correct === s.total)),
  },
  { id: "streak-3", icon: "🔥", title: "On fire", description: "Learn 3 days in a row", earned: ({ streak }) => streak.longest >= 3 },
  { id: "streak-7", icon: "⚡", title: "Week warrior", description: "Learn 7 days in a row", earned: ({ streak }) => streak.longest >= 7 },
  { id: "explorer", icon: "🧭", title: "Explorer", description: "Start 3 different paths", earned: ({ paths }) => paths.length >= 3 },
  { id: "rungs-50", icon: "🧗", title: "Climber", description: "Complete 50 steps in total", earned: ({ days }) => totalActions(days) >= 50 },
  { id: "summit", icon: "🏔️", title: "Summit", description: "Finish every checkpoint in a path", earned: ({ paths }) => paths.some((p) => progressOf(p).percent === 100) },
  { id: "streak-30", icon: "🏆", title: "Unstoppable", description: "Learn 30 days in a row", earned: ({ streak }) => streak.longest >= 30 },
  { id: "streak-100", icon: "👑", title: "Legend", description: "Learn 100 days in a row", earned: ({ streak }) => streak.longest >= 100 },
];

/**
 * Lists which badges are earned.
 * @param {BadgeContext} ctx Paths, activity and streak stats.
 * @returns {string[]} IDs of earned badges.
 */
export function earnedBadgeIds(ctx: BadgeContext): string[] {
  return BADGES.filter((b) => b.earned(ctx)).map((b) => b.id);
}
