/**
 * Learning platforms Ladderly can link to. Links are built here from each site's real search page, so they
 * always work; Claude only picks the platform and the search words. Every search URL below was checked to load.
 */
export const PLATFORMS = {
  youtube: { name: "YouTube", kind: "free", search: "https://www.youtube.com/results?search_query=" },
  khanacademy: { name: "Khan Academy", kind: "free", search: "https://www.khanacademy.org/search?page_search_query=" },
  freecodecamp: { name: "freeCodeCamp", kind: "free", search: "https://www.freecodecamp.org/news/search/?query=" },
  mitocw: { name: "MIT OpenCourseWare", kind: "free", search: "https://ocw.mit.edu/search/?q=" },
  coursera: { name: "Coursera", kind: "audit", search: "https://www.coursera.org/search?query=" },
  udemy: { name: "Udemy", kind: "paid", search: "https://www.udemy.com/courses/search/?q=" },
  skillshare: { name: "Skillshare", kind: "paid", search: "https://www.skillshare.com/en/search?query=" },
  linkedin: { name: "LinkedIn Learning", kind: "paid", search: "https://www.linkedin.com/learning/search?keywords=" },
  domestika: { name: "Domestika", kind: "paid", search: "https://www.domestika.org/en/search?query=" },
} as const;

export type PlatformId = keyof typeof PLATFORMS;

/** All platform IDs, for the schema's enum. */
export const PLATFORM_IDS = Object.keys(PLATFORMS) as [PlatformId, ...PlatformId[]];

/** How a course costs: free, free to audit (certificate costs extra), or paid. */
export type CourseKind = "free" | "audit" | "paid";

/** Human-readable labels for each kind of course. */
export const KIND_LABELS: Record<CourseKind, string> = {
  free: "Free",
  audit: "Free to audit",
  paid: "Paid",
};

/**
 * Builds a search link on a platform.
 * @param {PlatformId} platform Which platform to search.
 * @param {string} query The search words.
 * @returns {string} A URL to that platform's search results for the query.
 */
export function platformSearchUrl(platform: PlatformId, query: string): string {
  return PLATFORMS[platform].search + encodeURIComponent(query.trim());
}

/**
 * Builds a YouTube search link.
 * @param {string} query The search words.
 * @returns {string} A URL to YouTube's search results for the query.
 */
export function youtubeSearchUrl(query: string): string {
  return platformSearchUrl("youtube", query);
}
