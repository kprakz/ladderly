import type { PathRequest } from "./schema";

const LEVELS = {
  none: "a complete beginner",
  some: "someone with a little prior exposure",
  intermediate: "an intermediate learner",
} as const;

/** For a career transition, "level" is their experience with the new career so far. */
const EXPERIENCE = {
  none: "none yet",
  some: "a little (some courses or side projects)",
  intermediate: "solid (has done real work with it, but not as their job)",
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
- For "nextTopics", suggest 3 skills to learn after finishing this path. Each must build directly on this same skill: one goes deeper into it, one is a closely neighbouring skill, one applies it to real work. Use short names someone could type to start a new path, each with a one-sentence reason. Never suggest unrelated subjects.
- If the topic is not a learnable skill, still do your best to interpret it as one.`;

/**
 * Builds the user message sent to the AI from the form input.
 * @param {PathRequest} req The validated request: topic (and, for a career transition, the current career) plus
 *   optional level, hours per week and goal.
 * @returns {string} A short multi-line prompt describing the learner and asking for the path.
 */
export function buildUserPrompt(req: PathRequest): string {
  if (req.from) {
    const lines = [`Current career: ${req.from}`, `Career they want: ${req.topic}`];
    if (req.level) lines.push(`Experience with ${req.topic} so far: ${EXPERIENCE[req.level]}`);
    if (req.hoursPerWeek) lines.push(`Time available: about ${req.hoursPerWeek} hours per week`);
    lines.push("", `Create the career transition path from ${req.from} to ${req.topic}. The 3 next topics must help them grow in ${req.topic}.`);
    return lines.join("\n");
  }
  const lines = [`Skill: ${req.topic}`];
  if (req.level) lines.push(`Learner: ${LEVELS[req.level]}`);
  if (req.hoursPerWeek) lines.push(`Time available: about ${req.hoursPerWeek} hours per week`);
  if (req.goal) lines.push(`Goal: ${GOALS[req.goal]}`);
  lines.push("", `Create the learning path. The 3 next topics must build directly on ${req.topic}.`);
  return lines.join("\n");
}

/** Extra instruction for slower local models, so a path finishes in reasonable time on a laptop. */
const COMPACT_NOTE = `
- Keep it compact so it generates quickly: exactly 4 stages, 3-4 concepts and 2 checkpoints per stage, 1 practice task per stage, exactly 2 quiz questions per stage, 3 courses and 3 next topics (and 3 transferable skills for a career transition). Stay just as specific.`;

/** Extra guidelines for a career transition ("Transition"): the path starts from the learner's current career. */
const TRANSITION_NOTE = `

This is a career transition: the learner already works in one career and wants to move into another. Write the path from where they already are.
- Don't re-teach what their current career already gave them. Spend the time on the gaps between the two careers, most important first.
- "transferableSkills": 3-5 specific skills or knowledge from the current career that carry over (never generic traits like "hard work"), each with one sentence on how it's used in the new career. Even very different careers share something real (domain knowledge, tools, maths, working with clients); name it specifically.
- The first stage bridges the biggest gap for someone with this background. The middle stages build the core skills the new role is hired for, as it's practised today.
- At least one practice task is a project that combines their old field with the new one (e.g. an electronics engineer training a model on sensor data), because that domain knowledge is their advantage.
- The last stage makes them job-ready: a portfolio of 2-3 projects, rewriting their CV and LinkedIn to tell the switch as a story, the interview format for this role (e.g. coding rounds, case studies, take-home tasks), and realistic ways to land the first role (an internal move, an adjacent or hybrid role, freelancing, open source).
- Durations assume they're learning alongside a full-time job unless the weekly time says otherwise.
- The finish line is the milestone that proves they're ready to apply, e.g. a portfolio project a hiring manager could review.
- "pitfalls" are mistakes people make in this particular transition.
- "nextTopics" are skills to grow in the new career (deeper, neighbouring, applied).
- If either career isn't a real job, interpret it as the closest one.`;

/**
 * The system prompt for a given engine and kind of path.
 * @param {boolean} compact True for local models: asks for a shorter (but equally specific) path.
 * @param {boolean} [transition] True for a career transition.
 * @returns {string} The system prompt.
 */
export function buildSystemPrompt(compact: boolean, transition = false): string {
  return SYSTEM_PROMPT + (transition ? TRANSITION_NOTE : "") + (compact ? COMPACT_NOTE : "");
}
