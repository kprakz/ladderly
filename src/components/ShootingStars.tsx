"use client";

import { useEffect, useRef } from "react";

/** Minimum time between bursts while the cursor stays on the icon, in milliseconds. */
const COOLDOWN = 1400;
/** Points kept for each star's trail. */
const TRAIL = 18;

type Star = {
  x: number;
  y: number;
  angle: number;
  /** Turning speed in radians per frame, so stars arc around the page instead of flying straight. */
  turn: number;
  speed: number;
  age: number;
  life: number;
  trail: { x: number; y: number }[];
};

/**
 * Golden shooting stars that burst out from under the Ladderly logo when the cursor is on the icon, curve across the
 * app with glowing trails and fade away. Drawn on one full-screen canvas that never blocks clicks; the animation
 * loop only runs while stars are alive. Skipped on touch screens and for people who prefer reduced motion.
 * @param {Object} props
 * @param {string} props.anchorId The id of the app icon's wrapper; stars launch when the cursor is on it and start behind it.
 * @returns {JSX.Element} The canvas.
 */
export function ShootingStars({ anchorId }: { anchorId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let stars: Star[] = [];
    let frame = 0;
    let lastBurst = 0;

    /**
     * Matches the canvas to the window size and pixel density, so lines stay crisp.
     * @returns {void}
     */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /**
     * Launches 4–6 stars from the centre of the logo, fanned out in all directions. The logo sits above this
     * canvas, so the stars appear to slide out from underneath it.
     * @param {DOMRect} logo The logo's position on screen.
     * @returns {void}
     */
    const burst = (logo: DOMRect) => {
      const x = logo.left + logo.width / 2;
      const y = logo.top + logo.height / 2;
      const count = 4 + Math.floor(Math.random() * 3);
      const offset = Math.random() * Math.PI * 2;
      for (let i = 0; i < count; i++) {
        stars.push({
          x,
          y,
          angle: offset + (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6,
          turn: (Math.random() < 0.5 ? -1 : 1) * (0.008 + Math.random() * 0.012),
          speed: 7 + Math.random() * 5,
          age: 0,
          life: 90 + Math.random() * 60,
          trail: [],
        });
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    /**
     * Moves and draws every star for one frame, and stops the loop when none are left.
     * @returns {void}
     */
    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      // Bright gold on dark backgrounds; a deeper amber so the stars still show up on white.
      const rgb = document.documentElement.classList.contains("dark") ? "250, 204, 21" : "245, 158, 11";
      for (const s of stars) {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > TRAIL) s.trail.shift();
        s.angle += s.turn;
        s.speed *= 0.992;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.age++;

        // Fade in quickly, fade out over the last third of the star's life.
        const fade = Math.min(1, s.age / 6, (s.life - s.age) / (s.life / 3));
        for (let i = 1; i < s.trail.length; i++) {
          const t = i / s.trail.length;
          ctx.strokeStyle = `rgba(${rgb}, ${t * 0.55 * fade})`;
          ctx.lineWidth = t * 2.2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
          ctx.lineTo(s.trail[i].x, s.trail[i].y);
          ctx.stroke();
        }
        ctx.shadowColor = `rgba(${rgb}, 0.9)`;
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(255, 245, 200, ${fade})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      stars = stars.filter((s) => s.age < s.life);
      frame = stars.length ? requestAnimationFrame(tick) : 0;
      if (!frame) ctx.clearRect(0, 0, innerWidth, innerHeight);
    };

    /**
     * Launches a burst when the cursor is on the icon (at most once per cooldown).
     * @param {PointerEvent} e The pointer event.
     * @returns {void}
     */
    const onMove = (e: PointerEvent) => {
      const anchor = document.getElementById(anchorId);
      if (!anchor || performance.now() - lastBurst < COOLDOWN) return;
      const r = anchor.getBoundingClientRect();
      const onIcon = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!onIcon) return;
      lastBurst = performance.now();
      burst((anchor.querySelector("svg") ?? anchor).getBoundingClientRect());
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [anchorId]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
