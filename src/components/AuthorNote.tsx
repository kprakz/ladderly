/** The maker's links, shown as icons under the quote. */
const LINKS = [
  {
    label: "Karthik Prakashan on LinkedIn",
    href: "https://www.linkedin.com/in/kprakz/",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  },
  {
    label: "Karthik Prakashan on GitHub",
    href: "https://github.com/kprakz",
    path: "M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z",
  },
];

/**
 * A short note from Ladderly's maker under the title: a quote, his name, and LinkedIn and GitHub icons that open
 * his profiles (in the browser; the desktop app opens them in the default browser).
 * @returns {JSX.Element} The quote block.
 */
export function AuthorNote() {
  return (
    <figure className="mx-auto mt-4 max-w-xl text-center">
      <blockquote className="text-sm italic leading-relaxed text-zinc-500 dark:text-zinc-400">
        &ldquo;I know how it feels to stand at the start, unsure where to begin. Let me draw the first line on your
        canvas, so you can paint the rest.&rdquo;
      </blockquote>
      <figcaption className="mt-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">Karthik Prakashan</figcaption>
      <div className="mt-2 flex justify-center gap-3">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className="text-zinc-400 transition-colors hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d={link.path} />
            </svg>
          </a>
        ))}
      </div>
    </figure>
  );
}
