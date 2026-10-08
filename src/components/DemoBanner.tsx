import { connection } from "next/server";
import { isDemoMode } from "@/lib/demo";
import { DemoBannerText } from "./DemoBannerText";

/**
 * Banner shown at the top of every page while this server's default engine is the free demo.
 * Rendered at request time (not build time) because the desktop app decides demo mode when it launches.
 * The visible text is client-side, so it can hide once the user picks another engine in AI settings.
 * @returns {Promise<JSX.Element | null>} The banner, or `null` when the server has its own Claude key.
 */
export async function DemoBanner() {
  await connection();
  if (!isDemoMode()) return null;
  return <DemoBannerText />;
}
