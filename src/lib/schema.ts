import { z } from "zod";
import { PLATFORM_IDS } from "./platforms";

/** What the browser sends to /api/path. */
export const PathRequestSchema = z.object({
  topic: z.string().trim().min(1, "Enter a skill or topic").max(120),
  level: z.enum(["none", "some", "intermediate"]).optional(),
  hoursPerWeek: z.number().int().min(1).max(80).optional(),
  goal: z.enum(["hobby", "job", "exam"]).optional(),
});

export type PathRequest = z.infer<typeof PathRequestSchema>;

/** A multiple-choice question for a stage's quiz. */
export const QuizQuestionSchema = z.object({
  question: z.string().describe("A question about this stage's specific content (a technique, term, tool or situation from its concepts), never general study advice"),
  options: z.array(z.string()).length(4).describe("Four possible answers, exactly one correct"),
  answer: z.number().int().min(0).max(3).describe("Index (0-3) of the correct option"),
  explanation: z.string().describe("One sentence on why the correct answer is right"),
});

/** A course search on a known learning platform. Claude picks the platform and the search words, never a URL. */
export const CourseLinkSchema = z.object({
  platform: z.enum(PLATFORM_IDS).describe("A learning platform that suits this skill"),
  query: z.string().describe("Search words to find good courses for this skill on that platform"),
  note: z.string().describe("Half a sentence on what to look for there"),
});

/** A skill to learn after finishing this path. */
export const NextTopicSchema = z.object({
  topic: z.string().min(2).max(60).describe("A short skill name someone could type to start a new path, e.g. 'Music theory'"),
  why: z.string().min(5).max(200).describe("One sentence on why it's a good next step after this path"),
});

/** Fields every stage has, in all versions of the data. */
const StageCore = z.object({
  title: z.string().describe("Short stage name"),
  duration: z.string().describe('Estimated duration, e.g. "2–3 weeks"'),
  concepts: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe("Specific things to learn, each naming the exact technique, tool or idea plus what to know about it, e.g. 'Decision trees: choosing splits by Gini impurity, and how max_depth controls complexity'"),
  practice: z
    .array(z.string())
    .min(1)
    .max(2)
    .describe("Concrete exercises naming what to use (a dataset, song, tool or scenario) and a measurable goal"),
  checkpoint: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("\"You're ready to move on when…\" criteria: concrete and testable"),
  resources: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe('Kinds of resources, e.g. "an intro video course". Never URLs or invented titles.'),
});

/** Fields every path has, in all versions of the data. */
const PathCore = z.object({
  summary: z.string().describe('One line on what "competent" means for this skill'),
  finishLine: z.object({
    name: z.string().describe("Name of the final project or test"),
    description: z.string().describe("What to do and how it proves competence"),
  }),
  pitfalls: z.array(z.string()).length(3),
});

/** A stage as Claude must generate it: with a video search and a quiz. */
export const GeneratedStageSchema = StageCore.extend({
  videoSearch: z.string().describe("YouTube search words for lessons on this stage, e.g. 'guitar open chords beginner lesson'"),
  quiz: z.array(QuizQuestionSchema).min(2).max(3).describe("Questions to check understanding once the stage is done"),
});

/** The learning path Claude must return. Used for structured output and for validating Claude's response. */
export const GeneratedPathSchema = PathCore.extend({
  stages: z.array(GeneratedStageSchema).min(4).max(6),
  courses: z
    .array(CourseLinkSchema)
    .min(1)
    .max(6)
    .describe("2-3 free platforms and 1-3 paid platforms that suit this skill"),
  nextTopics: z
    .array(NextTopicSchema)
    .min(2)
    .max(4)
    .describe("3 skills to learn after finishing this path: deeper, neighbouring or applied skills that build on it"),
});

/**
 * Cleans up an AI-generated path before validation, so small mistakes don't fail the whole path:
 * - removes anything only hand-verified or server-added data may contain (`featured` links, per-stage `videos`,
 *   `isTemplate`, `webSources`), so a model can never inject URLs;
 * - trims lists that are longer than allowed (e.g. 7 concepts → 6);
 * - drops malformed quiz questions, courses on unknown platforms and malformed next topics.
 * Lists that are too short are left as they are, so validation still rejects them.
 * @param {unknown} raw Parsed JSON from the model.
 * @returns {unknown} The cleaned value (or `raw` unchanged if it isn't an object).
 */
export function repairGeneratedPath(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const { featured: _f, isTemplate: _t, webSources: _w, ...rest } = raw as Record<string, unknown>;
  void _f;
  void _t;
  void _w;
  const path = dropUnknownPlatforms(rest) as Record<string, unknown>;
  /**
   * Shortens a list to at most `max` items (leaves non-lists alone).
   * @param {unknown} v The value that should be a list.
   * @param {number} max The most items to keep.
   * @returns {unknown} The trimmed list, or `v` unchanged.
   */
  const trim = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max) : v);

  if (Array.isArray(path.stages)) {
    path.stages = path.stages.slice(0, 6).map((s) => {
      if (!s || typeof s !== "object") return s;
      const { videos: _v, ...stage } = s as Record<string, unknown>;
      void _v;
      return {
        ...stage,
        concepts: trim(stage.concepts, 6),
        practice: trim(stage.practice, 2),
        checkpoint: trim(stage.checkpoint, 5),
        resources: trim(stage.resources, 3),
        quiz: Array.isArray(stage.quiz)
          ? stage.quiz.filter((q) => QuizQuestionSchema.safeParse(q).success).slice(0, 3)
          : undefined,
      };
    });
  }
  path.pitfalls = trim(path.pitfalls, 3);
  path.courses = trim(path.courses, 6);
  // Next topics are optional when stored, so drop bad ones instead of failing the whole path.
  if (Array.isArray(path.nextTopics)) {
    path.nextTopics = path.nextTopics.filter((t) => NextTopicSchema.safeParse(t).success).slice(0, 3);
    if ((path.nextTopics as unknown[]).length === 0) delete path.nextTopics;
  } else {
    delete path.nextTopics;
  }
  return path;
}

/**
 * Removes course suggestions whose platform isn't in Ladderly's list, so one unknown platform doesn't make
 * a whole path fail validation. (Structured output describes the allowed platforms but can't enforce them.)
 * @param {unknown} raw Parsed JSON from Claude, before validation.
 * @returns {unknown} The same value, with unknown-platform courses filtered out when `courses` is an array.
 */
export function dropUnknownPlatforms(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { courses?: unknown }).courses)) return raw;
  const known = new Set<string>(PLATFORM_IDS);
  const courses = (raw as { courses: unknown[] }).courses.filter(
    (c) => !!c && typeof c === "object" && known.has(String((c as { platform?: unknown }).platform)),
  );
  return { ...raw, courses };
}

/** A specific, hand-verified video (used by the demo paths only; never generated). */
export const FeaturedVideoSchema = z.object({
  title: z.string(),
  channel: z.string(),
  youtubeId: z.string().regex(/^[\w-]{11}$/),
});

/** A specific, hand-verified course page (used by the demo paths only; never generated). */
export const FeaturedCourseSchema = z.object({
  title: z.string(),
  provider: z.string(),
  url: z.url({ protocol: /^https$/ }),
  kind: z.enum(["free", "audit", "paid"]),
});

/**
 * A learning path as the app stores and shows it. The newer fields are optional so that paths saved
 * before they existed still load; `featured` only comes from the hand-checked demo data.
 */
export const LearningPathSchema = PathCore.extend({
  stages: z
    .array(
      StageCore.extend({
        videoSearch: z.string().optional(),
        quiz: z.array(QuizQuestionSchema).optional(),
        /** Hand-verified videos for this stage (demo samples only; never generated). */
        videos: z.array(FeaturedVideoSchema).optional(),
      }),
    )
    .min(4)
    .max(6),
  courses: z.array(CourseLinkSchema).optional(),
  /** Real pages found by web search when the path was made (added by the server, never by the AI). */
  webSources: z
    .array(z.object({ title: z.string().max(200), url: z.url({ protocol: /^https$/ }) }))
    .max(6)
    .optional(),
  /** What to learn after this path (AI-written; older paths fall back to `suggestNextTopics`). */
  nextTopics: z.array(NextTopicSchema).optional(),
  featured: z
    .object({ videos: z.array(FeaturedVideoSchema), courses: z.array(FeaturedCourseSchema) })
    .optional(),
  /** True for the demo's generic template, whose content isn't specific to the topic. */
  isTemplate: z.boolean().optional(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type CourseLink = z.infer<typeof CourseLinkSchema>;
export type NextTopicItem = z.infer<typeof NextTopicSchema>;
export type FeaturedVideo = z.infer<typeof FeaturedVideoSchema>;
export type FeaturedCourse = z.infer<typeof FeaturedCourseSchema>;
export type LearningPath = z.infer<typeof LearningPathSchema>;
export type Stage = LearningPath["stages"][number];

/** Newline-delimited JSON events streamed from /api/path. */
export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "delta"; text: string }
  | { type: "done"; path: LearningPath }
  | { type: "error"; message: string };
