"use client";

import { useRef, useState } from "react";
import { History } from "@/components/History";
import { Logo } from "@/components/Logo";
import { PathForm } from "@/components/PathForm";
import { PathView } from "@/components/PathView";
import { ErrorPanel, LoadingPanel } from "@/components/StatusPanels";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generatePath } from "@/lib/generate";
import type { PathRequest } from "@/lib/schema";
import { updatePaths, useSavedPaths, type SavedPath } from "@/lib/storage";

type Status = { kind: "idle" } | { kind: "loading"; partial: string } | { kind: "error"; message: string };

/**
 * The app's only page: form, loading/error states, the active path and the saved-paths sidebar.
 * @returns {JSX.Element} The page.
 */
export default function Home() {
  const savedPaths = useSavedPaths();
  const paths = savedPaths ?? [];
  const loaded = savedPaths !== null;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [lastRequest, setLastRequest] = useState<PathRequest | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Show the selected path, falling back to the most recent one.
  const active = paths.find((p) => p.id === activeId) ?? paths[0];

  /**
   * Generates a path, showing the loading preview; on success saves and shows it, on failure shows the error.
   * Cancels any generation already in progress.
   * @param {PathRequest} request Topic and options from the form (or the last request, on Retry).
   * @returns {Promise<void>}
   */
  async function generate(request: PathRequest) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLastRequest(request);
    setStatus({ kind: "loading", partial: "" });
    try {
      const path = await generatePath(
        request,
        (partial) => setStatus({ kind: "loading", partial }),
        controller.signal,
      );
      const saved: SavedPath = { id: crypto.randomUUID(), createdAt: Date.now(), request, path, checked: [] };
      updatePaths((prev) => [saved, ...prev]);
      setActiveId(saved.id);
      setStatus({ kind: "idle" });
    } catch (err) {
      if (controller.signal.aborted) return;
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  /**
   * Checks or unchecks a checkpoint item in the active path and saves the change.
   * @param {string} key Checkpoint key from `checkKey`, e.g. `"1-0"`.
   * @returns {void}
   */
  function toggleCheck(key: string) {
    if (!active) return;
    updatePaths((prev) =>
      prev.map((p) =>
        p.id !== active.id
          ? p
          : { ...p, checked: p.checked.includes(key) ? p.checked.filter((k) => k !== key) : [...p.checked, key] },
      ),
    );
  }

  /**
   * Removes a saved path.
   * @param {string} id The saved path's ID.
   * @returns {void}
   */
  function deletePath(id: string) {
    updatePaths((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={44} className="shrink-0 rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/15" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ladderly</h1>
            <p className="text-sm text-zinc-500">From zero to competent in any skill, one step at a time.</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <PathForm onSubmit={generate} disabled={status.kind === "loading"} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        <main className="min-w-0 space-y-6">
          {status.kind === "loading" && lastRequest && <LoadingPanel topic={lastRequest.topic} partial={status.partial} />}
          {status.kind === "error" && lastRequest && (
            <ErrorPanel message={status.message} onRetry={() => generate(lastRequest)} />
          )}
          {status.kind !== "loading" && active && <PathView saved={active} onToggle={toggleCheck} />}
          {status.kind === "idle" && !active && loaded && (
            <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
              Type a skill above — like <em>guitar</em>, <em>machine learning</em> or <em>public speaking</em> — to get
              a step-by-step learning path.
            </div>
          )}
        </main>

        <aside>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Your paths</h2>
          <History
            paths={paths}
            activeId={active?.id ?? null}
            onSelect={(id) => {
              setActiveId(id);
              if (status.kind === "error") setStatus({ kind: "idle" });
            }}
            onDelete={deletePath}
          />
        </aside>
      </div>
    </div>
  );
}
