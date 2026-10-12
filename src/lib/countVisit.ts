import { useEffect } from "react";
import { desktopBridge } from "./desktop";

const COUNTED_KEY = "ladderly:counted-web";

/**
 * Counts this browser once as someone trying Ladderly on the web, for the website's world map (country only, done
 * by the server). Skipped in the desktop app, which is counted as a download instead. A local flag avoids sending
 * the request again; the server also ignores browsers it has already counted.
 * @returns {void}
 */
export function useCountVisit(): void {
  useEffect(() => {
    if (desktopBridge()) return;
    try {
      if (localStorage.getItem(COUNTED_KEY)) return;
    } catch {
      return;
    }
    fetch("/api/visit", { method: "POST", keepalive: true })
      .then((r) => {
        if (r.ok) localStorage.setItem(COUNTED_KEY, "1");
      })
      .catch(() => {});
  }, []);
}
