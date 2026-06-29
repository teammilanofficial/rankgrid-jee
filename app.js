const SERIES = [
  {
    id: "free",
    title: "Free JEE 2028 Dashboard",
    subject: "All Subjects",
    type: "Free Material",
    price: 0,
    free: true,
    description: "Free PDFs, practice questions, mini tests, planner and basic progress tracking."
  },
  {
    id: "physics-notes",
    title: "Physics Concise Notes Series",
    subject: "Physics",
    type: "PDF Notes",
    price: 49,
    free: false,
    description: "Physics concise notes PDFs, formulas, mind maps and revision sheets."
  },
  {
    id: "physics-pyq",
    title: "Physics PYQ Practice Series",
    subject: "Physics",
    type: "PYQ PDFs",
    price: 79,
    free: false,
    description: "Physics PYQ-style practice PDFs with solutions and progress tracking."
  },
  {
    id: "chemistry-dpp",
    title: "Chemistry DPP Practice Series",
    subject: "Chemistry",
    type: "DPP PDFs",
    price: 59,
    free: false,
    description: "Chemistry DPP PDFs for Physical, Inorganic and Organic Chemistry."
  },
  {
    id: "maths-test",
    title: "Maths Test Series",
    subject: "Maths",
    type: "Test PDFs",
    price: 99,
    free: false,
    description: "Weekly Maths test PDFs with solutions and performance tracking."
  },
  {
    id: "tracker-pro",
    title: "JEE 2028 Study Tracker Pro",
    subject: "All Subjects",
    type: "Tracker Pack",
    price: 29,
    free: false,
    description: "DPP tracker, mistake book, backlog tracker and test analysis PDFs."
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
    fileUrl: ""
  },
  {
    id: 2,
    seriesId: "free",
    title: "Basic Maths Formula Sheet Sample",
    type: "PDF",
    subject: "Physics",
    chapter: "Basic Maths",
    update: "Available",
    fileUrl: ""
  },
  {
    id: 3,
    seriesId: "free",
    title: "Weekly Mini Test 01",
    type: "PDF Test",
    subject: "All",
    chapter: "Mixed",
    update: "Available",
    fileUrl: ""
  },
  {
    id: 4,
    seriesId: "physics-notes",
    title: "Basic Maths Concise Notes",
    type: "PDF Notes",
    subject: "Physics",
    chapter: "Basic Maths",
    update: "Weekly",
    fileUrl: ""
  },
  {
    id: 5,
    seriesId: "physics-pyq",
    title: "Kinematics PYQ Practice Set 1",
    type: "PDF Practice",
    subject: "Physics",
    chapter: "Kinematics",
    update: "Weekly",
    fileUrl: ""
  },
  {
    id: 6,
    seriesId: "chemistry-dpp",
    title: "Mole Concept DPP Set 1",
    type: "PDF Practice",
    subject: "Chemistry",
    chapter: "Mole Concept",
    update: "Weekly",
    fileUrl: ""
  },
  {
    id: 7,
    seriesId: "maths-test",
    title: "Quadratic Equations Test 1",
    type: "PDF Test",
    subject: "Maths",
    chapter: "Quadratic Equations",
    update: "Sunday",
    fileUrl: ""
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
    question: "The slope of displacement-time graph represents:",
    options: ["Acceleration", "Velocity", "Force", "Work"],
    correct: 1,
    solution: "Slope of x-t graph is dx/dt, which is velocity."
  },
  {
    id: "q3",
    seriesId: "free",
    subject: "Chemistry",
    chapter: "Mole Concept",
    difficulty: "Easy",
    question: "1 mole of any substance contains approximately:",
    options: ["6.022 × 10²³ particles", "9.8 particles", "3 × 10⁸ particles", "1.6 × 10⁻¹⁹ particles"],
    correct: 0,
    solution: "One mole contains Avogadro number of particles, approximately 6.022 × 10²³."
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
  }
];

const STORAGE_KEY = "rankgrid_jee_working_v1";

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  view: "home",
  activeSeries: "free",
  activeTab: "overview",
  unlockedSeries: ["free"],
  attempts: {},
  bookmarks: []
};

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setView(view) {
  state.view = view;
  save();
  render();
}

function setSeries(seriesId) {
  state.activeSeries = seriesId;
  state.activeTab = "overview";
  state.view = "series-detail";
  save();
  render();
}

function setTab(tab) {
  state.activeTab = tab;
  save();
  render();
}

function isUnlocked(seriesId) {
  return state.unlockedSeries.includes(seriesId);
}

function getAttempts(filterSeries = null) {
  let arr = Object.values(state.attempts);

  if (filterSeries) {
    arr = arr.filter((a) => a.seriesId === filterSeries);
  }

  return arr;
}

function getStats(seriesId = null) {
  const arr = getAttempts(seriesId);

  const total = arr.length;
  const solved = arr.filter((a) => a.status !== "skipped").length;
  const correct = arr.filter((a) => a.status === "correct").length;
  const incorrect = arr.filter((a) => a.status === "incorrect").length;
  const skipped = arr.filter((a) => a.status === "skipped").length;
  const accuracy = solved ? Math.round((correct / solved) * 1000) / 10 : 0;

  return { total, solved, correct, incorrect, skipped, accuracy };
}

function getCompletion(seriesId) {
  const qs = QUESTIONS.filter((q) => q.seriesId === seriesId);

  if (qs.length === 0) {
    return seriesId === "free" ? 20 : 0;
  }

  const attempted = qs.filter((q) => state.attempts[q.id]).length;

  return Math.round((attempted / qs.length) * 100);
}

function stat(label, value) {
  return `
    <div class="stat">
      <div class="stat-number">${value}</div>
      <div class="stat-label">${label}</div>
    </div>
  `;
}

function nav(view, label) {
  return `
    <button class="nav-btn ${state.view === view ? "active" : ""}" onclick="setView('${view}')">
      <span class="nav-dot"></span>
      ${label}
    </button>
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
        ${nav("home", "Dashboard")}
        ${nav("free", "Free Dashboard")}
        ${nav("series", "All Series")}
        ${nav("practice", "Practice Zone")}
        ${nav("mistakes", "Mistake Book")}
        ${nav("analytics", "Analytics")}

        <div class="nav-title">Business</div>
        ${nav("premium", "Premium & UPI")}
        ${nav("admin", "Admin Panel")}

        <div class="footer-note">
          V1 works without Supabase. Progress is saved in this browser.
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
            <div class="avatar">J</div>
            <div>
              <strong>JEE Aspirant</strong>
              <div class="muted" style="font-size: 12px;">Free Account</div>
            </div>
          </div>
        </div>

        ${content}
      </main>
    </div>
  `;
}

function homePage() {
  const s = getStats();

  return layout(`
    <section class="hero">
      <div class="hero-card">
        <span class="badge">JEE 2028 Practice Dashboard</span>

        <h2>Professional dashboard for PDFs, practice, tests and accuracy tracking.</h2>

        <p>
          RankGrid JEE gives free and premium subject-wise PDF series with separate dashboards.
          Track solved problems, correct, incorrect, skipped, accuracy, mistakes and updates in one place.
        </p>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:20px;">
          <button class="btn" onclick="setView('free')">Start Free Dashboard</button>
          <button class="btn secondary" onclick="setView('series')">View Series</button>
        </div>
      </div>

      <div class="panel">
        <div class="kpi-ring" style="--percentage: ${s.accuracy * 3.6}deg;">
          <div>
            ${s.accuracy}%<br>
            <span class="muted" style="font-size:12px;">Accuracy</span>
          </div>
        </div>

        <div class="grid stats" style="grid-template-columns: repeat(2, 1fr);">
          ${stat("Solved", s.solved)}
          ${stat("Correct", s.correct)}
          ${stat("Incorrect", s.incorrect)}
          ${stat("Skipped", s.skipped)}
        </div>
      </div>
    </section>

    <div class="grid stats">
      ${stat("Series", SERIES.length)}
      ${stat("PDF Resources", MATERIALS.length)}
      ${stat("Practice Qs", QUESTIONS.length)}
      ${stat("Unlocked", state.unlockedSeries.length)}
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
        <div class="progress-bar" style="width:${completion}%;"></div>
      </div>

      <div class="muted">${completion}% completed</div>

      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;">
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

function freePage() {
  state.activeSeries = "free";
  state.activeTab = "overview";
  save();
  return seriesDetailPage(true);
}

function allSeriesPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>All PDF Series</h2>
        <p class="muted">Each series has its own dashboard, PDF resources, practice, analytics and updates.</p>
      </div>
    </div>

    <div class="grid cards">
      ${SERIES.map(seriesCard).join("")}
    </div>
  `);
}

function seriesDetailPage(forceFree = false) {
  const id = forceFree ? "free" : state.activeSeries;
  const series = SERIES.find((s) => s.id === id) || SERIES[0];
  const s = getStats(id);
  const locked = !isUnlocked(id);
  const tabs = ["overview", "materials", "practice", "tests", "mistakes", "analytics", "updates"];

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
      ${stat("Attempts", s.total)}
      ${stat("Correct", s.correct)}
      ${stat("Incorrect", s.incorrect)}
      ${stat("Accuracy", s.accuracy + "%")}
    </div>

    <div class="tabs">
      ${tabs.map((tab) => `
        <button class="tab ${state.activeTab === tab ? "active" : ""}" onclick="setTab('${tab}')">
          ${capitalize(tab)}
        </button>
      `).join("")}
    </div>

    ${locked ? lockedPanel(series) : tabContent(id, state.activeTab)}
  `);
}

function lockedPanel(series) {
  return `
    <div class="panel">
      <h3>This premium dashboard is locked</h3>
      <p class="muted">Unlock to access paid PDFs, dashboard, updates and tracking.</p>

      <div class="payment-box">
        <strong>Manual UPI Unlock</strong>
        <p>Pay ₹${series.price}, send screenshot, and admin will approve access.</p>
        <button class="btn warning" onclick="paymentPage('${series.id}')">Continue to Payment</button>
      </div>
    </div>
  `;
}

function tabContent(seriesId, tab) {
  if (tab === "overview") return overviewTab(seriesId);
  if (tab === "materials") return materialsTab(seriesId);
  if (tab === "practice") return practiceTab(seriesId);
  if (tab === "tests") return testsTab();
  if (tab === "mistakes") return mistakesPage(true, seriesId);
  if (tab === "analytics") return analyticsPage(true, seriesId);
  if (tab === "updates") return updatesTab(seriesId);
}

function overviewTab(seriesId) {
  const s = getStats(seriesId);
  const mats = MATERIALS.filter((m) => m.seriesId === seriesId);

  return `
    <div class="grid two-column">
      <div class="panel">
        <h3>Series Overview</h3>

        <table class="table">
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total Problems Solved</td><td>${s.solved}</td></tr>
          <tr><td>Total Correct</td><td>${s.correct}</td></tr>
          <tr><td>Total Incorrect</td><td>${s.incorrect}</td></tr>
          <tr><td>Total Skipped</td><td>${s.skipped}</td></tr>
          <tr><td>Accuracy</td><td>${s.accuracy}%</td></tr>
          <tr><td>Completion</td><td>${getCompletion(seriesId)}%</td></tr>
        </table>
      </div>

      <div class="panel">
        <h3>Latest PDF Resources</h3>
        <div class="list">
          ${
            mats.length
              ? mats.slice(0, 4).map((m) => `
                <div class="item">
                  <h4>${m.title}</h4>
                  <div class="muted">${m.type} • ${m.chapter} • ${m.update}</div>
                </div>
              `).join("")
              : `<p class="muted">Resources coming soon.</p>`
          }
        </div>
      </div>
    </div>
  `;
}

function materialsTab(seriesId) {
  const mats = MATERIALS.filter((m) => m.seriesId === seriesId);

  return `
    <div class="panel">
      <h3>PDF Materials Library</h3>

      <table class="table">
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Subject</th>
          <th>Chapter</th>
          <th>Update</th>
          <th>Open</th>
        </tr>

        ${
          mats.length
            ? mats.map((m) => `
              <tr>
                <td>${m.title}</td>
                <td>${m.type}</td>
                <td>${m.subject}</td>
                <td>${m.chapter}</td>
                <td>${m.update}</td>
                <td><button class="btn secondary" onclick="openMaterial(${m.id})">Open</button></td>
              </tr>
            `).join("")
            : `<tr><td colspan="6">No PDF resources added yet.</td></tr>`
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

  const current = questions.find((q) => !state.attempts[q.id]) || questions[0];
  const attempted = state.attempts[current.id];

  return `
    <div class="grid two-column">
      <div class="panel">
        <span class="pill">${current.subject}</span>
        <span class="pill">${current.chapter}</span>
        <span class="pill">${current.difficulty}</span>

        <h3 class="question">${current.question}</h3>

        ${current.options.map((option, index) => {
          let cls = "";

          if (attempted) {
            if (index === current.correct) cls = "correct";
            else if (attempted.selected === index) cls = "wrong";
          }

          return `
            <button class="option ${cls}" onclick="answerQuestion('${current.id}', ${index})">
              ${String.fromCharCode(65 + index)}. ${option}
            </button>
          `;
        }).join("")}

        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
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
      </div>
    </div>
  `;
}

function practiceStats(seriesId) {
  const s = getStats(seriesId);

  return `
    <div class="grid stats" style="grid-template-columns: repeat(2, 1fr);">
      ${stat("Solved", s.solved)}
      ${stat("Correct", s.correct)}
      ${stat("Incorrect", s.incorrect)}
      ${stat("Skipped", s.skipped)}
      ${stat("Accuracy", s.accuracy + "%")}
      ${stat("Completion", getCompletion(seriesId) + "%")}
    </div>
  `;
}

function testsTab() {
  return `
    <div class="panel">
      <h3>Tests</h3>

      <div class="list">
        <div class="item">
          <h4>Weekly Mini Test 01</h4>
          <div class="muted">PDF test • 15 questions • Mixed chapters</div>
          <button class="btn" style="margin-top:10px;" onclick="setTab('practice')">Start Practice</button>
        </div>

        <div class="item">
          <h4>More PDF tests coming soon</h4>
          <div class="muted">You can upload chapter-wise and subject-wise test PDFs here.</div>
        </div>
      </div>
    </div>
  `;
}

function mistakesPage(embedded = false, seriesId = null) {
  let wrong = Object.values(state.attempts).filter((a) => a.status === "incorrect");

  if (seriesId) {
    wrong = wrong.filter((a) => a.seriesId === seriesId);
  }

  const content = `
    <div class="panel">
      <h3>Mistake Book</h3>

      <div class="list">
        ${
          wrong.length
            ? wrong.map((a) => {
              const q = QUESTIONS.find((x) => x.id === a.questionId);

              return `
                <div class="item">
                  <h4>${q ? q.question : "Question"}</h4>
                  <div class="muted">${a.subject} • ${a.chapter}</div>
                  <p><strong>Correct concept:</strong> ${q ? q.solution : ""}</p>
                </div>
              `;
            }).join("")
            : `<p class="muted">No mistakes yet. Attempt practice questions first.</p>`
        }
      </div>
    </div>
  `;

  return embedded ? content : layout(content);
}

function analyticsPage(embedded = false) {
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

          ${subjects.map((subject) => {
            const arr = Object.values(state.attempts).filter((a) => a.subject === subject);
            const solved = arr.filter((a) => a.status !== "skipped").length;
            const correct = arr.filter((a) => a.status === "correct").length;
            const incorrect = arr.filter((a) => a.status === "incorrect").length;
            const accuracy = solved ? Math.round((correct / solved) * 1000) / 10 : 0;

            return `
              <tr>
                <td>${subject}</td>
                <td>${solved}</td>
                <td>${correct}</td>
                <td>${incorrect}</td>
                <td>${accuracy}%</td>
              </tr>
            `;
          }).join("")}
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
  const wrong = Object.values(state.attempts).filter((a) => a.status === "incorrect");
  const map = {};

  wrong.forEach((a) => {
    map[a.chapter] = (map[a.chapter] || 0) + 1;
  });

  const weak = Object.entries(map).sort((a, b) => b[1] - a[1]);

  if (!weak.length) {
    return `<p class="muted">No weak areas detected yet.</p>`;
  }

  return `
    <div class="list">
      ${weak.map(([chapter, count]) => `
        <div class="item">
          <strong>${chapter}</strong>
          <div class="muted">${count} repeated mistake(s)</div>
        </div>
      `).join("")}
    </div>
  `;
}

function updatesTab(seriesId) {
  const mats = MATERIALS.filter((m) => m.seriesId === seriesId);

  return `
    <div class="panel">
      <h3>Latest Updates</h3>

      <div class="list">
        ${
          mats.length
            ? mats.map((m) => `
              <div class="item">
                <h4>${m.update}: ${m.title}</h4>
                <div class="muted">${m.type} • ${m.subject} • ${m.chapter}</div>
              </div>
            `).join("")
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
        <h2>Premium PDF Series</h2>
        <p class="muted">Manual UPI unlock system for paid PDF resources.</p>
      </div>
    </div>

    <div class="grid cards">
      ${SERIES.filter((s) => !s.free).map(seriesCard).join("")}
    </div>
  `);
}

function paymentPage(seriesId) {
  const series = SERIES.find((s) => s.id === seriesId);

  state.view = "payment";
  save();

  document.getElementById("app").innerHTML = layout(`
    <div class="panel">
      <h2>Unlock ${series.title}</h2>

      <p class="muted">Manual payment flow for free setup.</p>

      <div class="payment-box">
        <h3>Pay ₹${series.price} via UPI</h3>

        <p><strong>UPI ID:</strong> yourupi@bank</p>

        <p>After payment, user sends screenshot on Telegram. You approve access manually.</p>

        <button class="btn success" onclick="demoUnlock('${series.id}')">
          Demo: Approve & Unlock
        </button>
      </div>
    </div>
  `);
}

function adminPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>Admin Panel V1</h2>
        <p class="muted">Demo admin area. Real upload and approval will come later with Supabase.</p>
      </div>
    </div>

    <div class="grid two-column">
      <div class="panel">
        <h3>PDF Resource Manager Demo</h3>

        <input class="field" placeholder="PDF title">
        <select class="field">
          <option>Concise Notes PDF</option>
          <option>DPP PDF</option>
          <option>PYQ PDF</option>
          <option>Test PDF</option>
          <option>Mind Map PDF</option>
        </select>
        <input class="field" placeholder="Subject">
        <input class="field" placeholder="Chapter">
        <input class="field" placeholder="PDF link">

        <button class="btn">Add PDF Demo</button>
      </div>

      <div class="panel">
        <h3>Upcoming Admin Powers</h3>

        <div class="list">
          <div class="item">Add new PDF resources</div>
          <div class="item">Approve UPI screenshots</div>
          <div class="item">Unlock paid series</div>
          <div class="item">Add questions and solutions</div>
          <div class="item">Send announcements</div>
        </div>
      </div>
    </div>
  `);
}

function answerQuestion(questionId, selectedIndex) {
  const q = QUESTIONS.find((x) => x.id === questionId);

  state.attempts[questionId] = {
    questionId,
    selected: selectedIndex,
    status: selectedIndex === q.correct ? "correct" : "incorrect",
    seriesId: q.seriesId,
    subject: q.subject,
    chapter: q.chapter,
    time: Date.now()
  };

  save();
  render();
}

function skipQuestion(questionId) {
  const q = QUESTIONS.find((x) => x.id === questionId);

  state.attempts[questionId] = {
    questionId,
    selected: null,
    status: "skipped",
    seriesId: q.seriesId,
    subject: q.subject,
    chapter: q.chapter,
    time: Date.now()
  };

  save();
  render();
}

function bookmarkQuestion(questionId) {
  if (!state.bookmarks.includes(questionId)) {
    state.bookmarks.push(questionId);
    save();
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

  save();
  render();
}

function openMaterial(materialId) {
  const material = MATERIALS.find((m) => m.id === materialId);

  if (!material.fileUrl) {
    alert("PDF link not added yet. Later you will paste your Google Drive or Supabase PDF link here.");
    return;
  }

  window.open(material.fileUrl, "_blank");
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
    app.innerHTML = freePage();
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
