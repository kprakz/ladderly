/** Background look for a topic: two glow colours (light and dark mode) and a few symbols that float by. */
export type TopicTheme = {
  id: string;
  /** Two colours for the soft glows, as CSS colours. */
  glows: [string, string];
  /** Emoji that drift faintly across the background. */
  symbols: string[];
};

/** Topic families, matched by keyword (whole words or word starts), most specific first. */
const THEMES: (TopicTheme & { keywords: string[] })[] = [
  { id: "music", glows: ["#f472b6", "#a78bfa"], symbols: ["🎸", "🎵", "🎶", "🥁", "🎹"], keywords: ["guitar", "piano", "music", "sing", "song", "drum", "violin", "ukulele", "bass", "chord", "dj", "compos", "vocal", "saxophone", "flute"] },
  { id: "ai", glows: ["#818cf8", "#22d3ee"], symbols: ["🧠", "🤖", "📊", "📈", "🔢"], keywords: ["machine learning", "ml", "ai", "artificial", "deep learning", "neural", "llm", "data scien", "statistic", "data analy", "nlp", "computer vision"] },
  { id: "python", glows: ["#60a5fa", "#facc15"], symbols: ["🐍", "💻", "⌨️", "🧩", "{ }"], keywords: ["python", "django", "flask", "pandas"] },
  { id: "code", glows: ["#34d399", "#60a5fa"], symbols: ["💻", "⌨️", "🧩", "</>", "{ }"], keywords: ["code", "coding", "program", "javascript", "typescript", "java", "rust", "golang", "c++", "react", "web dev", "sql", "software", "app dev", "html", "css", "linux", "algorithm"] },
  { id: "speaking", glows: ["#fb923c", "#f472b6"], symbols: ["🎤", "🗣️", "💬", "👏", "📣"], keywords: ["public speaking", "speak", "speech", "present", "debate", "communicat", "storytell", "interview", "confiden"] },
  { id: "language", glows: ["#f87171", "#fbbf24"], symbols: ["🗺️", "💬", "📖", "✈️", "🔤"], keywords: ["spanish", "french", "german", "japanese", "chinese", "mandarin", "korean", "italian", "hindi", "arabic", "english", "language", "portuguese", "tamil"] },
  { id: "art", glows: ["#f472b6", "#fbbf24"], symbols: ["🎨", "✏️", "🖌️", "🖼️", "✨"], keywords: ["draw", "paint", "art", "sketch", "design", "illustrat", "figma", "animation", "calligraph", "watercolor"] },
  { id: "photo", glows: ["#94a3b8", "#fbbf24"], symbols: ["📷", "🎞️", "🌅", "🎬", "💡"], keywords: ["photo", "camera", "film", "video edit", "cinematograph", "lightroom"] },
  { id: "fitness", glows: ["#4ade80", "#22d3ee"], symbols: ["💪", "🏃", "🧘", "⚽", "🏋️"], keywords: ["fitness", "gym", "run", "yoga", "workout", "swim", "football", "soccer", "basketball", "tennis", "cricket", "climb", "boxing", "martial", "cycling", "sport"] },
  { id: "cooking", glows: ["#fb923c", "#facc15"], symbols: ["🍳", "🥗", "🍞", "🌶️", "🧁"], keywords: ["cook", "bak", "chef", "food", "recipe", "kitchen", "bread", "pastry", "coffee"] },
  { id: "science", glows: ["#38bdf8", "#a78bfa"], symbols: ["🔬", "🧪", "⚛️", "🔭", "📐"], keywords: ["math", "calculus", "algebra", "physics", "chemistry", "biology", "science", "astronom", "geometry", "electronic", "engineering"] },
  { id: "money", glows: ["#4ade80", "#facc15"], symbols: ["💰", "📈", "💼", "🏦", "📊"], keywords: ["financ", "invest", "money", "budget", "account", "business", "marketing", "startup", "sales", "economic", "trading"] },
  { id: "writing", glows: ["#a78bfa", "#94a3b8"], symbols: ["✍️", "📖", "📝", "💭", "📚"], keywords: ["writ", "poetry", "novel", "blog", "journal", "read", "literature"] },
  { id: "games", glows: ["#a78bfa", "#34d399"], symbols: ["♟️", "🎲", "🧩", "🏆", "🎮"], keywords: ["chess", "game", "puzzle", "rubik", "poker", "sudoku"] },
];

/** The quiet default when no topic is known. */
export const DEFAULT_THEME: TopicTheme = { id: "default", glows: ["#818cf8", "#c4b5fd"], symbols: ["📚", "💡", "✏️", "⭐", "🪜"] };

/**
 * Finds the background theme for a topic by keyword.
 * @param {string} topic What the user typed or the active path's topic, e.g. "Learn jazz guitar".
 * @returns {TopicTheme | null} The matching theme, or `null` if no family matches.
 */
export function matchTopicTheme(topic: string): TopicTheme | null {
  const text = ` ${topic.toLowerCase().replace(/[^a-z0-9+#]+/g, " ")} `;
  if (!text.trim()) return null;
  for (const theme of THEMES) {
    // Short keywords ("ai", "ml", "art") must be whole words; longer ones may start a word ("bak" → baking).
    if (theme.keywords.some((k) => text.includes(k.length <= 3 ? ` ${k} ` : ` ${k}`))) {
      const { id, glows, symbols } = theme;
      return { id, glows, symbols };
    }
  }
  return null;
}
