"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AiSettingsDialog } from "@/components/AiSettingsDialog";
import { AuthorNote } from "@/components/AuthorNote";
import { FeedbackButton } from "@/components/FeedbackButton";
import { History } from "@/components/History";
import { Logo } from "@/components/Logo";
import { NameDialog } from "@/components/NameDialog";
import { PathForm } from "@/components/PathForm";
import { PathView } from "@/components/PathView";
import { ReadyPaths } from "@/components/ReadyPaths";
import { findNextStep, type NextStep, ProgressDashboard } from "@/components/ProgressDashboard";
import { OPEN_STAGE_EVENT } from "@/components/StageCard";
import { CursorGlow } from "@/components/CursorGlow";
import { ShootingStars } from "@/components/ShootingStars";
import { ErrorPanel, LoadingPanel } from "@/components/StatusPanels";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TransitionForm } from "@/components/TransitionForm";
import { TopicBackground } from "@/components/TopicBackground";
import { UpdateBanner } from "@/components/UpdateBanner";
import { Toaster } from "@/components/Toaster";
import { useActivity } from "@/lib/activity";
import { engineLabel } from "@/lib/ai/models";
import { useAiSettings } from "@/lib/ai/settingsStore";
import { useAiStatus } from "@/lib/ai/useAiStatus";
import { climb } from "@/lib/celebrate";
import { desktopBridge } from "@/lib/desktop";
import { useCountVisit } from "@/lib/countVisit";
import { dayKey } from "@/lib/dates";
import { generatePath } from "@/lib/generate";
import { isReturningVisit, useProfile } from "@/lib/profile";
import { type PathRequest, pathTitle } from "@/lib/schema";
import { checkKey, updatePaths, useSavedPaths, type SavedPath } from "@/lib/storage";
import { computeStreak } from "@/lib/streaks";
import { DEFAULT_THEME, matchTopicTheme } from "@/lib/topicTheme";

/** Ladderly's two ways in: learn a skill ("Grow") or move to a new career ("Transition"). */
type Mode = "grow" | "transition";

const MODES: { id: Mode; icon: string; label: string; hint: string }[] = [
  { id: "grow", icon: "🌱", label: "Grow", hint: "Learn a new skill, step by step." },
  { id: "transition", icon: "🔀", label: "Transition", hint: "Move from your current career to a new one." },
];

type Status = { kind: "idle" } | { kind: "loading"; partial: string; note?: string; ready?: boolean } | { kind: "error"; message: string };

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
  const [lastReady, setLastReady] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const aiSettings = useAiSettings();
  const { status: aiStatus, refresh: refreshAiStatus } = useAiStatus();
  const engine = engineLabel(aiSettings, aiStatus);
  const profile = useProfile();
  useCountVisit();
  const activity = useActivity();
  const [nameOpen, setNameOpen] = useState(false);
  // Ask for a name on the first visit, once the profile has loaded from this device.
  const askName = profile !== null && !profile.name && !profile.skipped;
  const today = dayKey();

  // Show the selected path, falling back to the most recent one.
  const active = paths.find((p) => p.id === activeId) ?? paths[0];
  const next = findNextStep(paths, active?.id ?? null);
  const [mode, setMode] = useState<Mode>("grow");
  const [typedTopic, setTypedTopic] = useState("");
  // The background follows what's being typed (once it's recognised), otherwise the path on screen.
  const backgroundTheme = matchTopicTheme(typedTopic) ?? (active && matchTopicTheme(active.request.topic)) ?? DEFAULT_THEME;

  /**
   * Generates a path, showing the loading preview; on success saves and shows it (a rung climbed), on failure
   * shows the error. Cancels any generation already in progress.
   * @param {PathRequest} request Topic and options from the form (or the last request, on Retry).
   * @param {boolean} [ready] True for a ready-made path: uses the built-in paths (instant, offline), whatever the engine.
   * @returns {Promise<void>}
   */
  async function generate(request: PathRequest, ready = false) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLastRequest(request);
    setLastReady(ready);
    setStatus({ kind: "loading", partial: "", ready });
    // On small screens the progress panel starts below the fold; bring it into view so people see it working.
    requestAnimationFrame(() => {
      const panel = document.getElementById("loading-panel");
      if (panel && panel.getBoundingClientRect().top > window.innerHeight * 0.6) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    try {
      let note: string | undefined;
      const path = await generatePath(
        request,
        (partial) => setStatus({ kind: "loading", partial, note, ready }),
        controller.signal,
        (message) => {
          note = message;
          setStatus({ kind: "loading", partial: "", note, ready });
        },
        ready ? { provider: "demo" } : undefined,
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
   * Starts a path for a suggested next topic. The learner has just finished a related path, so it assumes some
   * prior exposure and keeps their weekly time and goal (after a career transition, the goal is their job). Scrolls
   * up to show the progress.
   * @param {string} topic The suggested topic.
   * @returns {void}
   */
  function startNextTopic(topic: string) {
    if (!active) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    void generate({ topic, level: "some", hoursPerWeek: active.request.hoursPerWeek, goal: active.request.from ? "job" : active.request.goal });
  }

  /**
   * The logo opens the homepage. In the desktop app, the site's own home page is the download page, so it opens the
   * Ladderly website in the person's browser instead (the desktop shell sends new windows to the default browser).
   * @param {React.MouseEvent<HTMLAnchorElement>} e The click.
   * @returns {void}
   */
  function openHomepage(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!desktopBridge()) return;
    e.preventDefault();
    window.open("https://ladderly.vercel.app/", "_blank", "noopener");
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
        {/* Above the logo's tap area (z-40), so Feedback and Settings always get the tap on phones */}
        <div className="absolute right-0 top-0 z-50 flex items-center gap-1">
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
          <Link
            id="ladderly-logo"
            href="/"
            onClick={openHomepage}
            aria-label="Ladderly homepage"
            title="Ladderly homepage"
            className="shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Logo size={52} className="block rounded-xl ring-1 ring-black/5 dark:ring-white/15" />
          </Link>
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

      <div className="mb-3 flex flex-col items-center gap-1.5">
        <div role="tablist" aria-label="What would you like to do?" className="inline-flex rounded-xl border border-zinc-200 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          {MODES.map((m) => (
            <button
              key={m.id}
              id={`mode-${m.id}`}
              role="tab"
              type="button"
              aria-selected={mode === m.id}
              aria-controls={`panel-${m.id}`}
              onClick={() => {
                setMode(m.id);
                setTypedTopic("");
              }}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium transition ${
                mode === m.id ? "bg-indigo-600 text-white shadow" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <span aria-hidden="true">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500">{MODES.find((m) => m.id === mode)?.hint}</p>
      </div>
      {/* Both stay mounted, so switching tabs keeps what was typed. */}
      <div id="panel-grow" role="tabpanel" aria-labelledby="mode-grow" hidden={mode !== "grow"}>
        <PathForm onSubmit={(request) => generate(request)} disabled={status.kind === "loading"} onTopicChange={setTypedTopic} />
        <div className="mt-4">
          <ReadyPaths onPick={(topic) => void generate({ topic }, true)} disabled={status.kind === "loading"} />
        </div>
      </div>
      <div id="panel-transition" role="tabpanel" aria-labelledby="mode-transition" hidden={mode !== "transition"}>
        <TransitionForm onSubmit={(request) => generate(request)} disabled={status.kind === "loading"} onTopicChange={setTypedTopic} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        <main className="min-w-0 space-y-6">
          {status.kind === "loading" && lastRequest && <LoadingPanel
              topic={pathTitle(lastRequest)}
              partial={status.partial}
              note={status.note}
              engine={status.ready ? "Ladderly's ready-made paths" : engine}
              local={!status.ready && aiSettings.provider === "ollama"}
            />}
          {status.kind === "error" && lastRequest && (
            <ErrorPanel message={status.message} onRetry={() => generate(lastRequest, lastReady)} />
          )}
          {status.kind !== "loading" && active && (
            <PathView
              key={active.id}
              saved={active}
              onToggle={(key) => toggleCheck(active.id, key)}
              onQuizFinish={saveQuizScore}
              onStartTopic={startNextTopic}
            />
          )}
          {status.kind === "idle" && !active && loaded && (
            <p className="py-10 text-center text-zinc-500">
              {mode === "grow" ? (
                <>
                  Type something you want to learn, like <em>class 12 physics</em>, <em>guitar</em> or <em>python</em>, and get a step-by-step plan.
                </>
              ) : (
                <>
                  Tell Ladderly your current career and the one you want, like <em>electronics engineer → AI engineer</em>, and get a step-by-step plan to make the switch.
                </>
              )}
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
      <footer className="mt-16 border-t border-zinc-200 pt-6 text-center text-xs leading-relaxed text-zinc-500 dark:border-zinc-800">
        Learning paths are generated by AI, including open-source models and other large language models, and can
        contain mistakes. Please verify important information before you rely on it.
      </footer>
      {(askName || nameOpen) && <NameDialog open initialName={profile?.name ?? ""} onClose={() => setNameOpen(false)} />}
      <Toaster />
      <AiSettingsDialog open={aiOpen} onClose={() => setAiOpen(false)} status={aiStatus} onRefreshStatus={refreshAiStatus} />
    </div>
  );
}
