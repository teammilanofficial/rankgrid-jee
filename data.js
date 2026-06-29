const APP_CONFIG = {
  appName: "RankGrid JEE",
  tagline: "Track. Practice. Improve.",
  exam: "JEE 2028",
  upiId: "yourupi@bank",
  telegramUsername: "@yourusername"
};

const SERIES = [
  {
    id: "free",
    title: "Free JEE 2028 Dashboard",
    subject: "All Subjects",
    type: "Free Material",
    price: 0,
    free: true,
    description:
      "Free PDFs, sample notes, practice questions, mini tests, planner and basic progress tracking."
  },

  {
    id: "physics-concise-notes",
    title: "Physics Concise Notes Series",
    subject: "Physics",
    type: "Concise Notes PDFs",
    price: 49,
    free: false,
    description:
      "Complete Physics concise notes PDFs with formulas, concepts, mistakes and revision sheets."
  },

  {
    id: "physics-short-notes",
    title: "Physics Short Notes Series",
    subject: "Physics",
    type: "Short Notes PDFs",
    price: 39,
    free: false,
    description:
      "Quick revision short notes for Physics chapters, made for fast revision before tests."
  },

  {
    id: "physics-mind-map",
    title: "Physics Mind Map Series",
    subject: "Physics",
    type: "Mind Map PDFs",
    price: 39,
    free: false,
    description:
      "Physics chapter-wise mind maps for quick concept connection and revision."
  },

  {
    id: "physics-dpp",
    title: "Physics DPP Practice Series",
    subject: "Physics",
    type: "DPP PDFs",
    price: 59,
    free: false,
    description:
      "Physics DPP-style practice PDFs with chapter-wise question sets and solutions."
  },

  {
    id: "physics-pyq",
    title: "Physics PYQ Practice Series",
    subject: "Physics",
    type: "PYQ PDFs",
    price: 79,
    free: false,
    description:
      "Physics PYQ-style practice PDFs with solutions and performance tracking."
  },

  {
    id: "physics-test",
    title: "Physics Test Series",
    subject: "Physics",
    type: "Test PDFs",
    price: 99,
    free: false,
    description:
      "Physics chapter tests and mixed tests with solutions and test analysis tracking."
  },

  {
    id: "chemistry-concise-notes",
    title: "Chemistry Concise Notes Series",
    subject: "Chemistry",
    type: "Concise Notes PDFs",
    price: 49,
    free: false,
    description:
      "Chemistry concise notes PDFs for Physical, Inorganic and Organic Chemistry."
  },

  {
    id: "chemistry-short-notes",
    title: "Chemistry Short Notes Series",
    subject: "Chemistry",
    type: "Short Notes PDFs",
    price: 39,
    free: false,
    description:
      "Fast revision Chemistry short notes for formulas, facts and important concepts."
  },

  {
    id: "chemistry-mind-map",
    title: "Chemistry Mind Map Series",
    subject: "Chemistry",
    type: "Mind Map PDFs",
    price: 39,
    free: false,
    description:
      "Chemistry mind maps for quick revision and concept linking."
  },

  {
    id: "chemistry-dpp",
    title: "Chemistry DPP Practice Series",
    subject: "Chemistry",
    type: "DPP PDFs",
    price: 59,
    free: false,
    description:
      "Chemistry DPP-style practice PDFs with chapter-wise practice and solutions."
  },

  {
    id: "chemistry-pyq",
    title: "Chemistry PYQ Practice Series",
    subject: "Chemistry",
    type: "PYQ PDFs",
    price: 79,
    free: false,
    description:
      "Chemistry PYQ-style practice PDFs with solutions and performance tracking."
  },

  {
    id: "chemistry-test",
    title: "Chemistry Test Series",
    subject: "Chemistry",
    type: "Test PDFs",
    price: 99,
    free: false,
    description:
      "Chemistry chapter tests and mixed tests with solutions and tracking."
  },

  {
    id: "maths-concise-notes",
    title: "Maths Concise Notes Series",
    subject: "Maths",
    type: "Concise Notes PDFs",
    price: 49,
    free: false,
    description:
      "Maths concise notes PDFs with formulas, methods and important question types."
  },

  {
    id: "maths-short-notes",
    title: "Maths Short Notes Series",
    subject: "Maths",
    type: "Short Notes PDFs",
    price: 39,
    free: false,
    description:
      "Maths short notes for quick formula and concept revision."
  },

  {
    id: "maths-formula",
    title: "Maths Formula Sheet Series",
    subject: "Maths",
    type: "Formula PDFs",
    price: 39,
    free: false,
    description:
      "Maths formula sheets for all important Class 11 and JEE 2028 chapters."
  },

  {
    id: "maths-dpp",
    title: "Maths DPP Practice Series",
    subject: "Maths",
    type: "DPP PDFs",
    price: 59,
    free: false,
    description:
      "Maths DPP-style practice PDFs with chapter-wise questions and solutions."
  },

  {
    id: "maths-pyq",
    title: "Maths PYQ Practice Series",
    subject: "Maths",
    type: "PYQ PDFs",
    price: 79,
    free: false,
    description:
      "Maths PYQ-style practice PDFs with solutions and performance tracking."
  },

  {
    id: "maths-test",
    title: "Maths Test Series",
    subject: "Maths",
    type: "Test PDFs",
    price: 99,
    free: false,
    description:
      "Maths chapter tests, mixed tests and weekly practice tests."
  },

  {
    id: "jee-tracker-pro",
    title: "JEE 2028 Study Tracker Pro",
    subject: "All Subjects",
    type: "Tracker Pack",
    price: 29,
    free: false,
    description:
      "DPP tracker, mistake book, backlog tracker, formula revision tracker and test analysis templates."
  }
];

const MATERIALS = [
  {
    id: 1,
    seriesId: "free",
    title: "JEE 2028 Starter Checklist",
    type: "PDF",
    subject: "All",
    chapter: "Strategy",
    update: "Available",
    fileUrl: "",
    description: "Starter checklist for serious JEE 2028 aspirants."
  },

  {
    id: 2,
    seriesId: "free",
    title: "DPP Solving Method",
    type: "PDF",
    subject: "All",
    chapter: "Study Method",
    update: "Available",
    fileUrl: "",
    description: "How to solve DPPs properly and track mistakes."
  },

  {
    id: 3,
    seriesId: "free",
    title: "Mistake Notebook Template",
    type: "PDF",
    subject: "All",
    chapter: "Revision",
    update: "Available",
    fileUrl: "",
    description: "Template for recording and revising mistakes."
  },

  {
    id: 4,
    seriesId: "free",
    title: "Weekly Study Planner",
    type: "PDF",
    subject: "All",
    chapter: "Planning",
    update: "Available",
    fileUrl: "",
    description: "Simple weekly planner for JEE 2028 preparation."
  },

  {
    id: 5,
    seriesId: "free",
    title: "Basic Maths Sample Formula Sheet",
    type: "PDF",
    subject: "Physics",
    chapter: "Basic Maths",
    update: "Available",
    fileUrl: "",
    description: "Sample formula sheet for Basic Maths used in Physics."
  },

  {
    id: 6,
    seriesId: "free",
    title: "Free Weekly Mini Test 01",
    type: "PDF Test",
    subject: "All",
    chapter: "Mixed",
    update: "Available",
    fileUrl: "",
    description: "Free mixed mini test for JEE 2028 students."
  },

  {
    id: 101,
    seriesId: "physics-concise-notes",
    title: "Basic Maths Concise Notes",
    type: "PDF Notes",
    subject: "Physics",
    chapter: "Basic Maths",
    update: "Weekly",
    fileUrl: "",
    description: "Concise notes for Basic Maths in Physics."
  },

  {
    id: 102,
    seriesId: "physics-concise-notes",
    title: "Units and Dimensions Concise Notes",
    type: "PDF Notes",
    subject: "Physics",
    chapter: "Units and Dimensions",
    update: "Coming Soon",
    fileUrl: "",
    description: "Concise notes for Units and Dimensions."
  },

  {
    id: 103,
    seriesId: "physics-dpp",
    title: "Basic Maths DPP Set 1",
    type: "DPP PDF",
    subject: "Physics",
    chapter: "Basic Maths",
    update: "Weekly",
    fileUrl: "",
    description: "DPP practice set for Basic Maths."
  },

  {
    id: 104,
    seriesId: "physics-pyq",
    title: "Kinematics PYQ Practice Set 1",
    type: "PYQ PDF",
    subject: "Physics",
    chapter: "Kinematics",
    update: "Weekly",
    fileUrl: "",
    description: "PYQ-style practice for Kinematics."
  },

  {
    id: 201,
    seriesId: "chemistry-concise-notes",
    title: "Mole Concept Concise Notes",
    type: "PDF Notes",
    subject: "Chemistry",
    chapter: "Mole Concept",
    update: "Weekly",
    fileUrl: "",
    description: "Concise notes for Mole Concept."
  },

  {
    id: 202,
    seriesId: "chemistry-dpp",
    title: "Mole Concept DPP Set 1",
    type: "DPP PDF",
    subject: "Chemistry",
    chapter: "Mole Concept",
    update: "Weekly",
    fileUrl: "",
    description: "DPP practice for Mole Concept."
  },

  {
    id: 301,
    seriesId: "maths-concise-notes",
    title: "Quadratic Equations Concise Notes",
    type: "PDF Notes",
    subject: "Maths",
    chapter: "Quadratic Equations",
    update: "Weekly",
    fileUrl: "",
    description: "Concise notes for Quadratic Equations."
  },

  {
    id: 302,
    seriesId: "maths-test",
    title: "Quadratic Equations Test 1",
    type: "Test PDF",
    subject: "Maths",
    chapter: "Quadratic Equations",
    update: "Sunday",
    fileUrl: "",
    description: "Test PDF for Quadratic Equations."
  },

  {
    id: 401,
    seriesId: "jee-tracker-pro",
    title: "DPP Tracker Template",
    type: "Tracker PDF",
    subject: "All",
    chapter: "Tracking",
    update: "Available",
    fileUrl: "",
    description: "Template to track DPP completion."
  },

  {
    id: 402,
    seriesId: "jee-tracker-pro",
    title: "Backlog Recovery Planner",
    type: "Planner PDF",
    subject: "All",
    chapter: "Backlog",
    update: "Available",
    fileUrl: "",
    description: "Planner to clear backlog without stopping current syllabus."
  },

  {
    id: 403,
    seriesId: "jee-tracker-pro",
    title: "Test Analysis Sheet",
    type: "Tracker PDF",
    subject: "All",
    chapter: "Test Analysis",
    update: "Available",
    fileUrl: "",
    description: "Sheet to analyse test mistakes and weak areas."
  }
];

const QUESTIONS = [
  {
    id: "q1",
    seriesId: "free",
    subject: "Physics",
    chapter: "Basic Maths",
    difficulty: "Easy",
    question: "If y = x², then dy/dx is:",
    options: ["x", "2x", "x²", "2"],
    correct: 1,
    solution: "Using d(xⁿ)/dx = n xⁿ⁻¹, d(x²)/dx = 2x."
  },

  {
    id: "q2",
    seriesId: "free",
    subject: "Physics",
    chapter: "Graphs",
    difficulty: "Easy",
    question: "The slope of a displacement-time graph represents:",
    options: ["Acceleration", "Velocity", "Force", "Work"],
    correct: 1,
    solution: "Slope of x-t graph is dx/dt, which represents velocity."
  },

  {
    id: "q3",
    seriesId: "free",
    subject: "Chemistry",
    chapter: "Mole Concept",
    difficulty: "Easy",
    question: "1 mole of any substance contains approximately:",
    options: [
      "6.022 × 10²³ particles",
      "9.8 particles",
      "3 × 10⁸ particles",
      "1.6 × 10⁻¹⁹ particles"
    ],
    correct: 0,
    solution:
      "One mole contains Avogadro number of particles, approximately 6.022 × 10²³."
  },

  {
    id: "q4",
    seriesId: "free",
    subject: "Maths",
    chapter: "Quadratic Equations",
    difficulty: "Medium",
    question: "For ax² + bx + c = 0, the discriminant is:",
    options: ["b² + 4ac", "b² - 4ac", "a² - 4bc", "c² - 4ab"],
    correct: 1,
    solution: "The discriminant of ax² + bx + c = 0 is D = b² - 4ac."
  },

  {
    id: "q5",
    seriesId: "free",
    subject: "Physics",
    chapter: "Vectors",
    difficulty: "Medium",
    question:
      "If two equal vectors of magnitude A act at 60°, the resultant magnitude is:",
    options: ["A", "√2 A", "√3 A", "2A"],
    correct: 2,
    solution:
      "R = √(A² + A² + 2A²cos60°) = √(3A²) = √3 A."
  }
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Welcome to RankGrid JEE",
    message: "Free and premium PDF series will be updated weekly.",
    date: "Today"
  },
  {
    id: 2,
    title: "Free Dashboard Active",
    message: "Start with free PDFs, practice questions and tracking.",
    date: "Today"
  }
];
