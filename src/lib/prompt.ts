import type { PathRequest } from "./schema";

const LEVELS = {
  none: "a complete beginner",
  some: "someone with a little prior exposure",
  intermediate: "an intermediate learner",
} as const;

const GOALS = {
  hobby: "learning for fun as a hobby",
  job: "aiming to use it professionally in a job",
  exam: "preparing to pass an exam or certification",
} as const;

export const SYSTEM_PROMPT = `You design detailed, practical learning paths that take someone from their current level to "competent" in a skill.

Guidelines:
- 4 to 6 ordered stages, each building on the last.
- Be detailed and specific to the skill. A learner should be able to read a stage and know exactly what they will have covered. Each concept names the actual technique, tool, term or idea and says what to know about it, in one line. Never write generic study advice ("the 3-5 most-used techniques", "common beginner mistakes", "deliberate practice").
  - Vague: "The most-used techniques". Specific: "Logistic regression: predicting probabilities with the sigmoid and a decision threshold".
- Practice tasks name exactly what to work with (a dataset, song, piece, tool or real scenario) and a measurable goal, e.g. "Classify the Titanic passengers with logistic regression, k-NN and a random forest, and compare their test accuracy".
- Checkpoints must be concrete and self-testable (e.g. "Play G, C and D chords cleanly at 60 bpm"), never vague ("understand the basics").
- Resources describe kinds of resources only ("the official docs", "a beginner video course"). Never include URLs, and never invent book, course or channel names.
- Durations should be realistic for the learner's weekly time.
- The finish line is a single project or test that clearly proves competence.
- For each stage, write a YouTube search ("videoSearch") that would find good lessons for exactly that stage.
- For each stage, write 2-3 multiple-choice quiz questions (4 options, one correct) about that stage's own concepts: definitions, choosing the right technique, predicting what happens, reading a small example. Make wrong options plausible. Add a one-sentence explanation. Vary which option is correct. Never ask about study habits or motivation.
- For "courses", pick 2-3 free and 1-3 paid platforms that genuinely suit this skill, with search words for each. Use only these platform IDs: youtube, khanacademy, freecodecamp, mitocw (free); coursera (free to audit); udemy, skillshare, linkedin, domestika (paid). Skip platforms that don't cover the skill (e.g. freecodecamp is for programming, domestika for creative skills).
- If the topic is not a learnable skill, still do your best to interpret it as one.`;

/**
 * Builds the user message sent to Claude from the form input.
 * @param {PathRequest} req The validated request: topic plus optional level, hours per week and goal.
 * @returns {string} A short multi-line prompt describing the learner and asking for the path.
 */
export function buildUserPrompt(req: PathRequest): string {
  const lines = [`Skill: ${req.topic}`];
  if (req.level) lines.push(`Learner: ${LEVELS[req.level]}`);
  if (req.hoursPerWeek) lines.push(`Time available: about ${req.hoursPerWeek} hours per week`);
  if (req.goal) lines.push(`Goal: ${GOALS[req.goal]}`);
  lines.push("", "Create the learning path.");
  return lines.join("\n");
}

/** Extra instruction for slower local models, so a path finishes in reasonable time on a laptop. */
const COMPACT_NOTE = `
- Keep it compact so it generates quickly: exactly 4 stages, 3-4 concepts and 2 checkpoints per stage, 1 practice task per stage, exactly 2 quiz questions per stage, and 3 courses. Stay just as specific.`;

/**
 * The system prompt for a given engine.
 * @param {boolean} compact True for local models: asks for a shorter (but equally specific) path.
 * @returns {string} The system prompt.
 */
export function buildSystemPrompt(compact: boolean): string {
  return compact ? SYSTEM_PROMPT + COMPACT_NOTE : SYSTEM_PROMPT;
}
