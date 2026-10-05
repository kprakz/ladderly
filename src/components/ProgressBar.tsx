/**
 * Thin horizontal progress bar; turns green at 100%.
 * @param {Object} props
 * @param {number} props.percent Progress from 0 to 100.
 * @param {string} [props.className] Extra CSS classes for sizing and spacing.
 * @returns {JSX.Element} An accessible `progressbar` element.
 */
export function ProgressBar({ percent, className = "" }: { percent: number; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${percent === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
