/**
 * A built-in career transition someone can open instantly (free, offline in the desktop app). `label` replaces the
 * button text when the careers alone would read oddly.
 */
export type ReadyTransition = { from: string; to: string; label?: string };

/**
 * The hand-written transitions, grouped for the picker. Each pair selects its path in demoTransitions.ts (kept
 * separate so the page doesn't load the paths themselves).
 */
export const READY_TRANSITIONS: { label: string; items: ReadyTransition[] }[] = [
  {
    label: "🤖 Into AI and tech",
    items: [
      { from: "electronics engineer", to: "AI engineer" },
      { from: "electrical engineer", to: "AI engineer" },
      { from: "mechanical engineer", to: "AI engineer" },
      { from: "civil engineer", to: "AI engineer" },
      { from: "software engineer", to: "AI engineer" },
      { from: "engineer", to: "AI engineer", label: "any other engineer → AI engineer" },
      { from: "mechanical engineer", to: "robotics engineer" },
      { from: "data analyst", to: "data scientist" },
      { from: "accountant", to: "data analyst" },
      { from: "IT support", to: "cybersecurity analyst" },
    ],
  },
  {
    label: "🎨 Design and music",
    items: [
      { from: "graphic designer", to: "UX designer" },
      { from: "interior designer", to: "fashion designer" },
      { from: "guitarist", to: "pianist" },
    ],
  },
  {
    label: "💼 Business and education",
    items: [
      { from: "sales executive", to: "product manager" },
      { from: "teacher", to: "instructional designer" },
    ],
  },
];
