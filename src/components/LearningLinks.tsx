import { KIND_LABELS, PLATFORMS, platformSearchUrl, type CourseKind } from "@/lib/platforms";
import type { LearningPath } from "@/lib/schema";
import { Disclosure } from "./Disclosure";
import { VideoRow } from "./VideoRow";

/** One row in the free or paid course list. */
type LinkItem = { key: string; title: string; subtitle: string; url: string; kind: CourseKind };

/**
 * "Learn with" panel for a path: a Netflix-style row of recommended videos (verified demo picks), then free and
 * paid course links, each in its own dropdown. Course links are either verified course pages or searches on known
 * platforms, so every link works. Renders nothing for older saved paths that have no links.
 * @param {Object} props
 * @param {LearningPath} props.path The learning path.
 * @param {string} props.topic The path's topic, used for the "More on YouTube" search card.
 * @returns {JSX.Element | null} The panel, or `null` when the path has no videos or courses.
 */
export function LearningLinks({ path, topic }: { path: LearningPath; topic: string }) {
  const videos = path.featured?.videos ?? [];
  const items: LinkItem[] = [
    ...(path.featured?.courses ?? []).map((c) => ({
      key: c.url,
      title: c.title,
      subtitle: c.provider,
      url: c.url,
      kind: c.kind,
    })),
    ...(path.courses ?? []).map((c) => ({
      key: `${c.platform}:${c.query}`,
      title: `Search ${PLATFORMS[c.platform].name} for “${c.query}”`,
      subtitle: c.note,
      url: platformSearchUrl(c.platform, c.query),
      kind: PLATFORMS[c.platform].kind as CourseKind,
    })),
  ];
  if (videos.length === 0 && items.length === 0) return null;

  const free = items.filter((i) => i.kind !== "paid");
  const paid = items.filter((i) => i.kind === "paid");

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold">Learn with</h3>

      {videos.length > 0 && (
        <>
          <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Recommended videos</h4>
          <VideoRow videos={videos} searchQuery={`${topic} for beginners`} />
        </>
      )}

      {items.length > 0 && (
        <div className="mt-3 space-y-2">
          {free.length > 0 && (
            <Disclosure title="Free courses & resources" icon="🎓" count={free.length}>
              <LinkList items={free} />
            </Disclosure>
          )}
          {paid.length > 0 && (
            <Disclosure title="Paid courses" icon="💳" count={paid.length}>
              <LinkList items={paid} />
            </Disclosure>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-500">
        Links open the provider&apos;s site. Search links show that site&apos;s current results. Ladderly isn&apos;t
        affiliated with any provider; prices and availability may change.
      </p>
    </section>
  );
}

/**
 * A list of course links with a "free to audit" badge where it applies.
 * @param {Object} props
 * @param {LinkItem[]} props.items The links to show.
 * @returns {JSX.Element} The list.
 */
function LinkList({ items }: { items: LinkItem[] }) {
  return (
    <div>
      <ul className="space-y-3 pt-1">
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md p-2 -m-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{item.title} ↗</span>
              {item.kind === "audit" && (
                <span className="ml-2 inline-block whitespace-nowrap rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {KIND_LABELS.audit}
                </span>
              )}
              <span className="block text-xs text-zinc-500">{item.subtitle}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
