import { KIND_LABELS, PLATFORMS, platformSearchUrl, type CourseKind } from "@/lib/platforms";
import type { LearningPath } from "@/lib/schema";
import { Disclosure } from "./Disclosure";
import { VideoRow } from "./VideoRow";

/** One row in the free or paid course list. */
type LinkItem = { key: string; title: string; subtitle: string; url: string; kind: CourseKind };

/**
 * "Videos & courses" for a path, folded by default: a Netflix-style row of recommended videos (verified demo
 * picks), then free and paid course links. Course links are either verified course pages or searches on known
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
    <Disclosure title="Videos & courses" icon="🎓" count={videos.length + items.length} className="bg-white dark:bg-zinc-900">
      {videos.length > 0 && <VideoRow videos={videos} searchQuery={`${topic} for beginners`} />}
      {free.length > 0 && (
        <>
          <h4 className="mt-4 text-sm font-medium text-zinc-500">Free</h4>
          <LinkList items={free} />
        </>
      )}
      {paid.length > 0 && (
        <>
          <h4 className="mt-4 text-sm font-medium text-zinc-500">Paid</h4>
          <LinkList items={paid} />
        </>
      )}
      <p className="mt-4 text-xs text-zinc-400">Links open the provider&apos;s site. Ladderly isn&apos;t affiliated with them.</p>
    </Disclosure>
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
      <ul className="mt-2 space-y-3">
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
