"use client";

import { useEffect, useRef } from "react";
import { fromDayKey, type DayKey } from "@/lib/dates";
import { type ActivityDays, heatmapWeeks, yearTotals } from "@/lib/streaks";

/** Square colours by activity level, GitHub style (indigo to match Ladderly). */
const LEVEL_CLASSES = [
  "bg-zinc-100 dark:bg-zinc-800",
  "bg-indigo-200 dark:bg-indigo-900",
  "bg-indigo-400 dark:bg-indigo-700",
  "bg-indigo-600 dark:bg-indigo-500",
  "bg-indigo-800 dark:bg-indigo-300",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Describes one day for its tooltip.
 * @param {DayKey} day The day.
 * @param {number} count Learning actions that day.
 * @returns {string} For example "3 rungs on Mon 6 Oct 2026".
 */
function describeDay(day: DayKey, count: number): string {
  const label = fromDayKey(day).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  return `${count === 0 ? "No" : count} step${count === 1 ? "" : "s"} on ${label}`;
}

/**
 * GitHub-style contribution graph of learning activity over the past year: one square per day, darker for more
 * rungs climbed (checkpoints ticked, quizzes finished, paths started). Scrolls to the latest weeks on small screens.
 * @param {Object} props
 * @param {ActivityDays} props.days Actions per day.
 * @param {DayKey} props.today Today's day key.
 * @returns {JSX.Element} The heatmap with month labels, weekday labels, legend and totals.
 */
export function ActivityHeatmap({ days, today }: { days: ActivityDays; today: DayKey }) {
  const weeks = heatmapWeeks(days, today);
  const totals = yearTotals(days, today);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show the most recent weeks first on narrow screens (again whenever the width changes).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const toEnd = () => (el.scrollLeft = el.scrollWidth);
    toEnd();
    const observer = new ResizeObserver(toEnd);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A month label sits above the first week that starts in that month.
  const monthLabels = weeks.map((week, i) => {
    const month = fromDayKey(week[0].day).getMonth();
    const prevMonth = i > 0 ? fromDayKey(weeks[i - 1][0].day).getMonth() : -1;
    return month !== prevMonth && i < weeks.length - 1 ? MONTHS[month] : "";
  });

  return (
    <div>
      <p className="mb-2 text-xs text-zinc-500">
        <strong>{totals.lastYear}</strong> steps done on <strong>{totals.activeDays}</strong> day
        {totals.activeDays === 1 ? "" : "s"} in the last year
      </p>
      <div ref={scrollRef} className="overflow-x-auto pb-2" role="img" aria-label={`Learning activity: ${totals.lastYear} steps done on ${totals.activeDays} days in the last year.`}>
        <div className="inline-flex gap-2" aria-hidden="true">
          {/* Weekday labels */}
          <div className="grid grid-rows-[auto_repeat(7,0.75rem)] gap-[3px] pt-px text-[10px] leading-3 text-zinc-500">
            <span className="h-3" />
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <span key={i} className="h-3">
                {d}
              </span>
            ))}
          </div>
          <div>
            {/* Month labels */}
            <div className="flex gap-[3px] text-[10px] leading-3 text-zinc-500">
              {monthLabels.map((m, i) => (
                <span key={i} className="w-3 shrink-0 overflow-visible whitespace-nowrap">
                  {m}
                </span>
              ))}
            </div>
            {/* Squares: one column per week */}
            <div className="mt-[3px] flex gap-[3px]">
              {weeks.map((week) => (
                <div key={week[0].day} className="flex flex-col gap-[3px]">
                  {week.map((cell) =>
                    cell.future ? (
                      <span key={cell.day} className="h-3 w-3" />
                    ) : (
                      <span
                        key={cell.day}
                        title={describeDay(cell.day, cell.count)}
                        className={`h-3 w-3 rounded-[3px] ${LEVEL_CLASSES[cell.level]} ${
                          cell.day === today ? "ring-1 ring-zinc-900 ring-offset-1 ring-offset-white dark:ring-zinc-100 dark:ring-offset-zinc-900" : ""
                        }`}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-zinc-500" aria-hidden="true">
        Less
        {LEVEL_CLASSES.map((c, i) => (
          <span key={i} className={`h-3 w-3 rounded-[3px] ${c}`} />
        ))}
        More
      </div>
    </div>
  );
}
