"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

/** One stored message (see lib/server/feedback.ts). */
type Entry = {
  id: string;
  at: string;
  rating?: number;
  message: string;
  email?: string;
  source: "website" | "app" | "desktop";
  version?: string;
  country: string;
};

const EMOJI = ["", "😞", "😕", "😐", "🙂", "😍"];
const SOURCE_LABEL = { website: "Website", app: "Web app", desktop: "Windows app" } as const;
const TOKEN_KEY = "ladderly:feedback-admin";

type LoadResult = { ok: true; entries: Entry[]; ready: boolean } | { ok: false; error: string };

/**
 * Fetches the feedback from the API with the admin password.
 * @param {string} password The admin password.
 * @returns {Promise<LoadResult>} The entries, or an error message.
 */
async function fetchFeedback(password: string): Promise<LoadResult> {
  try {
    const res = await fetch("/api/feedback", { headers: { Authorization: `Bearer ${password}` }, cache: "no-store" });
    const json = (await res.json().catch(() => ({}))) as { entries?: Entry[]; ready?: boolean; error?: string };
    if (!res.ok) return { ok: false, error: json.error ?? "Couldn't load feedback." };
    return { ok: true, entries: json.entries ?? [], ready: json.ready !== false };
  } catch {
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/**
 * The maker's private feedback inbox. Asks for the admin password (FEEDBACK_ADMIN_TOKEN), keeps it for this browser
 * tab only, and lists the newest messages with rating, where they came from, country, version and reply email.
 * @returns {JSX.Element} The inbox.
 */
export default function FeedbackInbox() {
  const [token, setToken] = useState("");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | Entry["source"]>("all");

  /**
   * Shows the result of a load: the entries, or why they couldn't be loaded.
   * @param {LoadResult} result From `fetchFeedback`.
   * @param {string} password The password used, remembered for this tab on success.
   * @returns {void}
   */
  function apply(result: LoadResult, password: string) {
    if (!result.ok) {
      setError(result.error);
      sessionStorage.removeItem(TOKEN_KEY);
      return;
    }
    sessionStorage.setItem(TOKEN_KEY, password);
    setEntries(result.entries);
    setError(result.ready ? "" : "The feedback database isn't connected yet (see README).");
  }

  /**
   * Loads the feedback with a password.
   * @param {string} password The admin password.
   * @returns {Promise<void>}
   */
  async function load(password: string) {
    apply(await fetchFeedback(password), password);
  }

  // Reopen without asking again in the same tab.
  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) fetchFeedback(saved).then((result) => apply(result, saved));
  }, []);

  if (!entries) {
    return (
      <main className="mx-auto max-w-sm px-4 py-20">
        <Logo size={44} className="mx-auto rounded-xl" />
        <h1 className="mt-4 text-center text-xl font-semibold">Feedback inbox</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(token);
          }}
          className="mt-6 space-y-3"
        >
          <label htmlFor="admin-token" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500">Open</button>
        </form>
      </main>
    );
  }

  const shown = filter === "all" ? entries : entries.filter((e) => e.source === filter);
  const rated = entries.filter((e) => e.rating);
  const average = rated.length ? rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length : 0;
  const names = new Intl.DisplayNames(["en"], { type: "region" });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <p className="text-sm text-zinc-500">
          {entries.length} message{entries.length === 1 ? "" : "s"}
          {rated.length > 0 && ` · average ${EMOJI[Math.round(average)]} ${average.toFixed(1)} / 5`}
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{error}</p>}

      <div className="mt-4 flex gap-2 text-sm">
        {(["all", "website", "app", "desktop"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 ${filter === f ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"}`}
          >
            {f === "all" ? "All" : SOURCE_LABEL[f]}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-zinc-500">No feedback yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {shown.map((e) => (
            <li key={e.id} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                {e.rating && (
                  <span className="text-lg" title={`${e.rating} / 5`}>
                    {EMOJI[e.rating]}
                  </span>
                )}
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">{SOURCE_LABEL[e.source]}</span>
                {e.version && <span>v{e.version}</span>}
                <span>{e.country === "XX" ? "Unknown country" : (names.of(e.country) ?? e.country)}</span>
                <time dateTime={e.at} className="ml-auto">
                  {new Date(e.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{e.message}</p>
              {e.email && (
                <a href={`mailto:${e.email}?subject=${encodeURIComponent("Your Ladderly feedback")}`} className="mt-2 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                  Reply to {e.email}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
