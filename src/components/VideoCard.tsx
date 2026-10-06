"use client";

import { useEffect, useState } from "react";
import type { FeaturedVideo } from "@/lib/schema";

/** YouTube thumbnail images: the cover, then three frames YouTube captures from inside the video. */
const FRAMES = ["mqdefault", "mq1", "mq2", "mq3"] as const;
/** How long each preview frame stays on screen while hovering, in milliseconds. */
const FRAME_MS = 900;

/**
 * Builds the URL of one YouTube thumbnail image.
 * @param {string} youtubeId The video's ID.
 * @param {string} frame Which image: "mqdefault" (the cover) or "mq1"–"mq3" (frames from the video).
 * @returns {string} The image URL.
 */
function thumbUrl(youtubeId: string, frame: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/${frame}.jpg`;
}

/**
 * Netflix-style video card: thumbnail with the title and channel underneath. When hovered or focused it zooms up,
 * shows a play button, and cycles through frames from inside the video as a live preview, with dots showing
 * which frame is on screen. Clicking opens the video on YouTube in a new tab. Under "reduce motion", it
 * doesn't zoom or cycle.
 * @param {Object} props
 * @param {FeaturedVideo} props.video The video to show.
 * @returns {JSX.Element} A link card.
 */
export function VideoCard({ video }: { video: FeaturedVideo }) {
  const [active, setActive] = useState(false);
  const [frame, setFrame] = useState(0);
  // Frames 1–3 are only loaded once the card has been hovered, to keep the page light.
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS);
    return () => clearInterval(timer);
  }, [active]);

  /**
   * Starts the preview (on mouse enter or keyboard focus).
   * @returns {void}
   */
  function start() {
    setPrimed(true);
    setActive(true);
  }

  /**
   * Stops the preview and returns to the cover image.
   * @returns {void}
   */
  function stop() {
    setActive(false);
    setFrame(0);
  }

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      aria-label={`${video.title} by ${video.channel} (opens YouTube)`}
      className="group relative block w-60 shrink-0 snap-start overflow-hidden rounded-lg bg-zinc-900 shadow-sm ring-1 ring-black/5 transition duration-300 ease-out hover:z-10 hover:scale-[1.06] hover:shadow-xl focus-visible:z-10 focus-visible:scale-[1.06] motion-reduce:transition-none motion-reduce:hover:scale-100 dark:ring-white/10 sm:w-64"
    >
      <span className="relative block aspect-video">
        {FRAMES.map((f, i) =>
          i === 0 || primed ? (
            /* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnails; next/image would need remote config */
            <img
              key={f}
              src={thumbUrl(video.youtubeId, f)}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${
                i === frame ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null,
        )}

        {/* Play button, shown while previewing */}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 top-[38%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg transition duration-300 ${
            active ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          ▶
        </span>

        {/* Frame progress dots */}
        <span
          aria-hidden="true"
          className={`absolute right-2 top-2 flex gap-1 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
        >
          {FRAMES.map((f, i) => (
            <span key={f} className={`h-1 w-3 rounded-full ${i === frame ? "bg-white" : "bg-white/40"}`} />
          ))}
        </span>
      </span>

      {/* Caption below the image, so the thumbnail itself stays clean */}
      <span className="block p-2.5">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-white">{video.title}</span>
        <span className="mt-0.5 block text-xs text-zinc-400">{video.channel} · YouTube ↗</span>
      </span>
    </a>
  );
}
