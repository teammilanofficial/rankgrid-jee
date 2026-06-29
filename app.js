if (
  typeof APP_CONFIG === "undefined" ||
  typeof SERIES === "undefined" ||
  typeof MATERIALS === "undefined" ||
  typeof QUESTIONS === "undefined"
) {
  alert("data.js is not loaded. Make sure index.html loads data.js before app.js");
}

const STORAGE_KEY = "rankgrid_jee_final_v1";

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  view: "home",
  activeSeries: "free",
  activeTab: "overview",
  unlockedSeries: ["free"],
  attempts: {},
  completedMaterials: {},
  bookmarkedQuestions: [],
  bookmarkedMaterials: [],
  paymentSeries: null
};
let currentUser = null;
let currentProfile = null;
let currentIsAdmin = false;
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

function getSeries(seriesId) {
  return SERIES.find((series) => series.id === seriesId) || SERIES[0];
}

function getSeriesMaterials(seriesId) {
  return MATERIALS.filter((material) => material.seriesId === seriesId);
}

function getSeriesQuestions(seriesId) {
  return QUESTIONS.filter((question) => question.seriesId === seriesId);
}

function getAttemptsArray() {
  return Object.values(state.attempts);
}

function getQuestionStats(seriesId = null) {
  let attempts = getAttemptsArray();

  if (seriesId) {
    attempts = attempts.filter((attempt) => attempt.seriesId === seriesId);
  }

  const total = attempts.length;
  const solved = attempts.filter((attempt) => attempt.status !== "skipped").length;
  const correct = attempts.filter((attempt) => attempt.status === "correct").length;
  const incorrect = attempts.filter((attempt) => attempt.status === "incorrect").length;
  const skipped = attempts.filter((attempt) => attempt.status === "skipped").length;
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

function getMaterialStats(seriesId = null) {
  let materials = MATERIALS;

  if (seriesId) {
    materials = materials.filter((material) => material.seriesId === seriesId);
  }

  const total = materials.length;
  const completed = materials.filter((material) => state.completedMaterials[material.id]).length;
  const pending = total - completed;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completion
  };
}

function getOverallCompletion(seriesId) {
  const materialStats = getMaterialStats(seriesId);
  const questions = getSeriesQuestions(seriesId);

  if (questions.length === 0) {
    return materialStats.completion;
  }

  const attemptedQuestions = questions.filter((q) => state.attempts[q.id]).length;
  const questionCompletion = Math.round((attemptedQuestions / questions.length) * 100);

  return Math.round((materialStats.completion + questionCompletion) / 2);
}

function statCard(label, value) {
  return `
    <div class="stat">
      <div class="stat-number">${value}</div>
      <div class="stat-label">${label}</div>
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

function layout(content) {
  return `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="logo">
          <div class="logo-mark">RG</div>
          <div>
            <h1>${APP_CONFIG.appName}</h1>
            <p>${APP_CONFIG.tagline}</p>
          </div>
        </div>

        <div class="nav-title">Main</div>
        ${currentUser ? navButton("profile", "My Profile") :
          navButton("auth", "Login / Signup")}
        ${navButton("home", "Dashboard")}
        ${navButton("free", "Free Dashboard")}
        ${navButton("series", "All Series")}
        ${navButton("practice", "Practice Zone")}
        ${navButton("mistakes", "Mistake Book")}
        ${navButton("analytics", "Analytics")}

        <div class="nav-title">PDF Resources</div>
        ${navButton("bookmarks", "Bookmarks")}
        ${navButton("updates", "Updates")}

        <div class="nav-title">Business</div>
${navButton("premium", "Premium & UPI")}

        <div class="footer-note">
          V1 works without backend. Progress is saved in this browser.
          Paid unlock is manual demo. V2 will add login, database and protected PDFs.
        </div>
      </aside>

      <main class="main">
        <div class="topbar">
          <button class="btn secondary mobile-menu" onclick="toggleMenu()">Menu</button>

          <input 
            class="search" 
            placeholder="Search series, PDF, DPP, PYQ, tests..." 
            oninput="searchCards(this.value)"
          />

          <div class="profile" onclick="${currentUser ? "setView('profile')" : "setView('auth')"}" style="cursor:pointer;">
  <div class="avatar">${currentUser ? currentUser.email.charAt(0).toUpperCase() : "J"}</div>
  <div>
    <strong>${currentUser ? currentUser.email : "Login"}</strong>
    <div class="muted" style="font-size: 12px;">
      ${currentUser ? "User ID ready" : "Create free account"}
    </div>
  </div>
</div>
          </div>
        </div>

        ${content}
      </main>
    </div>
  `;
}

function homePage() {
  const qStats = getQuestionStats();
  const mStats = getMaterialStats();

  return layout(`
    <section class="hero">
      <div class="hero-card">
        <span class="badge">${APP_CONFIG.exam} Practice Dashboard</span>

        <h2>Professional dashboard for PDFs, practice, tests and progress tracking.</h2>

        <p>
          ${APP_CONFIG.appName} gives free and premium subject-wise PDF series with separate dashboards.
          Track PDF completion, solved questions, correct, incorrect, skipped, accuracy, mistakes and weekly updates.
        </p>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:20px;">
          <button class="btn" onclick="setView('free')">Start Free Dashboard</button>
          <button class="btn secondary" onclick="setView('series')">View All Series</button>
        </div>
      </div>

      <div class="panel">
        <div class="kpi-ring" style="--percentage: ${qStats.accuracy * 3.6}deg;">
          <div>
            ${qStats.accuracy}%<br>
            <span class="muted" style="font-size:12px;">Accuracy</span>
          </div>
        </div>

        <div class="grid stats" style="grid-template-columns: repeat(2, 1fr);">
          ${statCard("Solved", qStats.solved)}
          ${statCard("Correct", qStats.correct)}
          ${statCard("PDF Done", mStats.completed)}
          ${statCard("Unlocked", state.unlockedSeries.length)}
        </div>
      </div>
    </section>

    <div class="grid stats">
      ${statCard("Total Series", SERIES.length)}
      ${statCard("PDF Resources", MATERIALS.length)}
      ${statCard("Practice Qs", QUESTIONS.length)}
      ${statCard("PDF Progress", mStats.completion + "%")}
    </div>

    <div class="section-title">
      <div>
        <h2>Featured Series</h2>
        <p class="muted">Free and premium dashboards for JEE 2028 preparation.</p>
      </div>
      <button class="btn secondary" onclick="setView('series')">See All</button>
    </div>

    <div class="grid cards">
      ${SERIES.slice(0, 6).map(seriesCard).join("")}
    </div>
  `);
}

function seriesCard(series) {
  const completion = getOverallCompletion(series.id);

  return `
    <div 
      class="series-card searchable" 
      data-search="${series.title.toLowerCase()} ${series.subject.toLowerCase()} ${series.type.toLowerCase()}"
    >
      <span class="pill ${series.free ? "free" : "locked"}">
        ${series.free ? "Free" : "₹" + series.price}
      </span>

      <span class="pill">${series.subject}</span>
      <span class="pill">${series.type}</span>

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

function freeDashboardPage() {
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
        <p class="muted">
          Each series has its own dashboard, PDF library, progress, practice, analytics and update section.
        </p>
      </div>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="filterSeries('all')">All</button>
      <button class="tab" onclick="filterSeries('physics')">Physics</button>
      <button class="tab" onclick="filterSeries('chemistry')">Chemistry</button>
      <button class="tab" onclick="filterSeries('maths')">Maths</button>
      <button class="tab" onclick="filterSeries('free')">Free</button>
    </div>

    <div class="grid cards" id="seriesGrid">
      ${SERIES.map(seriesCard).join("")}
    </div>
  `);
}

function filterSeries(filter) {
  const grid = document.getElementById("seriesGrid");

  if (!grid) return;

  let filtered = SERIES;

  if (filter === "physics") {
    filtered = SERIES.filter((s) => s.subject.toLowerCase().includes("physics"));
  }

  if (filter === "chemistry") {
    filtered = SERIES.filter((s) => s.subject.toLowerCase().includes("chemistry"));
  }

  if (filter === "maths") {
    filtered = SERIES.filter((s) => s.subject.toLowerCase().includes("maths"));
  }

  if (filter === "free") {
    filtered = SERIES.filter((s) => s.free);
  }

  if (filter === "all") {
    filtered = SERIES;
  }

  grid.innerHTML = filtered.map(seriesCard).join("");
}

function seriesDetailPage(forceFree = false) {
  const seriesId = forceFree ? "free" : state.activeSeries;
  const series = getSeries(seriesId);
  const locked = !isUnlocked(seriesId);
  const qStats = getQuestionStats(seriesId);
  const mStats = getMaterialStats(seriesId);

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
      ${statCard("PDFs", mStats.total)}
      ${statCard("PDF Done", mStats.completed)}
      ${statCard("Solved", qStats.solved)}
      ${statCard("Accuracy", qStats.accuracy + "%")}
    </div>

    <div class="tabs">
      ${tabs
        .map(
          (tab) => `
          <button class="tab ${state.activeTab === tab ? "active" : ""}" onclick="setTab('${tab}')">
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
  const materials = getSeriesMaterials(series.id);

  return `
    <div class="grid two-column">
      <div class="panel">
        <h3>This premium dashboard is locked</h3>
        <p class="muted">
          Unlock this series to access PDF resources, completion tracking, updates and practice dashboard.
        </p>

        <div class="payment-box">
          <strong>Manual UPI Unlock</strong>
          <p>
            Pay ₹${series.price} using UPI, send screenshot to ${APP_CONFIG.telegramUsername},
            then access will be approved manually.
          </p>
          <button class="btn warning" onclick="paymentPage('${series.id}')">Continue to Payment</button>
        </div>
      </div>

      <div class="panel">
        <h3>Included PDFs Preview</h3>

        <div class="list">
          ${
            materials.length
              ? materials
                  .slice(0, 5)
                  .map(
                    (m) => `
                    <div class="item">
                      <h4>${m.title}</h4>
                      <div class="muted">${m.type} • ${m.chapter}</div>
                    </div>
                  `
                  )
                  .join("")
              : `<p class="muted">PDFs will be added soon.</p>`
          }
        </div>
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

  return overviewTab(seriesId);
}

function overviewTab(seriesId) {
  const qStats = getQuestionStats(seriesId);
  const mStats = getMaterialStats(seriesId);
  const materials = getSeriesMaterials(seriesId);

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
            <td>Total PDFs</td>
            <td>${mStats.total}</td>
          </tr>
          <tr>
            <td>PDFs Completed</td>
            <td>${mStats.completed}</td>
          </tr>
          <tr>
            <td>PDF Completion</td>
            <td>${mStats.completion}%</td>
          </tr>
          <tr>
            <td>Total Problems Solved</td>
            <td>${qStats.solved}</td>
          </tr>
          <tr>
            <td>Correct</td>
            <td>${qStats.correct}</td>
          </tr>
          <tr>
            <td>Incorrect</td>
            <td>${qStats.incorrect}</td>
          </tr>
          <tr>
            <td>Skipped</td>
            <td>${qStats.skipped}</td>
          </tr>
          <tr>
            <td>Accuracy</td>
            <td>${qStats.accuracy}%</td>
          </tr>
        </table>
      </div>

      <div class="panel">
        <h3>Latest PDF Resources</h3>

        <div class="list">
          ${
            materials.length
              ? materials
                  .slice(0, 6)
                  .map(
                    (m) => `
                    <div class="item">
                      <h4>${m.title}</h4>
                      <div class="muted">${m.type} • ${m.chapter} • ${m.update}</div>
                      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn secondary" onclick="openMaterial(${m.id})">Open</button>
                        <button class="btn secondary" onclick="toggleMaterialComplete(${m.id})">
                          ${state.completedMaterials[m.id] ? "Completed" : "Mark Done"}
                        </button>
                      </div>
                    </div>
                  `
                  )
                  .join("")
              : `<p class="muted">PDF resources coming soon.</p>`
          }
        </div>
      </div>
    </div>
  `;
}

function materialsTab(seriesId) {
  const materials = getSeriesMaterials(seriesId);

  return `
    <div class="panel">
      <div class="section-title">
        <div>
          <h3>PDF Materials Library</h3>
          <p class="muted">Open PDFs, mark completed, and track progress.</p>
        </div>
      </div>

      <table class="table">
        <tr>
          <th>Status</th>
          <th>Title</th>
          <th>Type</th>
          <th>Subject</th>
          <th>Chapter</th>
          <th>Update</th>
          <th>Actions</th>
        </tr>

        ${
          materials.length
            ? materials
                .map(
                  (m) => `
                <tr>
                  <td>${state.completedMaterials[m.id] ? "Done" : "Pending"}</td>
                  <td>
                    <strong>${m.title}</strong>
                    <div class="muted">${m.description || ""}</div>
                  </td>
                  <td>${m.type}</td>
                  <td>${m.subject}</td>
                  <td>${m.chapter}</td>
                  <td>${m.update}</td>
                  <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                      <button class="btn secondary" onclick="openMaterial(${m.id})">Open</button>
                      <button class="btn secondary" onclick="toggleMaterialComplete(${m.id})">
                        ${state.completedMaterials[m.id] ? "Undo" : "Done"}
                      </button>
                      <button class="btn secondary" onclick="bookmarkMaterial(${m.id})">Save</button>
                    </div>
                  </td>
                </tr>
              `
                )
                .join("")
            : `<tr><td colspan="7">No PDF resources added yet.</td></tr>`
        }
      </table>
    </div>
  `;
}

function practiceTab(seriesId = "free") {
  let questions = getSeriesQuestions(seriesId);

  if (questions.length === 0) {
    questions = getSeriesQuestions("free");
  }

  const current = questions.find((q) => !state.attempts[q.id]) || questions[0];

  if (!current) {
    return `
      <div class="panel">
        <h3>No questions added yet</h3>
        <p class="muted">Practice questions for this series will be added soon.</p>
      </div>
    `;
  }

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
  const stats = getQuestionStats(seriesId);

  return `
    <div class="grid stats" style="grid-template-columns: repeat(2, 1fr);">
      ${statCard("Solved", stats.solved)}
      ${statCard("Correct", stats.correct)}
      ${statCard("Incorrect", stats.incorrect)}
      ${statCard("Skipped", stats.skipped)}
      ${statCard("Accuracy", stats.accuracy + "%")}
      ${statCard("Attempts", stats.total)}
    </div>
  `;
}

function testsTab(seriesId) {
  const testMaterials = getSeriesMaterials(seriesId).filter((m) =>
    m.type.toLowerCase().includes("test")
  );

  return `
    <div class="panel">
      <h3>Test PDFs</h3>

      <div class="list">
        ${
          testMaterials.length
            ? testMaterials
                .map(
                  (m) => `
                <div class="item">
                  <h4>${m.title}</h4>
                  <div class="muted">${m.subject} • ${m.chapter} • ${m.update}</div>
                  <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn" onclick="openMaterial(${m.id})">Open Test PDF</button>
                    <button class="btn secondary" onclick="toggleMaterialComplete(${m.id})">
                      ${state.completedMaterials[m.id] ? "Completed" : "Mark Completed"}
                    </button>
                  </div>
                </div>
              `
                )
                .join("")
            : `
              <div class="item">
                <h4>No test PDF added yet</h4>
                <div class="muted">Upload test PDFs in data.js by adding material type as Test PDF.</div>
              </div>
            `
        }
      </div>
    </div>
  `;
}

function mistakesPage(embedded = false, seriesId = null) {
  let wrongAttempts = getAttemptsArray().filter((attempt) => attempt.status === "incorrect");

  if (seriesId) {
    wrongAttempts = wrongAttempts.filter((attempt) => attempt.seriesId === seriesId);
  }

  const content = `
    <div class="panel">
      <h3> Mistake Book</h3>

      <div class="list">
        ${
          wrongAttempts.length
            ? wrongAttempts
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
            <th>Skipped</th>
            <th>Accuracy</th>
          </tr>

          ${subjects
            .map((subject) => {
              let attempts = getAttemptsArray().filter((a) => a.subject === subject);

              if (seriesId) {
                attempts = attempts.filter((a) => a.seriesId === seriesId);
              }

              const solved = attempts.filter((a) => a.status !== "skipped").length;
              const correct = attempts.filter((a) => a.status === "correct").length;
              const incorrect = attempts.filter((a) => a.status === "incorrect").length;
              const skipped = attempts.filter((a) => a.status === "skipped").length;
              const accuracy = solved ? Math.round((correct / solved) * 1000) / 10 : 0;

              return `
                <tr>
                  <td>${subject}</td>
                  <td>${solved}</td>
                  <td>${correct}</td>
                  <td>${incorrect}</td>
                  <td>${skipped}</td>
                  <td>${accuracy}%</td>
                </tr>
              `;
            })
            .join("")}
        </table>
      </div>

      <div class="panel">
        <h3>Weak Area Detector</h3>
        ${weakAreaDetector(seriesId)}
      </div>
    </div>
  `;

  return embedded ? content : layout(content);
}

function weakAreaDetector(seriesId = null) {
  let wrongAttempts = getAttemptsArray().filter((attempt) => attempt.status === "incorrect");

  if (seriesId) {
    wrongAttempts = wrongAttempts.filter((attempt) => attempt.seriesId === seriesId);
  }

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
  const materials = getSeriesMaterials(seriesId);

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
                  <p>${m.description || ""}</p>
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

function globalUpdatesPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>All Updates</h2>
        <p class="muted">Latest PDF resources and announcements.</p>
      </div>
    </div>

    <div class="grid two-column">
      <div class="panel">
        <h3>Announcements</h3>
        <div class="list">
          ${
            typeof ANNOUNCEMENTS !== "undefined" && ANNOUNCEMENTS.length
              ? ANNOUNCEMENTS.map(
                  (a) => `
                  <div class="item">
                    <h4>${a.title}</h4>
                    <div class="muted">${a.date}</div>
                    <p>${a.message}</p>
                  </div>
                `
                ).join("")
              : `<p class="muted">No announcements yet.</p>`
          }
        </div>
      </div>

      <div class="panel">
        <h3>Recent PDFs</h3>
        <div class="list">
          ${MATERIALS.slice(0, 10)
            .map(
              (m) => `
              <div class="item">
                <h4>${m.title}</h4>
                <div class="muted">${m.subject} • ${m.type} • ${m.update}</div>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
    </div>
  `);
}

function premiumPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>Premium PDF Series</h2>
        <p class="muted">
          Unlock paid series manually through UPI. Access is saved in this browser for V1.
        </p>
      </div>
    </div>

    <div class="grid cards">
      ${SERIES.filter((series) => !series.free).map(seriesCard).join("")}
    </div>
  `);
}

function paymentPage(seriesId) {
  const series = getSeries(seriesId);

  state.paymentSeries = seriesId;
  state.view = "payment";
  save();

  const telegramLink = "https://t.me/" + APP_CONFIG.telegramUsername.replace("@", "");

  document.getElementById("app").innerHTML = layout(`
    <div class="panel">
      <h2>Unlock ${series.title}</h2>

      <p class="muted">
        Complete the payment and send screenshot on Telegram. Access will be given manually.
      </p>

      <div class="payment-box">
        <h3>Pay ₹${series.price} via UPI</h3>

        <p><strong>UPI ID:</strong> ${APP_CONFIG.upiId}</p>

        <p>
          After payment, send your screenshot and series name to:
          <strong>${APP_CONFIG.telegramUsername}</strong>
        </p>

        <a href="${telegramLink}" target="_blank">
          <button class="btn success">
            Send Screenshot on Telegram
          </button>
        </a>
      </div>

      <p class="footer-note">
        Your access/resources will be sent manually after verification.
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
          This is a demo admin panel. In V1, add PDFs by editing data.js from GitHub.
        </p>
      </div>
    </div>

    <div class="grid two-column">
      <div class="panel">
        <h3>How to Add a PDF</h3>

        <p class="muted">Open data.js and add a new object inside MATERIALS.</p>

        <div class="item">
          <pre style="white-space:pre-wrap; color:#cfe0f2;">
{
  id: 999,
  seriesId: "physics-dpp",
  title: "Kinematics DPP Set 2",
  type: "DPP PDF",
  subject: "Physics",
  chapter: "Kinematics",
  update: "New",
  fileUrl: "YOUR_PDF_LINK",
  description: "Practice PDF for Kinematics."
}
          </pre>
        </div>
      </div>

      <div class="panel">
        <h3>Current App Data</h3>

        <div class="grid stats" style="grid-template-columns: repeat(2, 1fr);">
          ${statCard("Series", SERIES.length)}
          ${statCard("PDFs", MATERIALS.length)}
          ${statCard("Questions", QUESTIONS.length)}
          ${statCard("Unlocked", state.unlockedSeries.length)}
        </div>

        <div class="list">
          <div class="item">Add new series in SERIES array</div>
          <div class="item">Add PDFs in MATERIALS array</div>
          <div class="item">Add quiz questions in QUESTIONS array</div>
          <div class="item">Change UPI and Telegram in APP_CONFIG</div>
        </div>
      </div>
    </div>
  `);
}

function bookmarksPage() {
  const savedQuestions = state.bookmarkedQuestions
    .map((id) => QUESTIONS.find((q) => q.id === id))
    .filter(Boolean);

  const savedMaterials = state.bookmarkedMaterials
    .map((id) => MATERIALS.find((m) => m.id === id))
    .filter(Boolean);

  return layout(`
    <div class="section-title">
      <div>
        <h2>Bookmarks</h2>
        <p class="muted">Saved questions and PDF resources.</p>
      </div>
    </div>

    <div class="grid two-column">
      <div class="panel">
        <h3>Saved PDF Resources</h3>

        <div class="list">
          ${
            savedMaterials.length
              ? savedMaterials
                  .map(
                    (m) => `
                    <div class="item">
                      <h4>${m.title}</h4>
                      <div class="muted">${m.subject} • ${m.chapter}</div>
                      <button class="btn secondary" style="margin-top:10px;" onclick="openMaterial(${m.id})">Open</button>
                    </div>
                  `
                  )
                  .join("")
              : `<p class="muted">No PDF bookmarks yet.</p>`
          }
        </div>
      </div>

      <div class="panel">
        <h3>Saved Questions</h3>

        <div class="list">
          ${
            savedQuestions.length
              ? savedQuestions
                  .map(
                    (q) => `
                    <div class="item">
                      <h4>${q.question}</h4>
                      <div class="muted">${q.subject} • ${q.chapter}</div>
                      <p>${q.solution}</p>
                    </div>
                  `
                  )
                  .join("")
              : `<p class="muted">No question bookmarks yet.</p>`
          }
        </div>
      </div>
    </div>
  `);
}

function answerQuestion(questionId, selectedIndex) {
  const question = QUESTIONS.find((q) => q.id === questionId);

  if (!question) return;

  state.attempts[questionId] = {
    questionId,
    selected: selectedIndex,
    status: selectedIndex === question.correct ? "correct" : "incorrect",
    seriesId: question.seriesId,
    subject: question.subject,
    chapter: question.chapter,
    time: Date.now()
  };

  save();
  render();
}

function skipQuestion(questionId) {
  const question = QUESTIONS.find((q) => q.id === questionId);

  if (!question) return;

  state.attempts[questionId] = {
    questionId,
    selected: null,
    status: "skipped",
    seriesId: question.seriesId,
    subject: question.subject,
    chapter: question.chapter,
    time: Date.now()
  };

  save();
  render();
}

function bookmarkQuestion(questionId) {
  if (!state.bookmarkedQuestions.includes(questionId)) {
    state.bookmarkedQuestions.push(questionId);
    save();
    alert("Question bookmarked");
  } else {
    alert("Question already bookmarked");
  }
}

function bookmarkMaterial(materialId) {
  if (!state.bookmarkedMaterials.includes(materialId)) {
    state.bookmarkedMaterials.push(materialId);
    save();
    alert("PDF resource bookmarked");
  } else {
    alert("PDF already bookmarked");
  }
}

function toggleMaterialComplete(materialId) {
  if (state.completedMaterials[materialId]) {
    delete state.completedMaterials[materialId];
  } else {
    state.completedMaterials[materialId] = true;
  }

  save();
  render();
}

function openMaterial(materialId) {
  const material = MATERIALS.find((m) => m.id === materialId);

  if (!material) return;

  if (!material.fileUrl) {
    alert("PDF link not added yet. Add fileUrl in data.js for this material.");
    return;
  }

  window.open(material.fileUrl, "_blank");
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
function authPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>Login / Signup</h2>
        <p class="muted">
          Create a free account to get your unique User ID and request access to paid series.
        </p>
      </div>
    </div>

    <div class="grid two-column">
      <div class="panel">
        <h3>Create Account</h3>

        <input class="field" id="signupEmail" type="email" placeholder="Email address">
        <input class="field" id="signupPassword" type="password" placeholder="Password">
        <input class="field" id="signupName" type="text" placeholder="Your name">
        <input class="field" id="signupTelegram" type="text" placeholder="Telegram username, example: @yourname">

        <button class="btn" onclick="signupUser()">Create Free Account</button>

        <p class="muted" style="margin-top:12px;">
          After signup, your unique User ID will be generated automatically.
        </p>
      </div>

      <div class="panel">
        <h3>Login</h3>

        <input class="field" id="loginEmail" type="email" placeholder="Email address">
        <input class="field" id="loginPassword" type="password" placeholder="Password">

        <button class="btn success" onclick="loginUser()">Login</button>

        <p class="muted" style="margin-top:12px;">
          Login to check your access requests and unlocked resources.
        </p>
      </div>
    </div>
  `);
}

function profilePage() {
  if (!currentUser) {
    return authPage();
  }

  return layout(`
    <div class="section-title">
      <div>
        <h2>My Profile</h2>
        <p class="muted">Your account details and unique User ID.</p>
      </div>
      <button class="btn danger" onclick="logoutUser()">Logout</button>
    </div>

    <div class="grid two-column">
      <div class="panel">
        <h3>Account Details</h3>

        <table class="table">
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Email</td>
            <td>${currentUser.email}</td>
          </tr>
          <tr>
            <td>User ID</td>
            <td style="word-break:break-all;">${currentUser.id}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>${currentProfile?.full_name || "Not added"}</td>
          </tr>
          <tr>
            <td>Telegram</td>
            <td>${currentProfile?.telegram_username || "Not added"}</td>
          </tr>
        </table>

        <button class="btn secondary" style="margin-top:12px;" onclick="copyUserId()">
          Copy User ID
        </button>
      </div>

      <div class="panel">
        <h3>How Paid Access Works</h3>

        <div class="list">
          <div class="item">
            1. Open any paid series.
          </div>
          <div class="item">
            2. Click Request Access.
          </div>
          <div class="item">
            3. Send your User ID on Telegram.
          </div>
          <div class="item">
            4. Admin approves your access after payment verification.
          </div>
        </div>
      </div>
    </div>
  `);
}

async function signupUser() {
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const fullName = document.getElementById("signupName").value.trim();
  const telegram = document.getElementById("signupTelegram").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  currentUser = data.user;

  if (currentUser) {
    await supabase.from("profiles").insert({
      id: currentUser.id,
      email: currentUser.email,
      full_name: fullName,
      telegram_username: telegram
    });
  }

  await loadCurrentUser();

  alert("Account created. Your unique User ID is ready.");
  setView("profile");
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  await loadCurrentUser();

  alert("Logged in successfully");
  setView("profile");
}

async function logoutUser() {
  await supabase.auth.signOut();

  currentUser = null;
  currentProfile = null;
  currentIsAdmin = false;

  state.view = "home";
  save();
  render();
}

async function loadCurrentUser() {
  const { data } = await supabase.auth.getUser();

  currentUser = data.user || null;
  currentProfile = null;
  currentIsAdmin = false;

  if (!currentUser) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  currentProfile = profile || null;

  const { data: adminData } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  currentIsAdmin = !!adminData;
}

function copyUserId() {
  if (!currentUser) return;

  navigator.clipboard.writeText(currentUser.id);
  alert("User ID copied");
}
function render() {
  const app = document.getElementById("app");

  if (!app) return;
if (state.view === "auth") {
  app.innerHTML = authPage();
  return;
}

if (state.view === "profile") {
  app.innerHTML = profilePage();
  return;
}
  if (state.view === "home") {
    app.innerHTML = homePage();
    return;
  }

  if (state.view === "free") {
    app.innerHTML = freeDashboardPage();
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
        <div>
          <h2>Practice Zone</h2>
          <p class="muted">Free practice questions with tracking.</p>
        </div>
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

  
  if (state.view === "bookmarks") {
    app.innerHTML = bookmarksPage();
    return;
  }

  if (state.view === "updates") {
    app.innerHTML = globalUpdatesPage();
    return;
  }

  app.innerHTML = homePage();
}

async function initApp() {
  await loadCurrentUser();
  render();
}

initApp();
