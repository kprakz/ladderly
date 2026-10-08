"use client";

import { useCallback, useEffect, useState } from "react";
import type { AiStatus } from "./models";

/**
 * Fetches `/api/ai/status` once on mount, and again whenever `refresh` is called.
 * @returns {{ status: AiStatus | null, loading: boolean, refresh: () => void }} The latest status (null until
 *   loaded or if the request failed), whether a request is in flight, and a function to re-fetch.
 */
export function useAiStatus(): { status: AiStatus | null; loading: boolean; refresh: () => void } {
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/status", { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<AiStatus>) : null))
      .catch(() => null)
      .then((s) => {
        if (cancelled) return;
        setStatus(s);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refresh = useCallback(() => {
    setLoading(true);
    setTick((t) => t + 1);
  }, []);

  return { status, loading, refresh };
}
