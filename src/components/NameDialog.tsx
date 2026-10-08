"use client";

import { useEffect, useRef, useState } from "react";
import { updateProfile } from "@/lib/profile";

/**
 * Asks the learner what to call them: shown automatically on their first visit, and again when they choose
 * "Change name". The name is saved only on this device. Native modal `<dialog>`, so Escape closes it.
 * @param {Object} props
 * @param {boolean} props.open Whether the dialog is shown.
 * @param {string} [props.initialName] The current name, when changing it.
 * @param {() => void} props.onClose Called when the dialog closes (after saving or skipping).
 * @returns {JSX.Element} The dialog.
 */
export function NameDialog({ open, initialName = "", onClose }: { open: boolean; initialName?: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const savedRef = useRef(false);
  const [name, setName] = useState(initialName);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /**
   * Saves the name (or marks the question as skipped if it's empty) and closes.
   * @param {React.FormEvent} e The form submit event.
   * @returns {void}
   */
  function save(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim().slice(0, 40);
    updateProfile(trimmed ? { name: trimmed, skipped: false } : { skipped: true });
    savedRef.current = true;
    ref.current?.close();
  }

  /**
   * Runs on every close (Save, Skip, Escape). Without a save on a first visit, it remembers the question was skipped
   * so we don't keep asking.
   * @returns {void}
   */
  function handleClose() {
    if (!savedRef.current && !initialName) updateProfile({ skipped: true });
    savedRef.current = false;
    onClose();
  }

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      aria-labelledby="name-dialog-title"
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/50 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <form onSubmit={save} className="p-6">
        <p aria-hidden="true" className="text-4xl">
          👋
        </p>
        <h2 id="name-dialog-title" className="mt-2 text-xl font-semibold">
          {initialName ? "Change your name" : "Welcome to Ladderly!"}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {initialName ? "What should we call you?" : "What should we call you? We'll greet you each time you come back to learn."}
        </p>
        <label htmlFor="learner-name" className="sr-only">
          Your name
        </label>
        <input
          id="learner-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          maxLength={40}
          autoComplete="given-name"
          autoFocus
          className="mt-4 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <p className="mt-2 text-xs text-zinc-500">Saved only on this device. No account needed.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => ref.current?.close()} className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            {initialName ? "Cancel" : "Skip for now"}
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            {initialName ? "Save" : "Let's go"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
