const SERIES = [
  {
    id: "free",
    title: "Free JEE 2028 Dashboard",
    subject: "All Subjects",
    type: "Free Material",
    price: 0,
    free: true,
    description:
      "Free dashboard with daily practice, sample notes, weekly tests, planner and basic tracking."
  },
  {
    id: "physics-notes",
    title: "Physics Concise Notes Series",
    subject: "Physics",
    type: "Concise Notes",
    price: 49,
    free: false,
    description:
      "Physics concise notes, formulas, mistakes and revision sheets for all chapters."
  },
  {
    id: "physics-pyq",
    title: "Physics PYQ Practice Series",
    subject: "Physics",
    type: "PYQ Practice",
    price: 79,
    free: false,
    description:
      "PYQ-style Physics practice with accuracy tracking, mistakes and analytics."
  },
  {
    id: "chemistry-dpp",
    title: "Chemistry DPP Practice Series",
    subject: "Chemistry",
    type: "DPP Practice",
    price: 59,
    free: false,
    description:
      "Original DPP-style Chemistry practice for Physical, Inorganic and Organic Chemistry."
  },
  {
    id: "maths-test",
    title: "Maths Test Series",
    subject: "Maths",
    type: "Test Series",
    price: 99,
    free: false,
    description:
      "Maths weekly tests with score tracking, skipped questions and accuracy dashboard."
  },
  {
    id: "tracker-pro",
    title: "JEE 2028 Study Tracker Pro",
    subject: "All Subjects",
    type: "Tracker Pack",
    price: 29,
    free: false,
    description:
      "DPP tracker, mistake book, backlog tracker, formula revision and test analysis templates."
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
    update: "Available"
  },
  {
    id: 2,
    seriesId: "free",
    title: "Basic Maths Formula Sheet Sample",
    type: "PDF",
    subject: "Physics",
    chapter: "Basic Maths",
    update: "Available"
  },
  {
    id: 3,
    seriesId: "free",
    title: "Weekly Mini Test 01",
    type: "Test",
    subject: "All",
    chapter: "Mixed",
    update: "Available"
  },
  {
    id: 4,
    seriesId: "physics-notes",
    title: "Basic Maths Concise Notes",
    type: "Notes PDF",
    subject: "Physics",
    chapter: "Basic Maths",
    update: "Weekly"
  },
  {
    id: 5,
    seriesId: "physics-notes",
    title: "Units and Dimensions Short Notes",
    type: "Notes PDF",
    subject: "Physics",
    chapter: "Units",
    update: "Coming Soon"
  },
  {
    id: 6,
    seriesId: "physics-pyq",
    title: "Kinematics PYQ Practice Set 1",
    type: "Practice",
    subject: "Physics",
    chapter: "Kinematics",
    update: "Weekly"
  },
  {
    id: 7,
    seriesId: "chemistry-dpp",
    title: "Mole Concept DPP Set 1",
    type: "Practice",
    subject: "Chemistry",
    chapter: "Mole Concept",
    update: "Weekly"
  },
  {
    id: 8,
    seriesId: "maths-test",
    title: "Quadratic Equations Test 1",
    type: "Test",
    subject: "Maths",
    chapter: "Quadratic Equations",
    update: "Sunday"
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
    chapter: "Basic Maths",
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

const STORAGE_KEY = "rankgrid_jee_v1";

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  view: "home",
  activeSeries: "free",
  activeTab: "overview",
  unlockedSeries: ["free"],
  attempts: {},
  bookmarks: [],
  user: {
    name: "JEE Aspirant",
    plan: "Free Account"
  }
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setView(view) {
  state.view = view;
  saveState();
  render();
}

function setSeries(seriesId) {
  state.activeSeries = seriesId;
  state.activeTab = "overview";
  state.view = "series-detail";
  saveState();
  render();
}

function setTab(tab) {
  state.activeTab = tab;
  saveState();
  render();
}

function isUnlocked(seriesId) {
  return state.unlockedSeries.includes(seriesId);
}

function getAttemptsArray() {
  return Object.values(state.attempts);
}

function getStats(filter = {}) {
  let attempts = getAttemptsArray();

  if (filter.seriesId) {
    attempts = attempts.filter((a) => a.seriesId === filter.seriesId);
  }

  if (filter.subject) {
    attempts = attempts.filter((a) => a.subject === filter.subject);
  }

  const total = attempts.length;
  const solved = attempts.filter((a) => a.status !== "skipped").length;
  const correct = attempts.filter((a) => a.status === "correct").length;
  const incorrect = attempts.filter((a) => a.status === "incorrect").length;
  const skipped = attempts.filter((a) => a.status === "skipped").length;
  const accuracy = solved ? Math.round((correct / solved) * 1000) / 10 : 0;

  return {
    total,
    solved,
    correct,
    incorrect,
    skipped,
    accuracy
  };
}

function getCompletion(seriesId) {
  const questions = QUESTIONS.filter((q) => q.seriesId === seriesId);

  if (questions.length === 0) {
    return seriesId === "free" ? 20 : 0;
  }

  const attempted = questions.filter((q) => state.attempts[q.id]).length;

  return Math.round((attempted / questions.length) * 100);
}

function statCard(label, value) {
  return `
    <div class="stat">
      <div class="stat-number">${value}</div>
      <div class="stat-label">${label}</div>
    </div>
  `;
}

function layout(content) {
  return `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="logo">
          <div class="logo-mark">RG</div>
          <div>
            <h1>RankGrid JEE</h1>
            <p>Track. Practice. Improve.</p>
          </div>
        </div>

        <div class="nav-title">Main</div>
        ${navButton("home", "Dashboard")}
        ${navButton("free", "Free Dashboard")}
        ${navButton("series", "All Series")}
        ${navButton("practice", "Practice Zone")}
        ${navButton("mistakes", "Mistake Book")}
        ${navButton("analytics", "Analytics")}

        <div class="nav-title">Business</div>
        ${navButton("premium", "Premium & UPI")}
        ${navButton("admin", "Admin Panel")}

        <div class="footer-note">
          Version 1 uses browser storage for progress tracking.
          Version 2 will connect Supabase for login, database, storage and admin approval.
        </div>
      </aside>

      <main class="main">
        <div class="topbar">
          <button class="btn secondary mobile-menu" onclick="toggleMenu()">Menu</button>

          <input 
            class="search" 
            placeholder="Search series, notes, PYQ, DPP, tests..." 
            oninput="searchCards(this.value)"
          />

          <div class="profile">
            <div class="avatar">${state.user.name.charAt(0)}</div>
            <div>
              <strong>${state.user.name}</strong>
              <div class="muted" style="font-size: 12px;">${state.user.plan}</div>
            </div>
          </div>
        </div>

        ${content}
      </main>
    </div>
  `;
}

function navButton(view, label) {
  return `
    <button class="nav-btn ${state.view === view ? "active" : ""}" onclick="setView('${view}')">
      <span class="nav-dot"></span>
      ${label}
    </button>
  `;
}

function homePage() {
  const stats = getStats();

  return layout(`
    <section class="hero">
      <div class="hero-card">
        <span class="badge">JEE 2028 Practice Dashboard</span>

        <h2>Professional dashboard for notes, practice, tests and accuracy tracking.</h2>

        <p>
          RankGrid JEE gives free and premium subject-wise series with separate dashboards.
          Track solved problems, correct, incorrect, skipped, accuracy, mistakes and weekly updates in one place.
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
          <button class="btn" onclick="setView('free')">Start Free Dashboard</button>
          <button class="btn secondary" onclick="setView('series')">View Series</button>
        </div>
      </div>

      <div class="panel">
        <div class="kpi-ring" style="--percentage: ${stats.accuracy * 3.6}deg;">
          <div>
            ${stats.accuracy}%<br />
            <span class="muted" style="font-size: 12px;">Accuracy</span>
          </div>
        </div>

        <div class="grid stats" style="grid-template-columns: repeat(2, 1fr);">
          ${statCard("Solved", stats.solved)}
          ${statCard("Correct", stats.correct)}
          ${statCard("Incorrect", stats.incorrect)}
          ${statCard("Skipped", stats.skipped)}
        </div>
      </div>
    </section>

    <div class="grid stats">
      ${statCard("Series", SERIES.length)}
      ${statCard("Free Materials", MATERIALS.filter((m) => m.seriesId === "free").length)}
      ${statCard("Practice Qs", QUESTIONS.length)}
      ${statCard("Unlocked", state.unlockedSeries.length)}
    </div>

    <div class="section-title">
      <h2>Featured Series</h2>
      <button class="btn secondary" onclick="setView('series')">See All</button>
    </div>

    <div class="grid cards">
      ${SERIES.slice(0, 3).map(seriesCard).join("")}
    </div>
  `);
}

function seriesCard(series) {
  const completion = getCompletion(series.id);

  return `
    <div class="series-card searchable" data-search="${series.title.toLowerCase()} ${series.subject.toLowerCase()} ${series.type.toLowerCase()}">
      <span class="pill ${series.free ? "free" : "locked"}">
        ${series.free ? "Free" : "₹" + series.price}
      </span>

      <span class="pill">${series.subject}</span>

      <h3>${series.title}</h3>

      <p>${series.description}</p>

      <div class="progress">
        <div class="progress-bar" style="width: ${completion}%;"></div>
      </div>

      <div class="muted">${completion}% completed</div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
        <button class="btn" onclick="setSeries('${series.id}')">
          ${isUnlocked(series.id) ? "Open Dashboard" : "Preview"}
        </button>

        ${
          !isUnlocked(series.id)
            ? `<button class="btn warning" onclick="paymentPage('${series.id}')">Buy</button>`
            : ""
        }
      </div>
    </div>
  `;
}

function freeDashboard() {
  state.activeSeries = "free";
  state.activeTab = "overview";
  saveState();
  return seriesDetailPage(true);
}

function allSeriesPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>All Subject-wise Series</h2>
        <p class="muted">
          Each series has its own dashboard, materials, practice, analytics and updates.
        </p>
      </div>
    </div>

    <div class="grid cards">
      ${SERIES.map(seriesCard).join("")}
    </div>
  `);
}

function seriesDetailPage(forceFree = false) {
  const seriesId = forceFree ? "free" : state.activeSeries;
  const series = SERIES.find((s) => s.id === seriesId) || SERIES[0];
  const stats = getStats({ seriesId });
  const locked = !isUnlocked(seriesId);

  const tabs = [
    "overview",
    "materials",
    "practice",
    "tests",
    "mistakes",
    "analytics",
    "updates"
  ];

  return layout(`
    <div class="section-title">
      <div>
        <span class="badge">${series.subject} • ${series.type}</span>
        <h2>${series.title}</h2>
        <p class="muted">${series.description}</p>
      </div>

      ${
        locked
          ? `<button class="btn warning" onclick="paymentPage('${series.id}')">Unlock ₹${series.price}</button>`
          : `<button class="btn success">Unlocked</button>`
      }
    </div>

    <div class="grid stats">
      ${statCard("Total Attempts", stats.total)}
      ${statCard("Correct", stats.correct)}
      ${statCard("Incorrect", stats.incorrect)}
      ${statCard("Accuracy", stats.accuracy + "%")}
    </div>

    <div class="tabs">
      ${tabs
        .map(
          (tab) => `
            <button 
              class="tab ${state.activeTab === tab ? "active" : ""}" 
              onclick="setTab('${tab}')"
            >
              ${capitalize(tab)}
            </button>
          `
        )
        .join("")}
    </div>

    ${locked ? lockedPanel(series) : tabContent(seriesId, state.activeTab)}
  `);
}

function lockedPanel(series) {
  return `
    <div class="panel">
      <h3>This premium dashboard is locked</h3>

      <p class="muted">
        You can preview this series. Unlock to access full materials, practice dashboard, analytics and updates.
      </p>

      <div class="payment-box">
        <strong>Manual UPI Unlock Flow</strong>
        <p>
          Pay ₹${series.price}, upload/send screenshot, then admin approves access.
          In Version 2, this will work with Supabase.
        </p>

        <button class="btn warning" onclick="paymentPage('${series.id}')">
          Continue to Payment
        </button>
      </div>
    </div>
  `;
}

function tabContent(seriesId, tab) {
  if (tab === "overview") return overviewTab(seriesId);
  if (tab === "materials") return materialsTab(seriesId);
  if (tab === "practice") return practiceTab(seriesId);
  if (tab === "tests") return testsTab(seriesId);
  if (tab === "mistakes") return mistakesPage(true, seriesId);
  if (tab === "analytics") return analyticsPage(true, seriesId);
  if (tab === "updates") return updatesTab(seriesId);
}

function overviewTab(seriesId) {
  const stats = getStats({ seriesId });
  const materials = MATERIALS.filter((m) => m.seriesId === seriesId);

  return `
    <div class="grid two-column">
      <div class="panel">
        <h3>Series Overview</h3>

        <table class="table">
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Total Problems Solved</td>
            <td>${stats.solved}</td>
          </tr>
          <tr>
            <td>Total Correct</td>
            <td>${stats.correct}</td>
          </tr>
          <tr>
            <td>Total Incorrect</td>
            <td>${stats.incorrect}</td>
          </tr>
          <tr>
            <td>Total Skipped</td>
            <td>${stats.skipped}</td>
          </tr>
          <tr>
            <td>Accuracy</td>
            <td>${stats.accuracy}%</td>
          </tr>
          <tr>
            <td>Completion</td>
            <td>${getCompletion(seriesId)}%</td>
          </tr>
        </table>
      </div>

      <div class="panel">
        <h3>Latest Materials</h3>

        <div class="list">
          ${
            materials.length
              ? materials
                  .slice(0, 4)
                  .map(
                    (m) => `
                      <div class="item">
                        <h4>${m.title}</h4>
                        <div class="muted">${m.type} • ${m.chapter} • ${m.update}</div>
                      </div>
                    `
                  )
                  .join("")
              : `<p class="muted">Materials coming soon.</p>`
          }
        </div>
      </div>
    </div>
  `;
}

function materialsTab(seriesId) {
  const materials = MATERIALS.filter((m) => m.seriesId === seriesId);

  return `
    <div class="panel">
      <h3>Materials Library</h3>

      <table class="table">
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Subject</th>
          <th>Chapter</th>
          <th>Update</th>
          <th>Action</th>
        </tr>

        ${
          materials.length
            ? materials
                .map(
                  (m) => `
                    <tr>
                      <td>${m.title}</td>
                      <td>${m.type}</td>
                      <td>${m.subject}</td>
                      <td>${m.chapter}</td>
                      <td>${m.update}</td>
                      <td><button class="btn secondary">Open</button></td>
                    </tr>
                  `
                )
                .join("")
            : `<tr><td colspan="6">No materials added yet.</td></tr>`
        }
      </table>
    </div>
  `;
}

function practiceTab(seriesId = "free") {
  let questions = QUESTIONS.filter((q) => q.seriesId === seriesId);

  if (questions.length === 0) {
    questions = QUESTIONS.filter((q) => q.seriesId === "free");
  }

  const current =
    questions.find((q) => !state.attempts[q.id]) || questions[0];

  const attempted = state.attempts[current.id];

  return `
    <div class="grid two-column">
      <div class="panel">
        <span class="pill">${current.subject}</span>
        <span class="pill">${current.chapter}</span>
        <span class="pill">${current.difficulty}</span>

        <h3 class="question">${current.question}</h3>

        ${current.options
          .map((option, index) => {
            let optionClass = "";

            if (attempted) {
              if (index === current.correct) optionClass = "correct";
              else if (attempted.selected === index) optionClass = "wrong";
            }

            return `
              <button 
                class="option ${optionClass}" 
                onclick="answerQuestion('${current.id}', ${index})"
              >
                ${String.fromCharCode(65 + index)}. ${option}
              </button>
            `;
          })
          .join("")}

        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
          <button class="btn secondary" onclick="skipQuestion('${current.id}')">Skip</button>
          <button class="btn secondary" onclick="bookmarkQuestion('${current.id}')">Bookmark</button>
          <button class="btn" onclick="render()">Next / Refresh</button>
        </div>

        ${
          attempted
            ? `<div class="solution"><strong>Solution:</strong> ${current.solution}</div>`
            : ""
        }
      </div>

      <div class="panel">
        <h3>Practice Stats</h3>
        ${practiceStats(seriesId)}
        <p class="muted">Attempt questions to update your dashboard instantly.</p>
      </div>
    </div>
  `;
}

function practiceStats(seriesId) {
  const stats = getStats({ seriesId });

  return `
    <div class="grid stats" style="grid-template-columns: repeat(2, 1fr);">
      ${statCard("Solved", stats.solved)}
      ${statCard("Correct", stats.correct)}
      ${statCard("Incorrect", stats.incorrect)}
      ${statCard("Skipped", stats.skipped)}
      ${statCard("Accuracy", stats.accuracy + "%")}
      ${statCard("Completion", getCompletion(seriesId) + "%")}
    </div>
  `;
}

function testsTab(seriesId) {
  return `
    <div class="panel">
      <h3>Tests</h3>

      <div class="list">
        <div class="item">
          <h4>Weekly Mini Test 01</h4>
          <div class="muted">15 questions • Mixed chapters • 45 minutes</div>
          <button class="btn" style="margin-top: 10px;" onclick="setTab('practice')">
            Start Practice
          </button>
        </div>

        <div class="item">
          <h4>Chapter Test System</h4>
          <div class="muted">
            Version 2 will add timer, marks, rank-style analysis and test history.
          </div>
        </div>
      </div>
    </div>
  `;
}

function mistakesPage(embedded = false, seriesId = null) {
  let attempts = getAttemptsArray().filter((a) => a.status === "incorrect");

  if (seriesId) {
    attempts = attempts.filter((a) => a.seriesId === seriesId);
  }

  const content = `
    <div class="panel">
      <h3>Mistake Book</h3>

      <div class="list">
        ${
          attempts.length
            ? attempts
                .map((attempt) => {
                  const question = QUESTIONS.find((q) => q.id === attempt.questionId);

                  return `
                    <div class="item">
                      <h4>${question ? question.question : "Question"}</h4>
                      <div class="muted">${attempt.subject} • ${attempt.chapter}</div>
                      <p><strong>Correct concept:</strong> ${
                        question ? question.solution : ""
                      }</p>
                    </div>
                  `;
                })
                .join("")
            : `<p class="muted">No mistakes yet. Attempt practice questions first.</p>`
        }
      </div>
    </div>
  `;

  return embedded ? content : layout(content);
}

function analyticsPage(embedded = false, seriesId = null) {
  const subjects = ["Physics", "Chemistry", "Maths"];

  const content = `
    <div class="grid two-column">
      <div class="panel">
        <h3>Subject-wise Analytics</h3>

        <table class="table">
          <tr>
            <th>Subject</th>
            <th>Solved</th>
            <th>Correct</th>
            <th>Incorrect</th>
            <th>Accuracy</th>
          </tr>

          ${subjects
            .map((subject) => {
              const stats = getStats({ subject });

              return `
                <tr>
                  <td>${subject}</td>
                  <td>${stats.solved}</td>
                  <td>${stats.correct}</td>
                  <td>${stats.incorrect}</td>
                  <td>${stats.accuracy}%</td>
                </tr>
              `;
            })
            .join("")}
        </table>
      </div>

      <div class="panel">
        <h3>Weak Area Detector</h3>
        ${weakAreaDetector()}
      </div>
    </div>
  `;

  return embedded ? content : layout(content);
}

function weakAreaDetector() {
  const wrongAttempts = getAttemptsArray().filter(
    (a) => a.status === "incorrect"
  );

  const chapterMap = {};

  wrongAttempts.forEach((attempt) => {
    chapterMap[attempt.chapter] = (chapterMap[attempt.chapter] || 0) + 1;
  });

  const weakChapters = Object.entries(chapterMap).sort((a, b) => b[1] - a[1]);

  if (weakChapters.length === 0) {
    return `<p class="muted">No weak areas detected yet.</p>`;
  }

  return `
    <div class="list">
      ${weakChapters
        .map(
          ([chapter, count]) => `
            <div class="item">
              <strong>${chapter}</strong>
              <div class="muted">${count} repeated mistake(s)</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function updatesTab(seriesId) {
  const materials = MATERIALS.filter((m) => m.seriesId === seriesId);

  return `
    <div class="panel">
      <h3>Latest Updates</h3>

      <div class="list">
        ${
          materials.length
            ? materials
                .map(
                  (m) => `
                    <div class="item">
                      <h4>${m.update}: ${m.title}</h4>
                      <div class="muted">${m.type} • ${m.subject} • ${m.chapter}</div>
                    </div>
                  `
                )
                .join("")
            : `<p class="muted">Weekly updates will appear here.</p>`
        }
      </div>
    </div>
  `;
}

function premiumPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>Premium Unlock System</h2>
        <p class="muted">
          Version 1 uses manual UPI demo. Version 2 will add screenshot upload and admin approval.
        </p>
      </div>
    </div>

    <div class="grid cards">
      ${SERIES.filter((s) => !s.free).map(seriesCard).join("")}
    </div>
  `);
}

function paymentPage(seriesId) {
  const series = SERIES.find((s) => s.id === seriesId);

  state.paymentSeries = seriesId;
  state.view = "payment";
  saveState();

  document.getElementById("app").innerHTML = layout(`
    <div class="panel">
      <h2>Unlock ${series.title}</h2>

      <p class="muted">Manual payment flow for free setup.</p>

      <div class="payment-box">
        <h3>Pay ₹${series.price} via UPI</h3>

        <p><strong>UPI ID:</strong> yourupi@bank</p>

        <p>
          After payment, user sends screenshot on Telegram.
          In Version 2, user will upload screenshot directly inside the app.
        </p>

        <button class="btn success" onclick="demoUnlock('${series.id}')">
          Demo: Approve & Unlock
        </button>
      </div>

      <p class="footer-note">
        Replace UPI ID before real launch. If you are under 18, take parent/guardian help for payments.
      </p>
    </div>
  `);
}

function adminPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>Admin Panel V1</h2>
        <p class="muted">
          Static demo admin. Version 2 will connect Supabase for real content upload and payment approval.
        </p>
      </div>
    </div>

    <div class="grid two-column">
      <div class="panel">
        <h3>Content Manager Demo</h3>

        <input class="field" placeholder="Material title" />

        <select class="field">
          <option>PDF</option>
          <option>Practice</option>
          <option>Test</option>
          <option>Mind Map</option>
        </select>

        <input class="field" placeholder="Subject" />
        <input class="field" placeholder="Chapter" />

        <button class="btn">Add Material Demo</button>
      </div>

      <div class="panel">
        <h3>Version 2 Admin Powers</h3>

        <div class="list">
          <div class="item">Add/edit series</div>
          <div class="item">Upload PDFs to Supabase Storage</div>
          <div class="item">Add questions and solutions</div>
          <div class="item">Approve UPI screenshots</div>
          <div class="item">Send announcements</div>
        </div>
      </div>
    </div>
  `);
}

function answerQuestion(questionId, selectedIndex) {
  const question = QUESTIONS.find((q) => q.id === questionId);

  state.attempts[questionId] = {
    questionId,
    selected: selectedIndex,
    status: selectedIndex === question.correct ? "correct" : "incorrect",
    seriesId: question.seriesId,
    subject: question.subject,
    chapter: question.chapter,
    time: Date.now()
  };

  saveState();
  render();
}

function skipQuestion(questionId) {
  const question = QUESTIONS.find((q) => q.id === questionId);

  state.attempts[questionId] = {
    questionId,
    selected: null,
    status: "skipped",
    seriesId: question.seriesId,
    subject: question.subject,
    chapter: question.chapter,
    time: Date.now()
  };

  saveState();
  render();
}

function bookmarkQuestion(questionId) {
  if (!state.bookmarks.includes(questionId)) {
    state.bookmarks.push(questionId);
    saveState();
    alert("Question bookmarked");
  } else {
    alert("Already bookmarked");
  }
}

function demoUnlock(seriesId) {
  if (!state.unlockedSeries.includes(seriesId)) {
    state.unlockedSeries.push(seriesId);
  }

  state.activeSeries = seriesId;
  state.activeTab = "overview";
  state.view = "series-detail";

  saveState();
  render();
}

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

function searchCards(value) {
  const searchValue = value.toLowerCase();
  const cards = document.querySelectorAll(".searchable");

  cards.forEach((card) => {
    const text = card.getAttribute("data-search") || "";

    card.style.display = text.includes(searchValue) ? "block" : "none";
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function render() {
  const app = document.getElementById("app");

  if (state.view === "home") {
    app.innerHTML = homePage();
    return;
  }

  if (state.view === "free") {
    app.innerHTML = freeDashboard();
    return;
  }

  if (state.view === "series") {
    app.innerHTML = allSeriesPage();
    return;
  }

  if (state.view === "series-detail") {
    app.innerHTML = seriesDetailPage();
    return;
  }

  if (state.view === "practice") {
    app.innerHTML = layout(`
      <div class="section-title">
        <h2>Practice Zone</h2>
      </div>

      ${practiceTab("free")}
    `);
    return;
  }

  if (state.view === "mistakes") {
    app.innerHTML = mistakesPage();
    return;
  }

  if (state.view === "analytics") {
    app.innerHTML = analyticsPage();
    return;
  }

  if (state.view === "premium") {
    app.innerHTML = premiumPage();
    return;
  }

  if (state.view === "admin") {
    app.innerHTML = adminPage();
    return;
  }

  app.innerHTML = homePage();
}

render();
