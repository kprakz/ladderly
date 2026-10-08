"use client";

import { useEffect, useRef } from "react";

/** Diameter of the glow, in pixels (about half a centimetre on a typical screen). */
const SIZE = 20;

/**
 * A small soft glow that follows the mouse, tinted with the topic colour. It moves with the pointer once per
 * animation frame (no React re-renders), never blocks clicks, fades out when the mouse leaves the window, and is
 * left out on touch screens, where there is no cursor.
 * @param {Object} props
 * @param {string} props.color Glow colour (CSS colour), e.g. the topic theme's first glow.
 * @returns {JSX.Element} The glow layer.
 */
export function CursorGlow({ color }: { color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    /**
     * Records the pointer position and schedules a move on the next frame.
     * @param {PointerEvent} e The pointer event.
     * @returns {void}
     */
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          el.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0)`;
        });
      }
    };
    /**
     * Hides the glow when the mouse leaves the window.
     * @returns {void}
     */
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 rounded-full opacity-0 transition-opacity duration-300"
      style={{
        width: SIZE,
        height: SIZE,
        background: `radial-gradient(circle, color-mix(in srgb, ${color} 40%, transparent) 0%, color-mix(in srgb, ${color} 15%, transparent) 40%, transparent 70%)`,
      }}
    />
  );
}
