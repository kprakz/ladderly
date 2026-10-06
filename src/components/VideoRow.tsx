"use client";

import { useEffect, useRef, useState } from "react";
import { youtubeSearchUrl } from "@/lib/platforms";
import type { FeaturedVideo } from "@/lib/schema";
import { VideoCard } from "./VideoCard";

/**
 * A Netflix-style horizontal row of video cards that scrolls sideways. Arrow buttons appear on hover, and only
 * on a side that has more to scroll to. The row ends in a "More on YouTube" card that searches YouTube; with no
 * videos, only that card is shown.
 * @param {Object} props
 * @param {FeaturedVideo[]} props.videos Verified videos to show (may be empty).
 * @param {string} props.searchQuery Search words for the "More on YouTube" card.
 * @returns {JSX.Element} The scrolling row.
 */
export function VideoRow({ videos, searchQuery }: { videos: FeaturedVideo[]; searchQuery: string }) {
  const rowRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  /**
   * Works out whether there is more content to the left or right of what's visible.
   * @returns {void}
   */
  function updateArrows() {
    const row = rowRef.current;
    if (!row) return;
    setCanScroll({ left: row.scrollLeft > 4, right: row.scrollLeft + row.clientWidth < row.scrollWidth - 4 });
  }

  // Re-check when the row is resized (e.g. the dropdown opens or the window changes size).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(() => updateArrows());
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  /**
   * Scrolls the row by most of its visible width.
   * @param {1 | -1} direction 1 to scroll right, -1 to scroll left.
   * @returns {void}
   */
  function scroll(direction: 1 | -1) {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  }

  const arrow =
    "absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-lg text-zinc-800 shadow-md ring-1 ring-black/10 opacity-0 transition group-hover/row:opacity-100 focus-visible:opacity-100 sm:flex dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <div className="group/row relative">
      {canScroll.left && (
        <button type="button" onClick={() => scroll(-1)} aria-label="Scroll videos left" className={`${arrow} -left-3`}>
          ‹
        </button>
      )}
      <ul
        ref={rowRef}
        onScroll={updateArrows}
        className="-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-3 overflow-x-auto scroll-smooth px-3 py-3 [scrollbar-width:thin]"
      >
        {videos.map((v) => (
          <li key={v.youtubeId}>
            <VideoCard video={v} />
          </li>
        ))}
        <li>
          <a
            href={youtubeSearchUrl(searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full min-h-[9rem] w-60 shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-300 p-3 text-center text-sm text-zinc-600 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400 sm:w-64"
          >
            <span aria-hidden="true" className="text-2xl">
              ▶
            </span>
            <span className="font-medium">{videos.length ? "More on YouTube" : "Find videos on YouTube"}</span>
            <span className="line-clamp-2 text-xs text-zinc-500">“{searchQuery}” ↗</span>
          </a>
        </li>
      </ul>
      {canScroll.right && (
        <button type="button" onClick={() => scroll(1)} aria-label="Scroll videos right" className={`${arrow} -right-3`}>
          ›
        </button>
      )}
    </div>
  );
}
