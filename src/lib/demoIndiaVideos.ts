// Per-stage videos for the Class 11–12 demo paths, chosen from YouTube searches for each stage and checked with
// YouTube oEmbed (each exists and allows embedding; titles and channels are as YouTube reports them).
import type { FeaturedVideo } from "./schema";

/** Videos for each stage of each subject, in stage order. */
export const INDIA_STAGE_VIDEOS: Record<"maths" | "physics" | "chemistry" | "biology" | "computerScience", FeaturedVideo[][]> = {
  maths: [
    [
      { youtubeId: "7BomsDdbUiQ", title: "Relations and Functions Class 11 One Shot | NCERT 11th Maths Chapter-2 | CBSE 2026-27 Exam", channel: "Next Toppers - 11th Science" },
      { youtubeId: "Ylr6SP9bgCk", title: "Relations and Functions Class 11 RAPID REVSION | 11th Maths Chapter-2 | CBSE 2026-27 | Kuldeep Sir", channel: "Next Toppers - 11th Science" },
      { youtubeId: "zGFBw_8CCeY", title: "Class - 11, Chapter 3, Introduction to Trigonometric Functions Maths || CBSE NCERT || Green Board", channel: "Green Board  Class 11 and 12" },
    ],
    [
      { youtubeId: "82vqHcOFV_g", title: "Permutation and Combination Class 11 Rapid Revision | CBSE 11th Maths Chapter-6 Quick Revision", channel: "Next Toppers - 11th Science" },
      { youtubeId: "Af5uFkXQ9n0", title: "Binomial Theorem | CBSE Class 11th Maths | Full Chapter in Mins | Rapid Revision Series", channel: "Next Toppers - 11th Science" },
      { youtubeId: "Y1X_zLptX_E", title: "Permutations And Combinations | Full Chapter in ONE SHOT | Chapter 6 | Class 11 Maths", channel: "PW Class 11 Science" },
    ],
    [
      { youtubeId: "nSElh-fbH0E", title: "Straight Lines | CBSE Class 11th Maths | Full Chapter in 20 Mins | Rapid Revision Series", channel: "Next Toppers - 11th Science" },
      { youtubeId: "y3v91_-NvpA", title: "MOST IMPORTANT CONIC SECTION Concepts & Formulas - in 20 Mins | Class 11th Maths - Chapter-10", channel: "Next Toppers - 11th Science" },
      { youtubeId: "1VQXjxDN-Zs", title: "CONIC SECTIONS ONE SHOT MATHS | CLASS 11th Maths NCERT Complete Chapter with Ushank Sir", channel: "Science and Fun Education" },
    ],
    [
      { youtubeId: "9cXT0aYMr94", title: "Application of Derivatives in 30 Mins | Class 12th Maths Chapter-6 Revision | CBSE Board 2026", channel: "Next Toppers - 12th Science" },
      { youtubeId: "fy4m6lZ9YwA", title: "Application of Derivatives One Shot Maths 2024-25 | Class 12th Maths CBSE Board with Ushank Sir", channel: "Science and Fun Education" },
      { youtubeId: "dBglfhVX6kI", title: "INTEGRALS in ONE SHOT || Full Chapter || Class 12 BOARDS || PW", channel: "12th Hackers" },
    ],
    [
      { youtubeId: "MYF034ZUKxo", title: "Matrices Detailed Explanation | Class 12th Maths NCERT Based Board 2024-25 with Ushank Sir", channel: "Science and Fun Education" },
      { youtubeId: "XJK4lYTIOhk", title: "Quick Revision of Matrices and Determinants Class 12 | JEE Main 2022 [IIT JEE Maths] |Vedantu JEE", channel: "Vedantu JEE" },
      { youtubeId: "coyCGcgIjBM", title: "Matrices & Determinants - Class 12 Maths | NCERT for Boards & CUET", channel: "Apni Kaksha Official" },
    ],
  ],
  physics: [
    [
      { youtubeId: "q_nHFZ_2IFc", title: "Projectile Motion | Class 11 Physics Chapter 4 | Motion In A Plane | Angular Projectile Motion", channel: "Nexa Classes-Deepak Antil" },
      { youtubeId: "mW-VRexkVKE", title: "Derivation Time of Flight, Range, Maximum height of Projectile | Class 11 Physics Derivation", channel: "MCQ NCERT" },
      { youtubeId: "7RGDC2_mC5w", title: "Motion in a Plane in 40 Mins. | Class 11th Physics Chapter-3 RAPID REVISION | CBSE 2026-27", channel: "Next Toppers - 11th Science" },
    ],
    [
      { youtubeId: "YR75d0aZ1Kk", title: "Laws of Motion | CBSE Class 11th Physics | Full Chapter in 15 Mins | Rapid Revision", channel: "Next Toppers - 11th Science" },
      { youtubeId: "_TlzyYE1dtc", title: "Newton's Laws of Motion (NLM) RAPID REVISION | Class 11th Physics Chapter-4 | CBSE 2026-27", channel: "Next Toppers - 11th Science" },
      { youtubeId: "eACeA8W0tCQ", title: "Work, Energy and Power | CLASS 11 Physics | Complete Chapter | NCERT Covered | Prashant Kirad", channel: "Prashant Kirad 11th & 12th" },
    ],
    [
      { youtubeId: "L2xOD_hCC2k", title: "Thermodynamics | CLASS 11 Physics | Complete NCERT Chapter |Prashant Kirad", channel: "Prashant Kirad 11th & 12th" },
      { youtubeId: "nX5nSrPEyE4", title: "Oscillations | CBSE Class 11th Physics | Full Chapter in 15 Mins | Rapid Revision Series", channel: "Next Toppers - 11th Science" },
      { youtubeId: "x7Hzh-F24Qo", title: "Oscillations One Shot Physics 2024-25 | Class 11th Physics NCERT with Experiment by Ashu Sir", channel: "Science and Fun Education" },
    ],
    [
      { youtubeId: "BbI4MhU-BYc", title: "Electric Charges and Field - Class 12th Physics Chapter-1 | SWAHA Series | CBSE 2026-27", channel: "Next Toppers - 12th Science" },
      { youtubeId: "Xg9dXAUTd7A", title: "Current Electricity Class 12 RAPID REVISION | 12th Physics Chapter-3 in One Shot | CBSE 2026-27", channel: "Next Toppers - 12th Science" },
      { youtubeId: "D6lsP4n_YKw", title: "Electric Charges and Fields in One Shot | Complete NCERT Coverage | Class 12 Physics Boards 2027", channel: "Munil Sir" },
    ],
    [
      { youtubeId: "aWZrNhD2S3k", title: "Ray Optics And Optical Instruments Class 12 One Shot | NCERT + Derivations | Physics Chapter 9", channel: "NCERT Wallah" },
      { youtubeId: "5S6w4CTk_O8", title: "DUAL NATURE OF RADIATION AND MATTER in 50 Minutes | Physics Chapter 11 | Full Chapter Class 12th", channel: "NCERT Wallah" },
      { youtubeId: "OH0syg0zlBU", title: "Dual Nature Of Matter And Radiation Class 12 One Shot | NCERT + PYQ | Physics Chapter 11", channel: "NCERT Wallah" },
    ],
  ],
  chemistry: [
    [
      { youtubeId: "7EtQIgx4q_A", title: "Some Basic Concepts of Chemistry Class 11 | CBSE Class 11th Chemistry Chapter-1 in 15 Mins", channel: "Next Toppers - 11th Science" },
      { youtubeId: "32q3YXhGx3s", title: "Some Basic Concepts Of Chemistry Class 11 | Rapid Revision in 30 min | Chemistry Chapter 1", channel: "PW Class 11 Science" },
      { youtubeId: "o9wvSQaWbdA", title: "Some Basic Concepts of Chemistry One Shot in 50 Minutes | 11th Chemistry Chapter 1 One Shot for 2027", channel: "Munil Sir" },
    ],
    [
      { youtubeId: "sqBxczmPZSY", title: "Chemical Bonding and Molecular Structure Class 11 | CBSE 11th Chemistry Chapter-4 | Rapid Revision", channel: "Next Toppers - 11th Science" },
      { youtubeId: "z3JYqn2cNzg", title: "Equilibrium Quick Revision | CBSE Class 11 Chemistry | Full Chapter in 15 Mins | Rapid Revision", channel: "Next Toppers - 11th Science" },
      { youtubeId: "tXCAwRnMtEc", title: "Chemical Bonding One Shot | Class 11 Chemistry Chapter 4 | Complete NCERT in 1.2 Hours | 2027", channel: "Munil Sir" },
    ],
    [
      { youtubeId: "tnsvWiSTPJ8", title: "Organic Chemistry: Some Basic Principles and Techniques | Class 11Chemistry | Full Chapter in 15 Min", channel: "Next Toppers - 11th Science" },
      { youtubeId: "SW98bpLnRlk", title: "Hydrocarbons Chemistry Class 11 One Shot | All Concepts + NCERT | Chemistry Chapter 13", channel: "PW Class 11 Science" },
      { youtubeId: "L88uuqmAioU", title: "Organic Chemistry Class 11 | Chapter 12 NCERT CBSE NEET JEE", channel: "LearnoHub - Class 11, 12" },
    ],
    [
      { youtubeId: "Sag2IkxobkA", title: "Chemical Kinetics Class 12 RAPID REVISION | 12th Chemistry Chapter 3 One Shot | CBSE 2026", channel: "Next Toppers - 12th Science" },
      { youtubeId: "F7GkhROlZsw", title: "Coordination Compounds Class 12 RAPID REVISION | 12th Chemistry Ch-5 One Shot | CBSE 2026", channel: "Next Toppers - 12th Science" },
      { youtubeId: "Q8LXVhGcce4", title: "Class 12th Chemistry Marathon | Solutions, Electrochemistry & Kinetics | Board Exam 2025 | Ashu Sir", channel: "Science and Fun Education" },
    ],
    [
      { youtubeId: "qngCrNQ7UT0", title: "Aldehydes, Ketones & Carboxylic Acids in Just 40 Min | NCERT Highlights | JEE/NEET 2026", channel: "ChemNEXUS" },
      { youtubeId: "c_-CrDcg1Hs", title: "Class 12th Chemistry Marathon | Aldehydes, Ketones And Carboxylic Acids, Amines by Ashu Sir", channel: "Science and Fun Education" },
      { youtubeId: "3pUEA0v8lEo", title: "Class 12 CBSE Chemistry | PYQ Discussion - Aldehydes, Ketones And Carboxylic Acids , Amines", channel: "Xylem Class 12 CBSE" },
    ],
  ],
  biology: [
    [
      { youtubeId: "TU4FUQDuzY4", title: "Biological Classification in 27 Min | Class 11th Biology Chapter-2 RAPID REVISION | CBSE 2026-27", channel: "Next Toppers - 11th Science" },
      { youtubeId: "2yP_y5MFJU0", title: "Animal Kingdom Quick One Shot | Complete NCERT Explanation | NEET Biology | Class 11 Biology", channel: "Taleology" },
      { youtubeId: "MQnx1lXFds0", title: "Animal Kingdom Class 11 One Shot | Biology Chapter 4 | NCERT Line by Line | Aarushi Ma'am", channel: "PW Class 11 Science" },
    ],
    [
      { youtubeId: "HkVSXumpp2k", title: "Photosynthesis in Higher Plants | CBSE Class 11 Biology Rapid Revision | Full Chapter in Mins", channel: "Next Toppers - 11th Science" },
      { youtubeId: "oO3wDNaRP0g", title: "Cell Cycle and Cell Division Class 11 Biology | Revised NCERT Solutions | Chapter 10 Questions 1-16", channel: "LearnoHub - Class 11, 12" },
      { youtubeId: "d6pfq-0CwZc", title: "PHOTOSYNTHESIS IN HIGHER PLANTS - Complete Chapter in One Video || Concepts+PYQs || Class 11th NEET", channel: "Competition Wallah" },
    ],
    [
      { youtubeId: "2fXWeGoVvV0", title: "Body Fluids And Circulation In 15 Mins | RE-NEET 2026 | Seep Pahuja", channel: "Unacademy NEET" },
      { youtubeId: "48t10qOiI3k", title: "Body Fluids and Circulation Class 11 Biology | New NCERT 2026-27 | One Shot CBSE NEET", channel: "LearnoHub - Class 11, 12" },
      { youtubeId: "0k8r7r1zEZ0", title: "Body Fluids and Circulation Class 11 One Shot | NCERT + Diagrams | Biology Chapter 18", channel: "PW Class 11 Science" },
    ],
    [
      { youtubeId: "nWvf6J-9umo", title: "Class12 Principles of inheritance and variation oneshot ⭐", channel: "Avi Didi" },
      { youtubeId: "LLN3QDSGpXQ", title: "Molecular Basis of Inheritance Class 12 Biology | Chapter 6 New NCERT 2026-27 CBSE One Shot NEET", channel: "LearnoHub - Class 11, 12" },
      { youtubeId: "fuglbkNZ7ac", title: "Principles of Inheritance and Variation Class 12 One Shot | Biology Chapter 4 | NCERT + PYQs", channel: "NCERT Wallah" },
    ],
    [
      { youtubeId: "l5ErDqr-t2w", title: "Biotechnology:Principles & Processes Class12 Biology| NCERT Chapter 11 | CBSE NEET", channel: "Avi Didi" },
      { youtubeId: "pumZiybEwdE", title: "Biotechnology Principles And Processes Class 12 One Shot | NCERT + PYQs | Biology Chapter 11", channel: "NCERT Wallah" },
      { youtubeId: "042LD-Xnt3A", title: "Ecosystem Class 12 One Shot | NCERT + PYQs | Biology Chapter 12 by By Aarushi Ma'am", channel: "NCERT Wallah" },
    ],
  ],
  computerScience: [
    [
      { youtubeId: "gI-qXk7XojA", title: "Boolean Logic & Logic Gates: Crash Course Computer Science", channel: "CrashCourse" },
      { youtubeId: "hCvAW_5-cJE", title: "Conversion from Decimal Number System", channel: "Neso Academy" },
      { youtubeId: "NLZbiFTrJ-g", title: "Data Representation- ONE SHOT | Class 11 Computer Science | ENGLISH", channel: "Pradnya's Class" },
    ],
    [
      { youtubeId: "gOMW_n2-2Mw", title: "Python lists, sets, and tuples explained", channel: "Bro Code" },
      { youtubeId: "RCM-lVAfXFg", title: "11. Dictionaries and Tuples [Python 3 Programming Tutorials]", channel: "codebasics" },
      { youtubeId: "axukaXMYAyI", title: "Tuples and Dictionaries- One Shot Revision | Ch 10 | Class 11 CS Code 083 | CBSE 2025-26", channel: "Magnet Brains" },
    ],
    [
      { youtubeId: "aequTxAvQq4", title: "Python Tutorial for Beginners | File handling", channel: "Telusko" },
      { youtubeId: "RZ1No6AOy_8", title: "Data File Handling in Python | Class 12 Computer Science | Full Chapter", channel: "Aakash Singh" },
      { youtubeId: "mXR56DpnsXQ", title: "FILE HANDLING Questions | Python Text | Binary | CSV File | Class 12 Computer Science", channel: "Pradnya's Class" },
    ],
    [
      { youtubeId: "fNxOpM8k4K8", title: "Computer Networks - Part 1 | ONE SHOT | CBSE Class 12 Computer Science", channel: "Pradnya's Class" },
      { youtubeId: "SJLYvG4ogl4", title: "Computer Networks | 1 Shot Video | CBSE Class 12 Computer Science", channel: "Swati Chawla" },
    ],
    [
      { youtubeId: "1xnV0NchZ9o", title: "Interface Python with MySQL | Python and MYSQL Connectivity 1 Shot | CBSE Class 12 Computer Science", channel: "Swati Chawla" },
      { youtubeId: "srdx-H5Li-4", title: "Complete MySQL Portion | DATABASE MANAGEMENT - ONE SHOT | Class 12 Computer Science | ENGLISH", channel: "Pradnya's Class" },
      { youtubeId: "_LNQ6hldKLo", title: "Interface Python with MySQL | Class 12 Computer Science | Python - MySQL Connectivity", channel: "Pradnya's Class" },
    ],
  ],
};
