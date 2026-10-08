/** Dates as "YYYY-MM-DD" strings in the user's own time zone, so "today" matches their calendar. */
export type DayKey = string;

/**
 * Formats a date as a local day key.
 * @param {Date} [date=new Date()] The date (defaults to now).
 * @returns {DayKey} For example "2026-10-06".
 */
export function dayKey(date: Date = new Date()): DayKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Turns a day key back into a Date at local midday (midday avoids daylight-saving edge cases).
 * @param {DayKey} key A "YYYY-MM-DD" string.
 * @returns {Date} That day at 12:00 local time.
 */
export function fromDayKey(key: DayKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

/**
 * Moves a day key forwards or backwards by whole days.
 * @param {DayKey} key The starting day.
 * @param {number} days How many days to add (negative to go back).
 * @returns {DayKey} The resulting day.
 */
export function addDays(key: DayKey, days: number): DayKey {
  const date = fromDayKey(key);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

/**
 * Counts whole days from one day to another.
 * @param {DayKey} from The earlier day.
 * @param {DayKey} to The later day.
 * @returns {number} Days between them (0 for the same day, negative if `to` is earlier).
 */
export function daysBetween(from: DayKey, to: DayKey): number {
  return Math.round((fromDayKey(to).getTime() - fromDayKey(from).getTime()) / 86_400_000);
}
