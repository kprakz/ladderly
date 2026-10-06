import { connection } from "next/server";
import { isDemoMode } from "@/lib/demo";

/**
 * Banner shown at the top of every page while demo mode is on.
 * Rendered at request time (not build time) because the desktop app decides demo mode when it launches.
 * @returns {Promise<JSX.Element | null>} The banner, or `null` when real generation is enabled.
 */
export async function DemoBanner() {
  await connection();
  if (!isDemoMode()) return null;

  return (
    <div className="bg-indigo-600 px-4 py-2 text-center text-sm text-white">
      Demo version: detailed paths for <strong>guitar</strong>, <strong>python</strong>,{" "}
      <strong>public speaking</strong> and <strong>machine learning</strong>. Other topics get a general template.
    </div>
  );
}
