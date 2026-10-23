// Hand-written career transition demos for "Transition" beyond engineering → AI (see demoTransitionsAi.ts), and the
// matching that picks one from what the learner typed. Every video was found with a YouTube search for its stage and
// checked with YouTube oEmbed; every course link was checked to load.
import { AI_TRANSITIONS, bring, course, next, q, type TransitionSample, v } from "./demoTransitionsAi";
import type { LearningPath } from "./schema";

const GUITAR_TO_PIANO: TransitionSample = {
  fromKeywords: ["guitar"],
  toKeywords: ["piano", "pianist", "keyboard", "keys player"],
  path: {
    summary: "Go from guitarist to pianist: use the chords and theory you already know, build two-hand coordination, read music and play full songs on piano.",
    transferableSkills: [
      bring("Chord knowledge: major, minor, 7th chords and progressions", "Piano makes the same chords visible as shapes; you'll learn voicings far faster than a beginner."),
      bring("Rhythm, timing and playing with a metronome", "Keeping steady time while your two hands do different things."),
      bring("Ear training and playing by ear", "Working out songs and accompaniments from recordings."),
      bring("Practice discipline and calloused patience", "Getting through the awkward first weeks of hand coordination."),
    ],
    stages: [
      {
        title: "Find your way around the keyboard",
        duration: "2–3 weeks",
        concepts: [
          "The keyboard layout: finding C by the groups of two black keys, octaves and note names",
          "Posture, relaxed curved fingers and finger numbers 1–5 for each hand",
          "Five-finger positions and the C major scale with the correct thumb-under fingering",
          "Mapping guitar knowledge: a fret is a semitone, so piano keys are the same chromatic steps laid out in a line",
        ],
        practice: ["Play the C, G and F major scales hands separately at 60 bpm with correct fingering, five minutes a day"],
        checkpoint: ["Name any white key in under 2 seconds", "Play C major one octave, each hand, with no fingering mistakes"],
        resources: ["a beginner piano lesson series", "a free note-naming trainer"],
        videoSearch: "piano for guitarists beginner hand position",
        videos: [
          v("thfUsCM6C0g", "Piano For Guitarists - Where Should I Start? Learn Piano Skills Today!", "Levi Clay"),
          v("uQ8xo1osZmo", "A Piano Lesson For Guitar Players", "Andertons Synths, Keys and Tech"),
          v("U4mU0uu-0Aw", "Good Hand Placement Is A GAME CHANGER For Beginners | Easy Lesson", "Piano From Scratch"),
        ],
        quiz: [
          q("How do you find middle C's neighbourhood quickly?", ["Count from the left edge", "C is just left of every group of two black keys", "C is always the first black key", "Look for the widest white key"], 1, "C sits immediately left of each pair of black keys, so you can find any C at a glance."),
          q("On a guitar, one fret is a semitone. What's one semitone on piano?", ["Two white keys", "The very next key, black or white", "An octave", "One white key only"], 1, "Each adjacent key, black or white, is one semitone, just like one fret."),
        ],
      },
      {
        title: "Chords and voicings on piano",
        duration: "3–4 weeks",
        concepts: [
          "Building triads from a root: major (4 + 3 semitones) and minor (3 + 4)",
          "Inversions: playing the same chord with a different note at the bottom",
          "Voice leading: moving between chords with the least hand movement",
          "Common progressions you know from guitar (I–V–vi–IV) as piano shapes",
        ],
        practice: ["Play C–G–Am–F with the right hand using inversions so no note moves more than two keys, while the left hand plays roots"],
        checkpoint: ["Play all 12 major triads in root position", "Play I–V–vi–IV in two keys with smooth inversions"],
        resources: ["a chord inversion lesson", "a music theory website"],
        videoSearch: "piano chord inversions voice leading beginners",
        videos: [
          v("Xuuq8DtUy_g", "Piano Chord Inversions", "Pianote"),
          v("rUE1yHuMm5A", "Master Your Piano Chord Inversions (How To Practice Them)", "Pianote"),
          v("ZKM8FtLgvRk", "Voice Leading - A Beginner Piano Lesson in Smooth Chord Progressions", "MangoldProject"),
        ],
        quiz: [
          q("A C major chord is C–E–G. What's its first inversion?", ["G–C–E", "E–G–C", "C–G–E", "E–C–G"], 1, "First inversion puts the third (E) at the bottom: E–G–C."),
          q("Why use inversions when changing chords?", ["They're louder", "They keep the hand close by, so changes are smooth", "They change the key", "Guitarists can't play root position"], 1, "Inversions minimise hand movement and create smoother voice leading."),
        ],
      },
      {
        title: "Two hands at once",
        duration: "4–5 weeks",
        concepts: [
          "Hand independence: steady left-hand patterns under a right-hand melody",
          "Left-hand accompaniment patterns: root notes, octaves, broken chords and Alberti bass",
          "Slow practice with a metronome, hands separately then together",
          "Counting out loud to lock rhythm across both hands",
        ],
        practice: ["Play a simple pop song: right-hand melody with a left-hand root-and-fifth pattern, starting at 50 bpm and reaching 80 bpm"],
        checkpoint: ["Keep a steady left-hand pattern while the right hand plays a different rhythm", "Play one full song with both hands at 80 bpm"],
        resources: ["hand independence exercises", "easy two-hand pop arrangements"],
        videoSearch: "piano hand independence exercises left hand patterns",
        videos: [
          v("aUbDQEPh_5g", "Hand Independence Exercises For Beginners", "Pianote"),
          v("VXD0p_g_UTg", "Play with 2 Hands on Piano (Practice these 10 Easy Exercises)", "Learn Piano with Jazer Lee"),
          v("JyesPzsAzJY", "10 AMAZING Pop Piano LEFT HAND Patterns", "Online Rock Piano Lessons"),
        ],
        quiz: [
          q("Your hands keep falling out of sync. What's the best fix?", ["Play faster to build momentum", "Slow down with a metronome and practise hands separately first", "Only practise the right hand", "Stop counting"], 1, "Slow, separate practice builds the motor patterns that let hands work together."),
          q("What is an Alberti bass?", ["A bass guitar part", "A left-hand broken-chord pattern: low, high, middle, high", "A type of pedal", "A scale exercise"], 1, "The Alberti bass breaks a chord into a repeating low–high–middle–high pattern."),
        ],
      },
      {
        title: "Reading music",
        duration: "4–5 weeks",
        concepts: [
          "The grand staff: treble clef for the right hand, bass clef for the left",
          "Landmark notes and intervals for reading quickly instead of counting lines",
          "Rhythm notation: note values, rests, time signatures and ties",
          "Daily sight-reading of easy pieces a level below your playing",
        ],
        practice: ["Sight-read one new easy piece every day for 3 weeks, slowly and without stopping"],
        checkpoint: ["Name notes on both clefs in under 3 seconds each", "Sight-read an easy 8-bar piece hands together at a slow tempo"],
        resources: ["a note-reading lesson", "graded sight-reading books"],
        videoSearch: "how to read sheet music piano landmark notes sight reading",
        videos: [
          v("PyOKefHURsg", "How to Read Notes The EASY Way You Weren’t Taught", "Pianote"),
          v("jSOU-J9KHbg", "How to Read Notes Fast - The Landmark System", "Musicians Inspired"),
          v("mysy4D23RfU", "Sightreading Like a Pro: The Beginner's Roadmap", "Learn Piano with Jazer Lee"),
        ],
        quiz: [
          q("Which clef usually shows the left hand's notes?", ["Treble clef", "Bass clef", "Alto clef", "Tab"], 1, "The bass clef covers the lower notes, usually played by the left hand."),
          q("In 4/4 time, how many beats does a half note get?", ["1", "2", "3", "4"], 1, "A half note lasts two beats in 4/4."),
        ],
      },
      {
        title: "Songs, lead sheets and pedal",
        duration: "4–6 weeks",
        concepts: [
          "Playing from lead sheets and chord charts: melody plus chord symbols, like guitar charts",
          "Accompaniment styles: block chords, arpeggios and rhythmic comping",
          "The sustain pedal: legato pedalling and changing it with the chords",
          "Building a repertoire of 5 songs you can play for others",
        ],
        practice: ["Learn 5 songs from lead sheets, record yourself playing two of them, and compare against the originals"],
        checkpoint: ["Play a song from a lead sheet with pedal and no blurring between chords", "Perform two songs from start to finish for someone"],
        resources: ["lead sheet collections", "a pedal technique lesson"],
        videoSearch: "how to play piano from lead sheet sustain pedal",
        videos: [
          v("mesxDxb3_Wo", "How I Use Lead Sheets for Playing Piano", "Sangah Noona"),
          v("koJVelJdnZE", "How To Use A Sustain Pedal - Piano Lesson (Pianote)", "Pianote"),
          v("U2GGFG8Lzck", "How To Use The Sustain Pedal With Chords | Full Beginner’s Guide", "Piano From Scratch"),
        ],
        quiz: [
          q("When should you change the sustain pedal?", ["Never", "At each chord change, lifting and pressing right after the new chord", "Only at the end", "Every beat"], 1, "Re-pedalling at each chord change keeps the sound connected without blurring chords together."),
          q("What does a lead sheet contain?", ["Every note for both hands", "The melody with chord symbols above it", "Only lyrics", "Guitar tab"], 1, "Lead sheets give the melody and chords; you create the accompaniment, much like on guitar."),
        ],
      },
    ],
    finishLine: {
      name: "Two-hand song recital",
      description: "Record a 3-song set on piano from lead sheets: melody in the right hand, an accompaniment pattern in the left, clean pedalling, and one song read from sheet music.",
    },
    pitfalls: [
      "Only playing chords with the right hand like a guitar, never building the left hand",
      "Skipping music reading because you could always use tabs on guitar",
      "Practising fast with mistakes instead of slowly and correctly",
    ],
    courses: [
      { platform: "youtube", query: "piano for guitarists", note: "free lessons that build on guitar knowledge" },
      { platform: "coursera", query: "developing your musicianship", note: "Berklee theory and ear training, free to audit" },
      { platform: "skillshare", query: "piano for beginners", note: "short project-based piano classes" },
      { platform: "udemy", query: "piano chords for beginners", note: "structured paid piano courses" },
    ],
    featured: {
      videos: [v("btFT3EDYRtU", "Piano for Guitarists", "Piano Fluency"), v("be4I5JrIEus", "Piano for Guitarists Episode 1: Cross-Training with White Keys", "Alamo Music Center - Pianos and Keyboards")],
      courses: [
        course("Free music theory lessons", "musictheory.net", "https://www.musictheory.net/lessons", "free"),
        course("Developing Your Musicianship", "Berklee College of Music on Coursera", "https://www.coursera.org/specializations/musicianship-specialization", "audit"),
        course("Online piano lessons", "Pianote", "https://www.pianote.com/", "paid"),
        course("Learn piano with songs", "flowkey", "https://www.flowkey.com/", "paid"),
      ],
    },
    nextTopics: [
      next("Jazz piano", "Use your chord knowledge for richer voicings and improvisation."),
      next("Music production", "Use keyboards to write and produce full tracks."),
      next("Piano improvisation", "Create your own fills and solos over chord progressions."),
    ],
  },
};

const INTERIOR_TO_FASHION: TransitionSample = {
  fromKeywords: ["interior"],
  toKeywords: ["fashion", "apparel", "clothing designer", "garment"],
  path: {
    summary: "Go from interior designer to fashion designer: move your eye for colour, texture and space onto the body, learn garment construction, and build a fashion portfolio.",
    transferableSkills: [
      bring("Colour theory, mood boards and trend research", "Building fashion collections and seasonal concept boards."),
      bring("Fabric and material knowledge from upholstery and soft furnishings", "Choosing fabrics by weight, drape and fibre for garments."),
      bring("Sketching and CAD (AutoCAD, SketchUp)", "Fashion illustration, technical flats and 3D garment software like CLO 3D."),
      bring("Client briefs, budgets and working with vendors", "Working with clients, sampling studios and manufacturers."),
    ],
    stages: [
      {
        title: "How fashion design works",
        duration: "2–3 weeks",
        concepts: [
          "The design process: research, concept, sketches, sampling, fittings and production",
          "Garment categories, silhouettes and the fashion calendar (seasons and collections)",
          "Key terms: block, toile, grading, tech pack, sample",
          "How interiors thinking (space, proportion, materials) applies to the body",
        ],
        practice: ["Build a mood board and a 6-look mini concept for a season, inspired by an interior style you know well"],
        checkpoint: ["Explain each step from sketch to finished garment", "Present one concept with colour palette, fabrics and silhouettes"],
        resources: ["fashion design process videos", "fashion week shows and lookbooks"],
        videoSearch: "fashion design process explained beginners",
        videos: [
          v("YCODadpMWyc", "Developing a concept  for Major Fashion Design Project", "Torunn Kjolberg"),
          v("YxeFR0ToXhM", "The Principles of Fashion Design", "Catherine Sews"),
          v("VVbD2dXS4gw", "Thom Browne’s Entire Design Process, From Sketch to Dress | Vogue", "Vogue"),
        ],
        quiz: [
          q("What is a toile?", ["The final garment", "A test version of a garment in cheap fabric to check fit", "A fabric shop", "A type of sketch"], 1, "A toile (or muslin) is a mock-up used to perfect fit and shape before cutting the real fabric."),
          q("Which step usually comes right before production?", ["Mood board", "Sampling and fittings", "Trend research", "Sketching"], 1, "Samples are made and fitted until approved; only then does production start."),
        ],
      },
      {
        title: "Fashion illustration and technical flats",
        duration: "3–4 weeks",
        concepts: [
          "The fashion croquis: 9-head proportions and poses",
          "Drawing garments on the figure: folds, drape and fabric behaviour",
          "Technical flats in Adobe Illustrator: front and back views with seams and stitching",
          "Presenting a collection: line-ups and colourways",
        ],
        practice: ["Draw a 6-look line-up on croquis, then make technical flats for two of the looks in Illustrator"],
        checkpoint: ["Draw a croquis in correct proportions without tracing", "Produce clean flats a sample maker could follow"],
        resources: ["a fashion illustration course", "Adobe Illustrator flats tutorials"],
        videoSearch: "fashion illustration croquis technical flats illustrator",
        videos: [
          v("ED84NRVGWNk", "Fashion Sketching for Beginners | Learn to Draw Fashion Figures Step-by-Step", "Nino Via"),
          v("b9qrj0MXFSg", "How to draw a Fashion Illustration | Step by step | Basic Croquis in front Pose | 9 Heads", "KalaaCurry"),
          v("wE6b4A4pTLA", "The EASIEST way to draw Flat Sketches on Adobe Illustrator! (Part 1)", "With love, Christina "),
        ],
        quiz: [
          q("What's the difference between a fashion illustration and a technical flat?", ["None", "An illustration shows mood on a figure; a flat is an exact, proportioned drawing for production", "Flats are always in colour", "Illustrations include measurements"], 1, "Flats are precise production drawings; illustrations communicate the look and attitude."),
          q("Why are fashion croquis often 9 heads tall?", ["It's the real human proportion", "The elongated figure shows garments more elegantly", "It saves paper", "It's required by law"], 1, "Real people are about 7.5 heads tall; fashion figures are stretched to flatter the clothes."),
        ],
      },
      {
        title: "Textiles for garments",
        duration: "3 weeks",
        concepts: [
          "Fibres: cotton, linen, wool, silk, polyester and blends, and how each behaves",
          "Woven vs knit fabrics: stretch, structure and what each is used for",
          "Weight (GSM), drape and hand feel: matching fabric to silhouette",
          "Sustainable materials and certifications buyers ask about",
        ],
        practice: ["Make a swatch book of 15 fabrics labelled with fibre, weave or knit, weight and a garment each suits"],
        checkpoint: ["Tell woven from knit by touch and by looking at the edge", "Pick a suitable fabric for a structured blazer and a flowing dress, and explain why"],
        resources: ["a textiles guide", "a local fabric market for swatches"],
        videoSearch: "fabric types for fashion design woven vs knit",
        videos: [
          v("-B4tfduOQ7w", "Learning About Fabrics 1: The Who, What, and How", "Zoe Hong"),
          v("Zg2aJpd_KJg", "Knitted Vs. Woven Fabrics - What's The Difference???", "FittDesign Studio"),
          v("2PTef_5ItsE", "Fashion Fabrics 101: Essential Learning for Fashion Designers!", "Nino Via"),
        ],
        quiz: [
          q("Which fabric type usually stretches more?", ["Woven", "Knit", "Both the same", "Neither"], 1, "Knits are made of interlocking loops, so they stretch; wovens are crossed threads and are more stable."),
          q("You want a flowing, draped dress. Which is the best choice?", ["Heavy denim", "Lightweight silk or viscose", "Upholstery canvas", "Stiff felt"], 1, "Light, fluid fabrics drape; heavy, stiff fabrics hold structure."),
        ],
      },
      {
        title: "Pattern making, sewing and draping",
        duration: "5–6 weeks",
        concepts: [
          "Taking body measurements and drafting a basic bodice block",
          "Darts, seam allowances and grainlines",
          "Using a sewing machine: straight seams, finishes and hems",
          "Draping on a dress form to create shapes directly in fabric",
        ],
        practice: ["Draft a bodice block to your measurements, sew a toile, fit it, and correct the pattern"],
        checkpoint: ["Your toile fits with corrected darts and balance", "Sew a simple garment start to finish"],
        resources: ["a pattern-making book or course", "a sewing machine and a dress form"],
        videoSearch: "pattern making bodice block sewing machine draping",
        videos: [
          v("4a7vtJDbz0k", "HOW TO MAKE A BASIC BODICE BLOCK PATTERN WITH DARTS - EASY (+ free PDF ruler)", "Coraline Street"),
          v("oD_KpZm7OaM", "A Beginner's Guide To SEWING! How to use a sewing machine", "coolirpa"),
          v("mHFrfaO4ipo", "How to Drape on a Dress Form Draping For Beginners | Sew Anastasia", "Sew Anastasia"),
        ],
        quiz: [
          q("What does a dart do?", ["Decorates the hem", "Shapes flat fabric around curves like the bust or waist", "Joins two garments", "Marks the grainline"], 1, "Darts remove a wedge of fabric so it fits the body's curves."),
          q("Why follow the grainline when cutting?", ["It saves fabric", "So the garment hangs straight and doesn't twist", "It's faster", "It hides seams"], 1, "Cutting on grain keeps the fabric's threads aligned so the garment drapes as intended."),
        ],
      },
      {
        title: "Digital fashion, tech packs and portfolio",
        duration: "4–6 weeks",
        concepts: [
          "3D garment design in CLO 3D: patterns, fabrics and virtual fittings",
          "Tech packs: flats, measurements, materials and construction notes for factories",
          "A fashion portfolio: concept, illustrations, flats, fabric choices and finished pieces",
          "Ways in: assistant designer roles, freelance sampling, a small capsule label, or interiors-to-home-textiles crossover",
        ],
        practice: ["Design a 6-look capsule collection, build one look in CLO 3D, sew one look for real, and write a tech pack for it"],
        checkpoint: ["Your tech pack is complete enough for a sample maker", "Your portfolio tells one clear collection story"],
        resources: ["CLO 3D tutorials", "tech pack templates", "fashion portfolio examples"],
        videoSearch: "CLO 3D beginner tech pack fashion portfolio",
        videos: [
          v("ycA5PIgP9qA", "CLO3D Basics | CLO3D Beginners Tutorial", "My Dress Patterns"),
          v("yGhyPzKpYws", "How To Design A Tech Pack For Your Clothing Brand Like A Pro", "Adam's Mockups"),
          v("7_f03MwX8BA", "Follow my Fashion Design Portfolio to get your first job.", "With love, Christina "),
        ],
        quiz: [
          q("What is a tech pack for?", ["Social media", "Telling a factory exactly how to make the garment", "Pricing for customers", "Storing fabrics"], 1, "A tech pack holds flats, measurements, materials and construction details so a factory can produce the garment correctly."),
          q("Why are tools like CLO 3D increasingly used?", ["They replace fabric entirely", "They cut physical samples by showing fit and drape virtually", "They're required by fashion schools", "They only make renders"], 1, "Virtual samples save time, money and waste before physical sampling."),
        ],
      },
    ],
    finishLine: {
      name: "Capsule collection portfolio",
      description: "A 6-look capsule collection with mood board, illustrations, technical flats, fabric swatches, one look in CLO 3D, one sewn sample and a full tech pack.",
    },
    pitfalls: [
      "Only sketching and never learning how garments are actually constructed",
      "Treating fabric like upholstery: garments need drape and stretch, not durability alone",
      "A portfolio of unrelated pieces instead of one clear collection story",
    ],
    courses: [
      { platform: "youtube", query: "fashion design for beginners", note: "free lessons on illustration, fabrics and sewing" },
      { platform: "domestika", query: "fashion design", note: "creative courses on illustration and pattern making" },
      { platform: "skillshare", query: "fashion design", note: "short project-based fashion classes" },
      { platform: "udemy", query: "fashion design pattern making", note: "structured paid courses" },
    ],
    featured: {
      videos: [
        v("8NCP0WUqE7M", "How to Become a Fashion Designer Without College or a Degree | Fashion Design from Home", "Siddhi Mapxencar"),
        v("wjOMFo_026A", "Every Fashion Designer, Explained", "Bliss Foster"),
      ],
      courses: [
        course("CLO 3D (free trial and learning resources)", "CLO Virtual Fashion", "https://www.clo3d.com/", "free"),
        course("Fashion design classes", "Skillshare", "https://www.skillshare.com/en/browse/fashion-design", "paid"),
        course("Fashion design courses", "Udemy", "https://www.udemy.com/topic/fashion-design/", "paid"),
      ],
    },
    nextTopics: [
      next("Pattern making", "Go deeper into drafting and grading patterns for real production."),
      next("Sustainable fashion", "Design with materials and processes that brands increasingly need."),
      next("Fashion merchandising", "Learn how collections are planned, priced and sold."),
    ],
  },
};

const GRAPHIC_TO_UX: TransitionSample = {
  fromKeywords: ["graphic", "visual designer", "illustrator", "brand designer", "print designer", "dtp"],
  toKeywords: ["ux", "ui/ux", "ui designer", "product designer", "user experience", "interaction designer"],
  path: {
    summary: "Go from graphic designer to UX designer: keep your visual skills, add user research, information architecture and prototyping, and show it all in case studies.",
    transferableSkills: [
      bring("Typography, layout, grids and colour", "Visual and UI design: clear, consistent interfaces."),
      bring("Design tools (Illustrator, Photoshop, maybe Figma)", "Learning Figma quickly for wireframes, components and prototypes."),
      bring("Working from client briefs and taking feedback", "Stakeholder reviews and iterating on designs."),
      bring("Visual hierarchy and brand systems", "Building design systems and guiding attention in interfaces."),
    ],
    stages: [
      {
        title: "From graphics to user experience",
        duration: "2 weeks",
        concepts: [
          "What UX designers do: solving user problems, not only making things look good",
          "The design thinking process: empathise, define, ideate, prototype, test",
          "UX vs UI vs graphic design, and where your skills already fit",
        ],
        practice: ["Pick an app you use daily, list 5 usability problems, and sketch a fix for one"],
        checkpoint: ["Explain the difference between UX and UI with an example", "Describe the design thinking stages in your own words"],
        resources: ["introductory UX articles", "a free UX course"],
        videoSearch: "what is UX design graphic designer to UX",
        videos: [
          v("ziQEqGZB8GE", "What Is UX Design? - An Introduction (Full Guide For 2024)", "CareerFoundry"),
          v("iM9qsr0vzhQ", "Transitioning from Graphic Design to UX", "NNgroup"),
          v("xulYv7DVQ74", "How to go from Graphic Designer to Product (UX/UI) Designer", "Elizabeth Alli - DesignerUp"),
        ],
        quiz: [
          q("What does a UX designer focus on first?", ["Choosing brand colours", "Understanding users' needs and problems", "Picking fonts", "Writing code"], 1, "UX starts with what users need and where they struggle; visuals come later."),
          q("Which skill is the biggest new addition for a graphic designer moving to UX?", ["Typography", "User research and testing", "Colour theory", "Using a grid"], 1, "Graphic designers already have visual skills; research and testing with users is the main gap."),
        ],
      },
      {
        title: "User research",
        duration: "3–4 weeks",
        concepts: [
          "User interviews: open questions, avoiding leading questions, the funnel technique",
          "Usability testing: tasks, think-aloud and observing without helping",
          "Personas and journey maps built from real research, not guesses",
          "Synthesising findings with affinity mapping",
        ],
        practice: ["Interview 5 people about how they order food online, synthesise the findings, and write 3 problem statements"],
        checkpoint: ["Run a 30-minute interview without leading the participant", "Turn research notes into an affinity map and a persona"],
        resources: ["Nielsen Norman Group articles", "a user interview guide"],
        videoSearch: "user interviews usability testing personas UX",
        videos: [
          v("5tVbFfGDQCk", "How To Conduct User Interviews Like A Pro (UX Design)", "CareerFoundry"),
          v("n8MnoJyl3W4", "Usability Testing 101", "NNgroup"),
          v("u44pBnAn7cM", "Creating Personas for User Experience Research", "PlaybookUX"),
        ],
        quiz: [
          q("Which is a leading question?", ["Tell me about the last time you ordered food", "Don't you think this button is confusing?", "What happened next?", "How did you decide?"], 1, "It suggests the answer you want; good research questions are open and neutral."),
          q("How many users usually reveal most usability problems in one round of testing?", ["1", "About 5", "50", "500"], 1, "Around 5 participants typically uncover most major usability issues in a round."),
        ],
      },
      {
        title: "Information architecture and wireframes",
        duration: "3 weeks",
        concepts: [
          "Information architecture: organising content so people can find it",
          "User flows: the steps to complete a task",
          "Low- and mid-fidelity wireframes that test structure before visuals",
          "Card sorting and tree testing to check navigation",
        ],
        practice: ["Map the user flow for booking a doctor's appointment, then wireframe its 5 key screens in greyscale"],
        checkpoint: ["Create a sitemap and user flow for an app", "Wireframe a flow without using colour or images"],
        resources: ["IA and wireframing guides", "Figma wireframe kits"],
        videoSearch: "information architecture wireframing tutorial UX",
        videos: [
          v("OJLfjgVlwDo", "What Is Information Architecture? (UX Design Guide)", "CareerFoundry"),
          v("qpH7-KFWZRI", "How To Create Your First Wireframe (A UX Tutorial)", "CareerFoundry"),
          v("v39z0JPeIc8", "Information Architecture: 3 Key Models", "NNgroup"),
        ],
        quiz: [
          q("Why are early wireframes usually greyscale?", ["Colour is expensive", "To focus feedback on structure and flow, not looks", "Figma requires it", "Users prefer grey"], 1, "Leaving out visuals keeps discussion on layout, content and flow."),
          q("What does card sorting help you design?", ["Logos", "Navigation and content grouping that matches users' mental models", "Animations", "Colour palettes"], 1, "Users group content cards in ways that make sense to them, guiding your navigation."),
        ],
      },
      {
        title: "Figma prototypes and design systems",
        duration: "4 weeks",
        concepts: [
          "Figma: frames, auto layout, components and variants",
          "Interactive prototypes for usability testing",
          "Design systems: tokens, components and documentation",
          "Accessibility basics: contrast, touch targets and text size",
        ],
        practice: ["Turn your wireframes into a high-fidelity, clickable Figma prototype built from your own small component library, and test it with 3 users"],
        checkpoint: ["Build a responsive component with auto layout and variants", "Your prototype passes WCAG AA colour contrast"],
        resources: ["the Figma help centre", "Figma's design systems course", "WCAG contrast checkers"],
        videoSearch: "figma tutorial components variants design systems",
        videos: [
          v("jQ1sfKIl50E", "Figma Tutorial for Beginners (13-min crash course!)", "Flux Academy"),
          v("bnoPAezI6cw", "Figma Tutorial: Master Figma Components and Variants in 20 Minutes (Beginner Guide)", "DesignWithArash"),
          v("YLo6g58vUm0", "Welcome to design systems - Lesson 1 : Introduction to design systems", "Figma"),
        ],
        quiz: [
          q("What's the benefit of components in Figma?", ["They export faster", "Change the main component once and every instance updates", "They add animation", "They're required for prototypes"], 1, "Components keep designs consistent and make changes in one place."),
          q("What's the minimum WCAG AA contrast ratio for normal body text?", ["2:1", "3:1", "4.5:1", "10:1"], 2, "WCAG AA requires at least 4.5:1 for normal text (3:1 for large text)."),
        ],
      },
      {
        title: "Case studies and getting hired",
        duration: "4–5 weeks",
        concepts: [
          "UX case studies: problem, research, process, decisions, results and what you'd change",
          "Showing your thinking, not only final screens",
          "Portfolio site and presenting your graphic background as a strength",
          "UX interviews: portfolio walkthroughs, whiteboard challenges and app critiques",
        ],
        practice: ["Write two complete case studies from your projects and present one aloud in 15 minutes to a working designer for feedback"],
        checkpoint: ["Two case studies that show research and iteration", "You can walk through a case study in 15 minutes"],
        resources: ["case study examples", "UX interview guides"],
        videoSearch: "UX case study portfolio interview",
        videos: [
          v("JhlCgYAoTec", "How to design your UI/UX case study | Portfolio tips + detailed walkthrough", "Rachel How"),
          v("uZwRVckjQWI", "How to write your UX design case study", "chunbuns"),
          v("vu3xcQm7cEo", "The Essential UX Interview Questions (And How To Answer Them!)", "CareerFoundry"),
        ],
        quiz: [
          q("What do hiring managers look for most in a UX case study?", ["Only polished final screens", "Your process: research, decisions, trade-offs and results", "The number of tools used", "Long text"], 1, "They want to see how you think and decide, backed by research and outcomes."),
          q("How should you present your graphic design background?", ["Hide it", "As a strength in visual and UI design alongside your new UX skills", "As your only skill", "Only in the footer"], 1, "Strong visual skills plus research and IA make a well-rounded product designer."),
        ],
      },
    ],
    finishLine: {
      name: "UX portfolio with two case studies",
      description: "Two end-to-end case studies (research, IA, wireframes, a tested Figma prototype and results) on a portfolio site, presented in a mock interview.",
    },
    pitfalls: [
      "Showing only beautiful screens with no research or reasoning",
      "Skipping usability testing because the design 'looks right'",
      "Jumping to high-fidelity before the structure works",
    ],
    courses: [
      { platform: "coursera", query: "google ux design", note: "Google's UX certificate, free to audit" },
      { platform: "youtube", query: "UX design for beginners", note: "free lessons and case study walkthroughs" },
      { platform: "skillshare", query: "UX design figma", note: "project-based UI and UX classes" },
      { platform: "udemy", query: "UX design", note: "structured paid UX courses" },
    ],
    featured: {
      videos: [
        v("ZzpbldyEE_Q", "From Graphic Designer to UX Designer", "Relab Studios"),
        v("8pGEtW9lrp8", "How to transition from a Graphic Designer to a Product (UX/UI) Designer", "Gemma Helyer"),
      ],
      courses: [
        course("Google UX Design Professional Certificate", "Google on Coursera", "https://www.coursera.org/professional-certificates/google-ux-design", "audit"),
        course("Figma Help Center and courses", "Figma", "https://help.figma.com/hc/en-us", "free"),
        course("UX articles and research", "Nielsen Norman Group", "https://www.nngroup.com/articles/", "free"),
        course("UX design courses", "Interaction Design Foundation", "https://ixdf.org/", "paid"),
      ],
    },
    nextTopics: [
      next("UX research", "Go deeper into research methods that shape product decisions."),
      next("Interaction design", "Design micro-interactions and motion that make products feel great."),
      next("Product design", "Combine UX, UI and business thinking to own product features."),
    ],
  },
};

const TEACHER_TO_ID: TransitionSample = {
  fromKeywords: ["teacher", "tutor", "lecturer", "professor", "educator", "faculty", "trainer", "teaching"],
  toKeywords: ["instructional design", "learning design", "learning experience", "e-learning", "elearning", "curriculum design", "l&d"],
  path: {
    summary: "Go from teacher to instructional designer: turn your classroom skills into designing effective training and e-learning for adults in companies.",
    transferableSkills: [
      bring("Lesson planning and writing learning objectives", "Designing courses with measurable objectives and aligned activities."),
      bring("Assessment design: quizzes, rubrics and feedback", "Building knowledge checks and evaluating training impact."),
      bring("Explaining complex ideas simply", "Turning expert knowledge into clear e-learning and job aids."),
      bring("Managing many learners and adapting on the fly", "Designing for different audiences and iterating from feedback."),
    ],
    stages: [
      {
        title: "Instructional design foundations",
        duration: "2–3 weeks",
        concepts: [
          "What instructional designers do in companies, and how it differs from teaching",
          "The ADDIE model: analysis, design, development, implementation, evaluation",
          "Writing measurable objectives with Bloom's taxonomy",
          "Your transferable teaching skills, translated into corporate language",
        ],
        practice: ["Rewrite one of your lesson plans as a corporate training outline with three measurable objectives"],
        checkpoint: ["Explain ADDIE with an example from your teaching", "Write objectives that start with observable verbs"],
        resources: ["instructional design introductions", "a free ID course"],
        videoSearch: "what is instructional design ADDIE teacher transition",
        videos: [
          v("5n-ea5gIEMk", "What is Instructional Design?", "Devlin Peck"),
          v("JB6aDdq3HTI", "The ADDIE Model of Instructional Design", "Devlin Peck"),
          v("5eJ_HOzZsR0", "How to Transition from Teaching into Instructional Design", "Devlin Peck"),
        ],
        quiz: [
          q("Which is a measurable learning objective?", ["Understand customer service", "Handle a refund request in under 5 minutes using the 4-step process", "Appreciate the policy", "Know the system"], 1, "Measurable objectives use observable actions and criteria, not 'understand' or 'know'."),
          q("In ADDIE, what happens in the Analysis phase?", ["Building slides", "Finding the performance problem, audience and goals", "Launching the course", "Grading learners"], 1, "Analysis identifies what needs to change, for whom and why, before anything is designed."),
        ],
      },
      {
        title: "Adult learning and needs analysis",
        duration: "3 weeks",
        concepts: [
          "Andragogy: how adults learn differently from children (relevance, autonomy, experience)",
          "Action mapping: start from the business goal and what people need to do, not what they need to know",
          "When training isn't the answer: job aids, process fixes and tools",
          "Kirkpatrick's four levels for evaluating training",
        ],
        practice: ["Create an action map for a real workplace problem (e.g. late expense reports), deciding which actions need training and which need a job aid"],
        checkpoint: ["Build an action map from goal to practice activities", "Explain Kirkpatrick's four levels with examples"],
        resources: ["Cathy Moore's action mapping resources", "adult learning theory guides"],
        videoSearch: "andragogy action mapping Kirkpatrick model",
        videos: [
          v("0Z02Wu0QAqo", "The 6 Principles of Andragogy (Explained in 3 Minutes)", "Helpful Professor Explains!"),
          v("b12Xe_Fg-yk", "Action Mapping for Instructional Designers", "Devlin Peck"),
          v("7ThFfgocqrc", "The Kirkpatrick Model of Training Evaluation", "Devlin Peck"),
        ],
        quiz: [
          q("Action mapping starts with…", ["The content to cover", "The measurable business goal", "The authoring tool", "A quiz"], 1, "Action mapping begins with the business goal, then what people must do to reach it."),
          q("Kirkpatrick Level 3 measures…", ["Reaction", "Learning", "Behaviour on the job", "Results"], 2, "Level 3 checks whether people apply what they learned at work."),
        ],
      },
      {
        title: "Storyboards and scenario-based learning",
        duration: "3–4 weeks",
        concepts: [
          "Writing an e-learning storyboard: screens, narration, visuals and interactions",
          "Scenario-based learning: realistic decisions with consequences",
          "Microlearning and chunking content",
          "Accessible design: captions, alt text and readable layouts",
        ],
        practice: ["Write a storyboard for a 10-minute branching scenario where a new manager handles a difficult conversation"],
        checkpoint: ["A complete storyboard a developer could build from", "A scenario with at least two meaningful decision points and feedback"],
        resources: ["storyboard templates", "scenario-based e-learning examples"],
        videoSearch: "elearning storyboard scenario based learning",
        videos: [
          v("B90v9HHyURs", "How to Create a Storyboard for eLearning (Instructional Design)", "Devlin Peck"),
          v("XivNPfotfpg", "Top 5 eLearning Examples - Best Scenario-based eLearning Simulations", "Devlin Peck"),
          v("f8RE3jZs-bA", "Effective Scenario-based e-Learning for Instructional Designers", "Anna Sabramowicz"),
        ],
        quiz: [
          q("Why use scenarios instead of information slides?", ["They're shorter", "Learners practise realistic decisions and see consequences", "They need no writing", "Authoring tools require them"], 1, "Scenarios build the judgement people need on the job, not just recall."),
          q("What does a storyboard document?", ["The project budget", "Each screen's text, visuals, audio and interactions", "Learner grades", "The LMS settings"], 1, "It's the blueprint developers and reviewers use before building."),
        ],
      },
      {
        title: "Authoring tools",
        duration: "4 weeks",
        concepts: [
          "Articulate Storyline: slides, triggers, states and variables",
          "Articulate Rise 360 for fast, responsive courses",
          "SCORM and LMSs: how courses are published and tracked",
          "Visual design basics for e-learning",
        ],
        practice: ["Build your branching scenario in Storyline using triggers and variables, and publish it as SCORM"],
        checkpoint: ["Build an interaction with triggers, states and a variable in Storyline", "Publish a Rise course and test it on a phone"],
        resources: ["Articulate's free trial and community", "authoring tool tutorials"],
        videoSearch: "Articulate Storyline Rise 360 tutorial beginners",
        videos: [
          v("7u1BbQ1D0Q8", "How To Learn Articulate Storyline In 10 Minutes", "Mark Spermon"),
          v("czHoZ0xUTv4", "Learn Articulate Rise 360 In 15 Minutes", "Mark Spermon"),
          v("_dIkKiVTPaY", "Beginner's Guide to Articulate Storyline | How-To Workshop", "The eLearning Designer's Academy by Tim Slade"),
        ],
        quiz: [
          q("What is SCORM?", ["A video format", "A standard that lets courses report completion and scores to an LMS", "An authoring tool", "A grading rubric"], 1, "SCORM packages courses so any compliant LMS can launch and track them."),
          q("In Storyline, what makes something happen when a learner clicks?", ["A layer", "A trigger", "A theme", "A master slide"], 1, "Triggers define actions (show a layer, change a state) when events like clicks happen."),
        ],
      },
      {
        title: "Portfolio and getting hired",
        duration: "4–5 weeks",
        concepts: [
          "An ID portfolio: 3 projects with the problem, your process and the finished piece",
          "Rewriting your CV: from 'taught students' to 'designed learning that changed performance'",
          "ID interviews: STAR answers, a portfolio walkthrough and design tests",
          "Ways in: L&D roles, ed-tech, corporate training, freelance course building",
        ],
        practice: ["Publish a portfolio site with your scenario, a Rise course and a job aid, each with a short write-up"],
        checkpoint: ["Three portfolio pieces with process write-ups", "A CV in corporate L&D language", "Practised answers to 10 common ID interview questions"],
        resources: ["ID portfolio examples", "ID interview guides"],
        videoSearch: "instructional design portfolio interview questions",
        videos: [
          v("p-tBgyt3mBg", "How to Create an Instructional Design Portfolio", "Devlin Peck"),
          v("Dsz5w8-dICw", "Instructional Design Portfolios: What to Include & What to Avoid", "Devlin Peck"),
          v("eJHNahEwT_Y", "11 Instructional Designer Interview Questions and How to Answer Them", "iSpring"),
        ],
        quiz: [
          q("How should a teacher describe classroom experience on an ID CV?", ["List the subjects taught", "Frame it as designing learning that improved measurable outcomes", "Leave it out", "List school names only"], 1, "Hiring managers want impact: designed, measured, improved."),
          q("What's the STAR method?", ["A rating scale", "Situation, Task, Action, Result: a structure for interview answers", "An authoring tool", "A learning theory"], 1, "STAR gives clear, evidence-based answers to behavioural questions."),
        ],
      },
    ],
    finishLine: {
      name: "Instructional design portfolio",
      description: "A portfolio site with a branching scenario built in Storyline, a Rise course and a job aid, each with an action map or storyboard and a short write-up, plus a CV in L&D language.",
    },
    pitfalls: [
      "Designing corporate training like a school lesson full of information",
      "Leading with 'I'm a teacher' instead of what you designed and its impact",
      "Learning every tool instead of building portfolio pieces",
    ],
    courses: [
      { platform: "coursera", query: "instructional design", note: "university ID courses, free to audit" },
      { platform: "youtube", query: "instructional design for beginners", note: "free lessons and portfolio advice" },
      { platform: "linkedin", query: "instructional design", note: "short courses on ID and authoring tools" },
      { platform: "udemy", query: "articulate storyline", note: "paid authoring tool courses" },
    ],
    featured: {
      videos: [
        v("kr98Yc5Pimc", "📚teacher to instructional design career 💻 | everything you need to know!", "by Sam Taylor"),
        v("TTsXLO6vi-M", "From Teacher to Instructional Designer: What skills transfer?", "InstructionalDesignCompany"),
      ],
      courses: [
        course("Instructional Design Foundations and Applications", "University of Illinois on Coursera", "https://www.coursera.org/learn/instructional-design-foundations-applications", "audit"),
        course("Instructional design guides and tutorials", "Devlin Peck", "https://www.devlinpeck.com/", "free"),
        course("E-Learning Heroes community", "Articulate", "https://community.articulate.com/", "free"),
        course("Build Your Skills as an Instructional Designer (learning path)", "LinkedIn Learning", "https://www.linkedin.com/learning/paths/build-your-skills-as-an-instructional-designer", "paid"),
        course("Articulate 360 (Storyline, Rise and training)", "Articulate", "https://www.articulate.com/360/", "paid"),
      ],
    },
    nextTopics: [
      next("Learning experience design", "Design whole learning journeys, not just single courses."),
      next("Video production for learning", "Create short, effective training videos."),
      next("Learning analytics", "Measure what training actually changes using data."),
    ],
  },
};

const ACCOUNTANT_TO_DA: TransitionSample = {
  fromKeywords: ["accountant", "accounting", "accounts", "chartered", " ca ", "auditor", "audit", "bookkeep", " cma ", "acca", "finance executive", "financial analyst", "tax consultant"],
  toKeywords: ["data analyst", "data analytics", "business analyst", " bi ", "bi analyst", "power bi", "analytics"],
  path: {
    summary: "Go from accountant to data analyst: build on Excel and finance knowledge with SQL, Power BI and Python, and analyse business data end to end.",
    transferableSkills: [
      bring("Advanced Excel: formulas, lookups and pivot tables", "The fastest analysis tool in most companies, and a bridge to SQL."),
      bring("Understanding financial statements and business drivers", "Asking the right questions and spotting what matters in data."),
      bring("Accuracy, reconciliation and audit trails", "Data cleaning, validation and trustworthy reporting."),
      bring("Reporting to managers", "Presenting insights in dashboards and short summaries."),
    ],
    stages: [
      {
        title: "Excel to analytics",
        duration: "2–3 weeks",
        concepts: [
          "Pivot tables and pivot charts for fast summaries",
          "Power Query: importing, cleaning and combining data without manual work",
          "What data analysts do day to day, and how it overlaps with your work",
          "Thinking in tables: rows as records, columns as fields",
        ],
        practice: ["Use Power Query to combine 12 monthly expense files into one table, then build a pivot of spend by category and month"],
        checkpoint: ["Automate a monthly report refresh with Power Query", "Answer three business questions with one pivot table"],
        resources: ["Excel Power Query tutorials", "a data analyst career guide"],
        videoSearch: "excel pivot tables power query data analyst",
        videos: [
          v("UsdedFoTA68", "Excel Pivot Table EXPLAINED in 10 Minutes (Productivity tips included!)", "Leila Gharani"),
          v("x7mzOYEn0XA", "Power Query for Beginners: Automate Your Excel Work in 25 Mins", "Leila Gharani"),
          v("dJA7k58zlA8", "How I'd become a data analyst (if i had to start over) in 2026", "Agatha"),
        ],
        quiz: [
          q("What does Power Query do best?", ["Draw charts", "Repeatable importing and cleaning of data", "Write macros", "Calculate tax"], 1, "Power Query records cleaning steps so you can refresh them on new data with one click."),
          q("In a pivot table, where do you put the field you want to total?", ["Filters", "Rows", "Values", "Columns"], 2, "Values holds the numbers to aggregate, such as sum of amount."),
        ],
      },
      {
        title: "SQL",
        duration: "4 weeks",
        concepts: [
          "SELECT, WHERE, ORDER BY and LIMIT",
          "GROUP BY with SUM, COUNT and AVG; HAVING to filter groups",
          "JOINs: inner and left joins between tables like invoices and customers",
          "Window functions: running totals, rankings and month-over-month change",
        ],
        practice: ["Load a sample sales or general-ledger dataset into SQLite or PostgreSQL and write 20 queries, including a running monthly total with a window function"],
        checkpoint: ["Join three tables to answer a business question", "Calculate month-over-month growth with LAG"],
        resources: ["a free SQL course", "an online SQL practice site"],
        videoSearch: "SQL for beginners joins window functions",
        videos: [
          v("7S_tz1z_5bA", "SQL Course for Beginners [Full Course]", "Programming with Mosh"),
          v("9yeOJ0ZMUYw", "SQL Joins Explained  |¦| Joins in SQL |¦| SQL Tutorial", "Socratica"),
          v("rIcB4zMYMas", "SQL Window Functions | Clearly Explained | PARTITION BY, ORDER BY, ROW_NUMBER, RANK, DENSE_RANK", "Maven Analytics"),
        ],
        quiz: [
          q("Which join keeps every invoice, even those without a matching customer?", ["INNER JOIN", "LEFT JOIN from invoices to customers", "CROSS JOIN", "No join"], 1, "A left join keeps all rows from the left table and fills missing matches with NULL."),
          q("What's the difference between WHERE and HAVING?", ["None", "WHERE filters rows before grouping; HAVING filters groups after", "HAVING is faster", "WHERE only works on text"], 1, "Use HAVING to filter on aggregates like SUM after GROUP BY."),
        ],
      },
      {
        title: "Power BI dashboards",
        duration: "4 weeks",
        concepts: [
          "Loading and modelling data: a star schema with fact and dimension tables",
          "DAX measures: SUM, CALCULATE and time intelligence like year-to-date",
          "Dashboard design: one question per visual, clear KPIs, filters",
          "Publishing and sharing reports",
        ],
        practice: ["Build a finance dashboard (revenue, expenses, margin, YTD vs last year) from your SQL data, with slicers by region and month"],
        checkpoint: ["Write a YTD measure with DAX", "A stakeholder can answer 3 questions from your dashboard without help"],
        resources: ["Microsoft Learn's Power BI path", "dashboard design guides"],
        videoSearch: "power bi tutorial DAX dashboard design",
        videos: [
          v("c7LrqSxjJQQ", "Power BI from ZERO to Your First Dashboard (in 20 Minutes)", "Leila Gharani"),
          v("waG_JhBgUpM", "📊 How to use Power BI DAX - Tutorial", "Kevin Stratvert"),
          v("t3cAUt7sOQg", "12 Dashboard design tips for better data visualization", "Geckoboard"),
        ],
        quiz: [
          q("In a star schema, what does a fact table hold?", ["Descriptions like customer names", "Measurable events like transactions and amounts", "Only dates", "Report layouts"], 1, "Fact tables hold events and numbers; dimension tables describe them (customer, product, date)."),
          q("Which DAX function changes the filter context of a calculation?", ["SUM", "CALCULATE", "RELATED", "FORMAT"], 1, "CALCULATE evaluates an expression under modified filters, the key to most DAX measures."),
        ],
      },
      {
        title: "Python for data analysis",
        duration: "4 weeks",
        concepts: [
          "Python basics in Jupyter notebooks",
          "Pandas: loading, cleaning, grouping and merging data",
          "Charts with Matplotlib or Seaborn",
          "Automating reports you used to build by hand",
        ],
        practice: ["Rebuild your monthly finance analysis in a Pandas notebook that loads raw files, cleans them and outputs the summary tables and charts"],
        checkpoint: ["Merge and group data in Pandas to match your SQL results", "Automate a report end to end in a notebook"],
        resources: ["a Python for data analysis course", "the Pandas documentation"],
        videoSearch: "pandas tutorial python for data analysis",
        videos: [
          v("EXIgjIBu4EU", "Learn Pandas in 30 Minutes - Python Pandas Tutorial", "Tech With Tim"),
          v("r-uOLxNrNk8", "Data Analysis with Python - Full Course for Beginners (Numpy, Pandas, Matplotlib, Seaborn)", "freeCodeCamp.org"),
          v("dcqPhpY7tWk", "What is Pandas? Why and How to Use Pandas in Python", "Python Programmer"),
        ],
        quiz: [
          q("Which Pandas method is like a pivot or GROUP BY?", ["merge", "groupby", "head", "dropna"], 1, "groupby splits data into groups and aggregates them, like SQL's GROUP BY."),
          q("Why automate a report in Python?", ["It looks nicer", "It's repeatable, faster and less error-prone than manual steps", "Excel can't open the output", "Managers require it"], 1, "Automation removes repetitive manual work and copy-paste errors."),
        ],
      },
      {
        title: "Portfolio and getting hired",
        duration: "4–5 weeks",
        concepts: [
          "Portfolio projects that use finance knowledge: spend analysis, profitability, forecasting",
          "Telling stories with data: question, analysis, insight, recommendation",
          "Rewriting your CV and LinkedIn for analyst roles",
          "Data analyst interviews: SQL tests, Excel tasks and case questions",
        ],
        practice: ["Publish 3 projects (a SQL analysis, a Power BI dashboard and a Python notebook) on GitHub or a portfolio site, each with a one-page summary of insights"],
        checkpoint: ["Three projects with clear business recommendations", "Pass a timed SQL practice test", "Your CV leads with analytics projects"],
        resources: ["portfolio project guides", "data analyst interview question banks"],
        videoSearch: "data analyst portfolio project interview",
        videos: [
          v("j9Q84_Gn_T0", "Building Your First Data Analytics Portfolio: A Step-by-Step Guide (2024)", "CareerFoundry"),
          v("2jGhQpbzHes", "SQL Data Analyst Portfolio Project | Like I Do in My Real Projects", "Data with Baraa"),
          v("5RzGOqZe-Gk", "How To Answer Data Analyst Interview Questions to Get a Job", "Agatha"),
        ],
        quiz: [
          q("What makes a portfolio project stand out?", ["Fancy colours", "A real business question, clear analysis and a recommendation", "Using every tool", "Very long notebooks"], 1, "Hiring managers want to see you turn data into decisions."),
          q("How should you use your accounting background in interviews?", ["Avoid mentioning it", "Show how finance knowledge helps you ask better questions of data", "Only talk about tax", "Apologise for it"], 1, "Domain knowledge is a real advantage; analysts who understand the business are valuable."),
        ],
      },
    ],
    finishLine: {
      name: "Finance analytics portfolio",
      description: "Three published projects (a SQL analysis of sales or ledger data, a Power BI finance dashboard and an automated Pandas report), each with business insights, plus a CV for analyst roles.",
    },
    pitfalls: [
      "Staying in Excel only and avoiding SQL, which nearly every analyst job tests",
      "Building dashboards with no clear business question",
      "Downplaying your finance knowledge instead of making it your niche",
    ],
    courses: [
      { platform: "coursera", query: "google data analytics", note: "Google's certificate, free to audit" },
      { platform: "youtube", query: "data analyst bootcamp", note: "free full courses on SQL, Excel and Power BI" },
      { platform: "freecodecamp", query: "data analysis with python", note: "free Python data analysis certification" },
      { platform: "udemy", query: "power bi", note: "structured paid Power BI courses" },
    ],
    featured: {
      videos: [
        v("9EVPu1iYLK8", "Data Analytics for Accountants - Future-proof Your Career", "CMA Coach / CMA Exam Academy"),
        v("cnjhHZNJEDk", "2026 FREE Data Analyst Bootcamp [24 Hours+] for FREE | SQL, Excel, Python, Power BI, GitHub, AWS", "Alex The Analyst"),
      ],
      courses: [
        course("Google Data Analytics Professional Certificate", "Google on Coursera", "https://www.coursera.org/professional-certificates/google-data-analytics", "audit"),
        course("Microsoft Power BI Data Analyst (PL-300)", "Microsoft Learn", "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/", "free"),
        course("Intro to SQL", "Kaggle Learn", "https://www.kaggle.com/learn/intro-to-sql", "free"),
        course("Data Analysis with Python", "freeCodeCamp", "https://www.freecodecamp.org/learn/data-analysis-with-python/", "free"),
        course("Microsoft Power BI Desktop for Business Intelligence", "Udemy", "https://www.udemy.com/course/microsoft-power-bi-up-running-with-power-bi-desktop/", "paid"),
        course("The Complete SQL Bootcamp: Go from Zero to Hero", "Udemy", "https://www.udemy.com/course/the-complete-sql-bootcamp/", "paid"),
      ],
    },
    nextTopics: [
      next("Financial data analysis", "Combine finance and analytics for FP&A and fintech roles."),
      next("Data science", "Add statistics and machine learning to predict, not just report."),
      next("Advanced SQL", "Handle large datasets and complex business logic."),
    ],
  },
};

const DA_TO_DS: TransitionSample = {
  fromKeywords: ["data analyst", "analyst", "business analyst", "bi developer", "mis executive", "reporting analyst"],
  toKeywords: ["data scientist", "data science"],
  path: {
    summary: "Go from data analyst to data scientist: add statistics, machine learning and experimentation to your SQL and reporting skills, and ship models that drive decisions.",
    transferableSkills: [
      bring("SQL and data cleaning", "Most data science time is getting and preparing data; you already do this."),
      bring("Business context and stakeholder communication", "Choosing problems worth modelling and explaining results."),
      bring("Dashboards and visualisation", "Exploratory analysis and presenting model results clearly."),
      bring("Python or Excel analysis", "A head start on Pandas and feature engineering."),
    ],
    stages: [
      {
        title: "Statistics for data science",
        duration: "4 weeks",
        concepts: [
          "Probability distributions, sampling and the central limit theorem",
          "Hypothesis tests, p-values and confidence intervals",
          "Correlation, regression to the mean and common traps",
          "How the data scientist role differs from the analyst role",
        ],
        practice: ["Test whether a change in a public dataset (e.g. weekday vs weekend sales) is statistically significant, and report a confidence interval"],
        checkpoint: ["Explain a p-value correctly in one sentence", "Choose and run the right test for a comparison"],
        resources: ["a statistics for data science course", "StatQuest videos"],
        videoSearch: "statistics hypothesis testing p values data scientist",
        videos: [
          v("0oc49DyA3hU", "Hypothesis Testing and The Null Hypothesis, Clearly Explained!!!", "StatQuest with Josh Starmer"),
          v("vemZtEM63GY", "p-values: What they are and how to interpret them", "StatQuest with Josh Starmer"),
          v("EMq4PH7PCeA", "How to Go From Data Analyst to Data Scientist", "Ken Jee"),
        ],
        quiz: [
          q("A p-value of 0.03 means…", ["There's a 3% chance the hypothesis is true", "If there were no real effect, data this extreme would appear about 3% of the time", "The effect is large", "The test failed"], 1, "A p-value is the probability of data at least this extreme assuming the null hypothesis is true."),
          q("Why use a confidence interval as well as a p-value?", ["It's required", "It shows the likely size and uncertainty of the effect", "It replaces the data", "It's always narrower"], 1, "A significant result can still be tiny; the interval shows how big the effect plausibly is."),
        ],
      },
      {
        title: "Machine learning core",
        duration: "4–5 weeks",
        concepts: [
          "Linear and logistic regression: assumptions, coefficients and interpretation",
          "Tree models: decision trees and random forests",
          "Feature engineering: encoding categories, scaling, dates and leakage",
          "Scikit-learn pipelines for repeatable modelling",
        ],
        practice: ["Predict customer churn on a public telecom dataset with logistic regression and a random forest, inside a scikit-learn pipeline"],
        checkpoint: ["Interpret logistic regression coefficients for a stakeholder", "Spot and remove a leaky feature"],
        resources: ["StatQuest ML videos", "the scikit-learn documentation"],
        videoSearch: "linear regression logistic regression feature engineering",
        videos: [
          v("nk2CQITm_eo", "Linear Regression, Clearly Explained!!!", "StatQuest with Josh Starmer"),
          v("yIYKR4sgzI8", "StatQuest: Logistic Regression", "StatQuest with Josh Starmer"),
          v("pYVScuY-GPk", "What is feature engineering | Feature Engineering Tutorial Python # 1", "codebasics"),
        ],
        quiz: [
          q("What is data leakage?", ["Losing data", "Using information in training that wouldn't be available when predicting", "A slow database", "Too few features"], 1, "Leakage makes models look great in testing but fail in reality, e.g. using 'refund issued' to predict churn."),
          q("Logistic regression predicts…", ["A continuous number", "The probability of a class", "Clusters", "A time series"], 1, "It outputs a probability between 0 and 1, then a threshold turns it into a class."),
        ],
      },
      {
        title: "Model evaluation and experiments",
        duration: "3–4 weeks",
        concepts: [
          "Cross-validation and honest test sets",
          "Precision, recall, ROC curves and choosing a threshold for the business",
          "A/B testing: design, sample size, and reading results",
          "Explaining model results to non-technical people",
        ],
        practice: ["Choose a churn-model threshold based on the cost of a retention offer vs a lost customer, and present the trade-off"],
        checkpoint: ["Pick a threshold using business costs, not 0.5 by default", "Design an A/B test with a sample size calculation"],
        resources: ["evaluation metric guides", "an A/B testing course"],
        videoSearch: "cross validation ROC AUC AB testing data science",
        videos: [
          v("fSytzGwwBVw", "Machine Learning Fundamentals: Cross Validation", "StatQuest with Josh Starmer"),
          v("4jRBRDbJemM", "ROC and AUC, Clearly Explained!", "StatQuest with Josh Starmer"),
          v("VpTlNRUcIDo", "A/B Testing Fundamentals: What Every Data Scientist Needs to Know!", "Emma Ding"),
        ],
        quiz: [
          q("Why calculate sample size before an A/B test?", ["To finish faster", "So the test can reliably detect the effect you care about", "It's a legal rule", "To pick the winner"], 1, "Too few users means real effects may go undetected; sample size planning avoids that."),
          q("What does AUC measure?", ["Accuracy at 0.5", "How well the model ranks positives above negatives across all thresholds", "Training time", "Number of features"], 1, "AUC summarises ranking quality across every threshold."),
        ],
      },
      {
        title: "Advanced models and forecasting",
        duration: "4 weeks",
        concepts: [
          "Gradient boosting with XGBoost or LightGBM",
          "Hyperparameter tuning and avoiding overfitting",
          "Time series forecasting: trends, seasonality and time-based validation",
          "Sharing models: a simple app or API",
        ],
        practice: ["Forecast weekly sales with XGBoost using lag and calendar features, validate on later weeks, and beat a seasonal baseline"],
        checkpoint: ["Tune a boosted model with cross-validation", "Your forecast beats the naive baseline on future data"],
        resources: ["the XGBoost documentation", "a time series forecasting tutorial"],
        videoSearch: "xgboost explained time series forecasting python",
        videos: [
          v("OtD8wVaFm6E", "XGBoost Part 1 (of 4): Regression", "StatQuest with Josh Starmer"),
          v("GrJP9FLV3FE", "XGBoost in Python from Start to Finish", "StatQuest with Josh Starmer"),
          v("vV12dGe_Fho", "Time Series Forecasting with XGBoost - Use python and machine learning to predict energy consumption", "Rob Mulla"),
        ],
        quiz: [
          q("How does gradient boosting build its model?", ["One big tree", "Many small trees, each correcting the errors of the previous ones", "Random guessing", "Only linear models"], 1, "Boosting adds trees sequentially, each fitting the remaining errors."),
          q("Why are lag features useful in forecasting?", ["They're random", "Recent past values strongly predict the next ones", "They remove seasonality", "They're required by XGBoost"], 1, "Last week's sales are often the best single predictor of this week's."),
        ],
      },
      {
        title: "Portfolio and getting hired",
        duration: "4–5 weeks",
        concepts: [
          "Portfolio projects with business impact: churn, forecasting, experiment analysis",
          "A simple deployed demo (e.g. Streamlit) for one model",
          "Rewriting your CV: from reports to models and decisions",
          "Data science interviews: statistics, ML concepts, SQL, case studies and A/B questions",
        ],
        practice: ["Publish 3 projects (churn model, sales forecast, A/B test analysis) with one deployed as a Streamlit app"],
        checkpoint: ["Three projects with stated business impact", "One live model demo", "Practised 20 statistics and ML interview questions"],
        resources: ["data science portfolio guides", "interview question banks"],
        videoSearch: "data science portfolio projects interview",
        videos: [
          v("QMP858aZcow", "5 Impactful Data Science Projects For Your Portfolio", "Ken Jee"),
          v("Yk-unX4KnV4", "Data Science Portfolio Project From Scratch | Building a YouTube Data Dashboard with Streamlit", "Ken Jee"),
          v("aXUsrKPTBvY", "Live Breakdown of Common Data Science Interview Questions | Kaggle", "Kaggle"),
        ],
        quiz: [
          q("What should each portfolio project state clearly?", ["The libraries used", "The business problem, approach, result and impact", "How long it took", "Your grades"], 1, "Impact and reasoning are what make projects persuasive."),
          q("In a case interview, what should you do first?", ["Name an algorithm", "Clarify the goal, metric and constraints", "Write code", "Ask about salary"], 1, "Clarifying the problem shows judgement before jumping to a model."),
        ],
      },
    ],
    finishLine: {
      name: "Data science portfolio",
      description: "Three published projects (a churn model with a business-based threshold, a sales forecast beating a baseline and an A/B test analysis), one deployed as a live app, plus a CV for data scientist roles.",
    },
    pitfalls: [
      "Jumping to deep learning before mastering statistics and classic ML",
      "Reporting accuracy without business context or a baseline",
      "Projects on toy datasets with no clear decision attached",
    ],
    courses: [
      { platform: "coursera", query: "ibm data science", note: "IBM's certificate, free to audit" },
      { platform: "youtube", query: "statquest machine learning", note: "clear free explanations of stats and ML" },
      { platform: "khanacademy", query: "statistics and probability", note: "free statistics fundamentals" },
      { platform: "udemy", query: "machine learning A-Z", note: "structured paid ML courses" },
    ],
    featured: {
      videos: [
        v("PW6aDIKWv6c", "Data Analyst to Data Scientist in 2026 (The Realistic Path)", "Marina Wyss - AI & Machine Learning"),
        v("qewHAdfzLOw", "Data Analyst Reacts: How to Go From Data Analyst to Data Scientist", "Alex The Analyst"),
      ],
      courses: [
        course("IBM Data Science Professional Certificate", "IBM on Coursera", "https://www.coursera.org/professional-certificates/ibm-data-science", "audit"),
        course("Intro to Machine Learning", "Kaggle Learn", "https://www.kaggle.com/learn/intro-to-machine-learning", "free"),
        course("Machine Learning Specialization", "Stanford & DeepLearning.AI on Coursera", "https://www.coursera.org/specializations/machine-learning-introduction", "audit"),
        course("Data Scientist in Python (career track)", "DataCamp", "https://www.datacamp.com/tracks/data-scientist-in-python", "paid"),
        course("Machine Learning A-Z: ML, DL and AI with Python and R", "Udemy", "https://www.udemy.com/course/machinelearning/", "paid"),
      ],
    },
    nextTopics: [
      next("Causal inference", "Answer 'what caused this?' beyond correlation."),
      next("MLOps", "Deploy and monitor models in production."),
      next("Deep learning", "Model text, images and complex patterns."),
    ],
  },
};

const SALES_TO_PM: TransitionSample = {
  fromKeywords: ["sales", "business development", " bde ", "account executive", "account manager", "customer success", "pre-sales", "presales", "relationship manager", "marketing"],
  toKeywords: ["product manager", "product management", "product owner", " pm "],
  path: {
    summary: "Go from sales to product manager: turn your customer knowledge into discovering problems, prioritising, working with engineers and shipping products people buy.",
    transferableSkills: [
      bring("Deep customer and market knowledge", "Knowing real customer pains and objections, the heart of product discovery."),
      bring("Negotiation and stakeholder management", "Aligning engineering, design and leadership on priorities."),
      bring("Hitting targets and working with numbers", "Owning product metrics like activation, retention and revenue."),
      bring("Clear, persuasive communication", "Writing specs and selling a roadmap internally."),
    ],
    stages: [
      {
        title: "What product managers really do",
        duration: "2 weeks",
        concepts: [
          "The PM role: deciding what to build and why, with engineering and design",
          "Product vs project management",
          "The product lifecycle: discovery, delivery, launch and iteration",
          "How sales experience maps to PM work",
        ],
        practice: ["Shadow or interview two PMs (internal if possible) and write down how they spend a typical week"],
        checkpoint: ["Explain how a PM differs from a project manager", "Describe the lifecycle of one feature you've sold"],
        resources: ["PM day-in-the-life videos", "product management articles"],
        videoSearch: "what does a product manager do transition into PM",
        videos: [
          v("U-lYLSlYU1o", "What Does a Product Manager Do All Day? | Day in the Life of a PM", "Aced (formerly Exponent)"),
          v("yUOC-Y0f5ZQ", "What do product managers do? - Agile Coach", "Atlassian"),
          v("OXo7nl4Yv34", "How to Transition to Product Management from Any Role", "Aced (formerly Exponent)"),
        ],
        quiz: [
          q("What's a PM's core responsibility?", ["Writing code", "Deciding what to build and why, based on user and business value", "Closing deals", "Managing budgets only"], 1, "PMs own the 'what' and 'why'; engineering owns the 'how'."),
          q("How does product management differ from project management?", ["They're the same", "PM decides what to build; project management delivers a defined plan on time", "Project managers set strategy", "PMs only do launches"], 1, "Product is about choosing the right thing; project is about delivering the plan."),
        ],
      },
      {
        title: "Customer discovery",
        duration: "3–4 weeks",
        concepts: [
          "Problem interviews that avoid pitching: The Mom Test",
          "Jobs to be Done: what customers are really 'hiring' a product for",
          "Turning sales objections and lost deals into problem hypotheses",
          "Validating problems before building solutions",
        ],
        practice: ["Run 5 customer interviews about a problem you've heard in sales calls, without pitching, and write a problem statement with evidence"],
        checkpoint: ["Conduct an interview with no leading questions or pitching", "Write a JTBD statement backed by interview quotes"],
        resources: ["The Mom Test book", "JTBD guides"],
        videoSearch: "customer discovery mom test jobs to be done",
        videos: [
          v("pk3VOO9WT8o", "TOP 3 TIPS from THE MOM TEST by Rob Fitzpatrick - Book Summary #12", "Rick Kettner"),
          v("Stc0beAxavY", "Clay Christensen: The Jobs to be Done Theory", "HubSpot Marketing"),
          v("dbVN6EYql6k", "Jobs to be Done with Examples", "PlaybookUX"),
        ],
        quiz: [
          q("According to The Mom Test, which question is best?", ["Would you buy this?", "Tell me about the last time this problem happened", "Do you like my idea?", "How much would you pay?"], 1, "Asking about real past behaviour gives honest evidence; opinions about the future don't."),
          q("Why can sales feedback mislead product decisions?", ["It's always wrong", "It over-represents loud prospects and requested features rather than underlying problems", "Sales never talks to customers", "It's too detailed"], 1, "Feature requests from deals are signals; PMs dig for the underlying problem across many customers."),
        ],
      },
      {
        title: "Prioritisation, specs and roadmaps",
        duration: "3–4 weeks",
        concepts: [
          "Prioritisation with RICE (reach, impact, confidence, effort)",
          "Writing a PRD: problem, goals, user stories, requirements and success metrics",
          "Outcome-based roadmaps instead of feature lists",
          "Saying no with data",
        ],
        practice: ["Score 10 feature requests with RICE, pick the top one, and write a one-page PRD with success metrics"],
        checkpoint: ["A PRD an engineer could estimate from", "Defend your top priority with RICE scores"],
        resources: ["PRD templates", "roadmapping guides"],
        videoSearch: "RICE prioritization PRD product roadmap",
        videos: [
          v("pzyRafZJ-0M", "What is the RICE Scoring Model?", "ProductPlan"),
          v("JJzODsXsCt0", "How to Write a Product Requirements Document - Create PRD | Free Notion Template", "HelloPM"),
          v("b4YVHTqQPk8", "How to Build a Product Roadmap in 6½ Simple Steps", "Eleken"),
        ],
        quiz: [
          q("In RICE, what does 'C' stand for?", ["Cost", "Confidence", "Customers", "Complexity"], 1, "Confidence reflects how sure you are about reach and impact estimates."),
          q("What belongs in a PRD's success metrics?", ["The tech stack", "Measurable outcomes like '+10% activation within 30 days'", "The launch party", "Team names"], 1, "Metrics define what success looks like so the team can measure it."),
        ],
      },
      {
        title: "Working with engineering and data",
        duration: "3–4 weeks",
        concepts: [
          "Agile and Scrum: sprints, backlogs, stand-ups and retros",
          "Writing good user stories and acceptance criteria",
          "Product metrics: north star, activation, retention and funnels",
          "Basic SQL to answer your own product questions",
        ],
        practice: ["Write 5 user stories with acceptance criteria for your PRD, and use SQL on a sample dataset to measure a funnel's drop-off"],
        checkpoint: ["Explain a sprint from planning to retro", "Calculate a conversion funnel with SQL"],
        resources: ["Scrum guides", "SQL for PMs tutorials", "product analytics guides"],
        videoSearch: "scrum explained north star metric SQL for product managers",
        videos: [
          v("9TycLR0TqFA", "Introduction to Scrum - 7 Minutes", "Uzility"),
          v("ZwrRJlhJBrE", "How to Set a Great North Star Metric", "Aced (formerly Exponent)"),
          v("_vnoEKgmL1I", "SQL explained for Product Managers", "Department of Product"),
        ],
        quiz: [
          q("What is a north star metric?", ["Monthly revenue only", "The one metric that best captures the value customers get", "Number of features shipped", "Team velocity"], 1, "It aligns the team around customer value that drives long-term growth."),
          q("What do acceptance criteria define?", ["The deadline", "When a user story is done and working as intended", "The designer", "The price"], 1, "They make 'done' testable and shared between PM and engineering."),
        ],
      },
      {
        title: "Portfolio and getting hired",
        duration: "4–5 weeks",
        concepts: [
          "A PM portfolio: discovery notes, a PRD, a roadmap and a metrics plan",
          "Internal moves: volunteering for product work in your current company",
          "PM interviews: product sense, metrics, execution and behavioural rounds",
          "Telling your sales-to-PM story",
        ],
        practice: ["Do 5 mock PM interviews (product sense and metrics) and refine a 2-minute 'why PM' story"],
        checkpoint: ["A portfolio case study from discovery to PRD", "Answer a product sense question with a clear structure", "Apply for internal or associate PM roles"],
        resources: ["PM interview guides", "mock interview partners"],
        videoSearch: "product manager interview product sense",
        videos: [
          v("dNtks5NfUwc", "How to Answer ANY Product Management Interview Question", "Aced (formerly Exponent)"),
          v("WE0KeryvpXE", "Answer Product Sense Interview Questions Like A Pro", "Aced (formerly Exponent)"),
          v("m-qyEDwB1tw", "The Top 10 Product Manager Interview Questions (And How To Answer Them)", "Aced (formerly Exponent)"),
        ],
        quiz: [
          q("A good first step in 'design a product for X' interviews is…", ["Sketch screens immediately", "Clarify the goal and pick a target user segment", "Name a price", "List competitors only"], 1, "Strong answers clarify goals and users before solutions."),
          q("What's often the easiest way into PM from sales?", ["Quitting first", "An internal transfer, building on your product and customer knowledge", "Only an MBA", "Cold applying to senior PM roles"], 1, "Internal moves let your company bet on your known customer knowledge."),
        ],
      },
    ],
    finishLine: {
      name: "Product case study",
      description: "A portfolio case study: customer interviews and a problem statement, a RICE-prioritised feature, a PRD with success metrics, user stories and a metrics plan, plus a polished sales-to-PM story.",
    },
    pitfalls: [
      "Treating feature requests from deals as the roadmap",
      "Pitching during discovery interviews instead of listening",
      "Applying only to senior PM roles instead of associate or internal ones",
    ],
    courses: [
      { platform: "coursera", query: "digital product management", note: "UVA Darden's PM course, free to audit" },
      { platform: "youtube", query: "product management interview", note: "free interview walkthroughs" },
      { platform: "linkedin", query: "product management", note: "short courses on PM fundamentals" },
      { platform: "udemy", query: "product management", note: "structured paid PM courses" },
    ],
    featured: {
      videos: [
        v("RyzPMlUcJSk", "PATH TO PRODUCT | How to transition from Tech Sales to Product Management", "Anika Rani"),
        v("VqBHgmYvj-k", "From Sales to Product Manager | Paul‘s Journey to PM", "somecallmemomo"),
      ],
      courses: [
        course("Digital Product Management Specialization", "University of Virginia on Coursera", "https://www.coursera.org/specializations/uva-darden-digital-product-management", "audit"),
        course("Product management articles", "Silicon Valley Product Group", "https://www.svpg.com/articles/", "free"),
        course("Become a Product Manager: Learn the Skills & Get the Job", "Udemy", "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/", "paid"),
        course("Product management programs", "Reforge", "https://www.reforge.com/", "paid"),
      ],
    },
    nextTopics: [
      next("Product analytics", "Use data to understand and grow product usage."),
      next("Growth product management", "Own activation, retention and monetisation."),
      next("AI product management", "Build products on top of LLMs and machine learning."),
    ],
  },
};

const IT_TO_CYBER: TransitionSample = {
  fromKeywords: ["it support", "helpdesk", "help desk", "desktop support", "service desk", "system admin", "sysadmin", "network engineer", "network admin", "technical support", "it admin", "it executive", " it ", "customer support", "tech support"],
  toKeywords: ["cyber", "security analyst", " soc ", "infosec", "information security", "ethical hack", "penetration", "security engineer"],
  path: {
    summary: "Go from IT support to cybersecurity analyst: build on your systems and networking experience with security fundamentals, SOC skills and hands-on labs.",
    transferableSkills: [
      bring("Troubleshooting Windows, accounts and networks", "Investigating alerts and incidents methodically."),
      bring("Active Directory, permissions and user management", "Spotting suspicious logins, privilege misuse and account attacks."),
      bring("Ticketing and documentation", "Documenting incidents clearly in a SOC."),
      bring("Calm communication with users under pressure", "Handling incidents and phishing reports with staff."),
    ],
    stages: [
      {
        title: "Networking and security foundations",
        duration: "3–4 weeks",
        concepts: [
          "The OSI and TCP/IP models, ports and common protocols (DNS, HTTP, SSH, SMB)",
          "The CIA triad: confidentiality, integrity, availability",
          "Common attacks: phishing, malware, brute force, man-in-the-middle",
          "Defence in depth: firewalls, MFA, patching and least privilege",
        ],
        practice: ["Map your home or lab network: list devices, open ports (with nmap on your own network) and which services they run"],
        checkpoint: ["Explain what happens when you visit a website, step by step", "Name the protocol for ports 22, 53, 80, 443 and 3389"],
        resources: ["a free cybersecurity certificate course", "networking fundamentals videos"],
        videoSearch: "networking for cybersecurity CIA triad",
        videos: [
          v("NIRXtMg-0z8", "Internet Networks & Network Security | Google Cybersecurity Certificate", "Grow with Google"),
          v("kPPFNrlN3zo", "What is the CIA Triad", "IBM Technology"),
          v("lYvijnPI1Rg", "Networking For Cybersecurity | What you NEED to know", "Ryan John"),
        ],
        quiz: [
          q("Which port does HTTPS use by default?", ["21", "80", "443", "3389"], 2, "HTTPS uses 443; HTTP uses 80 and RDP uses 3389."),
          q("Ransomware encrypting files mainly attacks which part of the CIA triad?", ["Confidentiality", "Integrity", "Availability", "None"], 2, "Encrypted files can't be used, so availability is the main target (often confidentiality too)."),
        ],
      },
      {
        title: "Linux, Windows logs and the command line",
        duration: "3–4 weeks",
        concepts: [
          "Linux command line: navigating, permissions, processes and logs",
          "Windows event logs: logon events (4624/4625), account changes and PowerShell logs",
          "Searching logs with grep and filtering for suspicious activity",
          "Basic scripting to automate checks",
        ],
        practice: ["Generate failed logins on a lab Windows VM, then find them in the Security log by event ID and write a short incident note"],
        checkpoint: ["Find failed logins in Windows and Linux logs", "Use grep to pull suspicious lines from a log file"],
        resources: ["a Linux command line course", "Windows event log guides"],
        videoSearch: "linux commands windows event logs SOC analyst",
        videos: [
          v("gd7BXuUQ91w", "60 Linux Commands you NEED to know (in 10 minutes)", "NetworkChuck"),
          v("CLh2ACdXNbc", "20% of Linux Commands You'll Use 80% of the Time (Real-World Example)", "TechWorld with Nana"),
          v("OfTDtT11g2M", "Where SOC Analysts Should Start With Windows Event Logs", "MyDFIR"),
        ],
        quiz: [
          q("Which Windows event ID records a failed logon?", ["4624", "4625", "4720", "1102"], 1, "4625 is a failed logon; 4624 is a successful one."),
          q("Many 4625 events for one account in a minute suggest…", ["A printer issue", "A brute-force or password-spraying attempt", "A software update", "Normal use"], 1, "Rapid repeated failures are a classic sign of password guessing."),
        ],
      },
      {
        title: "SOC analyst skills: SIEM and incident response",
        duration: "4 weeks",
        concepts: [
          "What a SOC does and an L1 analyst's daily work",
          "SIEM tools like Splunk: searching, dashboards and alerts",
          "The incident response lifecycle (NIST): prepare, detect, contain, eradicate, recover, learn",
          "Triage: true vs false positives and when to escalate",
        ],
        practice: ["Install Splunk's free version, load sample logs, and write searches that detect brute-force logins and unusual login times"],
        checkpoint: ["Write a Splunk search that finds failed logins by user", "Walk through the IR lifecycle for a phishing incident"],
        resources: ["Splunk's free training", "NIST incident handling guide"],
        videoSearch: "SOC analyst day in life splunk incident response",
        videos: [
          v("Vs6JIjSuyuA", "A Real Day in Life of a SOC Analyst | Remote Work from Home Reality", "Tech with Jono"),
          v("3CiRs6WaWaU", "Splunk Tutorial for Beginners (Cyber Security Tools)", "Jon Good"),
          v("IRSQEO0koYY", "Incident Response Lifecycle | IR Plan | NIST SP 800-61 Security Incident Handling| Cybersecurity", "CyberPlatter"),
        ],
        quiz: [
          q("What's the main job of a SIEM?", ["Blocking all attacks", "Collecting and correlating logs to raise alerts for investigation", "Encrypting files", "Managing passwords"], 1, "A SIEM centralises logs and detects suspicious patterns for analysts to investigate."),
          q("In incident response, what comes right after detection and analysis?", ["Lessons learned", "Containment", "Preparation", "Recovery"], 1, "Contain the threat first to stop it spreading, then eradicate and recover."),
        ],
      },
      {
        title: "Hands-on labs: traffic, phishing and attacks",
        duration: "4–5 weeks",
        concepts: [
          "Packet analysis with Wireshark",
          "Phishing email analysis: headers, links, attachments and reporting",
          "Guided SOC labs on TryHackMe or LetsDefend",
          "Writing clear investigation reports",
        ],
        practice: ["Complete 20 SOC-focused labs (TryHackMe SOC Level 1 or LetsDefend) and analyse 5 real phishing samples with written reports"],
        checkpoint: ["Find a suspicious connection in a packet capture", "Write a phishing analysis report with indicators of compromise"],
        resources: ["TryHackMe", "LetsDefend", "Wireshark sample captures"],
        videoSearch: "wireshark tutorial phishing analysis tryhackme SOC",
        videos: [
          v("OU-A2EmVrKQ", "Learn Wireshark! Tutorial for BEGINNERS", "Chris Greer"),
          v("k7HeshxhwPk", "Cybersecurity SOC Analyst Lab - Email Analysis (Phishing)", "MyDFIR"),
          v("AIPbFFJgD4o", "I took the TryHackMe Security Analyst Level 1 Certification (SAL1)", "John Hammond"),
        ],
        quiz: [
          q("Which email header check helps spot spoofing?", ["Subject line", "SPF, DKIM and DMARC results", "Font size", "Signature"], 1, "Failing SPF/DKIM/DMARC suggests the sender isn't who they claim."),
          q("In Wireshark, what does a display filter like 'dns' do?", ["Blocks DNS", "Shows only DNS packets", "Deletes other packets", "Encrypts traffic"], 1, "Display filters narrow the view to matching packets for analysis."),
        ],
      },
      {
        title: "Certification and getting hired",
        duration: "4–6 weeks",
        concepts: [
          "CompTIA Security+: the most common entry-level security certification",
          "A home lab and write-ups as your portfolio",
          "Rewriting your CV: security-relevant IT work (access control, patching, incidents)",
          "SOC analyst interviews: networking, logs, incident scenarios",
          "Internal moves into security from IT",
        ],
        practice: ["Pass Security+ practice exams at 85%+, publish 5 lab write-ups, and apply to SOC L1 or internal security roles"],
        checkpoint: ["Book (or pass) the Security+ exam", "Five public lab write-ups", "Answer 15 SOC interview questions confidently"],
        resources: ["Security+ study videos and practice tests", "SOC interview guides"],
        videoSearch: "security plus study guide SOC analyst interview",
        videos: [
          v("epgQ-sAr0l8", "How to PASS Your Security+ in ONE MONTH | CompTIA Security+ Study Guide For a Complete Beginner", "With Sandra"),
          v("EDVCe-kdpZA", "SOC Analyst: Top Interview Questions & Answers", "ForeverAnonymous"),
          v("KhJ5cWErZsI", "IT Support vs Cybersecurity: Which Gets You Hired Faster?", "IT Edge Network"),
        ],
        quiz: [
          q("Why do hiring managers value lab write-ups?", ["They're long", "They prove hands-on skills and clear reporting", "They replace interviews", "They're required by law"], 1, "Write-ups show you can investigate and communicate, the core of SOC work."),
          q("An interviewer asks how you'd handle a suspected compromised account. What's a strong first step?", ["Ignore it", "Check recent logins and activity, then contain by resetting credentials and revoking sessions per policy", "Delete the account", "Email everyone"], 1, "Investigate quickly, then contain according to the incident process."),
        ],
      },
    ],
    finishLine: {
      name: "SOC-ready portfolio",
      description: "A home lab with a SIEM detecting brute-force logins, five published investigation write-ups (including phishing and packet analysis), Security+ booked or passed, and a CV that highlights your security-relevant IT work.",
    },
    pitfalls: [
      "Collecting certificates without hands-on lab practice",
      "Aiming straight for penetration testing instead of entry-level SOC roles",
      "Not documenting your labs, so there's nothing to show employers",
    ],
    courses: [
      { platform: "coursera", query: "google cybersecurity", note: "Google's certificate, free to audit" },
      { platform: "youtube", query: "SOC analyst training", note: "free labs and walkthroughs" },
      { platform: "udemy", query: "comptia security+", note: "paid Security+ prep courses" },
      { platform: "linkedin", query: "cybersecurity foundations", note: "short security fundamentals courses" },
    ],
    featured: {
      videos: [
        v("IvQ4XRIOuyg", "How To Transition From IT or Helpdesk To Cybersecurity (Real-World Experiences)", "CYBERWOX"),
        v("YTNeCby_-WU", "Help Desk to Cybersecurity: The Exact Roadmap (2026)", "Luke Gough"),
      ],
      courses: [
        course("Google Cybersecurity Professional Certificate", "Google on Coursera", "https://www.coursera.org/professional-certificates/google-cybersecurity", "audit"),
        course("Hands-on security labs", "TryHackMe", "https://tryhackme.com/", "free"),
        course("SOC analyst training labs", "LetsDefend", "https://letsdefend.io/", "free"),
        course("CompTIA Security+ certification", "CompTIA", "https://www.comptia.org/en-us/certifications/security/", "paid"),
      ],
    },
    nextTopics: [
      next("Threat hunting", "Proactively search for attackers that alerts miss."),
      next("Cloud security", "Secure AWS, Azure and Google Cloud environments."),
      next("Digital forensics", "Investigate incidents in depth after they happen."),
    ],
  },
};

/** Every hand-written transition, most specific first (the order matters for matching). */
export const TRANSITION_SAMPLES: TransitionSample[] = [
  ...AI_TRANSITIONS.slice(0, -1),
  GUITAR_TO_PIANO,
  INTERIOR_TO_FASHION,
  GRAPHIC_TO_UX,
  TEACHER_TO_ID,
  ACCOUNTANT_TO_DA,
  DA_TO_DS,
  SALES_TO_PM,
  IT_TO_CYBER,
  // "Any engineer → AI engineer" last, so it never wins over a more specific match.
  ...AI_TRANSITIONS.slice(-1),
];

/**
 * Finds the hand-written transition for two careers, if there is one. Matching ignores case and looks for keywords
 * anywhere in each career (padded with spaces so short ones like " it " or " ai " match whole words only).
 * @param {string} from The current career.
 * @param {string} to The career they want.
 * @returns {LearningPath | null} The path, or `null` when nothing matches.
 */
export function findTransitionPath(from: string, to: string): LearningPath | null {
  const pad = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9/&+.\-]+/g, " ")} `;
  const f = pad(from);
  const t = pad(to);
  const sample = TRANSITION_SAMPLES.find((s) => s.fromKeywords.some((k) => f.includes(k)) && s.toKeywords.some((k) => t.includes(k)));
  return sample?.path ?? null;
}
