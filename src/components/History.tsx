"use client";

import { progressOf, type SavedPath } from "@/lib/storage";
import { ProgressBar } from "./ProgressBar";

type Props = {
  paths: SavedPath[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * Sidebar list of saved paths with progress, selection and delete.
 * @param {Props} props
 * @param {SavedPath[]} props.paths Saved paths, newest first.
 * @param {string | null} props.activeId ID of the path currently shown (highlighted).
 * @param {(id: string) => void} props.onSelect Called with a path's ID when it is clicked.
 * @param {(id: string) => void} props.onDelete Called with a path's ID after the user confirms deletion.
 * @returns {JSX.Element} The list, or a placeholder message when there are no paths.
 */
export function History({ paths, activeId, onSelect, onDelete }: Props) {
  if (paths.length === 0) {
    return <p className="text-sm text-zinc-500">Your saved paths will appear here.</p>;
  }

  return (
    <ul className="space-y-2">
      {paths.map((p) => {
        const { percent } = progressOf(p);
        const active = p.id === activeId;
        return (
          <li key={p.id} className="group relative">
            <button
              onClick={() => onSelect(p.id)}
              className={`w-full rounded-lg border p-3 pr-9 text-left transition ${
                active
                  ? "border-indigo-400 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              }`}
            >
              <span className="block truncate text-sm font-medium capitalize">{p.request.topic}</span>
              <span className="mt-0.5 block text-xs text-zinc-500">
                {new Date(p.createdAt).toLocaleDateString()} · {percent}%
              </span>
              <ProgressBar percent={percent} className="mt-2" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete the path for "${p.request.topic}"?`)) onDelete(p.id);
              }}
              aria-label={`Delete ${p.request.topic}`}
              className="absolute right-2 top-2 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 dark:hover:bg-zinc-800"
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}
