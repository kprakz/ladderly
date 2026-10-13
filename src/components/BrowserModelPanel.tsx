"use client";

import { useEffect, useState } from "react";
import { BROWSER_MODELS, type BrowserModelId } from "@/lib/ai/models";
import { updateAiSettings, useAiSettings } from "@/lib/ai/settingsStore";
import type { WebGpuSupport } from "@/lib/ai/browserEngine";

type ModelState = { kind: "checking" } | { kind: "missing" } | { kind: "downloading"; percent: number } | { kind: "ready" } | { kind: "error"; message: string };

/**
 * Settings for the open-source model that runs inside the browser: checks the device can run it (WebGPU), suggests
 * a model for it, downloads the chosen model once (with progress), and can remove it again. Everything stays on the
 * device; the browser keeps the model for next time.
 * @returns {JSX.Element} The panel.
 */
export function BrowserModelPanel() {
  const settings = useAiSettings();
  const [support, setSupport] = useState<WebGpuSupport | null>(null);
  const [recommended, setRecommended] = useState<BrowserModelId>("qwen2.5-3b");
  const [state, setState] = useState<ModelState>({ kind: "checking" });
  const chosen = settings.browserModel ?? recommended;
  const model = BROWSER_MODELS.find((m) => m.id === chosen) ?? BROWSER_MODELS[0];

  // Check WebGPU once, and pick the suggested model if none is chosen yet.
  useEffect(() => {
    let active = true;
    import("@/lib/ai/browserEngine").then(async ({ detectWebGpu, recommendBrowserModel }) => {
      const s = await detectWebGpu();
      if (!active) return;
      setSupport(s);
      const suggestion = recommendBrowserModel(s);
      setRecommended(suggestion);
      if (!settings.browserModel) updateAiSettings({ browserModel: suggestion });
    });
    return () => {
      active = false;
    };
    // Only on open; the chosen model is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Is the chosen model already downloaded?
  useEffect(() => {
    if (!support?.supported) return;
    let active = true;
    import("@/lib/ai/browserEngine").then(async ({ isBrowserModelDownloaded, webllmModelId }) => {
      const has = await isBrowserModelDownloaded(webllmModelId(chosen, support.f16));
      if (active) setState(has ? { kind: "ready" } : { kind: "missing" });
    });
    return () => {
      active = false;
    };
  }, [chosen, support]);

  /**
   * Downloads (and loads) the chosen model, showing progress.
   * @returns {Promise<void>}
   */
  async function download() {
    if (!support) return;
    setState({ kind: "downloading", percent: 0 });
    try {
      const { loadBrowserModel, webllmModelId } = await import("@/lib/ai/browserEngine");
      await loadBrowserModel(webllmModelId(chosen, support.f16), (fraction) => setState({ kind: "downloading", percent: Math.round(fraction * 100) }));
      setState({ kind: "ready" });
    } catch {
      setState({ kind: "error", message: "The download stopped. Check your internet connection and free space, then try again." });
    }
  }

  /**
   * Removes the chosen model from this browser to free up space.
   * @returns {Promise<void>}
   */
  async function remove() {
    if (!support) return;
    const { removeBrowserModel, webllmModelId } = await import("@/lib/ai/browserEngine");
    await removeBrowserModel(webllmModelId(chosen, support.f16)).catch(() => {});
    setState({ kind: "missing" });
  }

  if (support && !support.supported) {
    return (
      <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <p className="font-medium">This device can&apos;t run the in-browser model.</p>
        <p className="mt-1">{support.reason} You can still use the free demo, your own Claude or OpenAI key, or the Ladderly Windows app.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        A free, open-source AI model that runs <strong>inside your browser</strong>, on this device. It downloads once,
        your browser keeps it, and your topics never leave your device.
      </p>

      <fieldset>
        <legend className="text-sm font-medium">Model</legend>
        <div className="mt-2 space-y-2">
          {BROWSER_MODELS.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
                chosen === m.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
              }`}
            >
              <input type="radio" name="browser-model" checked={chosen === m.id} onChange={() => updateAiSettings({ browserModel: m.id })} className="mt-1 accent-indigo-600" />
              <span className="flex-1">
                <span className="font-medium">{m.label}</span> <span className="text-zinc-500">· {m.maker}</span>
                {m.id === recommended && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Recommended here</span>}
                <span className="block text-xs text-zinc-500">
                  {m.downloadGB.toFixed(2)} GB one-time download · {m.note}
                </span>
              </span>
            </label>
          ))}
        </div>
        {support?.mobile && chosen === "qwen2.5-3b" && (
          <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            ⚠️ This model is large for a phone. Your browser may close the page while it runs. Qwen 2.5 1.5B or Llama 3.2 1B
            are safer choices here.
          </p>
        )}
      </fieldset>

      <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
        {state.kind === "checking" && <p className="text-sm text-zinc-500">Checking this browser…</p>}
        {state.kind === "missing" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              {model.label} isn&apos;t downloaded yet ({model.downloadGB.toFixed(2)} GB). It also downloads automatically the first time you make a path.
            </p>
            <button onClick={download} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Download now
            </button>
          </div>
        )}
        {state.kind === "downloading" && (
          <div>
            <p className="text-sm">
              Downloading {model.label}… {state.percent}%
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800" role="progressbar" aria-valuenow={state.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-indigo-600 transition-[width]" style={{ width: `${state.percent}%` }} />
            </div>
            <p className="mt-1 text-xs text-zinc-500">You can keep using Ladderly; the download continues in the background.</p>
          </div>
        )}
        {state.kind === "ready" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">✓ {model.label} is ready on this device.</p>
            <button onClick={remove} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:border-red-400 hover:text-red-600 dark:border-zinc-700">
              Remove from this browser
            </button>
          </div>
        )}
        {state.kind === "error" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
            <button onClick={download} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Try again
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-1 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">
        <li>🔒 Runs entirely on this device. Nothing is sent to a server.</li>
        <li>⏱️ Writing a path takes a minute or two, depending on your device. Small models can make mistakes, so check important facts.</li>
        <li>💻 Works best in Chrome or Edge on a laptop or desktop{support?.mobile ? "; on phones it can be slow" : ""}.</li>
        <li>
          📱 On phones, use the smallest model (Llama 3.2 1B or Qwen 2.5 1.5B). It needs iPhone with iOS 26 or later, or a recent
          Android phone with Chrome. Bigger models can make the page reload, and the phone may get warm.
        </li>
      </ul>
    </div>
  );
}
