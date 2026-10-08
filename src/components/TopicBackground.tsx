"use client";

import type { TopicTheme } from "@/lib/topicTheme";

/** Where the floating symbols sit and how they move (fixed, so the layout never jumps). */
const SLOTS = [
  { left: "6%", top: "14%", size: 34, duration: 19, delay: 0 },
  { left: "88%", top: "10%", size: 28, duration: 23, delay: -6 },
  { left: "18%", top: "58%", size: 26, duration: 21, delay: -11 },
  { left: "78%", top: "46%", size: 38, duration: 25, delay: -3 },
  { left: "48%", top: "82%", size: 30, duration: 18, delay: -9 },
  { left: "93%", top: "76%", size: 24, duration: 22, delay: -14 },
  { left: "3%", top: "88%", size: 28, duration: 24, delay: -5 },
  { left: "60%", top: "6%", size: 22, duration: 20, delay: -12 },
  { left: "35%", top: "34%", size: 20, duration: 26, delay: -8 },
];

/**
 * A quiet, slowly moving background that reflects the topic: two soft colour glows that drift, and a few faint
 * symbols (🎸 for guitar, 🐍 for python…) floating gently. It crossfades when the topic changes, sits behind
 * everything, ignores the mouse, is hidden from screen readers, and stays still for people who prefer reduced motion.
 * @param {Object} props
 * @param {TopicTheme} props.theme The look to show.
 * @returns {JSX.Element} The fixed background layer.
 */
export function TopicBackground({ theme }: { theme: TopicTheme }) {
  const [a, b] = theme.glows;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-25 blur-3xl transition-colors duration-[1500ms] animate-[drift_28s_ease-in-out_infinite_alternate] motion-reduce:animate-none dark:opacity-[0.18]"
        style={{ backgroundColor: a }}
      />
      <div
        className="absolute -bottom-48 -right-40 h-[38rem] w-[38rem] rounded-full opacity-20 blur-3xl transition-colors duration-[1500ms] animate-[drift_34s_ease-in-out_infinite_alternate-reverse] motion-reduce:animate-none dark:opacity-[0.14]"
        style={{ backgroundColor: b }}
      />
      {/* Re-mounted per theme so the new symbols fade in */}
      <div key={theme.id} className="absolute inset-0 animate-[fadeIn_1.2s_ease-out]">
        {SLOTS.map((slot, i) => (
          <span
            key={i}
            className="absolute select-none opacity-[0.13] animate-[floaty_var(--d)_ease-in-out_infinite_alternate] motion-reduce:animate-none dark:opacity-[0.09]"
            style={
              {
                left: slot.left,
                top: slot.top,
                fontSize: slot.size,
                "--d": `${slot.duration}s`,
                animationDelay: `${slot.delay}s`,
              } as React.CSSProperties
            }
          >
            {theme.symbols[i % theme.symbols.length]}
          </span>
        ))}
      </div>
    </div>
  );
}
