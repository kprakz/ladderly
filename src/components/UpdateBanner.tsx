"use client";

import { useEffect, useState } from "react";
import { desktopBridge, type UpdateState } from "@/lib/desktop";

/**
 * A slim bar at the top of the desktop app when a new version is out: "Update now" downloads it (with progress),
 * installs it and reopens Ladderly, all from one click. Shows nothing in a browser or when up to date.
 * @returns {JSX.Element | null} The bar, or `null`.
 */
export function UpdateBanner() {
  const [state, setState] = useState<UpdateState | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    const bridge = desktopBridge();
    if (!bridge) return;
    let active = true;
    bridge.updates.get().then((s) => active && s && setState(s));
    const stop = bridge.updates.onChange((s) => setState(s));
    return () => {
      active = false;
      stop();
    };
  }, []);

  if (!state) return null;
  const { status, version } = state;
  if (status === "available" && dismissed === version) return null;
  if (status !== "available" && status !== "downloading" && status !== "installing" && status !== "error") return null;

  const install = () => void desktopBridge()?.updates.install();
  const notesUrl = `https://github.com/kprakz/ladderly/releases/tag/v${version}`;

  return (
    <div role="status" className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm dark:border-indigo-900 dark:bg-indigo-950/50">
      {status === "available" && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="flex-1">
            <span aria-hidden="true">✨ </span>
            <strong>Ladderly {version}</strong> is available.{" "}
            <a href={notesUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300">
              What&apos;s new
            </a>
          </p>
          <div className="flex gap-2">
            <button onClick={() => setDismissed(version ?? null)} className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-900">
              Later
            </button>
            <button onClick={install} className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500">
              Update now
            </button>
          </div>
        </div>
      )}

      {status === "downloading" && (
        <div>
          <p>Downloading Ladderly {version}… {state.percent ?? 0}%</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-900" role="progressbar" aria-valuenow={state.percent ?? 0} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-indigo-600 transition-[width]" style={{ width: `${state.percent ?? 0}%` }} />
          </div>
        </div>
      )}

      {status === "installing" && <p>Installing the update. Ladderly will reopen in a moment…</p>}

      {status === "error" && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="flex-1">The update couldn&apos;t be installed: {state.message}</p>
          <button onClick={install} className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
