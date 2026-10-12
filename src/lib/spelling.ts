// "Did you mean…?" for topics: catches typos like "puthon" or "machin lerning" before a path is made, by comparing
// each word with a list of known skills and subjects. Only words that are very close to a known word (and aren't
// known words themselves) are corrected, so real topics are left alone.

/** Skills and subjects people commonly type. Their words make up the vocabulary for corrections. */
const KNOWN_TOPICS = [
  // Ready-made paths and school subjects (CBSE/NCERT)
  "python", "guitar", "public speaking", "machine learning", "artificial intelligence", "maths", "mathematics", "math",
  "physics", "chemistry", "biology", "computer science", "class 11", "class 12", "calculus", "algebra", "geometry",
  "trigonometry", "statistics", "probability", "organic chemistry", "inorganic chemistry", "physical chemistry",
  "botany", "zoology", "genetics", "economics", "accountancy", "business studies", "history", "geography",
  "political science", "psychology", "sociology", "english", "hindi", "sanskrit", "jee", "neet", "cuet", "upsc",
  "board exams",
  // Programming and tech
  "javascript", "typescript", "java", "kotlin", "swift", "rust", "golang", "ruby", "php", "html", "css", "sql",
  "react", "angular", "vue", "nodejs", "django", "flask", "spring", "android development", "ios development",
  "web development", "app development", "data science", "data analysis", "data structures", "algorithms",
  "deep learning", "neural networks", "natural language processing", "computer vision", "cloud computing",
  "cybersecurity", "ethical hacking", "networking", "linux", "docker", "kubernetes", "devops", "git", "excel",
  "power bi", "tableau", "pandas", "numpy", "programming", "coding", "blockchain", "robotics", "arduino",
  "electronics", "game development", "unity", "blender", "prompt engineering",
  // Music and arts
  "piano", "violin", "drums", "ukulele", "flute", "singing", "music theory", "songwriting", "music production",
  "drawing", "painting", "sketching", "watercolor", "digital art", "illustration", "calligraphy", "animation",
  "graphic design", "ui design", "ux design", "photography", "video editing", "filmmaking", "dancing", "acting",
  // Languages
  "spanish", "french", "german", "japanese", "korean", "mandarin", "chinese", "italian", "portuguese", "arabic",
  "russian", "tamil", "telugu", "kannada", "malayalam", "bengali", "marathi", "gujarati", "punjabi", "urdu",
  // Life skills, health, hobbies
  "communication", "leadership", "negotiation", "storytelling", "writing", "creative writing", "copywriting",
  "personal finance", "investing", "stock market", "trading", "marketing", "digital marketing", "sales",
  "entrepreneurship", "productivity", "time management", "critical thinking", "problem solving", "interview",
  "cooking", "baking", "nutrition", "fitness", "yoga", "meditation", "running", "swimming", "cycling", "football",
  "cricket", "basketball", "badminton", "tennis", "chess", "gardening", "knitting", "sewing", "astronomy",
];

/** Common words that are never corrected (they can still be the correction for a typo, e.g. "lerning"). */
const LEAVE_ALONE = new Set([
  "a", "an", "and", "as", "at", "by", "for", "from", "how", "i", "in", "into", "is", "it", "learn", "learning",
  "me", "my", "of", "on", "or", "the", "to", "with", "basics", "beginner", "beginners", "advanced", "intro",
  "introduction", "course", "exam", "exams", "level", "class", "grade", "std",
]);

/** Every word in the known topics: these are never treated as typos. */
const KNOWN_WORDS = new Set(KNOWN_TOPICS.flatMap((t) => t.split(" ")));

/**
 * Words a typo may be corrected to: whole one-word skills ("python", "chess"), plus longer, distinctive words from
 * phrases ("learning", "speaking"). Short everyday words that only appear inside a phrase ("power" in "power bi",
 * "art" in "digital art") are left out, so "poker" or "dart" aren't "corrected" to them.
 */
const TARGETS = new Set([
  ...KNOWN_TOPICS.filter((t) => !t.includes(" ")),
  ...KNOWN_TOPICS.filter((t) => t.includes(" ")).flatMap((t) => t.split(" ").filter((w) => w.length >= 6)),
]);

/**
 * Counts the single-letter edits (insert, delete, replace, or swap two neighbouring letters) between two words.
 * Stops early once the count passes `limit`.
 * @param {string} a First word.
 * @param {string} b Second word.
 * @param {number} limit Largest distance worth knowing about.
 * @returns {number} The distance, or `limit + 1` if it's larger than `limit`.
 */
export function editDistance(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const prev2: number[] = new Array(b.length + 1).fill(0);
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, prev2[j - 2] + 1);
      row.push(d);
      rowMin = Math.min(rowMin, d);
    }
    if (rowMin > limit) return limit + 1;
    prev2.splice(0, prev2.length, ...prev);
    prev = row;
  }
  return prev[b.length];
}

/**
 * How many edits a word of this length may be away from a known word and still count as a typo. Short words need
 * to be closer, so "hunting" isn't turned into "running".
 * @param {number} length The word's length.
 * @returns {number} The allowed number of edits (0 means don't correct).
 */
function allowedEdits(length: number): number {
  if (length <= 3) return 0;
  if (length <= 7) return 1;
  return 2;
}

/**
 * Finds the closest known word to a possibly misspelled word.
 * @param {string} word A lowercase word.
 * @returns {string | null} The correction, or `null` if the word is fine or nothing is close enough.
 */
function correctWord(word: string): string | null {
  if (KNOWN_WORDS.has(word) || LEAVE_ALONE.has(word) || /\d/.test(word)) return null;
  const limit = allowedEdits(word.length);
  if (limit === 0) return null;
  let best: string | null = null;
  let bestDistance = limit + 1;
  for (const known of TARGETS) {
    const d = editDistance(word, known, limit);
    // Prefer the closest; on a tie, prefer a word that starts with the same letter.
    if (d < bestDistance || (d === bestDistance && best && known[0] === word[0] && best[0] !== word[0])) {
      best = known;
      bestDistance = d;
    }
  }
  return bestDistance <= limit ? best : null;
}

/**
 * Suggests a corrected spelling for a topic, word by word ("puthon" → "python", "machin lerning" → "machine
 * learning"). Words that are already known, short, numbers, or not close to any known skill are kept as typed.
 * @param {string} topic What the user typed.
 * @returns {string | null} The corrected topic, or `null` when there's nothing to correct.
 */
export function suggestSpelling(topic: string): string | null {
  const words = topic.trim().split(/\s+/);
  let changed = false;
  const fixed = words.map((w) => {
    const match = w.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}+#.-]+?)([^\p{L}\p{N}]*)$/u);
    if (!match) return w;
    const [, before, core, after] = match;
    const correction = correctWord(core.toLowerCase());
    if (!correction) return w;
    changed = true;
    return before + correction + after;
  });
  return changed ? fixed.join(" ") : null;
}
