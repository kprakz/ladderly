"use client";

import { useId, useState } from "react";

/**
 * A dropdown section: a header button that expands or collapses its content with a smooth height animation.
 * Accessible: the button reports `aria-expanded` and controls the content region.
 * @param {Object} props
 * @param {React.ReactNode} props.title Text (or elements) shown in the header button.
 * @param {number} [props.count] Optional number shown as a small badge next to the title.
 * @param {React.ReactNode} [props.icon] Optional icon shown before the title.
 * @param {boolean} [props.defaultOpen=false] Whether the section starts expanded.
 * @param {string} [props.className] Extra classes for the outer wrapper.
 * @param {React.ReactNode} props.children The content shown when expanded.
 * @returns {JSX.Element} The dropdown section.
 */
export function Disclosure({
  title,
  count,
  icon,
  defaultOpen = false,
  className = "",
  children,
}: {
  title: React.ReactNode;
  count?: number;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={`rounded-lg border border-zinc-200 dark:border-zinc-800 ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        <span className="flex-1">{title}</span>
        {count !== undefined && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {count}
          </span>
        )}
        <span
          aria-hidden="true"
          className={`text-zinc-400 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {/* The grid-rows trick animates height from 0 to the content's natural height */}
      <div
        id={contentId}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
