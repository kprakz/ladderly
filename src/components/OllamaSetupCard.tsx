"use client";

import { useEffect, useState } from "react";
import { OLLAMA_CATALOG, recommendOllamaModel } from "@/lib/ai/models";
import { desktopBridge, type OllamaSetupState } from "@/lib/desktop";

type CatalogModel = (typeof OLLAMA_CATALOG)[number];

const STEP_TEXT: Record<OllamaSetupState["status"], string> = {
  idle: "",
  downloading: "Downloading Ollama",
  verifying: "Checking the download is genuine (signed by Ollama Inc.)…",
  installing: "Installing Ollama…",
  starting: "Starting Ollama…",
  done: "Ollama is ready.",
  error: "",
};

/**
 * "Set up for me" in the Windows app: installs Ollama (the free app that runs open-source models) and then the model
 * Ladderly recommends for this computer, in one click. Shows the download size and free space needed first, then each
 * step. The install itself happens in the desktop app (electron/ollamaSetup.js), which only runs a file signed by
 * Ollama Inc.
 * @param {Object} props
 * @param {{ freeDiskGB: number, totalRamGB: number } | null} props.system This computer's free disk and memory.
 * @param {(model: CatalogModel | null) => void} props.onReady Called once Ollama is running, with the model to download next.
 * @returns {JSX.Element | null} The card, or `null` outside the desktop app (or in apps too old to support it).
 */
export function OllamaSetupCard({
  system,
  onReady,
}: {
  system: { freeDiskGB: number; totalRamGB: number } | null;
  onReady: (model: CatalogModel | null) => void;
}) {
  const [state, setState] = useState<OllamaSetupState>({ status: "idle" });
  const [sizes, setSizes] = useState({ installerGB: 1.6, installedGB: 2.8 });
  const bridge = desktopBridge()?.ollama;

  useEffect(() => {
    if (!bridge) return;
    let active = true;
    bridge.getSetup().then((s) => {
      if (!active || !s) return;
      setState(s);
      if (s.installerGB && s.installedGB) setSizes({ installerGB: s.installerGB, installedGB: s.installedGB });
    });
    const stop = bridge.onSetup((s) => setState(s));
    return () => {
      active = false;
      stop();
    };
  }, [bridge]);

  if (!bridge) return null;

  const ollamaNeedsGB = sizes.installerGB + sizes.installedGB;
  // Suggest a model that still fits after Ollama itself is installed.
  const model = system ? recommendOllamaModel(Math.max(0, system.freeDiskGB - ollamaNeedsGB), system.totalRamGB, []) : null;
  const downloadGB = sizes.installerGB + (model?.sizeGB ?? 0);
  const needGB = ollamaNeedsGB + (model?.sizeGB ?? 0);
  const enoughSpace = !system || system.freeDiskGB >= ollamaNeedsGB + 1;
  const busy = state.status === "downloading" || state.status === "verifying" || state.status === "installing" || state.status === "starting";

  /**
   * Runs the setup, then hands over to the model download.
   * @returns {Promise<void>}
   */
  async function setUp() {
    const result = await bridge!.install();
    if (result?.status === "done") onReady(model);
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm dark:border-indigo-900 dark:bg-indigo-950/40">
      <p className="text-base font-semibold">✨ Set up free local AI for me</p>
      <p className="mt-1 text-zinc-700 dark:text-zinc-300">
        Ladderly will install <strong>Ollama</strong> (free, from Ollama Inc.) and then download{" "}
        <strong>{model ? model.label : "a model that fits this computer"}</strong>, so you can write detailed paths on
        any topic, privately, on this computer.
      </p>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        About {downloadGB.toFixed(1)} GB to download · needs about {needGB.toFixed(1)} GB free
        {system ? ` (you have ${system.freeDiskGB} GB)` : ""} · no admin rights needed
      </p>

      {state.status === "idle" && (
        <button
          onClick={setUp}
          disabled={!enoughSpace}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Set up for me
        </button>
      )}
      {!enoughSpace && state.status === "idle" && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">Not enough free disk space. Free up some space, then press Refresh below.</p>
      )}

      {busy && (
        <div className="mt-3" aria-live="polite">
          <p>
            {STEP_TEXT[state.status]}
            {state.status === "downloading" ? `… ${state.percent ?? 0}%` : ""}
          </p>
          {state.status === "downloading" && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-900" role="progressbar" aria-valuenow={state.percent ?? 0} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-indigo-600 transition-[width]" style={{ width: `${state.percent ?? 0}%` }} />
            </div>
          )}
          <p className="mt-1 text-xs text-zinc-500">You can keep using Ladderly while this runs.</p>
        </div>
      )}

      {state.status === "done" && <p className="mt-3 text-emerald-700 dark:text-emerald-400">✓ Ollama is ready. Downloading your model next…</p>}

      {state.status === "error" && (
        <div className="mt-3">
          <p className="text-red-600 dark:text-red-400">{state.message}</p>
          <button onClick={setUp} className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
