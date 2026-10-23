// Hand-written career transition demos into AI engineering (and robotics), for "Transition". The engineering → AI
// engineer paths share three middle stages (machine learning, deep learning and LLM applications) and differ in the
// bridge stage, the domain project, what carries over, and the pitfalls. Every video was found with a YouTube search
// for its stage and checked with YouTube oEmbed; every course link was checked to load.
import type { FeaturedCourse, FeaturedVideo, LearningPath, NextTopicItem, QuizQuestion, Stage, TransferableSkill } from "./schema";

/**
 * Builds a verified video entry.
 * @param {string} youtubeId The 11-character YouTube video ID.
 * @param {string} title The video's title.
 * @param {string} channel The channel that published it.
 * @returns {FeaturedVideo} The video object.
 */
export function v(youtubeId: string, title: string, channel: string): FeaturedVideo {
  return { youtubeId, title, channel };
}

/**
 * Builds a quiz question, moving the correct option to a position picked from the question text, so answers are
 * spread across A–D (and stay the same every time) however the options were written.
 * @param {string} question The question text.
 * @param {string[]} options The four options.
 * @param {number} answer Index (0-3) of the correct option in `options`.
 * @param {string} explanation Why the correct option is right.
 * @returns {QuizQuestion} The question object.
 */
export function q(question: string, options: string[], answer: number, explanation: string): QuizQuestion {
  let hash = 0;
  for (const ch of question) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const target = hash % options.length;
  const others = options.filter((_, i) => i !== answer);
  const shuffled = [...others.slice(0, target), options[answer], ...others.slice(target)];
  return { question, options: shuffled, answer: target, explanation };
}

/**
 * Builds a skill that carries over to the new career.
 * @param {string} skill What the learner already has.
 * @param {string} use How it's used in the new career.
 * @returns {TransferableSkill} The entry.
 */
export function bring(skill: string, use: string): TransferableSkill {
  return { skill, use };
}

/**
 * Builds a next-topic suggestion.
 * @param {string} topic A short skill name.
 * @param {string} why Why it's a good next step.
 * @returns {NextTopicItem} The entry.
 */
export function next(topic: string, why: string): NextTopicItem {
  return { topic, why };
}

/**
 * Builds a verified course link.
 * @param {string} title The course or resource name.
 * @param {string} provider Who offers it.
 * @param {string} url Its https page (checked to load).
 * @param {FeaturedCourse["kind"]} kind Free, free to audit, or paid.
 * @returns {FeaturedCourse} The entry.
 */
export function course(title: string, provider: string, url: string, kind: FeaturedCourse["kind"]): FeaturedCourse {
  return { title, provider, url, kind };
}

/** A hand-written career transition: who it's for (keywords on both careers) and the path itself. */
export type TransitionSample = {
  /** Words that identify the current career, matched anywhere in the lowercased, space-padded text. */
  fromKeywords: string[];
  /** Words that identify the target career. */
  toKeywords: string[];
  path: LearningPath;
};

// ---------------------------------------------------------------------------------------------------------------
// Shared pieces of the engineering → AI engineer paths
// ---------------------------------------------------------------------------------------------------------------

const AI_TO = [" ai ", "ai engineer", "ai/ml", "ml engineer", "machine learning", "artificial intelligence", "genai", "generative ai", "llm", "ai developer", "ai engineering"];

const ML_FOUNDATIONS: Stage = {
  title: "Machine learning foundations",
  duration: "4–5 weeks",
  concepts: [
    "Supervised learning: regression vs classification, features and labels",
    "Train, validation and test splits, and why a model must be judged on data it hasn't seen",
    "Overfitting vs underfitting, and how k-fold cross-validation catches it",
    "Core models in scikit-learn: linear and logistic regression, decision trees, random forests, gradient boosting",
    "Metrics: MAE/RMSE for regression; accuracy, precision, recall and F1 for classification",
  ],
  practice: [
    "Predict house prices on the Kaggle 'House Prices' data with linear regression and a random forest, and compare their RMSE with 5-fold cross-validation",
    "Build a scikit-learn Pipeline (scaling + model) for the Titanic data and get above 78% test accuracy",
  ],
  checkpoint: [
    "Explain overfitting and show it on a learning curve",
    "Choose between precision and recall for a given problem and justify it",
    "Train, cross-validate and compare three models in under 50 lines of scikit-learn",
  ],
  resources: ["a beginner machine learning course with exercises", "the scikit-learn user guide", "a public dataset site such as Kaggle"],
  videoSearch: "machine learning for beginners scikit-learn cross validation",
  videos: [
    v("qYNweeDHiyU", "AI, Machine Learning, Deep Learning and Generative AI Explained", "IBM Technology"),
    v("0B5eIE_1vpU", "Scikit-learn Crash Course - Machine Learning Library for Python", "freeCodeCamp.org"),
    v("fSytzGwwBVw", "Machine Learning Fundamentals: Cross Validation", "StatQuest with Josh Starmer"),
  ],
  quiz: [
    q("Your model scores 99% on training data but 70% on test data. What's happening?", ["Underfitting", "Overfitting", "Data leakage from the test set", "The learning rate is too low"], 1, "A big gap between training and test performance means the model memorised the training data: overfitting."),
    q("A cancer screening model must miss as few real cases as possible. Which metric matters most?", ["Precision", "Accuracy", "Recall", "R-squared"], 2, "Recall measures how many real positives are caught, so it's the one to maximise when missing a case is costly."),
  ],
};

const DEEP_LEARNING: Stage = {
  title: "Deep learning and transformers",
  duration: "4–6 weeks",
  concepts: [
    "Neural networks: layers, activations, loss functions and backpropagation",
    "Training in PyTorch: tensors, Dataset/DataLoader, the training loop, GPUs",
    "CNNs for images and transfer learning from a pretrained model such as ResNet",
    "Transformers: embeddings, self-attention and why they power LLMs",
    "Tokens, context windows and how a language model predicts the next token",
  ],
  practice: [
    "Train a PyTorch CNN on CIFAR-10, then fine-tune a pretrained ResNet-18 and compare accuracy",
    "Use a small Hugging Face transformer to classify text sentiment and report its F1 score",
  ],
  checkpoint: [
    "Write a PyTorch training loop from memory",
    "Explain self-attention in plain words with a small example",
    "Fine-tune a pretrained model and beat your from-scratch model",
  ],
  resources: ["a practical deep learning course", "the PyTorch tutorials", "the Hugging Face course"],
  videoSearch: "neural networks pytorch transformers explained",
  videos: [
    v("aircAruvnKk", "But what is a neural network? | Deep learning chapter 1", "3Blue1Brown"),
    v("tHL5STNJKag", "Build Your First Pytorch Model In Minutes! [Tutorial + Code]", "Rob Mulla"),
    v("wjZofJX0v4M", "Transformers, the tech behind LLMs | Deep Learning Chapter 5", "3Blue1Brown"),
  ],
  quiz: [
    q("What does backpropagation compute?", ["The model's accuracy", "The gradient of the loss with respect to every weight", "The best learning rate", "The number of layers needed"], 1, "Backpropagation applies the chain rule to get each weight's gradient, which gradient descent then uses to update it."),
    q("Why does transfer learning usually beat training from scratch on a small dataset?", ["Pretrained models never overfit", "It uses a bigger learning rate", "The pretrained weights already encode useful general features", "It skips the validation set"], 2, "A model pretrained on millions of examples has learned general features (edges, shapes, language patterns) you can reuse."),
  ],
};

const AI_APPS: Stage = {
  title: "Building AI applications with LLMs",
  duration: "4–5 weeks",
  concepts: [
    "Calling LLM APIs: system prompts, structured (JSON) outputs, temperature and token costs",
    "RAG (retrieval-augmented generation): chunking, embeddings, a vector database and grounding answers in sources",
    "Agents and tool calling: letting a model call functions and APIs safely",
    "Evals: test sets, automatic checks and LLM-as-a-judge to measure quality before shipping",
    "Shipping: a FastAPI backend, Docker, logging, and guarding against prompt injection",
  ],
  practice: [
    "Build a RAG chatbot over a set of PDFs you know well (e.g. your old field's standards or manuals) that cites the page for every answer",
    "Write an eval set of 30 questions with expected answers and track your app's score as you change prompts and chunking",
  ],
  checkpoint: [
    "Your RAG app answers with citations and says 'I don't know' when the answer isn't in the documents",
    "You can show an eval score improving after a change",
    "The app runs in Docker behind an API",
  ],
  resources: ["an LLM provider's API documentation", "a free course on building with LLMs", "a vector database's quickstart guide"],
  videoSearch: "RAG tutorial AI agents tool calling LLM evals",
  videos: [
    v("T-D1OfcDW1M", "What is Retrieval-Augmented Generation (RAG)?", "IBM Technology"),
    v("bTMPwUgLZf0", "Build an AI Agent From Scratch in Python - Tutorial for Beginners", "Tech With Tim"),
    v("a3SMraZWNNs", "How to Systematically Setup LLM Evals (Metrics, Unit Tests, LLM-as-a-Judge)", "Dave Ebbelaar"),
  ],
  quiz: [
    q("What problem does RAG mainly solve?", ["It makes models train faster", "It grounds answers in your own, up-to-date documents", "It removes the need for prompts", "It shrinks the model"], 1, "RAG retrieves relevant passages and puts them in the prompt, so answers are based on your documents instead of the model's memory."),
    q("Why write evals for an LLM app?", ["To measure quality objectively before and after each change", "Because APIs require them", "To reduce token costs", "To train the base model"], 0, "Without a fixed test set you can't tell whether a prompt or retrieval change made the app better or worse."),
  ],
};

const AI_JOB_VIDEO = v("9WIsvEswZTk", "5 AI Engineer Projects to Build in 2026 | Ex-Google, Microsoft", "Aishwarya Srinivasan");

const AI_COURSES = [
  { platform: "coursera" as const, query: "machine learning specialization", note: "Andrew Ng's beginner ML course, free to audit" },
  { platform: "youtube" as const, query: "AI engineer roadmap projects", note: "project walkthroughs and career advice" },
  { platform: "freecodecamp" as const, query: "machine learning with python", note: "free hands-on ML lessons" },
  { platform: "udemy" as const, query: "LLM engineering RAG agents", note: "project-based courses on building AI apps" },
];

const AI_FEATURED_COURSES = [
  course("Machine Learning Specialization", "Stanford & DeepLearning.AI on Coursera", "https://www.coursera.org/specializations/machine-learning-introduction", "audit"),
  course("Machine Learning Crash Course", "Google", "https://developers.google.com/machine-learning/crash-course", "free"),
  course("Practical Deep Learning for Coders", "fast.ai", "https://course.fast.ai/", "free"),
  course("Hugging Face Learn (LLM, agents and more)", "Hugging Face", "https://huggingface.co/learn", "free"),
  course("Short courses on building with AI", "DeepLearning.AI", "https://www.deeplearning.ai/courses", "free"),
  course("AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents", "Udemy", "https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/", "paid"),
  course("Associate AI Engineer for Developers (career track)", "DataCamp", "https://www.datacamp.com/tracks/associate-ai-engineer-for-developers", "paid"),
];

const AI_NEXT = [
  next("LLM fine-tuning", "Adapt open models to your own data when prompting and RAG aren't enough."),
  next("MLOps", "Deploy, monitor and retrain models reliably, the skill that turns prototypes into products."),
  next("Computer vision", "Apply deep learning to images and video, from inspection to robotics."),
];

/** What every engineering → AI engineer path needs to say differently. */
type EngineeringSpec = {
  from: string;
  fromKeywords: string[];
  summary: string;
  transferable: TransferableSkill[];
  bridge: Stage;
  domain: Omit<Stage, "videos"> & { videos: FeaturedVideo[] };
  finish: LearningPath["finishLine"];
  pitfalls: [string, string, string];
  extraCourses?: FeaturedCourse[];
  featuredVideos: FeaturedVideo[];
  nextTopics?: NextTopicItem[];
};

/**
 * Builds an engineering → AI engineer path: the engineer's own bridge stage, the three shared AI stages, then a
 * project in their own field plus job preparation.
 * @param {EngineeringSpec} spec What's specific to this kind of engineer.
 * @returns {TransitionSample} The sample.
 */
function engineeringToAi(spec: EngineeringSpec): TransitionSample {
  return {
    fromKeywords: spec.fromKeywords,
    toKeywords: AI_TO,
    path: {
      summary: spec.summary,
      transferableSkills: spec.transferable,
      stages: [spec.bridge, ML_FOUNDATIONS, DEEP_LEARNING, AI_APPS, spec.domain],
      finishLine: spec.finish,
      pitfalls: spec.pitfalls,
      courses: AI_COURSES,
      featured: { videos: spec.featuredVideos, courses: [...AI_FEATURED_COURSES, ...(spec.extraCourses ?? [])] },
      nextTopics: spec.nextTopics ?? AI_NEXT,
    },
  };
}

/** Job preparation shared by the engineering paths' last stage. */
const JOB_CONCEPTS = [
  "A portfolio of 3 projects on GitHub, each with a README: the problem, your approach, results and a demo",
  "Rewriting your CV and LinkedIn to lead with AI projects and tell your engineering background as an advantage",
  "AI engineer interviews: Python coding, ML fundamentals, and an LLM system design round (e.g. 'design a support chatbot')",
];

// ---------------------------------------------------------------------------------------------------------------
// The engineering → AI engineer samples
// ---------------------------------------------------------------------------------------------------------------

const ELECTRONICS = engineeringToAi({
  from: "electronics engineer",
  fromKeywords: ["electronic", " ece ", "embedded", "vlsi", "communication engineer", "instrumentation", "telecom", "hardware engineer"],
  summary: "Go from electronics engineer to AI engineer: build, evaluate and ship ML and LLM applications, with an edge in AI on hardware and sensor data.",
  transferable: [
    bring("Signals and systems, Fourier transforms and filtering", "Turning raw sensor and audio signals into features, and understanding convolutions in CNNs."),
    bring("Linear algebra and probability from your degree", "The maths behind every model, from regression to attention in transformers."),
    bring("Embedded C and microcontrollers", "Running models on edge devices (TinyML), a niche few AI engineers can fill."),
    bring("Debugging hardware systematically", "Debugging data pipelines and models: isolate, measure, change one thing at a time."),
  ],
  bridge: {
    title: "Python and ML maths for an electronics engineer",
    duration: "3–4 weeks",
    concepts: [
      "Python for engineers: NumPy arrays and vectorised maths instead of loops",
      "Pandas for tabular data and Matplotlib for plotting signals and results",
      "Revising linear algebra for ML: vectors, matrix multiplication, dot products as similarity",
      "Gradients and the chain rule, the basis of how models learn",
      "FFT features: turning time-domain sensor signals into inputs a model can use",
    ],
    practice: ["Load an accelerometer or audio dataset in NumPy, compute its FFT, and plot the frequency features that separate two classes"],
    checkpoint: ["Rewrite a MATLAB or C signal-processing routine in vectorised NumPy", "Explain a matrix multiplication as a set of dot products"],
    resources: ["the NumPy and Pandas documentation", "a linear algebra refresher video series", "a Python course for engineers"],
    videoSearch: "numpy for engineers linear algebra for machine learning fft",
    videos: [
      v("DcfYgePyedM", "NumPy Tutorial: For Physicists, Engineers, and Mathematicians", "Mr. P Solver"),
      v("-KKxtHwxKhE", "How Linear Algebra Powers Machine Learning (ML)", "IBM Technology"),
      v("spUNpyF58BY", "But what is the Fourier Transform?  A visual introduction.", "3Blue1Brown"),
    ],
    quiz: [
      q("Why is vectorised NumPy code usually much faster than a Python for loop?", ["It uses less memory", "The work runs in optimised compiled code over whole arrays at once", "It skips floating-point maths", "It runs on the GPU by default"], 1, "NumPy pushes the loop into optimised C code operating on whole arrays, avoiding Python's per-item overhead."),
      q("You have 1 second of vibration data sampled at 1 kHz. What does an FFT give you?", ["The signal's average", "The amplitude at each frequency, useful as model features", "A cleaner time signal", "The sampling rate"], 1, "The FFT converts the time signal into its frequency content, which often separates healthy from faulty machines."),
    ],
  },
  domain: {
    title: "Edge AI project and getting hired",
    duration: "4–6 weeks",
    concepts: [
      "TinyML: training a small model, quantising it to 8-bit, and running it on a microcontroller",
      "Edge Impulse or TensorFlow Lite for Microcontrollers to deploy to an ESP32 or Arduino Nano 33 BLE",
      ...JOB_CONCEPTS,
    ],
    practice: [
      "Build a keyword-spotting or gesture-recognition model, deploy it to a microcontroller, and measure accuracy, latency and memory",
      "Publish your three projects (an ML model, a RAG app and the edge AI device) with READMEs and a short demo video",
    ],
    checkpoint: ["A model runs on a microcontroller within its RAM and timing budget", "Your portfolio and LinkedIn tell the electronics → AI story", "You've done two mock AI system design interviews"],
    resources: ["the Edge Impulse documentation", "the TensorFlow Lite for Microcontrollers guide", "AI engineer interview guides"],
    videoSearch: "tinyml arduino edge impulse tutorial",
    videos: [
      v("BzzqYNYOcWc", "Intro to TinyML Part 1: Training a Neural Network for Arduino in TensorFlow | Digi-Key Electronics", "DigiKey"),
      v("RuPjvJepX98", "What is Edge Impulse?", "Edge Impulse"),
      AI_JOB_VIDEO,
    ],
    quiz: [
      q("Why quantise a model to 8-bit integers before running it on a microcontroller?", ["To make it more accurate", "To cut memory and speed up inference on limited hardware", "Because microcontrollers can't store floats at all", "To encrypt the weights"], 1, "Int8 weights are 4× smaller than float32 and integer maths is fast on small chips, usually with only a small accuracy loss."),
      q("In an AI engineer interview you're asked to 'design a support chatbot'. What should you cover first?", ["Which GPU to buy", "Requirements, data sources, retrieval, evaluation and failure cases", "The exact prompt wording", "Your favourite framework"], 1, "System design rounds reward clarifying requirements and walking through data, retrieval, evals and failure handling before details."),
    ],
  },
  finish: {
    name: "Edge AI + LLM portfolio",
    description: "Three published projects: a cross-validated ML model, a RAG app with evals running in Docker, and a model deployed on a microcontroller, plus a CV that tells your switch from electronics.",
  },
  pitfalls: [
    "Spending months on maths theory before writing any model code",
    "Hiding your hardware background when edge AI and sensor ML are where you stand out",
    "Only following tutorials instead of building projects on your own data",
  ],
  extraCourses: [course("Edge Impulse documentation and tutorials", "Edge Impulse", "https://docs.edgeimpulse.com/", "free")],
  featuredVideos: [
    v("8c8Rrhd2oxo", "How I'd Become an AI Engineer in 2026 (Even with No CS Degree)", "Marina Wyss - AI & Machine Learning"),
    v("oHu_xWe0agI", "A Practical Guide To Becoming An AI Engineer (2026)", "CodeHead"),
  ],
  nextTopics: [
    next("TinyML", "Go deeper into running models on microcontrollers and sensors."),
    next("Computer vision", "Apply deep learning to cameras, from inspection to robotics."),
    next("LLM fine-tuning", "Adapt open models to your own data when prompting and RAG aren't enough."),
  ],
});

const MECHANICAL = engineeringToAi({
  from: "mechanical engineer",
  fromKeywords: ["mechanical", "automobile", "automotive", "production engineer", "manufacturing", "aerospace", "aeronautical", "industrial engineer", "mechatronics"],
  summary: "Go from mechanical engineer to AI engineer: build and ship ML and LLM applications, with an edge in industrial AI like predictive maintenance and simulation.",
  transferable: [
    bring("Physics, dynamics and simulation (FEA/CFD)", "Physics-informed ML and fast surrogate models that replace slow simulations."),
    bring("Engineering maths: calculus, linear algebra and numerical methods", "Understanding gradient descent, optimisation and model behaviour."),
    bring("MATLAB and data from tests and sensors", "Cleaning and modelling real measurement data, the daily work of ML."),
    bring("Knowledge of machines and manufacturing", "Spotting valuable industrial AI problems: failures, quality and downtime."),
  ],
  bridge: {
    title: "Python, data and statistics for a mechanical engineer",
    duration: "3–4 weeks",
    concepts: [
      "Python instead of MATLAB: NumPy arrays, functions and plotting",
      "Pandas for test and sensor data: cleaning, resampling and joining",
      "Statistics for ML: distributions, mean/variance, correlation and sampling",
      "From numerical methods to optimisation: minimising a loss function",
    ],
    practice: ["Port one of your MATLAB analyses (e.g. a test-rig dataset) to Python with Pandas and Matplotlib, and reproduce its plots"],
    checkpoint: ["Load, clean and plot a messy sensor CSV in Pandas", "Explain correlation vs causation with an example from a machine"],
    resources: ["a Python course for engineers", "the Pandas documentation", "a statistics crash course"],
    videoSearch: "python for mechanical engineers statistics for machine learning",
    videos: [
      v("TjVS1aydCd0", "Python for Mechanical Engineers: Complete Beginners Course", "GaugeHow AI"),
      v("rZ-pLx5P5C0", "MATLAB vs Python for Engineers", "Vincent Stevenson"),
      v("jmLid2x9eKg", "Supervised Machine Learning: Crash Course Statistics #36", "CrashCourse"),
    ],
    quiz: [
      q("Two sensor readings rise together on a machine. What can you conclude?", ["One causes the other", "They're correlated; causation needs more evidence", "The sensors are broken", "Nothing at all"], 1, "Correlation shows they move together; a shared cause (like load) could drive both."),
      q("In Pandas, what's the usual first step with a new sensor CSV?", ["Train a model on it", "Check its shape, types, missing values and ranges", "Delete all rows with gaps", "Convert it to Excel"], 1, "Inspecting the data first catches unit errors, gaps and outliers before they mislead a model."),
    ],
  },
  domain: {
    title: "Industrial AI project and getting hired",
    duration: "4–6 weeks",
    concepts: [
      "Predictive maintenance: predicting remaining useful life or failures from vibration and temperature data",
      "Physics-informed and surrogate models: fast ML approximations of FEA/CFD simulations",
      ...JOB_CONCEPTS,
    ],
    practice: [
      "Train a model on the NASA turbofan engine (C-MAPSS) data to predict remaining useful life, and report RMSE against a simple baseline",
      "Publish your three projects (the ML model, the RAG app and the predictive maintenance project) with READMEs",
    ],
    checkpoint: ["Your predictive maintenance model beats a naive baseline and you can explain its errors", "Your CV and LinkedIn tell the mechanical → AI story", "You've done two mock AI system design interviews"],
    resources: ["public industrial datasets such as NASA's prognostics data", "physics-informed ML lectures", "AI engineer interview guides"],
    videoSearch: "predictive maintenance machine learning physics informed neural networks",
    videos: [
      v("BApzsgq32mM", "How to Use Machine Learning for Predictive Maintenance", "RealPars"),
      v("-zrY7P2dVC4", "Physics Informed Neural Networks (PINNs) [Physics Informed Machine Learning]", "Steve Brunton"),
      AI_JOB_VIDEO,
    ],
    quiz: [
      q("What does a predictive maintenance model usually predict?", ["The machine's price", "Remaining useful life or the chance of failure soon", "The best operator", "The CAD geometry"], 1, "It uses sensor history to estimate when a part will fail, so maintenance happens just in time."),
      q("Why use an ML surrogate model for a CFD simulation?", ["It's always more accurate", "It gives near-instant approximate answers for design exploration", "It removes the need for physics", "It needs no training data"], 1, "Once trained on simulation runs, a surrogate predicts results in milliseconds, so you can explore many designs quickly."),
    ],
  },
  finish: {
    name: "Industrial AI portfolio",
    description: "Three published projects: a cross-validated ML model, a RAG app over engineering documents with evals, and a predictive maintenance model on real machine data, plus a CV that tells your switch from mechanical engineering.",
  },
  pitfalls: [
    "Trying to learn every algorithm before building one end-to-end project",
    "Leaving your mechanical knowledge out, when industrial AI roles want exactly that",
    "Staying in MATLAB: almost all AI tooling and jobs are in Python",
  ],
  extraCourses: [course("Mathematics for Machine Learning", "Imperial College London on Coursera", "https://www.coursera.org/specializations/mathematics-machine-learning", "audit")],
  featuredVideos: [
    v("8c8Rrhd2oxo", "How I'd Become an AI Engineer in 2026 (Even with No CS Degree)", "Marina Wyss - AI & Machine Learning"),
    v("oHu_xWe0agI", "A Practical Guide To Becoming An AI Engineer (2026)", "CodeHead"),
  ],
  nextTopics: [
    next("Physics-informed machine learning", "Combine your physics with ML for simulations and digital twins."),
    next("MLOps", "Deploy and monitor models on real production lines."),
    next("Computer vision", "Automate visual inspection and quality control."),
  ],
});

const CIVIL = engineeringToAi({
  from: "civil engineer",
  fromKeywords: ["civil", "structural", "construction", "site engineer", "geotechnical", "transportation engineer", "highway engineer"],
  summary: "Go from civil engineer to AI engineer: build and ship ML and LLM applications, with an edge in AI for construction, infrastructure and inspection.",
  transferable: [
    bring("Structural analysis and engineering maths", "Understanding models as functions you can test, and reasoning about errors and safety margins."),
    bring("Working with codes, standards and project documents", "Building RAG assistants that answer from standards and contracts with citations."),
    bring("Site and inspection experience", "Knowing which inspection, safety and scheduling problems are worth automating."),
    bring("Excel, AutoCAD and project data", "Cleaning and modelling real project data, the daily work of ML."),
  ],
  bridge: {
    title: "Python and data skills for a civil engineer",
    duration: "3–4 weeks",
    concepts: [
      "Python basics and NumPy: replacing spreadsheet formulas with code",
      "Pandas for project, material-test and sensor data",
      "Plotting results with Matplotlib",
      "Linear algebra refresher: vectors, matrices and dot products in ML",
    ],
    practice: ["Rewrite one of your Excel calculations (e.g. concrete mix or load tables) in Python and plot the results"],
    checkpoint: ["Automate a repetitive spreadsheet task with a Python script", "Load and summarise a material-test dataset in Pandas"],
    resources: ["a Python course for engineers", "the Pandas documentation", "a linear algebra refresher"],
    videoSearch: "python for civil engineers numpy pandas",
    videos: [
      v("GvMmazGi0jU", "How to Use Python for Structural and Civil Engineers", "StrucWeb"),
      v("OmIjuvEkCJ0", "Lecture 1: Python Programming for Civil Engineers: Introduction", "Dr. Mohammad Adil Civil Engineering"),
      v("-KKxtHwxKhE", "How Linear Algebra Powers Machine Learning (ML)", "IBM Technology"),
    ],
    quiz: [
      q("What's the main advantage of moving a spreadsheet calculation into Python?", ["It looks nicer", "It's repeatable, testable and can run on thousands of cases automatically", "It needs no inputs", "It's always more accurate"], 1, "Code can be versioned, tested and run over many inputs at once, which spreadsheets make hard."),
      q("In Pandas, which object holds a table of rows and columns?", ["Series", "DataFrame", "ndarray", "dict"], 1, "A DataFrame is Pandas' table; a Series is a single column."),
    ],
  },
  domain: {
    title: "Infrastructure AI project and getting hired",
    duration: "4–6 weeks",
    concepts: [
      "Computer vision for inspection: detecting and segmenting cracks in concrete images",
      "AI across construction: structural health monitoring, scheduling and document assistants",
      ...JOB_CONCEPTS,
    ],
    practice: [
      "Train a crack-detection model on a public concrete crack image dataset, report precision and recall, and show its mistakes",
      "Publish your three projects (the ML model, a RAG assistant over building codes and the crack detector) with READMEs",
    ],
    checkpoint: ["Your crack detector's precision and recall are reported on a held-out test set", "Your CV and LinkedIn tell the civil → AI story", "You've done two mock AI system design interviews"],
    resources: ["public concrete crack image datasets", "a computer vision tutorial using a pretrained model", "AI engineer interview guides"],
    videoSearch: "concrete crack detection deep learning AI in civil engineering",
    videos: [
      v("vFGxM2KLs10", "YOLOv7 Segmentation | Concrete Crack Detection | Google Colab | step-by-step Tutorial", "Roboflow"),
      v("LEA0viGoi1w", "AI Is Replacing Structural Engineers? Here Are 5 Examples.", "Structural Basics"),
      AI_JOB_VIDEO,
    ],
    quiz: [
      q("A crack detector misses real cracks. Which metric is low?", ["Precision", "Recall", "Accuracy on blank images", "Inference speed"], 1, "Missed real cracks are false negatives, which lower recall."),
      q("What makes a RAG assistant over building codes trustworthy?", ["It answers every question", "It cites the clause it used and refuses when the codes don't cover it", "It uses the biggest model", "It never uses retrieval"], 1, "Citations let engineers check answers, and refusing outside the documents avoids made-up requirements."),
    ],
  },
  finish: {
    name: "Infrastructure AI portfolio",
    description: "Three published projects: a cross-validated ML model, a RAG assistant over building codes with evals, and a concrete crack detector with honest error analysis, plus a CV that tells your switch from civil engineering.",
  },
  pitfalls: [
    "Assuming you need a computer science degree first: projects matter more",
    "Ignoring construction and infrastructure AI, where your site knowledge is rare",
    "Reporting only accuracy on imbalanced inspection images",
  ],
  extraCourses: [course("Mathematics for Machine Learning", "Imperial College London on Coursera", "https://www.coursera.org/specializations/mathematics-machine-learning", "audit")],
  featuredVideos: [
    v("8c8Rrhd2oxo", "How I'd Become an AI Engineer in 2026 (Even with No CS Degree)", "Marina Wyss - AI & Machine Learning"),
    v("oHu_xWe0agI", "A Practical Guide To Becoming An AI Engineer (2026)", "CodeHead"),
  ],
  nextTopics: [
    next("Computer vision", "Go deeper into inspection, drones and site monitoring."),
    next("Geospatial data science", "Model infrastructure, traffic and land use with maps and satellite data."),
    next("MLOps", "Deploy and monitor models used on real projects."),
  ],
});

const ELECTRICAL = engineeringToAi({
  from: "electrical engineer",
  fromKeywords: ["electrical", " eee ", "power engineer", "power system", "electrical and electronics"],
  summary: "Go from electrical engineer to AI engineer: build and ship ML and LLM applications, with an edge in energy, grids and batteries.",
  transferable: [
    bring("Circuits, control and power systems", "Framing energy problems (load, faults, batteries) as prediction tasks."),
    bring("Signals, transforms and time-series thinking", "Feature engineering and forecasting on sensor and meter data."),
    bring("Engineering maths and MATLAB", "Understanding optimisation and model behaviour; moving quickly to NumPy."),
    bring("Safety-critical mindset", "Testing models carefully and planning for failure cases."),
  ],
  bridge: {
    title: "Python and ML maths for an electrical engineer",
    duration: "3–4 weeks",
    concepts: [
      "Python and NumPy for vectorised maths",
      "Pandas for time series: timestamps, resampling and rolling windows",
      "Linear algebra refresher for ML",
      "The DFT/FFT and frequency features in Python",
    ],
    practice: ["Load a year of smart-meter or load data in Pandas, resample it to hourly, and plot daily and weekly patterns"],
    checkpoint: ["Resample and plot a time series with Pandas", "Compute FFT features from a signal in NumPy"],
    resources: ["the Pandas time series guide", "a NumPy tutorial for engineers", "a linear algebra refresher"],
    videoSearch: "numpy pandas time series linear algebra machine learning",
    videos: [
      v("DcfYgePyedM", "NumPy Tutorial: For Physicists, Engineers, and Mathematicians", "Mr. P Solver"),
      v("-KKxtHwxKhE", "How Linear Algebra Powers Machine Learning (ML)", "IBM Technology"),
      v("QmgJmh2I3Fw", "Understanding the Discrete Fourier Transform and the FFT", "MATLAB"),
    ],
    quiz: [
      q("You need hourly averages from minute-level meter data in Pandas. Which method fits?", ["groupby on the column names", "resample('h').mean()", "drop_duplicates()", "pivot()"], 1, "resample groups a time-indexed series into fixed periods, here hours, and aggregates them."),
      q("Why are 'hour of day' and 'day of week' good features for load forecasting?", ["They're always numeric", "Electricity demand follows strong daily and weekly cycles", "They remove the need for history", "They're required by scikit-learn"], 1, "Demand repeats daily and weekly, so these calendar features explain a lot of the variation."),
    ],
  },
  domain: {
    title: "Energy AI project and getting hired",
    duration: "4–6 weeks",
    concepts: [
      "Load forecasting with gradient boosting (XGBoost) and time-based validation",
      "Avoiding leakage in time series: always train on the past and test on the future",
      ...JOB_CONCEPTS,
    ],
    practice: [
      "Forecast next-day electricity demand on a public dataset with XGBoost, validate on a later period, and compare with a 'same hour last week' baseline",
      "Publish your three projects (the ML model, the RAG app and the load forecaster) with READMEs",
    ],
    checkpoint: ["Your forecaster beats the naive baseline on a future test period", "Your CV and LinkedIn tell the electrical → AI story", "You've done two mock AI system design interviews"],
    resources: ["public energy datasets", "a time series forecasting tutorial", "AI engineer interview guides"],
    videoSearch: "electricity load forecasting xgboost time series python",
    videos: [
      v("vV12dGe_Fho", "Time Series Forecasting with XGBoost - Use python and machine learning to predict energy consumption", "Rob Mulla"),
      v("fxx_E0ojKrc", "Time Series Forecasting in Python – Tutorial for Beginners", "freeCodeCamp.org"),
      AI_JOB_VIDEO,
    ],
    quiz: [
      q("Why not use random k-fold cross-validation for a load forecast?", ["It's too slow", "Shuffling lets the model see the future, so scores look better than reality", "XGBoost doesn't support it", "It needs more data"], 1, "In time series you must validate on later periods, or future information leaks into training."),
      q("What's a sensible baseline for next-day demand?", ["Zero", "The same hour on the same day last week", "The yearly average for every hour", "A random number"], 1, "A seasonal naive baseline is easy and surprisingly strong; your model must beat it to be useful."),
    ],
  },
  finish: {
    name: "Energy AI portfolio",
    description: "Three published projects: a cross-validated ML model, a RAG app with evals, and a load forecaster that beats a seasonal baseline on future data, plus a CV that tells your switch from electrical engineering.",
  },
  pitfalls: [
    "Validating time series with shuffled data and trusting inflated scores",
    "Overlooking energy and grid AI roles where your background is a strong advantage",
    "Collecting certificates instead of shipping projects",
  ],
  featuredVideos: [
    v("8c8Rrhd2oxo", "How I'd Become an AI Engineer in 2026 (Even with No CS Degree)", "Marina Wyss - AI & Machine Learning"),
    v("oHu_xWe0agI", "A Practical Guide To Becoming An AI Engineer (2026)", "CodeHead"),
  ],
  nextTopics: [
    next("Time series forecasting", "Go deeper into forecasting demand, prices and renewables."),
    next("MLOps", "Deploy and monitor models in production energy systems."),
    next("Reinforcement learning", "Optimise control problems like battery charging and grid balancing."),
  ],
});

const SOFTWARE = engineeringToAi({
  from: "software engineer",
  fromKeywords: ["software", "developer", "programmer", "web dev", "full stack", "fullstack", "full-stack", "backend", "frontend", "front-end", " sde ", " swe ", "coder"],
  summary: "Go from software engineer to AI engineer: add the ML and maths foundations you're missing, then build, evaluate and ship production LLM applications.",
  transferable: [
    bring("Production coding: Python or another language, Git, testing and code review", "Most AI engineering is software engineering: APIs, pipelines, tests and reliability."),
    bring("APIs, databases and system design", "Designing RAG systems, agents and their data stores at scale."),
    bring("Cloud, Docker and CI/CD", "Deploying, monitoring and scaling models and AI services (MLOps)."),
    bring("Debugging and performance tuning", "Finding why a pipeline or model misbehaves, and making inference fast and cheap."),
  ],
  bridge: {
    title: "The maths and ML mindset a developer is missing",
    duration: "3–4 weeks",
    concepts: [
      "Linear algebra you'll actually use: vectors, matrices, dot products and embeddings",
      "Calculus for ML: derivatives, gradients and the chain rule",
      "Probability and statistics: distributions, expectation and why models output probabilities",
      "The ML mindset: experiments, metrics and accepting that outputs are uncertain",
    ],
    practice: ["Implement gradient descent for linear regression from scratch in NumPy and check it matches scikit-learn's answer"],
    checkpoint: ["Explain cosine similarity between two embeddings", "Implement and debug gradient descent from scratch"],
    resources: ["a maths for ML video series", "the Mathematics for Machine Learning course", "the NumPy documentation"],
    videoSearch: "math for machine learning programmers linear algebra",
    videos: [
      v("KgolhE7p-KY", "How To Learn Math for Machine Learning FAST (Even With Zero Math Background)", "Marina Wyss - AI & Machine Learning"),
      v("fNk_zzaMoSs", "Vectors | Chapter 1, Essence of linear algebra", "3Blue1Brown"),
      v("ncvYo9tvP6o", "How to Transition from Software Engineering to AI Engineering", "Marina Wyss - AI & Machine Learning"),
    ],
    quiz: [
      q("Two text embeddings have a cosine similarity close to 1. What does that mean?", ["The texts are identical in length", "They point the same way: very similar meaning", "They're unrelated", "One is negative"], 1, "Cosine similarity measures the angle between vectors; close to 1 means the meanings are very similar."),
      q("What does a gradient tell gradient descent?", ["The final answer", "Which direction increases the loss fastest, so it steps the other way", "How many epochs to run", "The test accuracy"], 1, "The gradient points uphill; stepping against it lowers the loss."),
    ],
  },
  domain: {
    title: "Production AI: fine-tuning, MLOps and getting hired",
    duration: "4–6 weeks",
    concepts: [
      "MLOps: experiment tracking, model registries, CI/CD for models and monitoring drift",
      "Fine-tuning open models with LoRA/QLoRA, and when it beats prompting or RAG",
      "Serving models with FastAPI and Docker; latency and cost budgets",
      ...JOB_CONCEPTS.slice(1),
    ],
    practice: [
      "Fine-tune a small open model with LoRA on a narrow task, compare it with prompting using your eval set, and serve the winner behind a FastAPI endpoint",
      "Publish three projects (the ML model, the RAG app with evals, the fine-tuned model) with READMEs and a live demo",
    ],
    checkpoint: ["You can explain when to prompt, use RAG or fine-tune", "A model is served in Docker with logging and a latency budget", "Your CV leads with AI projects and production engineering"],
    resources: ["an MLOps course", "the Hugging Face PEFT documentation", "AI engineer interview guides"],
    videoSearch: "MLOps explained LoRA fine tuning deploy model fastapi docker",
    videos: [
      v("biqYkVf-a7Y", "MLOps Explained - What It Is, Why You Need It and How It Works", "TechWorld with Nana"),
      v("t1caDsMzWBk", "LoRA & QLoRA Fine-tuning Explained In-Depth", "Mark Hennings"),
      v("pJ_nCklQ65w", "How to Deploy ML Solutions with FastAPI, Docker, & AWS", "Shaw Talebi"),
    ],
    quiz: [
      q("Why is LoRA popular for fine-tuning large models?", ["It trains every weight faster", "It trains small low-rank adapters, so it needs far less memory and compute", "It removes the need for data", "It only works on images"], 1, "LoRA freezes the base model and learns small adapter matrices, cutting memory and cost dramatically."),
      q("Your model's accuracy slowly drops in production. What's the likely cause to check first?", ["The GPU is overheating", "Data drift: real inputs have changed from the training data", "The API key expired", "Too many tests"], 1, "Monitoring for drift catches when production data no longer looks like what the model learned from."),
    ],
  },
  finish: {
    name: "Production AI portfolio",
    description: "Three published, deployed projects: a cross-validated ML model, a RAG app with an eval suite, and a LoRA fine-tuned model served behind an API, plus a CV that leads with AI work and production engineering.",
  },
  pitfalls: [
    "Skipping the ML fundamentals and only wiring up LLM APIs",
    "Shipping LLM features without evals, so quality can't be measured",
    "Fine-tuning by default when better prompts or RAG would do",
  ],
  extraCourses: [course("MLOps | Machine Learning Operations", "Duke University on Coursera", "https://www.coursera.org/specializations/mlops-machine-learning-duke", "audit")],
  featuredVideos: [
    v("ZQ-YD96JPqQ", "How I'd Switch From Software Engineer to AI Engineer Before 2027", "Marina Wyss - AI & Machine Learning"),
    v("-Qt279gpemQ", "How to Go From Software Engineer to AI Engineer in 2026?", "Aishwarya Srinivasan"),
  ],
});

/** Any other engineer (chemical, biomedical, industrial…) → AI engineer. Matched after the specific ones. */
const ANY_ENGINEER = engineeringToAi({
  from: "engineer",
  fromKeywords: ["engineer", "engineering", "b.tech", "btech", " be "],
  summary: "Go from engineering to AI engineering: build, evaluate and ship ML and LLM applications, using your engineering field as your advantage.",
  transferable: [
    bring("Engineering maths: calculus, linear algebra and statistics", "The foundation of how models learn and how to judge their results."),
    bring("Problem solving with real-world constraints", "Choosing practical, reliable AI solutions over flashy ones."),
    bring("Domain knowledge from your field", "Finding AI problems in your industry that others can't see."),
    bring("Working with measurements and data", "Cleaning and modelling messy real data, the daily work of ML."),
  ],
  bridge: {
    title: "Python and ML maths for an engineer",
    duration: "3–4 weeks",
    concepts: [
      "Python basics: variables, functions, loops and modules",
      "NumPy and Pandas for numeric and tabular data",
      "Linear algebra and calculus refresher for ML",
      "Statistics: distributions, variance and correlation",
    ],
    practice: ["Take a dataset from your own field, clean it in Pandas and plot three insights"],
    checkpoint: ["Write a Python script that loads, cleans and summarises a CSV", "Explain gradients and dot products in your own words"],
    resources: ["a beginner Python course", "the Pandas documentation", "a maths for ML video series"],
    videoSearch: "python full course maths for machine learning",
    videos: [
      v("K5KVEU3aaeQ", "Python Full Course for Beginners", "Programming with Mosh"),
      v("KgolhE7p-KY", "How To Learn Math for Machine Learning FAST (Even With Zero Math Background)", "Marina Wyss - AI & Machine Learning"),
      v("-KKxtHwxKhE", "How Linear Algebra Powers Machine Learning (ML)", "IBM Technology"),
    ],
    quiz: [
      q("Which Python library is the standard for tables of data?", ["Matplotlib", "Pandas", "Requests", "Flask"], 1, "Pandas provides the DataFrame, the standard way to load, clean and analyse tabular data."),
      q("What does a dot product of two vectors measure, loosely?", ["Their lengths added", "How much they point in the same direction", "Their difference", "Their number of elements"], 1, "A large positive dot product means the vectors point similarly; it's the basis of similarity search."),
    ],
  },
  domain: {
    title: "AI project in your field and getting hired",
    duration: "4–6 weeks",
    concepts: ["Finding an AI problem in your own field: prediction, inspection, documents or optimisation", "Scoping a project to a clear metric and baseline", ...JOB_CONCEPTS],
    practice: [
      "Build an end-to-end project on data from your engineering field, with a baseline, a model, evaluation and a short demo",
      "Publish your three projects (the ML model, the RAG app and your domain project) with READMEs",
    ],
    checkpoint: ["Your domain project beats a simple baseline and you can explain why", "Your CV and LinkedIn tell your engineering → AI story", "You've done two mock AI system design interviews"],
    resources: ["public datasets from your industry", "ML project guides", "AI engineer interview guides"],
    videoSearch: "machine learning projects that get you hired AI engineer interview",
    videos: [
      v("MFSFcPsMsuE", "4 *Real* Machine Learning Projects That Get You Hired - No More Tutorials!", "Marina Wyss - AI & Machine Learning"),
      AI_JOB_VIDEO,
      v("s-MaQ6S9_DA", "ML Engineer Interviews Explained (in 5 Minutes)", "Aced (formerly Exponent)"),
    ],
    quiz: [
      q("Why compare your model with a simple baseline?", ["Interviewers require it", "It shows whether the model adds real value", "Baselines are always wrong", "It makes training faster"], 1, "If a simple rule does as well, the model isn't worth its complexity; beating the baseline proves value."),
      q("Which project impresses hiring managers most?", ["A copy of a popular tutorial", "An end-to-end project on a real problem, with evaluation and a demo", "A list of certificates", "A notebook with no explanation"], 1, "Real problems, honest evaluation and a working demo show you can do the job."),
    ],
  },
  finish: {
    name: "AI engineering portfolio",
    description: "Three published projects: a cross-validated ML model, a RAG app with evals, and an AI project on data from your engineering field, plus a CV that tells your switch.",
  },
  pitfalls: [
    "Waiting to feel 'ready' in maths before building anything",
    "Ignoring your engineering domain, your biggest advantage",
    "Only collecting course certificates instead of shipping projects",
  ],
  featuredVideos: [
    v("8c8Rrhd2oxo", "How I'd Become an AI Engineer in 2026 (Even with No CS Degree)", "Marina Wyss - AI & Machine Learning"),
    v("oHu_xWe0agI", "A Practical Guide To Becoming An AI Engineer (2026)", "CodeHead"),
  ],
});

// ---------------------------------------------------------------------------------------------------------------
// Mechanical engineer → robotics engineer
// ---------------------------------------------------------------------------------------------------------------

const ROBOTICS: TransitionSample = {
  fromKeywords: ["mechanical", "automobile", "automotive", "production engineer", "manufacturing", "aerospace", "mechatronics", "industrial engineer"],
  toKeywords: ["robotic", "robot"],
  path: {
    summary: "Go from mechanical engineer to robotics engineer: program, simulate and control robots with ROS 2, and add perception.",
    transferableSkills: [
      bring("Kinematics, dynamics and mechanisms", "Robot arm kinematics and dynamics are the same mechanics, written as matrices."),
      bring("CAD and mechanical design", "Designing robot parts and turning CAD into URDF models for simulation."),
      bring("Control basics from your degree", "Tuning PID and other controllers for motors and joints."),
      bring("Hands-on prototyping and testing", "Building, debugging and testing real robots."),
    ],
    stages: [
      {
        title: "Programming for robots: Python, C++ and Linux",
        duration: "4–5 weeks",
        concepts: [
          "Python for scripting, testing and data",
          "C++ basics for real-time robot code: classes, references and memory",
          "Linux and the command line: the environment ROS runs in",
          "Git for versioning robot code",
        ],
        practice: ["Write a C++ class for a 2-link arm that computes the end-effector position, and a Python script that plots its workspace"],
        checkpoint: ["Build and run a small C++ program from the terminal", "Navigate, edit and run scripts in Linux without a GUI"],
        resources: ["a C++ beginner course", "a Python course", "a Linux command line tutorial"],
        videoSearch: "C++ for beginners linux command line robotics",
        videos: [
          v("ZzaPdXTrSb8", "C++ Tutorial for Beginners - Learn C++ in 1 Hour", "Programming with Mosh"),
          v("K5KVEU3aaeQ", "Python Full Course for Beginners", "Programming with Mosh"),
          v("gd7BXuUQ91w", "60 Linux Commands you NEED to know (in 10 minutes)", "NetworkChuck"),
        ],
        quiz: [
          q("Why is C++ common in robot software?", ["It's the easiest language", "It gives predictable, fast performance for real-time control", "ROS only supports C++", "It has no compiler"], 1, "Control loops need low, predictable latency, which compiled C++ provides."),
          q("Which command lists files in a Linux directory?", ["cd", "ls", "pwd", "cat"], 1, "ls lists directory contents; cd changes directory and pwd prints where you are."),
        ],
      },
      {
        title: "Robot kinematics",
        duration: "3–4 weeks",
        concepts: [
          "Rotation matrices and homogeneous transforms",
          "Forward kinematics with Denavit–Hartenberg parameters",
          "Inverse kinematics: analytic solutions for simple arms and numeric solutions in general",
          "Jacobians: relating joint speeds to end-effector speed, and singularities",
        ],
        practice: ["Derive and code forward and inverse kinematics for a 3-DOF arm, and check that IK(FK(q)) returns q"],
        checkpoint: ["Compute an end-effector pose from joint angles by hand and in code", "Explain what a singularity is with an example"],
        resources: ["the Modern Robotics textbook and course", "a kinematics lecture series"],
        videoSearch: "forward inverse kinematics robotics explained",
        videos: [
          v("mO7JJxaVtkE", "Forward Kinematics (with solved examples) | Homogeneous Transformations | Robotics 101", "Engineering Simplified"),
          v("1-FJhmey7vk", "Inverse Kinematics of Robots | Robotics 101", "Engineering Simplified"),
          v("cKHsil0V6Qk", "Modern Robotics, Chapter 4:  Forward Kinematics Example", "Northwestern Robotics"),
        ],
        quiz: [
          q("What does inverse kinematics solve?", ["End-effector pose from joint angles", "Joint angles that reach a desired end-effector pose", "Motor torques from currents", "The robot's mass"], 1, "IK works backwards from where you want the tool to be to the joint angles that put it there."),
          q("At a singularity, what happens?", ["The robot moves faster", "The arm loses a direction of motion and joint speeds can blow up", "Kinematics no longer applies", "The controller turns off"], 1, "At singularities the Jacobian loses rank, so some end-effector motions become impossible."),
        ],
      },
      {
        title: "Control for robots",
        duration: "3–4 weeks",
        concepts: [
          "Feedback control and PID: what each term does and how to tune it",
          "Motor control: position, velocity and torque loops",
          "Trajectory generation: smooth motion between waypoints",
          "State-space models and an intro to optimal control",
        ],
        practice: ["Simulate a DC motor in Python, tune a PID controller to hit a step target with under 5% overshoot, and plot the response"],
        checkpoint: ["Tune a PID by reasoning about P, I and D, not guessing", "Generate a smooth trajectory and track it in simulation"],
        resources: ["a control systems lecture series", "the python-control library docs"],
        videoSearch: "PID control explained control theory",
        videos: [
          v("UR0hOmjaHp0", "PID Control - A brief introduction", "Brian Douglas"),
          v("wkfEZmsQqiA", "What Is PID Control? | Understanding PID Control, Part 1", "MATLAB"),
          v("lBC1nEq0_nk", "Everything You Need to Know About Control Theory", "MATLAB"),
        ],
        quiz: [
          q("Your system never quite reaches the target. Which PID term fixes steady-state error?", ["Proportional", "Integral", "Derivative", "None"], 1, "The integral term accumulates error over time and pushes it to zero."),
          q("What does the derivative term mainly do?", ["Removes steady-state error", "Damps the response by reacting to how fast the error changes", "Sets the target", "Increases overshoot"], 1, "D reacts to the rate of change of error, reducing overshoot and oscillation."),
        ],
      },
      {
        title: "ROS 2 and simulation",
        duration: "4–5 weeks",
        concepts: [
          "ROS 2 concepts: nodes, topics, services, actions and launch files",
          "Describing a robot with URDF and visualising it in RViz",
          "Simulating robots and sensors in Gazebo",
          "Navigation basics with Nav2 for a mobile robot",
        ],
        practice: ["Model a 2-wheel mobile robot in URDF, simulate it in Gazebo, and drive it to a goal with a ROS 2 node you wrote"],
        checkpoint: ["Write a ROS 2 publisher and subscriber in Python or C++", "Your robot model loads and moves in Gazebo"],
        resources: ["the official ROS 2 tutorials", "a ROS 2 and Gazebo course"],
        videoSearch: "ROS 2 tutorial beginners gazebo urdf",
        videos: [
          v("8aoFndU7jos", "Getting Started with ROS 2", "Mike Likes Robots"),
          v("CwdbsvcpOHM", "How do we describe a robot? With URDF! | Getting Ready to build Robots with ROS #7", "Articulated Robotics"),
          v("laWn7_cj434", "Simulating Robots with Gazebo and ROS | Getting Ready to Build Robots with ROS #8", "Articulated Robotics"),
        ],
        quiz: [
          q("In ROS 2, how does a camera node usually share images with other nodes?", ["By writing files", "By publishing messages on a topic", "Through a service call for every frame", "By editing the URDF"], 1, "Streams of data like images are published on topics that any node can subscribe to."),
          q("What is a URDF file?", ["A ROS launch script", "An XML description of the robot's links, joints and geometry", "A controller", "A map"], 1, "URDF describes the robot's structure so tools like RViz and Gazebo can display and simulate it."),
        ],
      },
      {
        title: "Perception, portfolio and getting hired",
        duration: "4–6 weeks",
        concepts: [
          "Computer vision with OpenCV: filtering, features and detecting objects",
          "SLAM: building a map while localising in it",
          "A robotics portfolio: videos of working robots, code and write-ups",
          "Robotics interviews: kinematics, control, C++ and a design discussion",
        ],
        practice: [
          "Add a camera to your simulated robot, detect a coloured object with OpenCV, and drive the robot to it",
          "Publish three projects (kinematics, control and the ROS 2 robot) with short videos and write-ups",
        ],
        checkpoint: ["Your robot finds and reaches an object using its camera", "Your portfolio has videos of robots working", "Your CV tells the mechanical → robotics story"],
        resources: ["the OpenCV tutorials", "a SLAM introduction", "robotics engineer interview guides"],
        videoSearch: "SLAM explained opencv python robotics portfolio",
        videos: [
          v("-XU54IsG8Vo", "SLAM Robot Mapping - Computerphile", "Computerphile"),
          v("qCR2Weh64h4", "OpenCV Python Tutorial #1 - Introduction & Images", "Tech With Tim"),
          v("C6qPhUt493o", "Why Your Robot Project Doesn't Land On a Job. Do THIS Instead", "Elliot Uncrewed - ubicoders"),
        ],
        quiz: [
          q("What does SLAM stand for?", ["Sensor Localisation And Motion", "Simultaneous Localisation And Mapping", "Simple Linear Arm Model", "Structured Light And Mapping"], 1, "SLAM builds a map of an unknown area while tracking the robot's position in it."),
          q("What makes a robotics portfolio stand out?", ["Only CAD renders", "Videos of robots actually working, with code and honest write-ups", "A long list of courses", "Screenshots of simulations with no explanation"], 1, "Hiring managers want proof the robot works and that you understand why."),
        ],
      },
    ],
    finishLine: {
      name: "Autonomous robot project",
      description: "A ROS 2 robot (simulated or real) that perceives an object with a camera, plans and drives to it under PID control, published with code, a video and a write-up.",
    },
    pitfalls: [
      "Staying only in CAD and mechanics and avoiding software",
      "Skipping simulation and testing ideas only on hardware",
      "Building robots without videos or write-ups that show they work",
    ],
    courses: [
      { platform: "coursera", query: "modern robotics", note: "Northwestern's robotics series, free to audit" },
      { platform: "youtube", query: "ROS 2 tutorial", note: "free ROS 2 and Gazebo walkthroughs" },
      { platform: "udemy", query: "ROS 2 for beginners", note: "structured paid ROS 2 courses" },
      { platform: "mitocw", query: "robotics", note: "MIT's free robotics lectures" },
    ],
    featured: {
      videos: [
        v("z_uGhq2ayVA", "Robotics engineers are in high demand — but what is the job really like?", "CNBC International"),
        v("X5CBzhPPc_c", "Robotics Mechanical Engineer Roadmap", "Robotix with Sina"),
      ],
      courses: [
        course("Modern Robotics: Mechanics, Planning, and Control", "Northwestern University on Coursera", "https://www.coursera.org/specializations/modernrobotics", "audit"),
        course("ROS 2 Tutorials (Jazzy)", "Open Robotics", "https://docs.ros.org/en/jazzy/Tutorials.html", "free"),
        course("Robotics courses with online simulations", "The Construct", "https://www.theconstruct.ai/", "paid"),
      ],
    },
    nextTopics: [
      next("Robot perception", "Go deeper into cameras, lidar and 3D vision for robots."),
      next("Motion planning", "Plan collision-free paths for arms and mobile robots."),
      next("Reinforcement learning for robotics", "Teach robots skills by trial and error in simulation."),
    ],
  },
};

/**
 * Robotics first, then the specific engineering fields, then any other engineer. Electrical comes before electronics
 * so "electrical and electronics engineer" (EEE) gets the electrical path.
 */
export const AI_TRANSITIONS: TransitionSample[] = [ROBOTICS, ELECTRICAL, ELECTRONICS, MECHANICAL, CIVIL, SOFTWARE, ANY_ENGINEER];
