"use client";

import { useState } from "react";
import { FeedbackDialog } from "./FeedbackDialog";

/**
 * A button that opens the feedback form. Usable from server components (like the website), which can't hold state.
 * @param {Object} props
 * @param {"website" | "app"} props.source Where it's shown.
 * @param {string} [props.className] Button classes.
 * @param {string} [props.title] Tooltip.
 * @param {React.ReactNode} props.children The button's content.
 * @returns {JSX.Element} The button (and the dialog while open).
 */
export function FeedbackButton({ source, className, title, children }: { source: "website" | "app"; className?: string; title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} title={title}>
        {children}
      </button>
      {open && <FeedbackDialog source={source} onClose={() => setOpen(false)} />}
    </>
  );
}
