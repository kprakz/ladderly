"use client";

import { useEffect, useRef, useState } from "react";
import { desktopBridge } from "@/lib/desktop";

const RATINGS = [
  { value: 1, emoji: "😞", label: "Not good" },
  { value: 2, emoji: "😕", label: "Could be better" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😍", label: "Love it" },
];

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const field =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950";

/**
 * A short feedback form in a modal: an optional emoji rating, a message, and an optional email for a reply.
 * Used in the app (source "app", or "desktop" in the Windows app) and on the website (source "website").
 * Render it only while open, so each opening starts fresh.
 * @param {Object} props
 * @param {"website" | "app"} props.source Where it's shown.
 * @param {() => void} props.onClose Called when the dialog closes.
 * @returns {JSX.Element} The dialog.
 */
export function FeedbackDialog({ source, onClose }: { source: "website" | "app"; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [rating, setRating] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  /**
   * Sends the feedback to /api/feedback.
   * @param {React.FormEvent} e The submit event.
   * @returns {Promise<void>}
   */
  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    const bridge = desktopBridge();
    const version = bridge ? (await bridge.updates.get().catch(() => null))?.currentVersion : undefined;
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          message,
          email: email.trim(),
          source: source === "app" && bridge ? "desktop" : source,
          version,
          page: location.pathname,
          website: trap,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Couldn't send your feedback right now.");
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't send your feedback right now." });
    }
  }

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="feedback-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl bg-white p-0 text-left text-zinc-900 shadow-2xl backdrop:bg-black/50 dark:bg-zinc-900 dark:text-zinc-100"
    >
      {status.kind === "sent" ? (
        <div className="p-6 text-center">
          <p aria-hidden="true" className="text-4xl">
            💛
          </p>
          <h2 id="feedback-title" className="mt-2 text-xl font-semibold">
            Thank you!
          </h2>
          <p className="mt-1 text-sm text-zinc-500">Every message is read, and it helps make Ladderly better for everyone.</p>
          <button onClick={close} className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={send} className="p-6">
          <h2 id="feedback-title" className="text-xl font-semibold">
            Share your feedback
          </h2>
          <p className="mt-1 text-sm text-zinc-500">What&apos;s working, what&apos;s confusing, what you&apos;d love to see.</p>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium">How do you feel about Ladderly?</legend>
            <div className="mt-2 flex justify-between gap-1">
              {RATINGS.map((r) => (
                <label
                  key={r.value}
                  title={r.label}
                  className={`flex flex-1 cursor-pointer justify-center rounded-lg py-1.5 text-2xl transition ${
                    rating === r.value ? "bg-indigo-100 ring-2 ring-indigo-500 dark:bg-indigo-950" : "grayscale-[60%] hover:bg-zinc-100 hover:grayscale-0 dark:hover:bg-zinc-800"
                  }`}
                >
                  <input type="radio" name="rating" value={r.value} checked={rating === r.value} onChange={() => setRating(r.value)} className="sr-only" />
                  <span aria-hidden="true">{r.emoji}</span>
                  <span className="sr-only">{r.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm font-medium" htmlFor="feedback-message">
            Your message
          </label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={3}
            maxLength={2000}
            rows={4}
            autoFocus
            placeholder="I wish Ladderly could…"
            className={`${field} mt-1 resize-y`}
          />

          <label className="mt-3 block text-sm font-medium" htmlFor="feedback-email">
            Email <span className="font-normal text-zinc-500">(optional, only if you&apos;d like a reply)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            autoComplete="email"
            className={`${field} mt-1`}
          />

          {/* Hidden from people; bots tend to fill it in. */}
          <input type="text" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          {status.kind === "error" && (
            <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
              {status.message}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">No account needed.</p>
            <div className="flex gap-2">
              <button type="button" onClick={close} className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button
                type="submit"
                disabled={status.kind === "sending" || message.trim().length < 3}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status.kind === "sending" ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </form>
      )}
    </dialog>
  );
}
