"use client";

import { useAiSettings } from "@/lib/ai/settingsStore";

/**
 * The demo banner's text. Hidden when the user has chosen a local model or their own API key, since the demo
 * isn't in use then.
 * @returns {JSX.Element | null} The banner, or `null` when another engine is selected.
 */
export function DemoBannerText() {
  const { provider } = useAiSettings();
  if (provider !== "auto" && provider !== "demo") return null;
  return (
    <div className="bg-blue-600 px-4 py-2 text-center text-sm text-white dark:bg-blue-700">
      <strong className="font-semibold">Free demo</strong> · full plans for Class 11–12 maths, physics, chemistry, biology and computer science, plus guitar, python, public speaking and machine learning
    </div>
  );
}
