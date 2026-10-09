import { INDIA_SAMPLES } from "./demoIndia";
import { type NextTopic, suggestNextTopics } from "./nextTopics";
import {
  genericExtras,
  GUITAR_EXTRAS,
  MACHINE_LEARNING_EXTRAS,
  type PathExtra,
  PUBLIC_SPEAKING_EXTRAS,
  PYTHON_EXTRAS,
} from "./demoExtras";
import type { LearningPath } from "./schema";

/**
 * Tells whether the app should serve built-in sample paths instead of calling the API.
 * On when DEMO_MODE=true, and always on when no ANTHROPIC_API_KEY is set,
 * so a deployment without a key can never make paid API calls. Server-side only.
 * @returns {boolean} `true` when demo mode is on.
 */
export const isDemoMode = (): boolean => process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;

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

const MACHINE_LEARNING: LearningPath = {
  summary:
    "Frame a prediction problem, clean real data, train and compare models with scikit-learn, evaluate them honestly and explain the results.",
  stages: [
    {
      title: "Python for data and the ML workflow",
      duration: "2–3 weeks",
      concepts: [
        "NumPy arrays: shapes, indexing, vectorised maths and broadcasting",
        "pandas DataFrames: read_csv, filtering rows, groupby, and handling missing values",
        "Matplotlib basics: histograms, scatter plots and line charts",
        "The ML workflow: question → data → features → model → evaluation",
        "Supervised vs unsupervised learning; regression vs classification problems",
      ],
      practice: [
        "Load the Titanic dataset with pandas, fill missing ages with the median, and plot survival rate by sex and passenger class",
        "Write your own mean, standard deviation and min-max scaler with NumPy and check them against np.mean and np.std",
      ],
      checkpoint: [
        "Load an unfamiliar CSV and answer three questions about it with pandas (e.g. average fare per class) in under 20 minutes",
        "Explain, with your own example, whether a problem is regression or classification",
        "Make a histogram and a scatter plot and describe what each one shows",
      ],
      resources: ["the official pandas getting-started tutorials", "a Python-for-data-analysis course", "public datasets to practise on"],
    },
    {
      title: "Core supervised learning techniques",
      duration: "3–4 weeks",
      concepts: [
        "Linear regression: fitting a line by minimising mean squared error, and reading the coefficients",
        "Logistic regression: predicting probabilities with the sigmoid function and a decision threshold",
        "k-nearest neighbours: distance-based predictions, and why feature scaling matters",
        "Decision trees: choosing splits by Gini impurity, and how max_depth controls complexity",
        "Random forests: averaging many trees trained on bootstrapped samples (bagging)",
        "scikit-learn's fit / predict / score pattern and train_test_split",
      ],
      practice: [
        "Predict California house prices with LinearRegression and DecisionTreeRegressor, and compare their mean absolute error",
        "Classify the Titanic passengers with logistic regression, k-NN and a random forest, and record each model's test accuracy in a table",
      ],
      checkpoint: [
        "Train and evaluate a scikit-learn model in a blank notebook without copying code",
        "Explain in two sentences how a decision tree picks a split",
        "Show with your own k-NN results how accuracy changes when you scale the features",
      ],
      resources: ["the scikit-learn user guide and examples", "a beginner machine learning course with notebooks", "visual explainer videos on each algorithm"],
    },
    {
      title: "Evaluating models honestly",
      duration: "2–3 weeks",
      concepts: [
        "Train/test splits, and why you never judge a model on its training data",
        "k-fold cross-validation for a more reliable score",
        "Overfitting vs underfitting, and reading learning curves",
        "Classification metrics: confusion matrix, precision, recall and F1",
        "Regression metrics: MAE, RMSE and R²",
        "Hyperparameter tuning with GridSearchCV, and preventing data leakage with Pipelines",
      ],
      practice: [
        "On the credit-card fraud dataset, compare accuracy with precision and recall, and write down why accuracy is misleading there",
        "Tune a random forest's max_depth and n_estimators with GridSearchCV inside a Pipeline that also scales the features",
      ],
      checkpoint: [
        "Calculate precision and recall by hand from a confusion matrix",
        "Explain data leakage and show how a Pipeline prevents it",
        "Report a model's 5-fold cross-validation score as a mean ± standard deviation",
      ],
      resources: ["the scikit-learn model evaluation guide", "a course chapter on model validation", "worked notebooks on imbalanced data"],
    },
    {
      title: "Feature engineering and unsupervised learning",
      duration: "2–3 weeks",
      concepts: [
        "Encoding categories: one-hot vs ordinal encoding",
        "Imputing missing values with SimpleImputer, and combining steps in a ColumnTransformer",
        "Creating new features from dates, text length and ratios",
        "k-means clustering, and choosing k with the elbow method",
        "PCA: reducing dimensions while keeping most of the variance",
      ],
      practice: [
        "Improve your house-price model's MAE by at least 10% using only feature engineering",
        "Segment customers in a retail dataset with k-means and describe each cluster in plain words",
      ],
      checkpoint: [
        "Build a ColumnTransformer that imputes, scales and one-hot encodes a mixed dataset",
        "Choose k for k-means and justify it with an elbow plot",
        "Explain what the first principal component represents",
      ],
      resources: ["the scikit-learn preprocessing guide", "a hands-on feature engineering tutorial", "public customer or retail datasets"],
    },
    {
      title: "Neural network basics",
      duration: "3–4 weeks",
      concepts: [
        "Neurons, layers, weights and activation functions (ReLU, sigmoid, softmax)",
        "Loss functions and gradient descent, and what the learning rate controls",
        "Backpropagation at an intuitive level",
        "Building and training a small network in PyTorch or Keras",
        "Fighting overfitting in neural nets: validation sets, dropout and early stopping",
      ],
      practice: [
        "Train a small network on the MNIST handwritten digits to above 97% test accuracy",
        "Plot training vs validation loss, and use early stopping to pick the best epoch",
      ],
      checkpoint: [
        "Explain what happens in one step of gradient descent",
        "Build, train and evaluate a two-layer network from a blank notebook",
        "Show on a loss curve what happens when the learning rate is too high",
      ],
      resources: ["the official PyTorch or Keras beginner tutorials", "visual explainer videos on neural networks", "a practical deep learning course"],
    },
  ],
  finishLine: {
    name: "End-to-end prediction project",
    description:
      "Pick a public dataset, frame a prediction question, build a clean Pipeline, compare at least three models with cross-validation, and write a short report on your metrics, mistakes and next steps.",
  },
  pitfalls: [
    "Evaluating on training data, or leaking test data into training",
    "Trusting accuracy on imbalanced data instead of checking precision and recall",
    "Jumping to deep learning before you're comfortable with data cleaning and simple models",
  ],
};

const SAMPLES: { keywords: string[]; path: LearningPath; extra: PathExtra; next?: NextTopic[] }[] = [
  { keywords: ["guitar"], path: GUITAR, extra: GUITAR_EXTRAS },
  { keywords: ["public speaking", "speaking", "presentation", "speech"], path: PUBLIC_SPEAKING, extra: PUBLIC_SPEAKING_EXTRAS },
  // Machine learning comes before Python (and maths) so "machine learning with Python" gets the ML path.
  { keywords: ["machine learning", " ml "], path: MACHINE_LEARNING, extra: MACHINE_LEARNING_EXTRAS },
  // CBSE/NCERT Class 11–12 subjects; Computer Science comes before Python so "class 12 computer science python" gets it.
  ...INDIA_SAMPLES,
  { keywords: ["python"], path: PYTHON, extra: PYTHON_EXTRAS },
];

/**
 * Adds the per-stage video searches and quizzes, course picks and featured links to a demo path.
 * @param {LearningPath} path The base demo path.
 * @param {PathExtra} extra The extra content; its `stages` line up with the path's stages by position.
 * @returns {LearningPath} A new path with everything merged in.
 */
function withExtras(path: LearningPath, extra: PathExtra): LearningPath {
  return {
    ...path,
    stages: path.stages.map((stage, i) => ({ ...stage, ...extra.stages[i] })),
    courses: extra.courses,
    ...(extra.featured ? { featured: extra.featured } : {}),
  };
}

/**
 * Builds a generic 4-stage path for topics without a hand-written sample.
 * @param {string} topic The topic the user typed; it is inserted into titles and text.
 * @returns {LearningPath} A complete path that passes `LearningPathSchema`.
 */
function genericPath(topic: string): LearningPath {
  const t = topic.trim();
  return {
    summary: `Use ${t} confidently on your own for real tasks.`,
    isTemplate: true,
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

/**
 * Picks the demo path for a topic: a hand-written sample if a keyword matches, otherwise the generic template.
 * Either way it includes video searches, quizzes, course links and next-topic suggestions (plus verified featured
 * links for samples).
 * @param {string} topic The topic the user typed (matching ignores case and looks anywhere in the text; the text is
 *   padded with spaces so keywords like " ml " match whole words only).
 * @returns {LearningPath} The matching sample path, or a generic path for the topic.
 */
export function getDemoPath(topic: string): LearningPath {
  const lower = ` ${topic.toLowerCase()} `;
  const sample = SAMPLES.find((s) => s.keywords.some((k) => lower.includes(k)));
  const path = sample ? withExtras(sample.path, sample.extra) : withExtras(genericPath(topic), genericExtras(topic));
  return { ...path, nextTopics: sample?.next ?? suggestNextTopics(topic) };
}
