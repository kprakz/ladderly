import { matchTopicTheme } from "./topicTheme";

/** A skill to learn next, with a one-line reason. */
export type NextTopic = { topic: string; why: string };

/** Hand-picked follow-ups per topic family (the same families as the topic background). */
const BY_FAMILY: Record<string, NextTopic[]> = {
  music: [
    { topic: "Music theory", why: "Understand why chords and scales work, so you can learn songs faster and write your own." },
    { topic: "Songwriting", why: "Turn the chords and rhythms you know into songs of your own." },
    { topic: "Ear training", why: "Play what you hear and pick up songs without needing tabs." },
  ],
  ai: [
    { topic: "Deep learning with PyTorch", why: "Go beyond classic models to neural networks for images, text and audio." },
    { topic: "MLOps: deploying machine learning models", why: "Learn to ship, monitor and update models in real products." },
    { topic: "Natural language processing with transformers", why: "Build on your ML skills with the models behind modern chatbots and search." },
  ],
  python: [
    { topic: "Data analysis with pandas", why: "Use Python to clean, explore and chart real-world data." },
    { topic: "Web development with Django", why: "Build and deploy full websites and APIs with the Python you know." },
    { topic: "Machine learning", why: "Apply Python to models that learn from data and make predictions." },
  ],
  code: [
    { topic: "Data structures and algorithms", why: "Write faster code and get ready for technical interviews." },
    { topic: "Git and GitHub collaboration", why: "Work on shared code the way professional teams do." },
    { topic: "System design basics", why: "Learn how real apps are structured, scaled and kept reliable." },
  ],
  speaking: [
    { topic: "Storytelling", why: "Make your talks memorable by turning points into stories." },
    { topic: "Negotiation", why: "Use your speaking confidence to argue for what you need." },
    { topic: "Leadership communication", why: "Run meetings, give feedback and lead people with clarity." },
  ],
  language: [
    { topic: "Conversation practice with native speakers", why: "Turn what you've learned into real, fluent conversations." },
    { topic: "Reading graded stories", why: "Grow your vocabulary naturally with stories at your level." },
    { topic: "Writing short essays", why: "Practise grammar and expression by writing about your own life." },
  ],
  art: [
    { topic: "Colour theory", why: "Choose colours that create mood and make your work stand out." },
    { topic: "Composition", why: "Arrange your pictures so the eye goes exactly where you want." },
    { topic: "Digital illustration", why: "Bring your skills to a tablet with layers, brushes and undo." },
  ],
  photo: [
    { topic: "Photo editing in Lightroom", why: "Get the most out of every shot with colour and light adjustments." },
    { topic: "Lighting for photography", why: "Control light, the thing that makes or breaks a photo." },
    { topic: "Video editing", why: "Tell stories with moving pictures using the eye you've trained." },
  ],
  fitness: [
    { topic: "Nutrition basics", why: "Fuel your training and recover faster." },
    { topic: "Mobility and stretching", why: "Move better and avoid injuries as you train harder." },
    { topic: "Strength training", why: "Build strength that supports every other sport." },
  ],
  cooking: [
    { topic: "Bread baking", why: "Master dough, fermentation and baking, a skill you'll use every week." },
    { topic: "Meal prep", why: "Cook healthy food for the whole week in a couple of hours." },
    { topic: "World cuisines", why: "Use your techniques to explore new flavours and dishes." },
  ],
  science: [
    { topic: "Statistics", why: "Make sense of data and uncertainty in any field." },
    { topic: "Linear algebra", why: "The maths behind graphics, physics and machine learning." },
    { topic: "Scientific computing with Python", why: "Solve real problems by simulating and analysing them in code." },
  ],
  money: [
    { topic: "Investing basics", why: "Make your money grow with index funds, risk and compounding." },
    { topic: "Excel for finance", why: "Build budgets, models and forecasts in spreadsheets." },
    { topic: "Personal finance", why: "Budget, save and plan for the big goals in your life." },
  ],
  writing: [
    { topic: "Editing and revision", why: "Turn first drafts into clear, polished writing." },
    { topic: "Creative nonfiction", why: "Write true stories that read like fiction." },
    { topic: "Copywriting", why: "Write words that persuade, for work or your own projects." },
  ],
  games: [
    { topic: "Chess openings", why: "Start every game with a plan and a solid position." },
    { topic: "Logic puzzles", why: "Sharpen the pattern spotting that strategy games reward." },
    { topic: "Probability for games", why: "Understand the odds behind smart decisions." },
  ],
};

/**
 * Suggests three things to learn after a topic: hand-picked follow-ups for a known topic family, or general
 * next steps (going deeper, building a portfolio, teaching it) otherwise. Used for the demo paths and for older
 * saved paths that don't have AI-written suggestions.
 * @param {string} topic The finished path's topic, e.g. "guitar".
 * @returns {NextTopic[]} Three suggestions.
 */
export function suggestNextTopics(topic: string): NextTopic[] {
  const family = matchTopicTheme(topic)?.id;
  if (family && BY_FAMILY[family]) return BY_FAMILY[family];
  const t = topic.trim();
  return [
    { topic: `Advanced ${t}`, why: `Go deeper into the techniques experienced people use.` },
    { topic: `${t} projects for a portfolio`, why: "Show what you can do with real projects others can see." },
    { topic: `Teaching ${t}`, why: "Explaining it to others is the fastest way to master it." },
  ];
}
