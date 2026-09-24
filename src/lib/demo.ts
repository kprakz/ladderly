import type { LearningPath } from "./schema";

/**
 * Demo mode: canned learning paths so the app can run without calling the API.
 * On when DEMO_MODE=true, and always on when no ANTHROPIC_API_KEY is set,
 * so a deployment without a key can never make paid API calls.
 */
export const isDemoMode = () => process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;

const GUITAR: LearningPath = {
  summary: "Play common songs from chord charts with clean chords, steady rhythm and basic barre chords.",
  stages: [
    {
      title: "Guitar foundations",
      duration: "1–2 weeks",
      concepts: ["Parts of the guitar and how to hold it", "Tuning with a tuner", "Reading chord diagrams and tabs"],
      practice: ["Tune up and play each open string cleanly, 5 minutes a day"],
      checkpoint: ["Tune all six strings in under 2 minutes", "Name every open string from low to high"],
      resources: ["a beginner guitar video course", "a free tuner app"],
    },
    {
      title: "Open chords",
      duration: "3–4 weeks",
      concepts: ["E minor, A minor, C, G, D and E major shapes", "Finger placement to avoid muted strings", "One-minute chord change drills"],
      practice: ["Daily one-minute changes between chord pairs, logging your count"],
      checkpoint: ["Play all six chords with every string ringing clearly", "Switch G–C–D at least 30 times in one minute"],
      resources: ["a chord chart reference", "beginner lesson videos"],
    },
    {
      title: "Rhythm and strumming",
      duration: "3–4 weeks",
      concepts: ["Counting beats in 4/4 time", "Down–up strumming patterns", "Playing along with a metronome"],
      practice: ["Strum a four-chord progression at 70 bpm with a metronome", "Play along to one slow song"],
      checkpoint: ["Keep a steady strumming pattern for 2 minutes without stopping", "Play one full song along with the recording"],
      resources: ["a metronome app", "songbooks for beginners"],
    },
    {
      title: "Songs and barre chords",
      duration: "4–6 weeks",
      concepts: ["F and B minor barre shapes", "Movable chord shapes up the neck", "Song structure: verse, chorus, bridge", "Capo use to change key"],
      practice: ["Learn three songs that use at least one barre chord"],
      checkpoint: ["Play an F barre chord with no buzzing strings", "Play three songs start to finish from chord charts"],
      resources: ["an intermediate video course", "a chord and lyrics website"],
    },
  ],
  finishLine: {
    name: "Three-song recording",
    description: "Record yourself playing three full songs, one with barre chords, with clean chord changes and steady time.",
  },
  pitfalls: ["Skipping the metronome and rushing tempo", "Pressing too hard and tiring your hand", "Only practicing the parts you can already play"],
};

const PUBLIC_SPEAKING: LearningPath = {
  summary: "Give a clear, well-structured 10-minute talk to a live audience with confidence and minimal notes.",
  stages: [
    {
      title: "Structure a message",
      duration: "1–2 weeks",
      concepts: ["One core message per talk", "Opening hook, three points, clear close", "Knowing your audience"],
      practice: ["Outline three 3-minute talks on topics you know well"],
      checkpoint: ["Summarize each talk's message in one sentence", "Write an outline that fits on one index card"],
      resources: ["a book on presentation structure", "recorded talks from well-known speakers"],
    },
    {
      title: "Delivery basics",
      duration: "2–3 weeks",
      concepts: ["Pace, pauses and volume", "Reducing filler words", "Eye contact and posture", "Purposeful gestures"],
      practice: ["Record a 3-minute talk daily and review it", "Count your filler words each time"],
      checkpoint: ["Deliver a 3-minute talk with fewer than 5 filler words", "Hold natural pauses of 2 seconds or more"],
      resources: ["your phone's video camera", "a speaking-skills video course"],
    },
    {
      title: "Managing nerves",
      duration: "2 weeks",
      concepts: ["Breathing techniques before speaking", "Reframing anxiety as energy", "Rehearsal as confidence building"],
      practice: ["Give a short talk to one or two friends and ask for feedback"],
      checkpoint: ["Speak to a small group without reading from notes", "Name two techniques that help you calm down"],
      resources: ["a local speaking club", "guided breathing exercises"],
    },
    {
      title: "Slides and audience",
      duration: "2–3 weeks",
      concepts: ["Simple slides that support, not repeat, your words", "Handling questions", "Adapting to audience reactions"],
      practice: ["Build a 7-slide deck for a 7-minute talk", "Practice answering five tough questions"],
      checkpoint: ["Present with slides without reading them aloud", "Answer an unexpected question calmly and concisely"],
      resources: ["presentation design guides", "a speaking club or meetup"],
    },
  ],
  finishLine: {
    name: "10-minute live talk",
    description: "Give a 10-minute talk with a Q&A to at least 10 people and collect written feedback on clarity and confidence.",
  },
  pitfalls: ["Memorizing a script word for word", "Cramming too much text onto slides", "Only rehearsing in your head, never out loud"],
};

const PYTHON: LearningPath = {
  summary: "Write, debug and organize small Python programs that solve real problems using files, libraries and APIs.",
  stages: [
    {
      title: "Python basics",
      duration: "2 weeks",
      concepts: ["Variables, types and operators", "if/else and loops", "Running scripts from the terminal"],
      practice: ["Write a number-guessing game"],
      checkpoint: ["Write a loop that prints FizzBuzz from 1 to 100 without help", "Explain the difference between a list and a string"],
      resources: ["the official Python tutorial", "an interactive beginner course"],
    },
    {
      title: "Functions and data structures",
      duration: "2–3 weeks",
      concepts: ["Defining functions with parameters and returns", "Lists, dictionaries, sets and tuples", "Reading error messages and tracebacks"],
      practice: ["Build a to-do list program that adds, removes and lists items", "Solve 10 beginner coding exercises"],
      checkpoint: ["Write a function that counts word frequencies in a string", "Fix a bug by reading its traceback"],
      resources: ["a coding exercise website", "the official Python docs"],
    },
    {
      title: "Files, modules and libraries",
      duration: "2–3 weeks",
      concepts: ["Reading and writing files, including CSV and JSON", "Importing modules and installing packages with pip", "Virtual environments"],
      practice: ["Write a script that reads a CSV and prints summary statistics"],
      checkpoint: ["Create a virtual environment and install a package", "Load a JSON file, change a value and save it"],
      resources: ["the official docs for the csv and json modules", "a practical Python book for beginners"],
    },
    {
      title: "Real-world projects",
      duration: "3–4 weeks",
      concepts: ["Calling web APIs with requests", "Organizing code into multiple files", "Basic testing with pytest", "Using Git to track changes"],
      practice: ["Build a script that fetches data from a public API and saves a report", "Write tests for three of your functions"],
      checkpoint: ["Put a multi-file project on GitHub with a README", "Run a passing test suite with pytest"],
      resources: ["the requests library docs", "an intro to Git video course", "the pytest docs"],
    },
  ],
  finishLine: {
    name: "Personal automation tool",
    description: "Build and publish a command-line tool that automates a real task for you, with tests and a README.",
  },
  pitfalls: ["Watching tutorials without writing code yourself", "Copying code you don't understand", "Avoiding error messages instead of reading them"],
};

const SAMPLES: { keywords: string[]; path: LearningPath }[] = [
  { keywords: ["guitar"], path: GUITAR },
  { keywords: ["public speaking", "speaking", "presentation", "speech"], path: PUBLIC_SPEAKING },
  { keywords: ["python"], path: PYTHON },
];

/** A generic path for topics without a hand-written sample. */
function genericPath(topic: string): LearningPath {
  const t = topic.trim();
  return {
    summary: `[Demo] Use ${t} confidently on your own for real tasks. (A general template: the demo has tailored paths for guitar, public speaking and python.)`,
    stages: [
      {
        title: `${t} fundamentals`,
        duration: "1–2 weeks",
        concepts: ["Core vocabulary and key ideas", "What the skill looks like when done well", "Setting up tools or materials"],
        practice: [`Spend 20 minutes a day on the simplest ${t} exercises`],
        checkpoint: ["Explain the core ideas in your own words", "Complete a beginner exercise without a guide"],
        resources: ["an intro video course", "a beginner-friendly book or guide"],
      },
      {
        title: "Core techniques",
        duration: "2–4 weeks",
        concepts: ["The 3–5 most-used techniques", "Common beginner mistakes", "Deliberate, focused practice"],
        practice: ["Practice each core technique in short daily sessions"],
        checkpoint: ["Perform each core technique correctly three times in a row", "Spot and fix one of your own mistakes"],
        resources: ["structured lessons or a course", "a practice log or journal"],
      },
      {
        title: "Applied practice",
        duration: "3–4 weeks",
        concepts: ["Combining techniques in realistic tasks", "Getting and using feedback", "Measuring your progress"],
        practice: ["Complete a small real-world task end to end", "Ask someone experienced to review your work"],
        checkpoint: ["Finish a small project without step-by-step help", "Act on at least two pieces of feedback"],
        resources: ["a community forum or local group", "worked examples from experienced practitioners"],
      },
      {
        title: "Independence",
        duration: "3–4 weeks",
        concepts: ["Tackling unfamiliar problems", "Finding answers on your own", "Developing your own style or approach"],
        practice: ["Take on a slightly-too-hard challenge each week"],
        checkpoint: ["Solve a new problem using only reference material", "Teach a basic concept to someone else"],
        resources: ["the official documentation or reference", "advanced tutorials"],
      },
    ],
    finishLine: {
      name: `Capstone ${t} project`,
      description: `Plan and complete a project that uses ${t} for a real purpose, then share it for feedback.`,
    },
    pitfalls: ["Consuming tutorials without practicing", "Trying to learn everything at once", "Skipping the fundamentals"],
  };
}

export function getDemoPath(topic: string): LearningPath {
  const lower = topic.toLowerCase();
  return SAMPLES.find((s) => s.keywords.some((k) => lower.includes(k)))?.path ?? genericPath(topic);
}
