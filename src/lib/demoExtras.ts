import type { CourseLink, FeaturedCourse, FeaturedVideo, QuizQuestion } from "./schema";

/** Extra per-stage content for a demo path: a YouTube search and, for hand-written samples, a quiz and videos. */
export type StageExtra = { videoSearch: string; quiz?: QuizQuestion[]; videos?: FeaturedVideo[] };

/** Extra content for a whole demo path, merged into it by `getDemoPath`. */
export type PathExtra = {
  stages: StageExtra[];
  courses: CourseLink[];
  featured?: { videos: FeaturedVideo[]; courses: FeaturedCourse[] };
};

/**
 * Builds a verified video entry.
 * @param {string} youtubeId The 11-character YouTube video ID (checked to exist via YouTube oEmbed).
 * @param {string} title The video's title.
 * @param {string} channel The channel that published it.
 * @returns {FeaturedVideo} The video object.
 */
function v(youtubeId: string, title: string, channel: string): FeaturedVideo {
  return { youtubeId, title, channel };
}

/**
 * Builds a quiz question.
 * @param {string} question The question text.
 * @param {string[]} options The four options, in display order.
 * @param {number} answer Index (0-3) of the correct option.
 * @param {string} explanation Why the correct option is right.
 * @returns {QuizQuestion} The question object.
 */
function q(question: string, options: string[], answer: number, explanation: string): QuizQuestion {
  return { question, options, answer, explanation };
}

// Every featured video and course below was checked to exist (YouTube oEmbed / page loads) before adding.

export const GUITAR_EXTRAS: PathExtra = {
  stages: [
    {
      videoSearch: "how to tune a guitar and read chord diagrams for beginners",
      videos: [
        v("X2EmpWr9vUc", "How to Tune Your Guitar For Beginners", "JustinGuitar"),
        v("LlN2yrFQKzY", "How to Read Guitar Chord Charts", "JustinGuitar"),
        v("dFDtLgOq0yI", "How To Read A Chord Diagram", "Lauren Bateman"),
      ],
      quiz: [
        q("In standard tuning, what are the open strings from thickest to thinnest?", ["E B G D A E", "E A D G B E", "A D G C E A", "E A D G C F"], 1, "Standard tuning from the low (thickest) string up is E A D G B E."),
        q("In a chord diagram, what does an X above a string mean?", ["Play it open", "Press it with your index finger", "Don't play that string", "Play it twice"], 2, "An X means the string is muted or not strummed; an O means play it open."),
      ],
    },
    {
      videoSearch: "beginner guitar open chords G C D E minor lesson",
      videos: [
        v("WksDEkIlTb8", "The 8 Essential Beginner Chord Grips", "JustinGuitar"),
        v("R_qmvyUDvEc", "First 7 Chords To Learn on Guitar", "Andy Guitar"),
        v("tw09AanVXQo", "Easy Guitar Chords – G, C, D, Em", "Jackson Emmer"),
      ],
      quiz: [
        q("Which three chords form a very common beginner progression in the key of G?", ["G, F and B", "A, E♭ and F", "C, F♯ and B", "G, C and D"], 3, "G, C and D are the I, IV and V chords in G major, used in countless songs."),
        q("A string buzzes when you play a chord. What's the most likely fix?", ["Press just behind the fret, not in the middle", "Strum much harder", "Loosen the string", "Press with the flat of your finger"], 0, "Fretting right behind the fret wire needs the least pressure and stops buzzing."),
      ],
    },
    {
      videoSearch: "beginner guitar strumming patterns with metronome",
      videos: [
        v("ely9LaJJJr4", "Beginner Strumming Patterns For Acoustic Guitar – Pattern 1", "Marty Music"),
        v("sNa44EmrsDc", "How and Why to Use a Metronome", "JustinGuitar"),
        v("cUTxyrGAseE", "How to Use a Metronome (so it makes your playing better)", "Hi Guitar by Florian"),
      ],
      quiz: [
        q("How many beats are in one bar of 4/4 time?", ["3", "4", "2", "8"], 1, "4/4 means four quarter-note beats per bar."),
        q("In a down-up strumming pattern, when does your hand usually move down?", ["Only on beat 1", "On the 'and's between beats", "On the beats: 1, 2, 3, 4", "At random"], 2, "Downstrums land on the beat and upstrums fall on the 'and' in between."),
      ],
    },
    {
      videoSearch: "F barre chord for beginners and how to use a capo",
      videos: [
        v("WsOa4_XGnTE", "The F Barre Chord (+ Easier Versions)", "Guitar Mastery Method"),
        v("6vBK7EL9gkE", "How to Play Barre Chords – Avoid These Top 5 Mistakes", "for3v3rfaithful"),
        v("Z9ttde31lW4", "This Barre Chord Trick Will Save You Hours", "The School of Guitar"),
      ],
      quiz: [
        q("What does a capo do?", ["Raises the pitch of all strings so you can change key with the same shapes", "Mutes all the strings", "Tunes the guitar automatically", "Holds your pick"], 0, "A capo clamps across a fret, shifting every open string up so familiar shapes sound in a new key."),
        q("Why do barre chords like F feel hard at first?", ["They need a special guitar", "One finger presses several strings flat across a fret", "They only use open strings", "They're played with the picking hand"], 1, "The index finger has to hold down multiple strings at once, which takes strength and precise positioning."),
      ],
    },
  ],
  courses: [
    { platform: "youtube", query: "beginner guitar lessons", note: "free step-by-step lessons from experienced teachers" },
    { platform: "coursera", query: "guitar for beginners", note: "university music courses you can audit for free" },
    { platform: "udemy", query: "beginner guitar course", note: "structured courses with lifetime access" },
    { platform: "skillshare", query: "acoustic guitar for beginners", note: "short project-based classes" },
  ],
  featured: {
    videos: [
      { title: "JustinGuitar Beginner Course Grade 1 Introduction", channel: "JustinGuitar", youtubeId: "_QCt3UBTS1Y" },
      { title: "The 8 Essential Beginner Chord Grips", channel: "JustinGuitar", youtubeId: "WksDEkIlTb8" },
      { title: "Beginner Strumming Patterns For Acoustic Guitar – Pattern 1", channel: "Marty Music", youtubeId: "ely9LaJJJr4" },
    ],
    courses: [
      { title: "Beginner Guitar Course", provider: "JustinGuitar", url: "https://www.justinguitar.com/classes/beginner-guitar-course-grade-one", kind: "free" },
      { title: "Fender Play", provider: "Fender", url: "https://www.fender.com/play", kind: "paid" },
      { title: "Complete Guitar Lessons System – Beginner to Advanced", provider: "Udemy", url: "https://www.udemy.com/course/complete-guitar-system-beginner-to-advanced/", kind: "paid" },
    ],
  },
};

export const PUBLIC_SPEAKING_EXTRAS: PathExtra = {
  stages: [
    {
      videoSearch: "how to structure a speech hook main points conclusion",
      videos: [
        v("Q4K0SnRlik0", "How to Structure a Speech", "Ace Study Guides"),
        v("Uf5JRpXeWR4", "The Best Way to Start a Speech – Conor Neill", "Step Ahead"),
        v("dYyyq2FTVEw", "How to Give Better Presentations", "Gohar Khan"),
      ],
      quiz: [
        q("What should a talk be built around?", ["As many facts as possible", "One clear core message", "Your slides", "A long personal history"], 1, "A single core message gives every part of the talk a purpose and makes it memorable."),
        q("Which is a simple, effective talk structure?", ["Close, points, then hook", "Slides first, then speech", "Hook, a few key points, clear close", "Questions only"], 2, "Opening with a hook, making a few points and closing clearly is easy to follow and remember."),
      ],
    },
    {
      videoSearch: "public speaking delivery tips pace pauses eye contact",
      videos: [
        v("eIho2S0ZahI", "How to Speak So That People Want to Listen", "TED (Julian Treasure)"),
        v("_muM29u9WTc", "Mastering the Pause: Obama's Public Speaking Trick", "Speak with Amee"),
        v("8S0FDjFBj8o", "How to Sound Smart in Your TEDx Talk", "TEDx Talks (Will Stephen)"),
      ],
      quiz: [
        q("What's the best replacement for filler words like 'um'?", ["A short, silent pause", "Speaking faster", "Saying 'like' instead", "Reading from notes"], 0, "A brief pause sounds confident and gives you time to think."),
        q("Why record yourself while practising?", ["To memorise word for word", "To avoid practising in front of people", "So you never need feedback", "To spot habits you don't notice while speaking"], 3, "Video shows pace, fillers and body language that you can't see in the moment."),
      ],
    },
    {
      videoSearch: "how to manage public speaking anxiety breathing techniques",
      videos: [
        v("83wYDzO3CzI", "Public Speaking Anxiety Tips: 6 Mindset Tips", "Alexander Lyon"),
        v("dyIoUMwD7Xw", "Breathing Exercises for Confident Public Speaking", "Dominic Colenso"),
        v("VEStYVONy-0", "Public Speaking Anxiety Tips", "Alexander Lyon"),
      ],
      quiz: [
        q("Which is a helpful technique right before you speak?", ["Drinking several coffees", "Slow, deep breathing", "Skipping your rehearsal", "Memorising every word last minute"], 1, "Slow breathing calms the body's stress response so you can think clearly."),
        q("Why does reframing nerves as excitement help?", ["It removes nerves completely", "The audience can't see nerves", "Both feel similar in the body, so the label changes how you respond", "It makes talks shorter"], 2, "Nerves and excitement share physical signs; calling it excitement turns the energy into something useful."),
      ],
    },
    {
      videoSearch: "how to design presentation slides and handle audience questions",
      videos: [
        v("tEF2vNP3S9A", "The Do's and Don'ts of Effective Presentation Slides", "Carl Kwan"),
        v("PS90YsHjAU4", "How to Deal with Questions During a Presentation", "British Council"),
      ],
      quiz: [
        q("Good slides should…", ["Contain your full script", "Have dense paragraphs", "Be read aloud word for word", "Support what you say with few words and clear visuals"], 3, "Slides work best as a visual backup to your words, not a copy of them."),
        q("If you don't know the answer to an audience question, it's best to…", ["Say so honestly and offer to follow up", "Make something up", "Ignore the question", "End the talk"], 0, "Being honest keeps your credibility; offering to follow up shows you take the question seriously."),
      ],
    },
  ],
  courses: [
    { platform: "youtube", query: "public speaking tips", note: "talks and practical tips from experienced speakers" },
    { platform: "coursera", query: "public speaking", note: "university courses you can audit for free" },
    { platform: "linkedin", query: "public speaking", note: "short professional courses" },
    { platform: "udemy", query: "public speaking course", note: "practice-focused courses with exercises" },
  ],
  featured: {
    videos: [
      { title: "How to Speak So That People Want to Listen", channel: "TED (Julian Treasure)", youtubeId: "eIho2S0ZahI" },
      { title: "How to sound smart in your TEDx Talk", channel: "TEDx Talks (Will Stephen)", youtubeId: "8S0FDjFBj8o" },
    ],
    courses: [
      { title: "Introduction to Public Speaking", provider: "University of Washington on Coursera", url: "https://www.coursera.org/learn/public-speaking", kind: "audit" },
      { title: "Toastmasters club membership", provider: "Toastmasters International", url: "https://www.toastmasters.org/", kind: "paid" },
    ],
  },
};

export const PYTHON_EXTRAS: PathExtra = {
  stages: [
    {
      videoSearch: "python basics variables loops for beginners",
      videos: [
        v("kqtD5dpn9C8", "Python for Beginners – Learn Coding with Python in 1 Hour", "Programming with Mosh"),
        v("cQT33yu9pY8", "Python Variables – Python Tutorial for Beginners", "Programming with Mosh"),
        v("94UHCEmprCY", "Python For Loops – Python Tutorial for Absolute Beginners", "Programming with Mosh"),
      ],
      quiz: [
        q("What does print(type(3.0)) show?", ["<class 'int'>", "<class 'float'>", "<class 'str'>", "3.0"], 1, "3.0 has a decimal point, so it's a float."),
        q("Which statement runs a set number of times, e.g. over range(5)?", ["if", "def", "while True", "for"], 3, "A for loop iterates over each item in range(5): 0, 1, 2, 3, 4."),
      ],
    },
    {
      videoSearch: "python functions lists dictionaries tutorial",
      videos: [
        v("89cGQjB5R4M", "Functions in Python Are Easy", "Bro Code"),
        v("f2RATcdPcrE", "Introduction to Lists in Python", "Neso Academy"),
        v("daefaLgNkw0", "Dictionaries – Working with Key-Value Pairs", "Corey Schafer"),
      ],
      quiz: [
        q("Which built-in type stores key–value pairs?", ["dict", "list", "tuple", "set"], 0, "A dictionary maps keys to values, e.g. {'apple': 3}."),
        q("What does a function with no return statement return?", ["0", "An empty string", "None", "It raises an error"], 2, "Python functions return None when they don't explicitly return a value."),
      ],
    },
    {
      videoSearch: "python read csv json files pip virtual environment",
      videos: [
        v("eDe-z2Qy9x4", "Python Virtual Environment and pip for Beginners", "Dave Gray"),
        v("Y21OR1OPC9A", "Python Virtual Environments – Full Tutorial for Beginners", "Tech With Tim"),
        v("9N6a-VLBa2I", "Working with JSON Data using the json Module", "Corey Schafer"),
      ],
      quiz: [
        q("What is a virtual environment for?", ["Running Python in a browser", "Keeping each project's packages separate", "Making loops faster", "Writing files"], 1, "A virtual environment gives each project its own installed packages, avoiding version clashes."),
        q("Which standard-library module reads and writes JSON?", ["csv", "os", "math", "json"], 3, "The json module provides json.load/json.dump and friends."),
      ],
    },
    {
      videoSearch: "python requests api tutorial and pytest basics",
      videos: [
        v("Xnbef8F_Yfc", "Master Python Requests in 15 Minutes", "Tech With Tim"),
        v("EgpLj86ZHFQ", "Pytest Tutorial – How to Write Tests in Python", "Tech With Tim"),
        v("7dgQRVqF1N0", "PyTest – REST API Integration Testing with Python", "pixegami"),
      ],
      quiz: [
        q("Which library is most commonly used to call web APIs in Python?", ["requests", "numpy", "tkinter", "turtle"], 0, "requests makes HTTP calls simple, e.g. requests.get(url).json()."),
        q("How does pytest find your tests by default?", ["It runs every function in every file", "Functions decorated with @run", "Functions whose names start with test_", "Only functions named main"], 2, "pytest collects test_*.py files and functions named test_*."),
      ],
    },
  ],
  courses: [
    { platform: "freecodecamp", query: "python", note: "free tutorials and a Python certification path" },
    { platform: "youtube", query: "python for beginners full course", note: "complete beginner courses" },
    { platform: "mitocw", query: "introduction to computer science python", note: "MIT's free intro programming course materials" },
    { platform: "coursera", query: "python for everybody", note: "beginner-friendly university courses, free to audit" },
    { platform: "udemy", query: "python bootcamp", note: "project-heavy bootcamp-style courses" },
  ],
  featured: {
    videos: [
      { title: "Learn Python – Full Course for Beginners", channel: "freeCodeCamp.org", youtubeId: "rfscVS0vtbw" },
      { title: "Python for Beginners – Learn Coding with Python in 1 Hour", channel: "Programming with Mosh", youtubeId: "kqtD5dpn9C8" },
    ],
    courses: [
      { title: "The Python Tutorial", provider: "Python.org (official docs)", url: "https://docs.python.org/3/tutorial/", kind: "free" },
      { title: "Scientific Computing with Python", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", kind: "free" },
      { title: "Python for Everybody", provider: "University of Michigan on Coursera", url: "https://www.coursera.org/specializations/python", kind: "audit" },
      { title: "100 Days of Code: The Complete Python Pro Bootcamp", provider: "Udemy", url: "https://www.udemy.com/course/100-days-of-code/", kind: "paid" },
    ],
  },
};

export const MACHINE_LEARNING_EXTRAS: PathExtra = {
  stages: [
    {
      videoSearch: "pandas numpy matplotlib tutorial for machine learning beginners",
      videos: [
        v("ZyhVh-qRZPA", "Python Pandas Tutorial (Part 1): Getting Started with Data Analysis", "Corey Schafer"),
        v("EXIgjIBu4EU", "Learn Pandas in 30 Minutes", "Tech With Tim"),
        v("r67SfaiYaDI", "Intro to Machine Learning & Data Science (+Pandas, NumPy, Matplotlib)", "Zero To Mastery"),
      ],
      quiz: [
        q("A DataFrame df has missing values in its 'age' column. Which call fills them with the column's median?", ["df['age'].fillna(df['age'].median())", "df['age'].dropna()", "df.median('age')", "df['age'].replace(None)"], 0, "fillna replaces missing values with the value you pass, here the column median."),
        q("Predicting a house's sale price from its size and location is an example of…", ["Classification", "Regression", "Clustering", "Dimensionality reduction"], 1, "The target is a continuous number, which makes it a regression problem."),
        q("What is the shape of np.zeros((3, 4))?", ["(4, 3)", "12", "(3, 4)", "(3,)"], 2, "The tuple you pass is the shape: 3 rows and 4 columns."),
      ],
    },
    {
      videoSearch: "linear regression logistic regression knn decision tree random forest explained",
      videos: [
        v("aFDOzpTeg0s", "The Essence of Linear Regression", "StatQuest with Josh Starmer"),
        v("yIYKR4sgzI8", "StatQuest: Logistic Regression", "StatQuest with Josh Starmer"),
        v("J4Wdy0Wc_xQ", "Random Forests Part 1 – Building, Using and Evaluating", "StatQuest with Josh Starmer"),
      ],
      quiz: [
        q("Why should you scale features before using k-nearest neighbours?", ["k-NN only accepts whole numbers", "Distances get dominated by features with large ranges", "Scaling speeds up training but never changes results", "scikit-learn refuses unscaled data"], 1, "k-NN compares distances, so a feature measured in thousands drowns out one measured in units unless you scale."),
        q("A logistic regression model outputs 0.72 for an email. With the default 0.5 threshold, the prediction is…", ["Not spam, because 0.72 is below 1", "Undefined", "Spam (the positive class)", "Spam only if the threshold is 0.8"], 2, "0.72 is above the 0.5 threshold, so the email is classified as the positive class."),
        q("What does increasing a decision tree's max_depth usually do?", ["Lowers its training accuracy", "Makes the model simpler", "Has no effect", "Raises the risk of overfitting"], 3, "Deeper trees can memorise the training data, which often hurts performance on new data."),
      ],
    },
    {
      videoSearch: "cross validation confusion matrix precision recall explained",
      videos: [
        v("fSytzGwwBVw", "Machine Learning Fundamentals: Cross Validation", "StatQuest with Josh Starmer"),
        v("Kdsp6soqA7o", "Machine Learning Fundamentals: The Confusion Matrix", "StatQuest with Josh Starmer"),
        v("EuBBz3bI-aA", "Machine Learning Fundamentals: Bias and Variance", "StatQuest with Josh Starmer"),
      ],
      quiz: [
        q("A model scores 99% accuracy on data where 99% of cases are negative. What should you check next?", ["Nothing, 99% is excellent", "Precision and recall for the positive class", "Only the training accuracy", "The learning rate"], 1, "A model that always predicts 'negative' would also score 99%, so you need metrics that look at the rare positive class."),
        q("Training accuracy is 99% but test accuracy is 70%. This is a sign of…", ["Underfitting", "A perfect model", "Overfitting", "Too little training data in the test set"], 2, "A big gap between training and test scores means the model learned the training data too specifically."),
        q("Why put the scaler inside a Pipeline during cross-validation?", ["It runs faster", "It increases the number of folds", "Random forests require it", "So information from the validation fold doesn't leak into training"], 3, "In a Pipeline, the scaler is fitted on each training fold only, so the validation fold stays unseen."),
      ],
    },
    {
      videoSearch: "feature engineering one hot encoding k-means clustering PCA tutorial",
      videos: [
        v("4b5d3muPQmA", "StatQuest: K-means Clustering", "StatQuest with Josh Starmer"),
        v("HMOI_lkzW08", "PCA Main Ideas in Only 5 Minutes", "StatQuest with Josh Starmer"),
      ],
      quiz: [
        q("Which encoding suits a 'colour' column with values red, green and blue?", ["One-hot encoding", "Ordinal encoding (1, 2, 3)", "Dropping the column", "Scaling it to 0–1"], 0, "Colours have no natural order, so one-hot encoding avoids implying red < green < blue."),
        q("k-means is an example of…", ["Supervised classification", "Unsupervised clustering", "Reinforcement learning", "Regression"], 1, "k-means groups unlabelled data points into k clusters."),
        q("What does PCA do?", ["Labels data automatically", "Removes outliers", "Finds new axes that capture the most variance", "Splits data into train and test sets"], 2, "PCA rotates the data onto principal components ordered by how much variance they explain."),
      ],
    },
    {
      videoSearch: "neural networks gradient descent explained pytorch beginner",
      videos: [
        v("aircAruvnKk", "But What Is a Neural Network?", "3Blue1Brown"),
        v("IHZwWFHWa-w", "Gradient Descent, How Neural Networks Learn", "3Blue1Brown"),
        v("Ilg3gGewQ5U", "Backpropagation, Intuitively", "3Blue1Brown"),
      ],
      quiz: [
        q("If the learning rate is much too high, the training loss usually…", ["Decreases very slowly", "Jumps around or blows up", "Becomes exactly zero", "Is unaffected"], 1, "Steps that are too big overshoot the minimum, so the loss bounces or diverges."),
        q("Which activation is usually used on the output layer for multi-class classification?", ["ReLU", "Tanh", "Sigmoid", "Softmax"], 3, "Softmax turns the outputs into probabilities that add up to 1 across the classes."),
        q("What does dropout do during training?", ["Randomly switches off neurons to reduce overfitting", "Removes bad training examples", "Lowers the learning rate", "Deletes whole layers"], 0, "Dropping random neurons forces the network not to rely on any single path, which helps it generalise."),
      ],
    },
  ],
  courses: [
    { platform: "youtube", query: "machine learning for beginners", note: "full courses and visual explainers" },
    { platform: "coursera", query: "machine learning specialization", note: "Andrew Ng's courses, free to audit" },
    { platform: "khanacademy", query: "statistics and probability", note: "the maths behind the models" },
    { platform: "udemy", query: "machine learning python", note: "project-based bootcamp courses" },
    { platform: "linkedin", query: "machine learning", note: "short professional courses" },
  ],
  featured: {
    videos: [
      { title: "Machine Learning for Everybody – Full Course", channel: "freeCodeCamp.org", youtubeId: "i_LwzRVP7bg" },
      { title: "The Essence of Linear Regression", channel: "StatQuest with Josh Starmer", youtubeId: "aFDOzpTeg0s" },
      { title: "StatQuest: Logistic Regression", channel: "StatQuest with Josh Starmer", youtubeId: "yIYKR4sgzI8" },
      { title: "Random Forests Part 1 – Building, Using and Evaluating", channel: "StatQuest with Josh Starmer", youtubeId: "J4Wdy0Wc_xQ" },
      { title: "But what is a neural network?", channel: "3Blue1Brown", youtubeId: "aircAruvnKk" },
      { title: "Gradient descent, how neural networks learn", channel: "3Blue1Brown", youtubeId: "IHZwWFHWa-w" },
    ],
    courses: [
      { title: "Machine Learning Crash Course", provider: "Google for Developers", url: "https://developers.google.com/machine-learning/crash-course", kind: "free" },
      { title: "scikit-learn User Guide", provider: "scikit-learn (official docs)", url: "https://scikit-learn.org/stable/user_guide.html", kind: "free" },
      { title: "Practical Deep Learning for Coders", provider: "fast.ai", url: "https://course.fast.ai/", kind: "free" },
      { title: "Machine Learning Specialization", provider: "Stanford & DeepLearning.AI on Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction", kind: "audit" },
      { title: "Machine Learning A-Z: AI, Python & R", provider: "Udemy", url: "https://www.udemy.com/course/machinelearning/", kind: "paid" },
    ],
  },
};

/**
 * Extra content for the generic template path: topic-based video searches and course platform picks.
 * It has no quizzes and no featured links: without knowing the topic, questions would be about learning in
 * general rather than the subject, and nothing specific has been verified for an arbitrary topic.
 * @param {string} topic The topic the user typed.
 * @returns {PathExtra} Searches and course platform picks for the generic path.
 */
export function genericExtras(topic: string): PathExtra {
  const t = topic.trim();
  return {
    stages: [
      { videoSearch: `${t} for complete beginners` },
      { videoSearch: `${t} core techniques tutorial` },
      { videoSearch: `${t} beginner project walkthrough` },
      { videoSearch: `${t} intermediate tips` },
    ],
    courses: [
      { platform: "youtube", query: `${t} for beginners`, note: "free lessons and walkthroughs" },
      { platform: "coursera", query: t, note: "university courses, often free to audit" },
      { platform: "udemy", query: t, note: "structured paid courses with lifetime access" },
      { platform: "skillshare", query: t, note: "short project-based classes" },
    ],
  };
}
