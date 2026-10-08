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
    <div className="border-b border-zinc-200 px-4 py-2 text-center text-xs text-zinc-500 dark:border-zinc-800">
      Free demo · full plans for guitar, python, public speaking and machine learning
    </div>
  );
}
