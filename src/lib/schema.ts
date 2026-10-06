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
});

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
  featured: z
    .object({ videos: z.array(FeaturedVideoSchema), courses: z.array(FeaturedCourseSchema) })
    .optional(),
  /** True for the demo's generic template, whose content isn't specific to the topic. */
  isTemplate: z.boolean().optional(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type CourseLink = z.infer<typeof CourseLinkSchema>;
export type FeaturedVideo = z.infer<typeof FeaturedVideoSchema>;
export type FeaturedCourse = z.infer<typeof FeaturedCourseSchema>;
export type LearningPath = z.infer<typeof LearningPathSchema>;
export type Stage = LearningPath["stages"][number];

/** Newline-delimited JSON events streamed from /api/path. */
export type StreamEvent =
  | { type: "delta"; text: string }
  | { type: "done"; path: LearningPath }
  | { type: "error"; message: string };
