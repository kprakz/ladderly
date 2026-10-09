// Demo paths for India's senior secondary curriculum (CBSE/NCERT Classes 11–12), following the official CBSE
// 2025–26 syllabi (cbseacademic.nic.in). Chapters removed in the rationalised syllabus (e.g. p-block, solid state and
// surface chemistry in Class 12) are left out. Every featured link below was opened and checked before adding:
// the NCERT textbooks page, the CBSE syllabus PDFs, and Khan Academy India courses linked from india.khanacademy.org.
import type { PathExtra } from "./demoExtras";
import type { NextTopic } from "./nextTopics";
import type { FeaturedCourse, LearningPath, QuizQuestion } from "./schema";

/**
 * Builds a quiz question, rotating its options by an amount derived from the question text, so the correct answer
 * lands on A, B, C or D evenly instead of wherever it was written (the rotation is fixed, so it's the same every time).
 * @param {string} question The question text.
 * @param {string[]} options The four options, as written.
 * @param {number} answer Index (0-3) of the correct option, as written.
 * @param {string} explanation Why the correct option is right.
 * @returns {QuizQuestion} The question object with rotated options and the matching answer index.
 */
function q(question: string, options: string[], answer: number, explanation: string): QuizQuestion {
  const shift = [...question].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 9973, 7) % options.length;
  const rotated = options.map((_, i) => options[(i - shift + options.length) % options.length]);
  return { question, options: rotated, answer: (answer + shift) % options.length, explanation };
}

const NCERT_BOOKS: FeaturedCourse = { title: "NCERT textbooks (free PDFs, Classes I–XII)", provider: "NCERT", url: "https://ncert.nic.in/textbook.php", kind: "free" };

/**
 * The official CBSE 2025–26 senior secondary syllabus PDF for a subject.
 * @param {string} subject Display name, e.g. "Physics".
 * @param {string} file The PDF's file-name stem, e.g. "Physics".
 * @returns {FeaturedCourse} The link.
 */
function syllabus(subject: string, file: string): FeaturedCourse {
  return {
    title: `CBSE ${subject} syllabus 2025–26 (Classes XI–XII)`,
    provider: "CBSE Academic",
    url: `https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/${file}_SrSec_2025-26.pdf`,
    kind: "free",
  };
}

/**
 * A Khan Academy India course.
 * @param {string} title The course name.
 * @param {string} path The course's path on khanacademy.org.
 * @returns {FeaturedCourse} The link.
 */
function khan(title: string, path: string): FeaturedCourse {
  return { title, provider: "Khan Academy India", url: `https://www.khanacademy.org${path}`, kind: "free" };
}

const NOTE = "Built on the CBSE 2025–26 syllabus; check your school's latest syllabus for any changes.";

// ---------------------------------------------------------------- Mathematics

const MATHS: LearningPath = {
  summary: `Cover the CBSE/NCERT Class 11–12 maths syllabus and solve exam-style problems in every unit with confidence. ${NOTE}`,
  stages: [
    {
      title: "Sets, functions and trigonometry",
      duration: "4–5 weeks",
      concepts: [
        "Sets: subsets, intervals, Venn diagrams, union, intersection, complement and De Morgan's laws",
        "Relations and functions: Cartesian product, domain, co-domain and range; modulus, signum and greatest integer functions with their graphs",
        "Trigonometric functions on the unit circle: radians, signs in each quadrant, and graphs of sin, cos and tan",
        "Identities: sin(x ± y), cos(x ± y), tan(x ± y), and the double- and triple-angle formulas",
        "Class 12: reflexive, symmetric, transitive and equivalence relations; one-one and onto functions; principal values of inverse trigonometric functions",
      ],
      practice: ["Draw the graphs of |x|, [x] and signum x by hand, then check them on a graphing tool", "Prove 10 identities from the NCERT exercise using sin(x ± y) and the double-angle formulas"],
      checkpoint: [
        "Find the domain and range of f(x) = √(x − 1) and of 1/(x − 2)",
        "Convert 135° to radians and find its sin, cos and tan without a calculator",
        "State the principal value branch of sin⁻¹x and find sin⁻¹(−1/2)",
      ],
      resources: ["the NCERT Class 11 and 12 maths textbooks", "a graphing tool such as Desmos", "the NCERT Exemplar problems"],
      videoSearch: "class 11 relations and functions trigonometric functions ncert",
      quiz: [
        q("What is the range of the greatest integer function f(x) = [x]?", ["All real numbers", "All integers", "Non-negative integers only", "[0, 1)"], 1, "[x] always gives an integer, and every integer n is reached at x = n."),
        q("What is the principal value of sin⁻¹(−1/2)?", ["−π/6", "7π/6", "5π/6", "−π/3"], 0, "The principal branch of sin⁻¹ is [−π/2, π/2], and sin(−π/6) = −1/2."),
      ],
    },
    {
      title: "Algebra: complex numbers to sequences",
      duration: "4 weeks",
      concepts: [
        "Complex numbers: i² = −1, the algebra of a + ib, conjugate, modulus and the Argand plane",
        "Linear inequalities in one variable and showing their solutions on a number line",
        "Permutations and combinations: the counting principle, ⁿPᵣ = n!/(n − r)! and ⁿCᵣ = n!/(r!(n − r)!)",
        "The binomial theorem for positive integer powers, the general term and Pascal's triangle",
        "Sequences and series: the general term and sum of a G.P., the sum of an infinite G.P., and the A.M.–G.M. relation",
      ],
      practice: ["Solve 15 counting problems (arranging letters, choosing committees, forming numbers) and say for each whether order matters", "Expand (1 + x)⁶ with Pascal's triangle and check two terms with the general-term formula"],
      checkpoint: ["Find the modulus of 3 + 4i and plot it on the Argand plane", "Count the arrangements of the letters of BANANA", "Find the sum of the infinite G.P. 1 + 1/2 + 1/4 + …"],
      resources: ["the NCERT Class 11 textbook exercises and examples", "a problem book with graded exercises"],
      videoSearch: "permutations combinations binomial theorem class 11 ncert",
      quiz: [
        q("In how many ways can 3 students be chosen from 5 for a team, if order doesn't matter?", ["60", "10", "15", "125"], 1, "⁵C₃ = 5!/(3!·2!) = 10."),
        q("What is the sum of the infinite G.P. 3 + 1 + 1/3 + …?", ["4", "9/2", "6", "It has no sum"], 1, "a = 3 and r = 1/3, so S = a/(1 − r) = 3/(2/3) = 9/2."),
      ],
    },
    {
      title: "Coordinate geometry, statistics and probability",
      duration: "3–4 weeks",
      concepts: [
        "Straight lines: slope, the angle between two lines, and the point-slope, slope-intercept, two-point and intercept forms",
        "Distance of a point from a line: |ax₁ + by₁ + c| / √(a² + b²)",
        "Conic sections: standard equations of the circle, parabola (y² = 4ax), ellipse and hyperbola, with foci and eccentricity",
        "Introduction to 3D: coordinates of a point and the distance formula in space",
        "Statistics and probability: mean deviation, variance and standard deviation; probability of 'not', 'and' and 'or' events",
      ],
      practice: ["For 5 parabolas and ellipses from the NCERT exercise, find the focus, directrix or axes and sketch each one", "Work out the variance and standard deviation of your last 10 test scores by hand, then check with a spreadsheet"],
      checkpoint: ["Find the line through (2, 3) with slope −1/2 and its distance from the origin", "Find the focus and directrix of y² = 12x", "Find P(A or B) from P(A), P(B) and P(A and B)"],
      resources: ["the NCERT Class 11 textbook", "a graphing tool to check conic sketches"],
      videoSearch: "class 11 conic sections straight lines ncert",
      quiz: [
        q("What is the focus of the parabola y² = 12x?", ["(3, 0)", "(12, 0)", "(0, 3)", "(6, 0)"], 0, "y² = 4ax with 4a = 12 gives a = 3, so the focus is (a, 0) = (3, 0)."),
        q("What is the distance of the origin from the line 3x + 4y − 10 = 0?", ["10", "2", "5/2", "1"], 1, "|3·0 + 4·0 − 10| / √(9 + 16) = 10/5 = 2."),
      ],
    },
    {
      title: "Calculus: limits to differential equations",
      duration: "6–8 weeks",
      concepts: [
        "Limits and derivatives: intuitive limits, the standard limit sin x / x → 1, and the derivative as slope and rate of change",
        "Continuity and differentiability: the chain rule, implicit, logarithmic and parametric differentiation, and second derivatives",
        "Applications of derivatives: rates of change, increasing and decreasing functions, and maxima and minima by the first and second derivative tests",
        "Integrals: substitution, partial fractions, integration by parts, the standard forms, and definite integrals with their properties",
        "Area under simple curves, and first-order differential equations: separation of variables, homogeneous and linear (dy/dx + Py = Q)",
      ],
      practice: ["Solve one maximisation word problem a day for two weeks (e.g. the largest open box from a square sheet)", "Do the NCERT integration exercises in mixed order so you have to choose the method yourself"],
      checkpoint: ["Differentiate x^(sin x) using logarithmic differentiation", "Find the largest area of a rectangle with perimeter 40 cm", "Solve dy/dx + y = eˣ with an integrating factor"],
      resources: ["the NCERT Class 11 and 12 textbooks (calculus chapters)", "the NCERT Exemplar problems", "past CBSE board papers"],
      videoSearch: "class 12 calculus integration by parts application of derivatives ncert",
      quiz: [
        q("What is the limit of sin x / x as x → 0 (x in radians)?", ["0", "1", "∞", "It doesn't exist"], 1, "This is the standard limit, equal to 1."),
        q("What is the integrating factor of dy/dx + (1/x)·y = x², for x > 0?", ["eˣ", "x", "1/x", "ln x"], 1, "IF = e^(∫(1/x)dx) = e^(ln x) = x."),
        q("If f′(c) = 0 and f″(c) < 0, then at x = c the function has…", ["a local minimum", "a local maximum", "a point of inflection", "no turning point"], 1, "A negative second derivative means the curve bends downward, so c is a local maximum."),
      ],
    },
    {
      title: "Matrices, vectors, 3D, linear programming and probability",
      duration: "5–6 weeks",
      concepts: [
        "Matrices: types, transpose, symmetric and skew-symmetric matrices, multiplication, and why AB ≠ BA in general",
        "Determinants up to 3×3: minors, cofactors, adjoint, inverse, and solving equations with X = A⁻¹B",
        "Vectors: direction cosines, position vectors, the section formula, and the dot and cross products",
        "3D lines: vector and Cartesian equations, the angle between lines, and the shortest distance between skew lines",
        "Linear programming by the graphical corner-point method; conditional probability, independent events, total probability and Bayes' theorem",
      ],
      practice: ["Solve a system of three equations by the matrix-inverse method and check by substitution", "Model a real choice (e.g. dividing study hours between two subjects) as a linear programming problem and solve it graphically"],
      checkpoint: ["Find the inverse of a 3×3 matrix and check that A·A⁻¹ = I", "Find the angle between two vectors with the dot product", "Solve a two-bag Bayes' theorem problem"],
      resources: ["the NCERT Class 12 textbook, Parts I and II", "CBSE sample question papers"],
      videoSearch: "class 12 matrices determinants vectors bayes theorem ncert",
      quiz: [
        q("If A is 2×3 and B is 3×4, what is the order of AB?", ["3×3", "2×4", "4×2", "AB is not defined"], 1, "The inner sizes match (3), so AB takes the outer sizes: 2×4."),
        q("Two non-zero vectors have a dot product of 0. What does that tell you?", ["They are parallel", "They are perpendicular", "They are equal", "One is a unit vector"], 1, "a·b = |a||b|cos θ = 0 means cos θ = 0, so θ = 90°."),
      ],
    },
  ],
  finishLine: {
    name: "Full-syllabus mock board exam",
    description: "Take a timed 3-hour CBSE Class 12 maths sample paper, mark it with the official marking scheme, then redo every question you lost marks on until you can solve it unaided.",
  },
  pitfalls: [
    "Memorising formulas without practising enough mixed problems",
    "Moving to harder books before finishing the NCERT examples and exercises",
    "Leaving calculus revision to the end, though it carries the most marks (35 of 80) in Class 12",
  ],
};

const MATHS_EXTRAS: PathExtra = {
  stages: [],
  courses: [
    { platform: "khanacademy", query: "class 12 math india", note: "free NCERT-aligned lessons and practice" },
    { platform: "youtube", query: "class 12 maths ncert full chapter", note: "chapter-wise lectures and revision" },
  ],
  featured: {
    videos: [],
    courses: [
      khan("Class 11 math (India)", "/math/in-in-grade-11-ncert"),
      khan("Class 12 math (India)", "/math/in-in-grade-12-ncert"),
      NCERT_BOOKS,
      syllabus("Mathematics", "Maths"),
    ],
  },
};

const MATHS_NEXT: NextTopic[] = [
  { topic: "JEE Main mathematics", why: "Stretch the same syllabus to the harder, faster problems of engineering entrance exams." },
  { topic: "Statistics for data science", why: "Build on probability and statistics to analyse real data." },
  { topic: "Linear algebra", why: "Go beyond matrices and vectors to the maths behind graphics and machine learning." },
];

// ---------------------------------------------------------------- Physics

const PHYSICS: LearningPath = {
  summary: `Cover the CBSE/NCERT Class 11–12 physics syllabus: understand each law, solve numericals confidently and explain the physics in exam answers. ${NOTE}`,
  stages: [
    {
      title: "Measurement and kinematics",
      duration: "3–4 weeks",
      concepts: [
        "Units and measurements: SI units, significant figures, and checking equations by dimensional analysis",
        "Motion in a straight line: position–time and velocity–time graphs, and v = u + at, s = ut + ½at², v² = u² + 2as",
        "Vectors: resolving into components, adding vectors and relative velocity",
        "Motion in a plane: projectiles (time of flight, maximum height, range R = u² sin 2θ / g) and uniform circular motion (a = v²/r)",
      ],
      practice: ["Solve 10 projectile problems, and check one by filming a ball throw with your phone", "Find the dimensions of 5 formulas and use them to spot an incorrect equation"],
      checkpoint: ["Explain why the area under a v–t graph equals displacement", "Show that range is greatest at 45° for a projectile on level ground", "Check whether s = ut + ½at² is dimensionally correct"],
      resources: ["the NCERT Class 11 physics textbook", "the NCERT Exemplar problems"],
      videoSearch: "class 11 physics kinematics projectile motion ncert",
      quiz: [
        q("For a projectile on level ground, which launch angle gives the greatest range?", ["30°", "45°", "60°", "90°"], 1, "R = u² sin 2θ / g is largest when sin 2θ = 1, i.e. θ = 45°."),
        q("What does the slope of a velocity–time graph give?", ["Displacement", "Speed", "Acceleration", "Distance"], 2, "Slope = change in velocity / time = acceleration."),
      ],
    },
    {
      title: "Laws of motion, energy, rotation and gravitation",
      duration: "5–6 weeks",
      concepts: [
        "Newton's laws, free-body diagrams, static and kinetic friction, and circular motion on level and banked roads",
        "Work, energy and power: the work–energy theorem, conservation of mechanical energy, and elastic and inelastic collisions",
        "Rotational motion: centre of mass, torque, angular momentum and moment of inertia",
        "Gravitation: the universal law, how g changes with height and depth, orbital velocity and escape velocity",
      ],
      practice: ["Draw free-body diagrams for 10 situations (lift, inclined plane, pulley) before writing any equations", "Solve collision problems by conserving momentum, then check whether kinetic energy was conserved"],
      checkpoint: ["Find the acceleration of two blocks connected over a pulley", "Explain why escape velocity doesn't depend on the mass of the object", "Find the torque of a 10 N force applied 0.5 m from a hinge at 90°"],
      resources: ["the NCERT Class 11 physics textbook", "a problem book with solved examples"],
      videoSearch: "class 11 physics laws of motion work energy rotational motion ncert",
      quiz: [
        q("In a perfectly inelastic collision, which quantity is always conserved?", ["Kinetic energy", "Momentum", "Velocity", "Both kinetic energy and momentum"], 1, "Momentum is conserved whenever there's no external force; kinetic energy is lost when the bodies stick together."),
        q("About how fast is escape velocity from Earth's surface?", ["7.9 km/s", "11.2 km/s", "3 km/s", "30 km/s"], 1, "vₑ = √(2GM/R) ≈ 11.2 km/s; 7.9 km/s is the orbital speed near the surface."),
      ],
    },
    {
      title: "Matter, heat, oscillations and waves",
      duration: "4–5 weeks",
      concepts: [
        "Mechanical properties: stress, strain and Young's modulus; pressure, Bernoulli's principle and viscosity",
        "Thermal properties: heat capacity, calorimetry, expansion, and conduction, convection and radiation",
        "Thermodynamics: the first law ΔU = Q − W, isothermal and adiabatic processes, and the second law",
        "Kinetic theory: pressure of an ideal gas, rms speed and degrees of freedom",
        "Oscillations and waves: simple harmonic motion, the simple pendulum T = 2π√(l/g), wave speed, standing waves and beats",
      ],
      practice: ["Time 20 swings of a homemade pendulum at three lengths and compare with T = 2π√(l/g)", "Solve calorimetry problems by writing heat lost = heat gained"],
      checkpoint: ["Apply the first law of thermodynamics to an isothermal expansion", "Find the beat frequency of tuning forks at 256 Hz and 260 Hz", "Explain why the rms speed of gas molecules rises with temperature"],
      resources: ["the NCERT Class 11 physics textbook (Part II)", "the NCERT Exemplar problems"],
      videoSearch: "class 11 physics thermodynamics oscillations waves ncert",
      quiz: [
        q("If a pendulum is made 4 times longer, its period becomes…", ["4 times longer", "2 times longer", "half as long", "the same"], 1, "T ∝ √l, so 4× the length gives √4 = 2× the period."),
        q("In an isothermal process for an ideal gas, what stays constant?", ["Pressure", "Volume", "Temperature", "Heat"], 2, "Isothermal means constant temperature, so the gas's internal energy doesn't change."),
      ],
    },
    {
      title: "Electricity and magnetism",
      duration: "6–7 weeks",
      concepts: [
        "Electrostatics: Coulomb's law, electric fields and field lines, Gauss's law, potential, and capacitors in series and parallel",
        "Current electricity: drift velocity, Ohm's law, resistivity, Kirchhoff's laws and the Wheatstone bridge",
        "Moving charges and magnetism: the Biot–Savart and Ampère's laws, forces on moving charges and wires, and the moving-coil galvanometer",
        "Electromagnetic induction and AC: Faraday's and Lenz's laws, self and mutual inductance, LCR circuits, resonance and transformers",
        "Electromagnetic waves: displacement current and the electromagnetic spectrum",
      ],
      practice: ["Solve 10 circuit problems with Kirchhoff's laws, marking current directions first", "Build a simple circuit with a battery, bulb and resistor; predict the current, then measure it with a multimeter"],
      checkpoint: ["Find the equivalent capacitance of capacitors in series and in parallel", "Use Lenz's law to find the direction of the induced current in a coil", "Find the resonant frequency of an LCR circuit"],
      resources: ["the NCERT Class 12 physics textbook (Part I)", "a lab manual for practical work"],
      videoSearch: "class 12 physics electrostatics current electricity electromagnetic induction ncert",
      quiz: [
        q("Two 6 µF capacitors are connected in series. What is the total capacitance?", ["12 µF", "6 µF", "3 µF", "36 µF"], 2, "In series, 1/C = 1/6 + 1/6, so C = 3 µF."),
        q("Lenz's law follows from the conservation of…", ["charge", "momentum", "energy", "mass"], 2, "The induced current opposes the change causing it; otherwise energy would come from nothing."),
      ],
    },
    {
      title: "Optics and modern physics",
      duration: "5–6 weeks",
      concepts: [
        "Ray optics: mirror and lens formulas, refraction, total internal reflection, prisms, microscopes and telescopes",
        "Wave optics: Huygens' principle, Young's double-slit interference (fringe width β = λD/d) and single-slit diffraction",
        "Dual nature of radiation and matter: the photoelectric effect, Einstein's equation and the de Broglie wavelength λ = h/p",
        "Atoms and nuclei: the Bohr model and hydrogen spectrum, mass defect, binding energy, fission and fusion",
        "Semiconductors: intrinsic and extrinsic semiconductors, the p–n junction diode and the diode as a rectifier",
      ],
      practice: ["Solve lens and mirror problems with one consistent sign convention, drawing a ray diagram for each", "Plot binding energy per nucleon against mass number from a data table and mark where fission and fusion release energy"],
      checkpoint: ["Find the image distance for an object 30 cm from a convex lens of focal length 20 cm", "Explain why stopping potential depends on frequency but not intensity", "Draw a half-wave rectifier circuit and its output waveform"],
      resources: ["the NCERT Class 12 physics textbook (Part II)", "CBSE sample question papers"],
      videoSearch: "class 12 physics ray optics wave optics photoelectric effect ncert",
      quiz: [
        q("In Young's double-slit experiment, what happens to the fringe width if the slit separation d is doubled?", ["It doubles", "It halves", "It stays the same", "It becomes four times larger"], 1, "β = λD/d, so doubling d halves β."),
        q("In the photoelectric effect, raising the light's intensity (same frequency) increases…", ["the electrons' maximum kinetic energy", "the stopping potential", "the number of electrons emitted", "the threshold frequency"], 2, "More photons per second free more electrons; their maximum energy depends only on frequency."),
      ],
    },
  ],
  finishLine: {
    name: "Full-syllabus mock board exam",
    description: "Take a timed 3-hour CBSE Class 12 physics sample paper, mark it with the official marking scheme, and redo every numerical and derivation you lost marks on.",
  },
  pitfalls: [
    "Memorising derivations without understanding the physics behind each step",
    "Dropping units and sign conventions in numericals",
    "Neglecting graphs and experiments, which matter in the practical exam",
  ],
};

const PHYSICS_EXTRAS: PathExtra = {
  stages: [],
  courses: [
    { platform: "khanacademy", query: "class 12 physics india", note: "free lessons aligned with the NCERT chapters" },
    { platform: "youtube", query: "class 12 physics ncert full chapter", note: "chapter-wise lectures and numericals" },
  ],
  featured: {
    videos: [],
    courses: [
      khan("Class 11 physics (India)", "/science/in-in-class11th-physics"),
      khan("Class 12 physics (India)", "/science/in-in-class-12th-physics-india"),
      NCERT_BOOKS,
      syllabus("Physics", "Physics"),
    ],
  },
};

const PHYSICS_NEXT: NextTopic[] = [
  { topic: "JEE physics problem solving", why: "Apply the same chapters to the multi-step problems of engineering entrance exams." },
  { topic: "Electronics with Arduino", why: "Turn circuits and semiconductors into real projects you can build." },
  { topic: "Astronomy basics", why: "Use gravitation, optics and nuclear physics to understand stars and planets." },
];

// ---------------------------------------------------------------- Chemistry

const CHEMISTRY: LearningPath = {
  summary: `Cover the CBSE/NCERT Class 11–12 chemistry syllabus: solve physical chemistry numericals, explain organic mechanisms and recall inorganic facts for exams. ${NOTE}`,
  stages: [
    {
      title: "Basic concepts, atomic structure and periodicity",
      duration: "3–4 weeks",
      concepts: [
        "Mole concept: molar mass, percentage composition, empirical and molecular formulas, and stoichiometry with limiting reagents",
        "Structure of the atom: the Bohr model, quantum numbers, shapes of s, p and d orbitals, and the Aufbau, Pauli and Hund's rules",
        "Periodic trends: atomic radius, ionisation enthalpy, electron gain enthalpy and electronegativity across periods and down groups",
      ],
      practice: ["Solve 15 mole-concept problems, including one limiting-reagent problem a day", "Write the electronic configurations of elements 1–30, including the exceptions Cr and Cu"],
      checkpoint: ["Find the moles and molecules in 18 g of water", "Write all four quantum numbers for sodium's outermost electron", "Explain why ionisation enthalpy generally rises across a period"],
      resources: ["the NCERT Class 11 chemistry textbook", "the NCERT Exemplar problems"],
      videoSearch: "class 11 chemistry mole concept structure of atom ncert",
      quiz: [
        q("How many molecules are in 0.5 mol of CO₂?", ["3.011 × 10²³", "6.022 × 10²³", "1.2044 × 10²⁴", "22.4"], 0, "Molecules = moles × Avogadro's number = 0.5 × 6.022 × 10²³."),
        q("What is the electronic configuration of chromium (Z = 24)?", ["[Ar] 3d⁴ 4s²", "[Ar] 3d⁵ 4s¹", "[Ar] 3d⁶", "[Ar] 4s² 4p⁴"], 1, "A half-filled 3d subshell is extra stable, so one 4s electron moves into 3d."),
      ],
    },
    {
      title: "Bonding, thermodynamics, equilibrium and redox",
      duration: "4–5 weeks",
      concepts: [
        "Chemical bonding: VSEPR shapes, hybridisation (sp, sp², sp³), molecular orbital theory and bond order",
        "Thermodynamics: enthalpy, Hess's law, entropy and Gibbs energy ΔG = ΔH − TΔS for spontaneity",
        "Equilibrium: Kc and Kp, Le Chatelier's principle, pH, buffers and the solubility product",
        "Redox reactions: oxidation numbers and balancing redox equations",
      ],
      practice: ["Draw the shape and state the hybridisation of 15 molecules (e.g. CH₄, NH₃, H₂O, BF₃, PCl₅, SF₆)", "Predict how temperature, pressure and concentration affect the Haber process using Le Chatelier's principle"],
      checkpoint: ["Find the bond order of O₂ and explain why it is paramagnetic", "Decide whether a reaction with ΔH < 0 and ΔS > 0 is spontaneous", "Find the pH of 0.001 M HCl"],
      resources: ["the NCERT Class 11 chemistry textbook", "a molecular model kit or a 3D molecule viewer"],
      videoSearch: "class 11 chemistry chemical bonding equilibrium thermodynamics ncert",
      quiz: [
        q("What is the shape of the NH₃ molecule?", ["Trigonal planar", "Tetrahedral", "Trigonal pyramidal", "Bent"], 2, "Nitrogen is sp³ with one lone pair, so its three bonds form a pyramid."),
        q("What is the pH of 0.001 M HCl?", ["1", "3", "11", "0.001"], 1, "HCl ionises fully, so [H⁺] = 10⁻³ M and pH = 3."),
      ],
    },
    {
      title: "Organic chemistry foundations",
      duration: "4–5 weeks",
      concepts: [
        "IUPAC naming, isomerism, and electronic effects: inductive effect, resonance and hyperconjugation",
        "Reaction intermediates (carbocations, carbanions, free radicals) and types of organic reactions",
        "Hydrocarbons: alkanes, alkenes (Markovnikov addition), alkynes, and benzene's aromaticity and electrophilic substitution",
        "Class 12 haloalkanes and haloarenes: SN1 vs SN2 mechanisms, and why haloarenes resist nucleophilic substitution",
      ],
      practice: ["Name 30 compounds by IUPAC rules, and draw 30 more from their names", "Make a one-page reaction map for alkenes showing each reagent and product"],
      checkpoint: ["Predict the major product when HBr adds to propene", "Explain why a tertiary carbocation is more stable than a primary one", "Decide whether a reaction goes by SN1 or SN2 from its substrate and solvent"],
      resources: ["the NCERT Class 11 and 12 chemistry textbooks", "a reaction-mechanism flashcard set you make yourself"],
      videoSearch: "class 11 chemistry organic chemistry basic principles hydrocarbons ncert",
      quiz: [
        q("When HBr adds to propene (no peroxide), the major product is…", ["1-bromopropane", "2-bromopropane", "1,2-dibromopropane", "propane"], 1, "Markovnikov's rule: H adds to the carbon with more H atoms, via the more stable secondary carbocation."),
        q("An SN2 reaction at a chiral carbon happens with…", ["retention of configuration", "inversion of configuration", "racemisation", "no change at the carbon"], 1, "The nucleophile attacks from the back in a single step, flipping the configuration (Walden inversion)."),
      ],
    },
    {
      title: "Physical and inorganic chemistry (Class 12)",
      duration: "5–6 weeks",
      concepts: [
        "Solutions: concentration terms, Raoult's law and colligative properties such as boiling-point elevation and osmotic pressure",
        "Electrochemistry: cells, electrode potentials, the Nernst equation, conductance and Kohlrausch's law",
        "Chemical kinetics: rate law, order and molecularity, integrated rate equations, half-life and the Arrhenius equation",
        "d- and f-block elements: trends, colour and magnetism, KMnO₄ and K₂Cr₂O₇, and the lanthanoid contraction",
        "Coordination compounds: IUPAC naming, isomerism, and bonding by valence bond and crystal field theory",
      ],
      practice: ["Solve Nernst-equation and kinetics numericals every day for two weeks", "Name 20 coordination compounds and find each metal's oxidation state and coordination number"],
      checkpoint: ["Find the half-life of a first-order reaction from its rate constant", "Calculate a Daniell cell's EMF at non-standard concentrations with the Nernst equation", "Name [Co(NH₃)₆]Cl₃ and give the oxidation state of cobalt"],
      resources: ["the NCERT Class 12 chemistry textbook (Part I)", "past CBSE board papers"],
      videoSearch: "class 12 chemistry electrochemistry chemical kinetics coordination compounds ncert",
      quiz: [
        q("A first-order reaction has k = 0.0693 min⁻¹. What is its half-life?", ["1 min", "10 min", "100 min", "0.693 min"], 1, "t½ = 0.693 / k = 0.693 / 0.0693 = 10 min."),
        q("What is the oxidation state of Co in [Co(NH₃)₆]Cl₃?", ["0", "+2", "+3", "+6"], 2, "NH₃ is neutral and there are three Cl⁻ counter-ions, so Co is +3."),
      ],
    },
    {
      title: "Organic chemistry and biomolecules (Class 12)",
      duration: "4–5 weeks",
      concepts: [
        "Alcohols, phenols and ethers: preparation, the acidity of phenol, and tests to tell them apart",
        "Aldehydes, ketones and carboxylic acids: nucleophilic addition, aldol and Cannizzaro reactions, and acid strength",
        "Amines: basicity order, diazonium salts and their reactions",
        "Biomolecules: carbohydrates, proteins, enzymes, vitamins and nucleic acids",
        "Named reactions and conversions between functional groups in two or three steps",
      ],
      practice: ["Make flashcards for 20 named reactions and test yourself daily", "Practise three conversions a day (e.g. ethanol → ethanoic acid → ethanamide)"],
      checkpoint: ["Explain why phenol is more acidic than ethanol", "Give a chemical test to tell an aldehyde from a ketone", "Order methylamine, dimethylamine and aniline by basicity in water"],
      resources: ["the NCERT Class 12 chemistry textbook (Part II)", "CBSE sample question papers"],
      videoSearch: "class 12 chemistry aldehydes ketones amines named reactions ncert",
      quiz: [
        q("Which reagent tells an aldehyde from a ketone?", ["Tollens' reagent", "Lucas reagent", "Bromine water", "Hinsberg's reagent"], 0, "Aldehydes reduce Tollens' reagent to a silver mirror; ketones don't."),
        q("Which of these undergoes the Cannizzaro reaction?", ["Ethanal", "Propanone", "Benzaldehyde", "Ethanol"], 2, "Aldehydes with no α-hydrogen, like benzaldehyde, undergo Cannizzaro; ethanal has α-hydrogens and gives the aldol reaction."),
      ],
    },
  ],
  finishLine: {
    name: "Full-syllabus mock board exam",
    description: "Take a timed 3-hour CBSE Class 12 chemistry sample paper, mark it with the official marking scheme, and redo every numerical and conversion you lost marks on.",
  },
  pitfalls: [
    "Memorising organic reactions without understanding their mechanisms",
    "Skimming the inorganic text in NCERT, which many questions come straight from",
    "Doing numericals without units and significant figures",
  ],
};

const CHEMISTRY_EXTRAS: PathExtra = {
  stages: [],
  courses: [
    { platform: "khanacademy", query: "class 11 chemistry india", note: "free lessons aligned with the NCERT chapters" },
    { platform: "youtube", query: "class 12 chemistry ncert full chapter", note: "chapter-wise lectures and reaction practice" },
  ],
  featured: {
    videos: [],
    courses: [khan("Class 11 chemistry (India)", "/science/class-11-chemistry-india"), NCERT_BOOKS, syllabus("Chemistry", "Chemistry")],
  },
};

const CHEMISTRY_NEXT: NextTopic[] = [
  { topic: "Organic reaction mechanisms", why: "Go deeper into why reactions happen, the key to entrance-exam organic chemistry." },
  { topic: "NEET chemistry practice", why: "Apply the syllabus to the fast multiple-choice questions of medical entrance exams." },
  { topic: "Biochemistry", why: "Connect biomolecules and kinetics to how living cells work." },
];

// ---------------------------------------------------------------- Biology

const BIOLOGY: LearningPath = {
  summary: `Cover the CBSE/NCERT Class 11–12 biology syllabus: explain processes with labelled diagrams and solve genetics problems with confidence. ${NOTE}`,
  stages: [
    {
      title: "Diversity and structural organisation",
      duration: "3–4 weeks",
      concepts: [
        "The living world and classification: taxonomic hierarchy, binomial nomenclature and the five-kingdom system",
        "Plant kingdom: algae, bryophytes, pteridophytes, gymnosperms and angiosperms, and alternation of generations",
        "Animal kingdom: the basis of classification (symmetry, coelom, segmentation) and the major phyla",
        "Morphology and anatomy of flowering plants: root, stem, leaf, flower and fruit; plant tissues",
        "Structural organisation in animals: the frog's morphology, anatomy and organ systems",
      ],
      practice: ["Make a chart of the animal phyla with one example and one key feature each", "Draw and label a flower and a dicot stem section from memory"],
      checkpoint: ["Write the scientific name of humans following binomial rules", "Tell a monocot from a dicot by its root, stem and leaf", "Name the phylum of a cockroach, an earthworm and a starfish"],
      resources: ["the NCERT Class 11 biology textbook", "a set of your own labelled diagrams"],
      videoSearch: "class 11 biology biological classification animal kingdom ncert",
      quiz: [
        q("Which phylum has a water vascular system?", ["Mollusca", "Echinodermata", "Annelida", "Arthropoda"], 1, "Echinoderms such as starfish move and feed with tube feet powered by a water vascular system."),
        q("Who proposed the five-kingdom classification?", ["Linnaeus", "R.H. Whittaker", "Darwin", "Mendel"], 1, "R.H. Whittaker proposed it in 1969: Monera, Protista, Fungi, Plantae and Animalia."),
      ],
    },
    {
      title: "Cell biology and plant physiology",
      duration: "4–5 weeks",
      concepts: [
        "The cell: prokaryotic vs eukaryotic cells, and the organelles and their functions",
        "Biomolecules: carbohydrates, proteins, lipids, nucleic acids, and enzymes and what affects their activity",
        "Cell cycle: the phases of mitosis and meiosis, and why each matters",
        "Photosynthesis: the light reactions, the Calvin cycle, C₃ vs C₄ plants and photorespiration",
        "Respiration and growth in plants: glycolysis, the Krebs cycle, electron transport, and plant growth regulators",
      ],
      practice: ["Draw mitosis and meiosis side by side and list three differences", "Make one flowchart linking glycolysis, the Krebs cycle and the electron transport chain"],
      checkpoint: ["Explain why meiosis halves the chromosome number", "Say where the light reactions and the Calvin cycle happen in the chloroplast", "Name the plant hormone that ripens fruit"],
      resources: ["the NCERT Class 11 biology textbook", "the NCERT Exemplar problems"],
      videoSearch: "class 11 biology cell cycle photosynthesis respiration ncert",
      quiz: [
        q("Where does the Calvin cycle take place?", ["Thylakoid membrane", "Stroma of the chloroplast", "Mitochondrial matrix", "Cytoplasm"], 1, "The Calvin cycle fixes CO₂ in the stroma; the light reactions happen on the thylakoids."),
        q("When does crossing over happen?", ["Prophase I of meiosis", "Metaphase of mitosis", "Anaphase II of meiosis", "Interphase"], 0, "Homologous chromosomes pair up and exchange segments during prophase I."),
      ],
    },
    {
      title: "Human physiology",
      duration: "4 weeks",
      concepts: [
        "Breathing and exchange of gases: the mechanism of breathing, respiratory volumes, and transport of O₂ and CO₂",
        "Body fluids and circulation: blood groups, double circulation, the cardiac cycle and the ECG",
        "Excretion: the structure of the nephron, urine formation and regulation of kidney function",
        "Locomotion and movement: the sliding filament theory of muscle contraction and the skeletal system",
        "Neural control: the neuron, how a nerve impulse is generated and conducted, and the synapse",
      ],
      practice: ["Draw a labelled nephron and trace filtration, reabsorption and secretion along it", "Explain the cardiac cycle out loud with a heart diagram, timing each phase"],
      checkpoint: ["Explain how oxygen is carried from the lungs to the tissues", "Describe what happens in a muscle fibre when it contracts", "Explain how a nerve impulse crosses a chemical synapse"],
      resources: ["the NCERT Class 11 biology textbook", "anatomy diagrams or 3D models"],
      videoSearch: "class 11 biology human physiology nephron cardiac cycle ncert",
      quiz: [
        q("Which part of the nephron does most of the filtering?", ["Loop of Henle", "Glomerulus", "Collecting duct", "Distal tubule"], 1, "Blood is filtered from the glomerulus into Bowman's capsule."),
        q("Whose red blood cells can be given to all ABO and Rh groups?", ["AB positive", "O negative", "A positive", "B negative"], 1, "O negative cells carry no A, B or Rh antigens, so they're the universal donor type."),
      ],
    },
    {
      title: "Reproduction, genetics and evolution (Class 12)",
      duration: "5–6 weeks",
      concepts: [
        "Sexual reproduction in flowering plants: pollination, double fertilisation and seed formation",
        "Human reproduction and reproductive health: gametogenesis, the menstrual cycle and contraception",
        "Principles of inheritance: Mendel's laws, incomplete dominance, sex determination and genetic disorders",
        "Molecular basis of inheritance: DNA replication, transcription, translation, the lac operon and the Human Genome Project",
        "Evolution: the evidence, natural selection, the Hardy–Weinberg principle and human evolution",
      ],
      practice: ["Solve 20 Punnett-square problems, including dihybrid crosses", "Draw the lac operon switched on and switched off"],
      checkpoint: ["Derive the 9:3:3:1 ratio of a dihybrid cross", "Explain double fertilisation in flowering plants", "Describe how lactose switches on the lac operon"],
      resources: ["the NCERT Class 12 biology textbook", "past CBSE board papers"],
      videoSearch: "class 12 biology molecular basis of inheritance genetics ncert",
      quiz: [
        q("What is the phenotype ratio of a monohybrid F₂ generation with complete dominance?", ["1:2:1", "3:1", "9:3:3:1", "1:1"], 1, "Crossing Tt × Tt gives 3 showing the dominant trait to 1 showing the recessive one."),
        q("In the lac operon, lactose acts as…", ["the repressor", "the inducer", "the promoter", "the operator"], 1, "Lactose (as allolactose) binds the repressor and removes it, so the genes are transcribed."),
      ],
    },
    {
      title: "Human welfare, biotechnology and ecology (Class 12)",
      duration: "4–5 weeks",
      concepts: [
        "Human health and disease: pathogens, immunity, vaccines, AIDS, cancer and drug abuse",
        "Microbes in human welfare: in food, industry, sewage treatment and biogas",
        "Biotechnology principles: restriction enzymes, cloning vectors, PCR and gel electrophoresis",
        "Biotechnology applications: Bt crops, RNA interference, gene therapy and biosafety",
        "Ecology: population interactions, energy flow and ecological pyramids, and biodiversity and its conservation",
      ],
      practice: ["Draw the steps of making recombinant DNA, from cutting with a restriction enzyme to transforming a host cell", "Make a table of population interactions (mutualism, competition, predation, parasitism) with Indian examples"],
      checkpoint: ["Explain the three steps of each PCR cycle", "Explain how Bt cotton protects itself from bollworms", "Explain why only about 10% of energy passes to the next trophic level"],
      resources: ["the NCERT Class 12 biology textbook", "CBSE sample question papers"],
      videoSearch: "class 12 biology biotechnology principles ecology ncert",
      quiz: [
        q("Which enzyme joins DNA fragments in recombinant DNA technology?", ["Restriction endonuclease", "DNA ligase", "DNA polymerase", "Helicase"], 1, "Restriction enzymes cut the DNA; DNA ligase seals the fragments together."),
        q("Where does the Bt toxin come from?", ["A virus", "The bacterium Bacillus thuringiensis", "A fungus", "The cotton plant itself"], 1, "The cry genes come from Bacillus thuringiensis and are inserted into crops such as cotton."),
      ],
    },
  ],
  finishLine: {
    name: "Full-syllabus mock board exam",
    description: "Take a timed 3-hour CBSE Class 12 biology sample paper, mark it with the official marking scheme, and redraw every diagram you lost marks on.",
  },
  pitfalls: [
    "Skipping diagrams, which earn marks and help you remember processes",
    "Reading NCERT without making your own notes and flowcharts",
    "Leaving genetics problems to the end, though they need regular practice",
  ],
};

const BIOLOGY_EXTRAS: PathExtra = {
  stages: [],
  courses: [
    { platform: "khanacademy", query: "class 12 biology india", note: "free lessons aligned with the NCERT chapters" },
    { platform: "youtube", query: "class 12 biology ncert full chapter", note: "chapter-wise lectures and diagrams" },
  ],
  featured: {
    videos: [],
    courses: [
      khan("Class 11 biology (India)", "/science/in-in-class-11-biology-india"),
      khan("Class 12 biology (India)", "/science/in-in-class-12-biology-india"),
      NCERT_BOOKS,
      syllabus("Biology", "Biology"),
    ],
  },
};

const BIOLOGY_NEXT: NextTopic[] = [
  { topic: "NEET biology practice", why: "Apply the same NCERT chapters to the medical entrance exam's question style." },
  { topic: "Biotechnology", why: "Go deeper into the tools behind modern medicine and agriculture." },
  { topic: "Human anatomy and physiology", why: "Build a detailed picture of how the body works, for medicine and allied health." },
];

// ---------------------------------------------------------------- Computer Science (083)

const COMPUTER_SCIENCE: LearningPath = {
  summary: `Cover the CBSE Class 11–12 Computer Science (083) syllabus: write working Python programs with files and stacks, use SQL confidently and explain networking basics. ${NOTE}`,
  stages: [
    {
      title: "Computer systems and Python basics (Class 11)",
      duration: "3 weeks",
      concepts: [
        "Computer organisation: the CPU, memory (primary, cache and secondary) and units from bit to petabyte",
        "Software: operating systems, language translators (assembler, compiler, interpreter) and application software",
        "Boolean logic: AND, OR, NOT, NAND, NOR and XOR gates, truth tables and De Morgan's laws",
        "Number systems and encoding: binary, octal and hexadecimal conversions; ASCII and Unicode (UTF-8, UTF-32)",
        "Python basics: tokens, variables, data types, mutable vs immutable types, operators and input/output",
      ],
      practice: ["Convert 20 numbers between binary, octal, decimal and hexadecimal by hand", "Write 10 short Python programs that take input, calculate and print a result (e.g. simple interest)"],
      checkpoint: ["Convert 156 (decimal) to binary and hexadecimal", "Prove one of De Morgan's laws with a truth table", "Explain the difference between a compiler and an interpreter"],
      resources: ["the NCERT Class 11 computer science textbook", "Python installed on your computer (or an online Python editor)"],
      videoSearch: "class 11 computer science python basics number system boolean logic cbse",
      quiz: [
        q("What is decimal 13 in binary?", ["1011", "1101", "1110", "1001"], 1, "13 = 8 + 4 + 1, which is 1101 in binary."),
        q("Which of these Python types is immutable?", ["list", "dict", "tuple", "set"], 2, "A tuple can't be changed once created; lists, dicts and sets can."),
      ],
    },
    {
      title: "Python: control flow and data structures (Class 11)",
      duration: "4 weeks",
      concepts: [
        "Flow of control: if-elif-else, for loops with range(), while loops, break and continue, and nested loops",
        "Strings: slicing, traversal, and methods such as split(), join(), find(), replace() and strip()",
        "Lists and tuples: indexing, slicing, methods (append, extend, insert, pop, sort) and linear search",
        "Dictionaries: keys and values, get(), update(), items(), and counting frequencies",
        "Modules: math, random and statistics",
      ],
      practice: ["Write the CBSE suggested programs: patterns, series sums, factorial, and frequencies in a list", "Use a dictionary to count how often each character appears in a sentence"],
      checkpoint: ["Check whether a string is a palindrome using slicing", "Find the largest, smallest and mean value of a list with a loop, without built-in functions", "Explain why a list can't be a dictionary key but a tuple can"],
      resources: ["the NCERT Class 11 computer science textbook", "the official Python tutorial"],
      videoSearch: "class 11 computer science python strings lists dictionaries cbse",
      quiz: [
        q("What does 'Python'[1:4] give?", ["'Pyt'", "'yth'", "'ytho'", "'Pyth'"], 1, "The slice [1:4] takes indices 1, 2 and 3: 'y', 't' and 'h'."),
        q("What does d.get('x', 0) return when 'x' isn't a key in d?", ["None", "An error", "0", "'x'"], 2, "get() returns the default you pass (here 0) when the key is missing."),
      ],
    },
    {
      title: "Functions, exceptions and file handling (Class 12)",
      duration: "4 weeks",
      concepts: [
        "Functions: parameters and arguments, default and positional parameters, return values, and local vs global scope",
        "Exception handling with try-except-finally",
        "Text files: open modes (r, w, a, r+), read(), readline(), readlines(), write(), seek() and tell(), and the with clause",
        "Binary files with pickle: dump() and load() for writing, reading, searching, appending and updating records",
        "CSV files with the csv module: writer(), writerow(), writerows() and reader()",
      ],
      practice: ["Write a program that counts the lines starting with 'T' in a text file", "Build a student-records program that stores, searches and updates records in a binary file with pickle"],
      checkpoint: ["Explain the difference between 'w' and 'a' modes", "Handle a ZeroDivisionError and a ValueError in one program", "Read a CSV file and print the rows that match a condition"],
      resources: ["the NCERT Class 12 computer science textbook", "the Python docs for the csv and pickle modules"],
      videoSearch: "class 12 computer science python file handling binary csv pickle cbse",
      quiz: [
        q("Which file mode adds data to the end of a file without erasing it?", ["'r'", "'w'", "'a'", "'rb'"], 2, "'a' (append) writes at the end; 'w' empties the file first."),
        q("Which pickle function writes an object to a binary file?", ["pickle.load()", "pickle.dump()", "pickle.write()", "pickle.save()"], 1, "pickle.dump(obj, file) writes it; pickle.load(file) reads it back."),
      ],
    },
    {
      title: "Stacks and computer networks (Class 12)",
      duration: "3 weeks",
      concepts: [
        "The stack data structure: LIFO, push and pop, and implementing a stack with a Python list",
        "Data communication: bandwidth, data transfer rate, IP addresses, and circuit vs packet switching",
        "Transmission media and devices: twisted pair, coaxial and fibre-optic cable, radio waves; modem, hub, switch, router and gateway",
        "Network types and topologies: PAN, LAN, MAN and WAN; bus, star and tree",
        "Protocols and the web: HTTP, HTTPS, FTP, SMTP, POP3, TCP/IP and VoIP; URLs, domain names and web hosting",
      ],
      practice: ["Implement push, pop and display for a stack of student records using a list", "Design a network for a school campus case study: choose the topology and cabling, and place the switch and router"],
      checkpoint: ["Explain why a stack is LIFO with an everyday example", "Tell a hub, a switch and a router apart", "Name the protocol used to send email and the one used to receive it"],
      resources: ["the NCERT Class 12 computer science textbook", "CBSE sample question papers (networking case studies)"],
      videoSearch: "class 12 computer science stack computer networks cbse",
      quiz: [
        q("Which device connects different networks and forwards packets between them?", ["Hub", "Repeater", "Router", "Modem"], 2, "A router joins networks (e.g. a LAN to the internet) and chooses the path for each packet."),
        q("What order does a stack follow?", ["FIFO", "LIFO", "Random", "Priority"], 1, "Last In, First Out: the last item pushed is the first one popped."),
      ],
    },
    {
      title: "Databases, SQL and Python–MySQL connectivity (Class 12)",
      duration: "4 weeks",
      concepts: [
        "The relational model: relation, attribute, tuple, degree, cardinality, and candidate, primary, alternate and foreign keys",
        "SQL DDL and DML: CREATE, ALTER, DROP, INSERT, UPDATE and DELETE, and constraints",
        "SELECT queries: WHERE, IN, BETWEEN, LIKE, IS NULL, ORDER BY, DISTINCT and aliases",
        "Aggregate functions with GROUP BY and HAVING, and joins: Cartesian product, equi-join and natural join",
        "Python–MySQL connectivity: connect(), cursor(), execute(), commit(), fetchone(), fetchall() and rowcount",
      ],
      practice: ["Create a 'school' database with STUDENT and MARKS tables and write 25 queries covering every clause in the syllabus", "Write a Python menu program that inserts, updates, deletes and displays records in MySQL"],
      checkpoint: ["Write a query for the average marks per class, showing only classes averaging above 70", "Explain the difference between WHERE and HAVING", "Explain why commit() is needed after an INSERT from Python"],
      resources: ["the NCERT Class 12 computer science textbook", "MySQL installed on your computer", "an online SQL tutorial with practice exercises"],
      videoSearch: "class 12 computer science sql python mysql connectivity cbse",
      quiz: [
        q("The degree of a table is its number of…", ["rows", "columns (attributes)", "keys", "tables"], 1, "Degree = number of attributes; cardinality = number of rows (tuples)."),
        q("Which clause filters groups after GROUP BY?", ["WHERE", "ORDER BY", "HAVING", "DISTINCT"], 2, "WHERE filters rows before grouping; HAVING filters the groups."),
      ],
    },
  ],
  finishLine: {
    name: "Class 12 project and practical rehearsal",
    description: "With a partner, build a Python application that stores data in MySQL or files (e.g. a library or quiz system), then do a timed practical rehearsal with one Python program and one set of SQL queries.",
  },
  pitfalls: [
    "Writing code only on paper without running it on a computer",
    "Mixing up file modes and forgetting to close files (use the with clause)",
    "Learning SQL syntax without practising on a real database",
  ],
};

const COMPUTER_SCIENCE_EXTRAS: PathExtra = {
  stages: [],
  courses: [
    { platform: "youtube", query: "class 12 computer science python cbse", note: "chapter-wise CBSE lectures and practicals" },
    { platform: "freecodecamp", query: "python sql", note: "free practice for Python and SQL" },
  ],
  featured: {
    videos: [],
    courses: [
      NCERT_BOOKS,
      syllabus("Computer Science", "Computer_Science"),
      { title: "The Python Tutorial", provider: "Python.org (official docs)", url: "https://docs.python.org/3/tutorial/", kind: "free" },
      { title: "SQL Tutorial", provider: "W3Schools", url: "https://www.w3schools.com/sql/", kind: "free" },
    ],
  },
};

const COMPUTER_SCIENCE_NEXT: NextTopic[] = [
  { topic: "Data structures and algorithms", why: "Build on stacks and lists to write faster programs and prepare for coding interviews." },
  { topic: "Web development", why: "Turn your Python and database skills into websites people can use." },
  { topic: "Data analysis with pandas", why: "Use Python to analyse real data, a natural next step after files and SQL." },
];

/** The Class 11–12 demo samples, with the words that select each (checked before the other demos). */
export const INDIA_SAMPLES: { keywords: string[]; path: LearningPath; extra: PathExtra; next: NextTopic[] }[] = [
  {
    keywords: ["computer science", "class 11 computer", "class 12 computer", "11th computer", "12th computer", "cbse computer", " cs 083", "computer 083"],
    path: COMPUTER_SCIENCE,
    extra: COMPUTER_SCIENCE_EXTRAS,
    next: COMPUTER_SCIENCE_NEXT,
  },
  { keywords: ["physics"], path: PHYSICS, extra: PHYSICS_EXTRAS, next: PHYSICS_NEXT },
  { keywords: ["chemistry"], path: CHEMISTRY, extra: CHEMISTRY_EXTRAS, next: CHEMISTRY_NEXT },
  { keywords: ["biology", " neet "], path: BIOLOGY, extra: BIOLOGY_EXTRAS, next: BIOLOGY_NEXT },
  { keywords: ["maths", "mathematics", " math ", "calculus", "trigonometry"], path: MATHS, extra: MATHS_EXTRAS, next: MATHS_NEXT },
];
