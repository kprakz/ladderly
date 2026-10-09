"use client";

import { useEffect, useRef, useState } from "react";
import {
  ANTHROPIC_MODELS,
  type AiStatus,
  type CatalogModel,
  modelFit,
  OLLAMA_CATALOG,
  OPENAI_MODELS,
  type ProviderId,
  recommendOllamaModel,
} from "@/lib/ai/models";
import { updateAiSettings, useAiSettings } from "@/lib/ai/settingsStore";

type Props = { open: boolean; onClose: () => void; status: AiStatus | null; onRefreshStatus: () => void };

/** Download progress for one model. */
type PullState = { model: string; status: string; completed: number; total: number; error?: string };

/**
 * The "AI engine" settings dialog: choose the free demo, a free local open-source model (Ollama), or Claude /
 * OpenAI with your own API key. Uses a native modal `<dialog>`, so Escape closes it and focus stays inside.
 * @param {Props} props
 * @param {boolean} props.open Whether the dialog is shown.
 * @param {() => void} props.onClose Called when the dialog closes.
 * @param {AiStatus | null} props.status Server status (local or hosted, Ollama, disk and memory).
 * @param {() => void} props.onRefreshStatus Re-fetches the status (after installing Ollama or a model).
 * @returns {JSX.Element} The dialog.
 */
export function AiSettingsDialog({ open, onClose, status, onRefreshStatus }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const settings = useAiSettings();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // "auto" means the free demo unless this server has its own Claude key.
  const current: ProviderId = settings.provider === "auto" && status?.serverDefault !== "claude" ? "demo" : settings.provider;

  const options: { id: ProviderId; title: string; subtitle: string; hidden?: boolean }[] = [
    { id: "auto", title: "Claude (set up on this server)", subtitle: "Uses the API key configured for this app", hidden: status?.serverDefault !== "claude" },
    { id: "demo", title: "Free demo", subtitle: "Built-in sample paths, no setup" },
    { id: "ollama", title: "Local open-source model", subtitle: "Free and private, runs on your computer (Ollama)" },
    { id: "anthropic", title: "Claude", subtitle: "Your Anthropic API key, best quality" },
    { id: "openai", title: "OpenAI GPT", subtitle: "Your OpenAI API key" },
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="ai-settings-title"
      className="m-auto max-h-[90vh] w-[min(46rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/50 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h2 id="ai-settings-title" className="text-lg font-semibold">
            AI engine
          </h2>
          <p className="text-sm text-zinc-500">Choose what writes your learning paths.</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close AI settings"
          className="rounded-lg px-2.5 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ✕
        </button>
      </div>

      <div className="space-y-5 p-5">
        <fieldset>
          <legend className="sr-only">Engine</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {options
              .filter((o) => !o.hidden)
              .map((o) => {
                const disabled = o.id === "ollama" && status !== null && !status.local;
                const selected = current === o.id;
                return (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-950/40"
                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <input
                      type="radio"
                      name="ai-provider"
                      checked={selected}
                      disabled={disabled}
                      onChange={() => updateAiSettings({ provider: o.id, ...defaultOllamaModel(o.id, settings.ollamaModel, status) })}
                      className="mt-1 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold">{o.title}</span>
                      <span className="block text-xs text-zinc-500">
                        {disabled ? "Available in the Ladderly desktop app" : o.subtitle}
                      </span>
                    </span>
                  </label>
                );
              })}
          </div>
        </fieldset>

        {current === "demo" && (
          <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">
            The free demo has detailed paths for Class 11–12 maths, physics, chemistry, biology and computer science (CBSE/NCERT), and for guitar, python, public speaking and machine learning. Other topics get a
            general template. For a detailed path on any topic, use a local model or your own API key.
          </p>
        )}
        {current === "ollama" && status?.local && <OllamaPanel status={status} onRefresh={onRefreshStatus} />}
        {current === "anthropic" && <AnthropicPanel hosted={status !== null && !status.local} />}
        {current === "openai" && <OpenAiPanel hosted={status !== null && !status.local} />}

        <WebSearchPanel status={status} />
      </div>
    </dialog>
  );
}

/**
 * When switching to the local engine with no model chosen yet, picks one that's already installed: the
 * recommended model if it's downloaded, otherwise the first catalog model installed, otherwise any installed model.
 * @param {ProviderId} provider The engine being switched to.
 * @param {string | undefined} currentModel The currently chosen Ollama model, if any.
 * @param {AiStatus | null} status Server status with installed models and system info.
 * @returns {{ ollamaModel?: string }} A settings change to merge in (empty if nothing needs choosing).
 */
function defaultOllamaModel(provider: ProviderId, currentModel: string | undefined, status: AiStatus | null): { ollamaModel?: string } {
  const installed = status?.ollama?.models.map((m) => m.name) ?? [];
  if (provider !== "ollama" || (currentModel && installed.includes(currentModel)) || installed.length === 0) return {};
  const rec = status?.system ? recommendOllamaModel(status.system.freeDiskGB, status.system.totalRamGB, installed) : null;
  const pick =
    (rec && installed.includes(rec.id) ? rec.id : undefined) ??
    OLLAMA_CATALOG.find((c) => installed.includes(c.id))?.id ??
    installed[0];
  return { ollamaModel: pick };
}

/**
 * Local model settings: Ollama status, this computer's memory and free disk, a recommended model, and the
 * catalog with download / use / delete buttons and live download progress.
 * @param {Object} props
 * @param {AiStatus} props.status Server status (must be local).
 * @param {() => void} props.onRefresh Re-fetches the status after a download or delete.
 * @returns {JSX.Element} The panel.
 */
function OllamaPanel({ status, onRefresh }: { status: AiStatus; onRefresh: () => void }) {
  const settings = useAiSettings();
  const [pull, setPull] = useState<PullState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const ollama = status.ollama;
  const system = status.system;
  const installed = ollama?.models ?? [];
  const installedNames = installed.map((m) => m.name);
  const recommended = system ? recommendOllamaModel(system.freeDiskGB, system.totalRamGB, installedNames) : null;
  const extras = installed.filter((m) => !OLLAMA_CATALOG.some((c) => c.id === m.name));

  /**
   * Downloads a catalog model through the server, updating the progress bar as Ollama reports progress.
   * @param {CatalogModel} model The model to download.
   * @returns {Promise<void>}
   */
  async function download(model: CatalogModel) {
    const controller = new AbortController();
    abortRef.current = controller;
    setPull({ model: model.id, status: "Starting…", completed: 0, total: 0 });
    try {
      const res = await fetch("/api/ai/ollama/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: model.id }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Download failed.");
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const p = JSON.parse(line) as { status?: string; completed?: number; total?: number; error?: string };
          if (p.error) throw new Error(p.error);
          setPull((prev) => ({
            model: model.id,
            status: p.status ?? prev?.status ?? "",
            completed: p.completed ?? (p.total ? 0 : prev?.completed ?? 0),
            total: p.total ?? prev?.total ?? 0,
          }));
        }
      }
      setPull(null);
      updateAiSettings({ provider: "ollama", ollamaModel: model.id });
      onRefresh();
    } catch (err) {
      if (controller.signal.aborted) setPull(null);
      else setPull({ model: model.id, status: "", completed: 0, total: 0, error: err instanceof Error ? err.message : "Download failed." });
    }
  }

  /**
   * Deletes a downloaded model (after confirmation) to free disk space.
   * @param {string} name The installed model's name.
   * @returns {Promise<void>}
   */
  async function remove(name: string) {
    if (!confirm(`Delete ${name} from this computer? You can download it again later.`)) return;
    setBusy(name);
    await fetch("/api/ai/ollama/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: name }),
    }).catch(() => null);
    if (settings.ollamaModel === name) updateAiSettings({ ollamaModel: undefined });
    setBusy(null);
    onRefresh();
  }

  if (!ollama?.reachable) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <p className="font-semibold">Ollama isn&apos;t running on this computer.</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            Install Ollama (free) from{" "}
            <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="font-medium underline">
              ollama.com/download
            </a>
            .
          </li>
          <li>Open it, so it runs in the background.</li>
          <li>Come back here and press Refresh.</li>
        </ol>
        <button onClick={onRefresh} className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-500">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-zinc-600 dark:text-zinc-300">
          {system && (
            <>
              This computer: <strong>{system.totalRamGB} GB</strong> memory · <strong>{system.freeDiskGB} GB</strong> free disk
            </>
          )}
          <span className="text-zinc-400"> · Ollama {ollama.version}</span>
        </p>
        <button onClick={onRefresh} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
          Refresh
        </button>
      </div>

      {recommended ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          ⭐ <strong>Recommended for this computer: {recommended.label}</strong> ({recommended.sizeGB} GB). The best-quality
          model that fits your memory and free space.
        </p>
      ) : (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          None of the suggested models fit this computer&apos;s memory and free space. Free up some disk space, or use an
          API key instead.
        </p>
      )}

      <p className="text-xs text-zinc-500">
        Local models are free and private. Speed depends on your computer: with a graphics card a path takes about a
        minute; on a laptop without one it can take 5–15 minutes. Larger models write better paths but are slower.
        Small models (under 4B) can make factual mistakes, especially in quiz answers.
      </p>

      <ul className="space-y-2">
        {OLLAMA_CATALOG.map((m) => {
          const isInstalled = installedNames.includes(m.id);
          const fit = system ? modelFit(m, system.freeDiskGB, system.totalRamGB, isInstalled) : { fitsDisk: true, fitsRam: true };
          const selected = settings.ollamaModel === m.id;
          const pulling = pull?.model === m.id;
          return (
            <li
              key={m.id}
              className={`rounded-xl border p-3 ${
                selected ? "border-indigo-500 ring-1 ring-indigo-500" : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {m.label} <span className="font-normal text-zinc-500">by {m.maker}</span>
                    {recommended?.id === m.id && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                        Recommended
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {m.sizeGB} GB download · needs about {m.ramGB} GB memory · {m.note}
                  </p>
                  {!fit.fitsRam && <p className="text-xs text-amber-700 dark:text-amber-400">May be too large for this computer&apos;s memory.</p>}
                  {!fit.fitsDisk && <p className="text-xs text-amber-700 dark:text-amber-400">Not enough free disk space.</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  {isInstalled ? (
                    <>
                      <button
                        onClick={() => updateAiSettings({ provider: "ollama", ollamaModel: m.id })}
                        disabled={selected}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:bg-emerald-600"
                      >
                        {selected ? "✓ In use" : "Use"}
                      </button>
                      <button
                        onClick={() => remove(m.id)}
                        disabled={busy === m.id}
                        aria-label={`Delete ${m.label}`}
                        className="rounded-lg border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-600 hover:border-red-400 hover:text-red-600 dark:border-zinc-600 dark:text-zinc-300"
                      >
                        🗑
                      </button>
                    </>
                  ) : pulling && !pull?.error ? (
                    <button
                      onClick={() => abortRef.current?.abort()}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => download(m)}
                      disabled={!fit.fitsDisk || (pull !== null && !pull.error)}
                      className="rounded-lg border border-indigo-500 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
              {pulling && (
                <div className="mt-2" aria-live="polite">
                  {pull?.error ? (
                    <p className="text-xs text-red-600 dark:text-red-400">{pull.error}</p>
                  ) : (
                    <>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${pull && pull.total ? Math.round((pull.completed / pull.total) * 100) : 2}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        {pull?.status}
                        {pull && pull.total > 0 && ` · ${(pull.completed / 1e9).toFixed(2)} of ${(pull.total / 1e9).toFixed(2)} GB`}
                      </p>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {extras.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Other models on this computer</h3>
          <ul className="mt-2 space-y-2">
            {extras.map((m) => {
              const selected = settings.ollamaModel === m.name;
              return (
                <li key={m.name} className={`flex items-center justify-between gap-2 rounded-xl border p-3 ${selected ? "border-indigo-500 ring-1 ring-indigo-500" : "border-zinc-200 dark:border-zinc-700"}`}>
                  <span className="text-sm">
                    <span className="font-semibold">{m.name}</span> <span className="text-zinc-500">· {m.sizeGB} GB</span>
                  </span>
                  <span className="flex gap-2">
                    <button
                      onClick={() => updateAiSettings({ provider: "ollama", ollamaModel: m.name })}
                      disabled={selected}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:bg-emerald-600"
                    >
                      {selected ? "✓ In use" : "Use"}
                    </button>
                    <button
                      onClick={() => remove(m.name)}
                      disabled={busy === m.name}
                      aria-label={`Delete ${m.name}`}
                      className="rounded-lg border border-zinc-300 px-2.5 py-1.5 text-sm text-zinc-600 hover:border-red-400 hover:text-red-600 dark:border-zinc-600 dark:text-zinc-300"
                    >
                      🗑
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Shared layout for an API-key provider: key field (hidden by default, with show/hide), model choice, where to
 * get a key, and a privacy note.
 * @param {Object} props
 * @param {string} props.name Provider name, e.g. "Anthropic".
 * @param {string} props.keyValue The saved key ("" if none).
 * @param {(key: string) => void} props.onKey Called when the key changes.
 * @param {string} props.placeholder Key format hint, e.g. "sk-ant-…".
 * @param {readonly { id: string, label: string, note: string }[]} props.models Models to choose from.
 * @param {string} props.model The selected model ID.
 * @param {(id: string) => void} props.onModel Called when a model is chosen.
 * @param {string} props.keyUrl Where to get a key.
 * @param {boolean} props.hosted True on the website (keys pass through Ladderly's server), false in the desktop app.
 * @returns {JSX.Element} The panel.
 */
function KeyPanel(props: {
  name: string;
  keyValue: string;
  onKey: (key: string) => void;
  placeholder: string;
  models: readonly { id: string; label: string; note: string }[];
  model: string;
  onModel: (id: string) => void;
  keyUrl: string;
  hosted: boolean;
}) {
  const [show, setShow] = useState(false);
  const inputId = `${props.name.toLowerCase()}-key`;
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={inputId} className="text-sm font-medium">
          {props.name} API key
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id={inputId}
            type={show ? "text" : "password"}
            value={props.keyValue}
            onChange={(e) => props.onKey(e.target.value)}
            placeholder={props.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="rounded-lg border border-zinc-300 px-3 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {show ? "Hide" : "Show"}
          </button>
          {props.keyValue && (
            <button
              type="button"
              onClick={() => props.onKey("")}
              className="rounded-lg border border-zinc-300 px-3 text-sm hover:border-red-400 hover:text-red-600 dark:border-zinc-700"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Don&apos;t have one?{" "}
          <a href={props.keyUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Create a key ↗
          </a>{" "}
          Usage is billed to your own {props.name} account.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Model</legend>
        <div className="mt-1 space-y-1.5">
          {props.models.map((m) => (
            <label key={m.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name={`${inputId}-model`} checked={props.model === m.id} onChange={() => props.onModel(m.id)} className="accent-indigo-600" />
              <span className="font-medium">{m.label}</span>
              <span className="text-zinc-500">· {m.note}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">
        🔒 Your key is saved only on this device{props.hosted ? " (in this browser)" : ""}. It&apos;s sent only with your
        own requests{props.hosted ? ", through Ladderly's server to " + props.name + ", and is never stored or logged there" : " to " + props.name}.
      </p>
    </div>
  );
}

const SEARCH_PROVIDERS = [
  { id: "tavily", name: "Tavily", note: "built for AI apps, with a free monthly allowance", keyUrl: "https://app.tavily.com/", placeholder: "tvly-…" },
  { id: "brave", name: "Brave Search", note: "independent search index, with a free plan", keyUrl: "https://brave.com/search/api/", placeholder: "Your Brave Search API key" },
] as const;

/**
 * Optional web search: one quick search while a path is written, for up-to-date info and real links. Works with
 * every engine. Explains the trade-offs (a little slower; the topic is sent to the search service).
 * @param {Object} props
 * @param {AiStatus | null} props.status Server status (whether the server has its own search key).
 * @returns {JSX.Element} The panel.
 */
function WebSearchPanel({ status }: { status: AiStatus | null }) {
  const s = useAiSettings();
  const [show, setShow] = useState(false);
  const on = !!s.webSearch;
  const provider = SEARCH_PROVIDERS.find((p) => p.id === (s.searchProvider ?? "tavily")) ?? SEARCH_PROVIDERS[0];
  const serverKey = !!status?.serverSearch;
  return (
    <section className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={on} onChange={(e) => updateAiSettings({ webSearch: e.target.checked })} className="mt-1 h-4 w-4 accent-indigo-600" />
        <span>
          <span className="block text-sm font-semibold">🌐 Fresh info from the web</span>
          <span className="block text-xs text-zinc-500">
            Search the web once while writing a path, so it reflects new versions, tools and syllabus changes, and
            includes real links to current pages. Works with every engine.
          </span>
        </span>
      </label>

      {on && (
        <div className="mt-4 space-y-4 pl-7">
          <fieldset>
            <legend className="text-sm font-medium">Search service</legend>
            <div className="mt-1 space-y-1.5">
              {SEARCH_PROVIDERS.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="search-provider" checked={provider.id === p.id} onChange={() => updateAiSettings({ searchProvider: p.id })} className="accent-indigo-600" />
                  <span className="font-medium">{p.name}</span>
                  <span className="text-zinc-500">· {p.note}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="search-key" className="text-sm font-medium">
              {provider.name} API key {serverKey && <span className="font-normal text-zinc-500">(optional: this app has one)</span>}
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="search-key"
                type={show ? "text" : "password"}
                value={s.searchKey ?? ""}
                onChange={(e) => updateAiSettings({ searchKey: e.target.value || undefined })}
                placeholder={provider.placeholder}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="rounded-lg border border-zinc-300 px-3 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Don&apos;t have one?{" "}
              <a href={provider.keyUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                Get a {provider.name} key ↗
              </a>
            </p>
            {!s.searchKey && !serverKey && <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">Add a key to use web search.</p>}
          </div>

          <ul className="space-y-1 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">
            <li>⏱️ Adds a few seconds with Claude, OpenAI or the demo, and roughly 10–45 seconds with a local model (it reads the results first).</li>
            <li>🔒 Your topic is sent to {provider.name} to search. Your key stays on this device and goes only with your own requests.</li>
            <li>🧭 Best for fast-changing topics (frameworks, AI tools, exams). Classic skills like guitar change little.</li>
          </ul>
        </div>
      )}
    </section>
  );
}

/**
 * Claude settings: the user's Anthropic key and model.
 * @param {Object} props
 * @param {boolean} props.hosted True on the website, false in the desktop app.
 * @returns {JSX.Element} The panel.
 */
function AnthropicPanel({ hosted }: { hosted: boolean }) {
  const s = useAiSettings();
  return (
    <KeyPanel
      name="Anthropic"
      keyValue={s.anthropicKey ?? ""}
      onKey={(k) => updateAiSettings({ anthropicKey: k || undefined })}
      placeholder="sk-ant-…"
      models={ANTHROPIC_MODELS}
      model={s.anthropicModel ?? "claude-opus-5"}
      onModel={(id) => updateAiSettings({ anthropicModel: id as (typeof ANTHROPIC_MODELS)[number]["id"] })}
      keyUrl="https://console.anthropic.com/settings/keys"
      hosted={hosted}
    />
  );
}

/**
 * OpenAI settings: the user's OpenAI key and model.
 * @param {Object} props
 * @param {boolean} props.hosted True on the website, false in the desktop app.
 * @returns {JSX.Element} The panel.
 */
function OpenAiPanel({ hosted }: { hosted: boolean }) {
  const s = useAiSettings();
  return (
    <KeyPanel
      name="OpenAI"
      keyValue={s.openaiKey ?? ""}
      onKey={(k) => updateAiSettings({ openaiKey: k || undefined })}
      placeholder="sk-…"
      models={OPENAI_MODELS}
      model={s.openaiModel ?? "gpt-6.1-sol"}
      onModel={(id) => updateAiSettings({ openaiModel: id as (typeof OPENAI_MODELS)[number]["id"] })}
      keyUrl="https://platform.openai.com/api-keys"
      hosted={hosted}
    />
  );
}
