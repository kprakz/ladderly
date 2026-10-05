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

export const SYSTEM_PROMPT = `You design concise, practical learning paths that take someone from their current level to "competent" in a skill.

Guidelines:
- 4 to 6 ordered stages, each building on the last.
- Keep every bullet short (one line). Be specific to the skill, not generic study advice.
- Checkpoints must be concrete and self-testable (e.g. "Play G, C and D chords cleanly at 60 bpm"), never vague ("understand the basics").
- Resources describe kinds of resources only ("the official docs", "a beginner video course"). Never include URLs, and never invent book, course or channel names.
- Durations should be realistic for the learner's weekly time.
- The finish line is a single project or test that clearly proves competence.
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
