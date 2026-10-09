"use client";

import { useRef, useState } from "react";
import { AiSettingsDialog } from "@/components/AiSettingsDialog";
import { AuthorNote } from "@/components/AuthorNote";
import { FeedbackButton } from "@/components/FeedbackButton";
import { History } from "@/components/History";
import { Logo } from "@/components/Logo";
import { NameDialog } from "@/components/NameDialog";
import { PathForm } from "@/components/PathForm";
import { PathView } from "@/components/PathView";
import { findNextStep, type NextStep, ProgressDashboard } from "@/components/ProgressDashboard";
import { OPEN_STAGE_EVENT } from "@/components/StageCard";
import { CursorGlow } from "@/components/CursorGlow";
import { ShootingStars } from "@/components/ShootingStars";
import { ErrorPanel, LoadingPanel } from "@/components/StatusPanels";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TopicBackground } from "@/components/TopicBackground";
import { UpdateBanner } from "@/components/UpdateBanner";
import { Toaster } from "@/components/Toaster";
import { useActivity } from "@/lib/activity";
import { engineLabel } from "@/lib/ai/models";
import { useAiSettings } from "@/lib/ai/settingsStore";
import { useAiStatus } from "@/lib/ai/useAiStatus";
import { climb } from "@/lib/celebrate";
import { dayKey } from "@/lib/dates";
import { generatePath } from "@/lib/generate";
import { isReturningVisit, useProfile } from "@/lib/profile";
import type { PathRequest } from "@/lib/schema";
import { checkKey, updatePaths, useSavedPaths, type SavedPath } from "@/lib/storage";
import { computeStreak } from "@/lib/streaks";
import { DEFAULT_THEME, matchTopicTheme } from "@/lib/topicTheme";

type Status = { kind: "idle" } | { kind: "loading"; partial: string } | { kind: "error"; message: string };

/**
 * The app's only page: greeting and progress dashboard, form, loading/error states, the active path and the
 * saved-paths sidebar.
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
  const [aiOpen, setAiOpen] = useState(false);
  const aiSettings = useAiSettings();
  const { status: aiStatus, refresh: refreshAiStatus } = useAiStatus();
  const engine = engineLabel(aiSettings, aiStatus);
  const profile = useProfile();
  const activity = useActivity();
  const [nameOpen, setNameOpen] = useState(false);
  // Ask for a name on the first visit, once the profile has loaded from this device.
  const askName = profile !== null && !profile.name && !profile.skipped;
  const today = dayKey();

  // Show the selected path, falling back to the most recent one.
  const active = paths.find((p) => p.id === activeId) ?? paths[0];
  const next = findNextStep(paths, active?.id ?? null);
  const [typedTopic, setTypedTopic] = useState("");
  // The background follows what's being typed (once it's recognised), otherwise the path on screen.
  const backgroundTheme = matchTopicTheme(typedTopic) ?? (active && matchTopicTheme(active.request.topic)) ?? DEFAULT_THEME;

  /**
   * Generates a path, showing the loading preview; on success saves and shows it (a rung climbed), on failure
   * shows the error. Cancels any generation already in progress.
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
      climb(1, () => updatePaths((prev) => [saved, ...prev]));
      setActiveId(saved.id);
      setStatus({ kind: "idle" });
    } catch (err) {
      if (controller.signal.aborted) return;
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  /**
   * Checks or unchecks a checkpoint item and saves the change. Ticking counts as a rung climbed today;
   * unticking takes one back, so toggling can't inflate the count.
   * @param {string} pathId The saved path's ID.
   * @param {string} key Checkpoint key from `checkKey`, e.g. `"1-0"`.
   * @returns {void}
   */
  function toggleCheck(pathId: string, key: string) {
    const path = paths.find((p) => p.id === pathId);
    if (!path) return;
    const ticking = !path.checked.includes(key);
    climb(ticking ? 1 : -1, () =>
      updatePaths((prev) =>
        prev.map((p) =>
          p.id !== pathId ? p : { ...p, checked: ticking ? [...p.checked, key] : p.checked.filter((k) => k !== key) },
        ),
      ),
    );
  }

  /**
   * Ticks the dashboard's suggested next checkpoint.
   * @param {NextStep} step The suggestion.
   * @returns {void}
   */
  function tickNext(step: NextStep) {
    toggleCheck(step.path.id, checkKey(step.stageIndex, step.itemIndex));
  }

  /**
   * Shows a path and scrolls to one of its stages.
   * @param {string} pathId The saved path's ID.
   * @param {number} stageIndex Zero-based stage position.
   * @returns {void}
   */
  function openStage(pathId: string, stageIndex: number) {
    setActiveId(pathId);
    if (status.kind === "error") setStatus({ kind: "idle" });
    // Wait a frame for the path to render, then open the stage and scroll to it.
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(OPEN_STAGE_EVENT, { detail: stageIndex }));
      document.getElementById(`stage-${stageIndex}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /**
   * Saves a stage's quiz result on the active path, keeping the best score. The first finish of a stage's quiz,
   * or beating your best, counts as a rung; replaying for the same score doesn't.
   * @param {number} stageIndex Zero-based stage position.
   * @param {number} correct How many questions were answered correctly.
   * @param {number} total How many questions the quiz had.
   * @returns {void}
   */
  function saveQuizScore(stageIndex: number, correct: number, total: number) {
    if (!active) return;
    const previous = active.quizScores?.[String(stageIndex)];
    if (previous && previous.correct >= correct) return;
    climb(1, () =>
      updatePaths((prev) =>
        prev.map((p) => (p.id !== active.id ? p : { ...p, quizScores: { ...p.quizScores, [String(stageIndex)]: { correct, total } } })),
      ),
    );
  }

  /**
   * Removes a saved path. (Its past activity stays in the heatmap.)
   * @param {string} id The saved path's ID.
   * @returns {void}
   */
  function deletePath(id: string) {
    updatePaths((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <TopicBackground theme={backgroundTheme} />
      <CursorGlow color={backgroundTheme.glows[0]} />
      <ShootingStars anchorId="ladderly-logo" />
      <UpdateBanner />
      <header className="relative mb-8">
        <div className="absolute right-0 top-0 flex items-center gap-1">
          <FeedbackButton
            source="app"
            title="Share your feedback"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <span aria-hidden="true">💬</span>
            <span className="hidden sm:inline">Feedback</span>
            <span className="sr-only sm:hidden">Feedback</span>
          </FeedbackButton>
          <button
            onClick={() => setAiOpen(true)}
            title={`AI: ${engine}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <span aria-hidden="true">⚙️</span>
            <span className="hidden sm:inline">Settings</span>
            <span className="sr-only sm:hidden">AI settings</span>
          </button>
          <ThemeToggle />
        </div>
        {/* Above the shooting-star canvas (z-30), so stars appear to fly out from under the logo */}
        {/* Icon: shooting stars. Name: it glows and the logo's star twinkles. */}
        <div className="brand relative z-40 mx-auto flex w-fit cursor-default items-center justify-center gap-3 pt-10 sm:pt-0">
          <span id="ladderly-logo" className="shrink-0">
            <Logo size={52} className="block rounded-xl ring-1 ring-black/5 dark:ring-white/15" />
          </span>
          <h1 className="brand-text text-3xl font-bold tracking-tight">Ladderly</h1>
        </div>
        <p className="mt-1 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">The first step towards you</p>
        <AuthorNote />
      </header>

      {profile && activity && (
        <ProgressDashboard
          profile={profile}
          returning={isReturningVisit()}
          paths={paths}
          days={activity}
          streak={computeStreak(activity, today)}
          today={today}
          next={next}
          onTickNext={tickNext}
          onOpenStage={openStage}
          onChangeName={() => setNameOpen(true)}
        />
      )}

      <PathForm onSubmit={generate} disabled={status.kind === "loading"} onTopicChange={setTypedTopic} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        <main className="min-w-0 space-y-6">
          {status.kind === "loading" && lastRequest && <LoadingPanel topic={lastRequest.topic} partial={status.partial} engine={engine} local={aiSettings.provider === "ollama"} />}
          {status.kind === "error" && lastRequest && (
            <ErrorPanel message={status.message} onRetry={() => generate(lastRequest)} />
          )}
          {status.kind !== "loading" && active && (
            <PathView key={active.id} saved={active} onToggle={(key) => toggleCheck(active.id, key)} onQuizFinish={saveQuizScore} />
          )}
          {status.kind === "idle" && !active && loaded && (
            <p className="py-10 text-center text-zinc-500">
              Type something you want to learn, like <em>guitar</em> or <em>python</em>, and get a step-by-step plan.
            </p>
          )}
        </main>

        <aside>
          <h2 className="mb-3 text-sm font-medium text-zinc-500">Your paths</h2>
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
      {(askName || nameOpen) && <NameDialog open initialName={profile?.name ?? ""} onClose={() => setNameOpen(false)} />}
      <Toaster />
      <AiSettingsDialog open={aiOpen} onClose={() => setAiOpen(false)} status={aiStatus} onRefreshStatus={refreshAiStatus} />
    </div>
  );
}
