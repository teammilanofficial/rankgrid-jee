const STORAGE_KEY = "rankgrid_jee_supabase_v1_fixed";

let currentUser = null;
let currentProfile = null;
let currentIsAdmin = false;

let remoteSeries = [];
let remoteMaterials = [];
let remoteRequests = [];

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  view: "home",
  activeSeries: "free",
  activeTab: "overview",
  attempts: {},
  completedMaterials: {},
  bookmarkedQuestions: [],
  bookmarkedMaterials: [],
  paymentSeries: null
};

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getConfig() {
  if (typeof APP_CONFIG !== "undefined") {
    return APP_CONFIG;
  }

  return {
    appName: "RankGrid JEE",
    tagline: "Track. Practice. Improve.",
    exam: "JEE 2028",
    telegramUsername: "@yourusername"
  };
}

function getLocalSeries() {
  if (typeof SERIES !== "undefined" && Array.isArray(SERIES)) {
    return SERIES;
  }

  return [
    {
      id: "free",
      title: "Free JEE 2028 Dashboard",
      subject: "All Subjects",
      type: "Free Material",
      price: 0,
      free: true,
      description: "Free dashboard with PDFs, practice questions and tracking."
    }
  ];
}

function getLocalMaterials() {
  if (typeof MATERIALS !== "undefined" && Array.isArray(MATERIALS)) {
    return MATERIALS;
  }

  return [];
}

function getLocalQuestions() {
  if (typeof QUESTIONS !== "undefined" && Array.isArray(QUESTIONS)) {
    return QUESTIONS;
  }

  return [];
}

function normalizeSeries(series) {
  return {
    id: series.id,
    title: series.title || "Untitled Series",
    subject: series.subject || "All Subjects",
    type: series.type || "PDF Series",
    price: series.price || 0,
    free: series.free === true || series.is_free === true,
    description: series.description || ""
  };
}

function normalizeMaterial(material) {
  return {
    id: String(material.id),
    seriesId: material.seriesId || material.series_id || "free",
    title: material.title || "Untitled PDF",
    type: material.type || material.material_type || "PDF",
    subject: material.subject || "",
    chapter: material.chapter || "",
    update: material.update || "Available",
    description: material.description || "",
    fileUrl: material.fileUrl || material.file_url || "",
    storagePath: material.storagePath || material.storage_path || "",
    isFree: material.isFree === true || material.is_free === true
  };
}

function getAllSeries() {
  if (remoteSeries.length > 0) {
    return remoteSeries.map(normalizeSeries);
  }

  return getLocalSeries().map(normalizeSeries);
}

function getAllMaterials() {
  if (remoteMaterials.length > 0) {
    return remoteMaterials.map(normalizeMaterial);
  }

  return getLocalMaterials().map(normalizeMaterial);
}

function getSeries(seriesId) {
  const allSeries = getAllSeries();

  return (
    allSeries.find((series) => series.id === seriesId) ||
    allSeries.find((series) => series.id === "free") ||
    {
      id: "free",
      title: "Free JEE 2028 Dashboard",
      subject: "All Subjects",
      type: "Free Material",
      price: 0,
      free: true,
      description: "Free dashboard."
    }
  );
}

function getSeriesMaterials(seriesId) {
  return getAllMaterials().filter((material) => material.seriesId === seriesId);
}

function getSeriesQuestions(seriesId) {
  return getLocalQuestions().filter((question) => question.seriesId === seriesId);
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

function isApprovedForSeries(seriesId) {
  const series = getSeries(seriesId);

  if (!series) return false;
  if (series.free) return true;
  if (currentIsAdmin) return true;
  if (!currentUser) return false;

  return remoteRequests.some(function (request) {
    return (
      request.series_id === seriesId &&
      request.user_id === currentUser.id &&
      request.status === "approved"
    );
  });
}

function hasPendingRequest(seriesId) {
  if (!currentUser) return false;

  return remoteRequests.some(function (request) {
    return (
      request.series_id === seriesId &&
      request.user_id === currentUser.id &&
      request.status === "pending"
    );
  });
}

function getAttemptsArray() {
  return Object.values(state.attempts || {});
}

function getQuestionStats(seriesId) {
  let attempts = getAttemptsArray();

  if (seriesId) {
    attempts = attempts.filter(function (attempt) {
      return attempt.seriesId === seriesId;
    });
  }

  const total = attempts.length;
  const solved = attempts.filter(function (attempt) {
    return attempt.status !== "skipped";
  }).length;

  const correct = attempts.filter(function (attempt) {
    return attempt.status === "correct";
  }).length;

  const incorrect = attempts.filter(function (attempt) {
    return attempt.status === "incorrect";
  }).length;

  const skipped = attempts.filter(function (attempt) {
    return attempt.status === "skipped";
  }).length;

  const accuracy = solved ? Math.round((correct / solved) * 1000) / 10 : 0;

  return {
    total: total,
    solved: solved,
    correct: correct,
    incorrect: incorrect,
    skipped: skipped,
    accuracy: accuracy
  };
}

function getMaterialStats(seriesId) {
  let materials = getAllMaterials();

  if (seriesId) {
    materials = materials.filter(function (material) {
      return material.seriesId === seriesId;
    });
  }

  const total = materials.length;

  const completed = materials.filter(function (material) {
    return state.completedMaterials[String(material.id)];
  }).length;

  const pending = total - completed;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  return {
    total: total,
    completed: completed,
    pending: pending,
    completion: completion
  };
}

function getOverallCompletion(seriesId) {
  const materialStats = getMaterialStats(seriesId);
  const questions = getSeriesQuestions(seriesId);

  if (!questions.length) {
    return materialStats.completion;
  }

  const attemptedQuestions = questions.filter(function (question) {
    return state.attempts[question.id];
  }).length;

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
  const config = getConfig();

  return `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="logo">
          <div class="logo-mark">RG</div>
          <div>
            <h1>${config.appName}</h1>
            <p>${config.tagline}</p>
          </div>
        </div>

        <div class="nav-title">Account</div>
        ${currentUser ? navButton("profile", "My Profile") : navButton("auth", "Login / Signup")}

        <div class="nav-title">Main</div>
        ${navButton("home", "Dashboard")}
        ${navButton("free", "Free Dashboard")}
        ${navButton("series", "All Series")}
        ${navButton("practice", "Practice Zone")}
        ${navButton("mistakes", "Mistake Book")}
        ${navButton("analytics", "Analytics")}

        <div class="nav-title">Resources</div>
        ${navButton("bookmarks", "Bookmarks")}
        ${navButton("updates", "Updates")}

        <div class="nav-title">Premium</div>
        ${navButton("premium", "Premium Series")}

        ${
          currentIsAdmin
            ? `
              <div class="nav-title">Admin</div>
              ${navButton("admin", "Admin Approval")}
            `
            : ""
        }

        <div class="footer-note">
          Login, access request and protected PDFs are handled through Supabase.
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

          <div 
            class="profile" 
            onclick="${currentUser ? "setView('profile')" : "setView('auth')"}" 
            style="cursor:pointer;"
          >
            <div class="avatar">${currentUser ? currentUser.email.charAt(0).toUpperCase() : "J"}</div>
            <div>
              <strong>${currentUser ? currentUser.email : "Login"}</strong>
              <div class="muted" style="font-size:12px;">
                ${currentUser ? "User ID active" : "Create free account"}
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
  const config = getConfig();
  const qStats = getQuestionStats();
  const mStats = getMaterialStats();

  return layout(`
    <section class="hero">
      <div class="hero-card">
        <span class="badge">${config.exam} Practice Dashboard</span>

        <h2>Professional dashboard for PDFs, practice, tests and progress tracking.</h2>

        <p>
          ${config.appName} gives free and premium subject-wise PDF series with separate dashboards.
          Track PDF completion, solved questions, correct, incorrect, skipped, accuracy, mistakes and updates.
        </p>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:20px;">
          <button class="btn" onclick="setView('free')">Start Free Dashboard</button>
          <button class="btn secondary" onclick="setView('series')">View All Series</button>
        </div>
      </div>

      <div class="panel">
        <div class="kpi-ring" style="--percentage:${qStats.accuracy * 3.6}deg;">
          <div>
            ${qStats.accuracy}%<br>
            <span class="muted" style="font-size:12px;">Accuracy</span>
          </div>
        </div>

        <div class="grid stats" style="grid-template-columns:repeat(2,1fr);">
          ${statCard("Solved", qStats.solved)}
          ${statCard("Correct", qStats.correct)}
          ${statCard("PDF Done", mStats.completed)}
          ${statCard("Series", getAllSeries().length)}
        </div>
      </div>
    </section>

    <div class="grid stats">
      ${statCard("Total Series", getAllSeries().length)}
      ${statCard("PDF Resources", getAllMaterials().length)}
      ${statCard("Practice Qs", getLocalQuestions().length)}
      ${statCard("PDF Progress", mStats.completion + "%")}
    </div>

    <div class="section-title">
      <div>
        <h2>Featured Series</h2>
        <p class="muted">Free and premium dashboards for JEE preparation.</p>
      </div>
      <button class="btn secondary" onclick="setView('series')">See All</button>
    </div>

    <div class="grid cards">
      ${getAllSeries().slice(0, 6).map(seriesCard).join("")}
    </div>
  `);
}

function seriesCard(series) {
  const completion = getOverallCompletion(series.id);
  const approved = isApprovedForSeries(series.id);

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
          ${approved ? "Open Dashboard" : "Preview"}
        </button>

        ${
          !approved && !series.free
            ? `<button class="btn warning" onclick="requestAccessPage('${series.id}')">Request Access</button>`
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
          Each series has its own dashboard, PDF library, progress, practice, analytics and updates.
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
      ${getAllSeries().map(seriesCard).join("")}
    </div>
  `);
}

function filterSeries(filter) {
  const grid = document.getElementById("seriesGrid");
  if (!grid) return;

  let filtered = getAllSeries();

  if (filter === "physics") {
    filtered = filtered.filter(function (series) {
      return series.subject.toLowerCase().includes("physics");
    });
  }

  if (filter === "chemistry") {
    filtered = filtered.filter(function (series) {
      return series.subject.toLowerCase().includes("chemistry");
    });
  }

  if (filter === "maths") {
    filtered = filtered.filter(function (series) {
      return series.subject.toLowerCase().includes("maths");
    });
  }

  if (filter === "free") {
    filtered = filtered.filter(function (series) {
      return series.free;
    });
  }

  grid.innerHTML = filtered.map(seriesCard).join("");
}

function seriesDetailPage(forceFree) {
  const seriesId = forceFree ? "free" : state.activeSeries;
  const series = getSeries(seriesId);
  const approved = isApprovedForSeries(seriesId);
  const qStats = getQuestionStats(seriesId);
  const mStats = getMaterialStats(seriesId);

  const tabs = ["overview", "materials", "practice", "tests", "mistakes", "analytics", "updates"];

  return layout(`
    <div class="section-title">
      <div>
        <span class="badge">${series.subject} • ${series.type}</span>
        <h2>${series.title}</h2>
        <p class="muted">${series.description}</p>
      </div>

      ${
        approved
          ? `<button class="btn success">Access Active</button>`
          : `<button class="btn warning" onclick="requestAccessPage('${series.id}')">Request Access</button>`
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
        .map(function (tab) {
          return `
            <button class="tab ${state.activeTab === tab ? "active" : ""}" onclick="setTab('${tab}')">
              ${capitalize(tab)}
            </button>
          `;
        })
        .join("")}
    </div>

    ${approved ? tabContent(seriesId, state.activeTab) : lockedPanel(series)}
  `);
}

function lockedPanel(series) {
  const materials = getSeriesMaterials(series.id);
  const pending = hasPendingRequest(series.id);

  return `
    <div class="grid two-column">
      <div class="panel">
        <h3>This premium dashboard is locked</h3>

        <p class="muted">
          Request access first. Payment details will be shared privately on Telegram.
          Your UPI ID is not shown publicly on this website.
        </p>

        ${
          pending
            ? `
              <div class="payment-box">
                <strong>Request already pending</strong>
                <p>DM admin on Telegram with your User ID and payment screenshot.</p>
              </div>
            `
            : `
              <button class="btn warning" onclick="requestAccessPage('${series.id}')">
                Request Access
              </button>
            `
        }
      </div>

      <div class="panel">
        <h3>Included PDFs Preview</h3>

        <div class="list">
          ${
            materials.length
              ? materials
                  .slice(0, 5)
                  .map(function (material) {
                    return `
                      <div class="item">
                        <h4>${material.title}</h4>
                        <div class="muted">${material.type} • ${material.chapter}</div>
                      </div>
                    `;
                  })
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
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total PDFs</td><td>${mStats.total}</td></tr>
          <tr><td>PDFs Completed</td><td>${mStats.completed}</td></tr>
          <tr><td>PDF Completion</td><td>${mStats.completion}%</td></tr>
          <tr><td>Total Problems Solved</td><td>${qStats.solved}</td></tr>
          <tr><td>Correct</td><td>${qStats.correct}</td></tr>
          <tr><td>Incorrect</td><td>${qStats.incorrect}</td></tr>
          <tr><td>Skipped</td><td>${qStats.skipped}</td></tr>
          <tr><td>Accuracy</td><td>${qStats.accuracy}%</td></tr>
        </table>
      </div>

      <div class="panel">
        <h3>Latest PDF Resources</h3>

        <div class="list">
          ${
            materials.length
              ? materials
                  .slice(0, 6)
                  .map(function (material) {
                    return `
                      <div class="item">
                        <h4>${material.title}</h4>
                        <div class="muted">${material.type} • ${material.chapter}</div>

                        <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
                          <button class="btn secondary" onclick="openMaterial('${material.id}')">Open</button>
                          <button class="btn secondary" onclick="toggleMaterialComplete('${material.id}')">
                            ${state.completedMaterials[String(material.id)] ? "Completed" : "Mark Done"}
                          </button>
                        </div>
                      </div>
                    `;
                  })
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
          <p class="muted">Open PDFs, mark completed and track progress.</p>
        </div>
      </div>

      <table class="table">
        <tr>
          <th>Status</th>
          <th>Title</th>
          <th>Type</th>
          <th>Subject</th>
          <th>Chapter</th>
          <th>Actions</th>
        </tr>

        ${
          materials.length
            ? materials
                .map(function (material) {
                  return `
                    <tr>
                      <td>${state.completedMaterials[String(material.id)] ? "Done" : "Pending"}</td>
                      <td>
                        <strong>${material.title}</strong>
                        <div class="muted">${material.description || ""}</div>
                      </td>
                      <td>${material.type}</td>
                      <td>${material.subject}</td>
                      <td>${material.chapter}</td>
                      <td>
                        <div style="display:flex; gap:6px; flex-wrap:wrap;">
                          <button class="btn secondary" onclick="openMaterial('${material.id}')">Open</button>
                          <button class="btn secondary" onclick="toggleMaterialComplete('${material.id}')">
                            ${state.completedMaterials[String(material.id)] ? "Undo" : "Done"}
                          </button>
                          <button class="btn secondary" onclick="bookmarkMaterial('${material.id}')">Save</button>
                        </div>
                      </td>
                    </tr>
                  `;
                })
                .join("")
            : `<tr><td colspan="6">No PDF resources added yet.</td></tr>`
        }
      </table>
    </div>
  `;
}

function practiceTab(seriesId) {
  let questions = getSeriesQuestions(seriesId || "free");

  if (!questions.length) {
    questions = getSeriesQuestions("free");
  }

  const current =
    questions.find(function (question) {
      return !state.attempts[question.id];
    }) || questions[0];

  if (!current) {
    return `
      <div class="panel">
        <h3>No questions added yet</h3>
        <p class="muted">Practice questions will be added soon.</p>
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
          .map(function (option, index) {
            let optionClass = "";

            if (attempted) {
              if (index === current.correct) optionClass = "correct";
              else if (attempted.selected === index) optionClass = "wrong";
            }

            return `
              <button class="option ${optionClass}" onclick="answerQuestion('${current.id}', ${index})">
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
        ${practiceStats(seriesId || "free")}
      </div>
    </div>
  `;
}

function practiceStats(seriesId) {
  const stats = getQuestionStats(seriesId);

  return `
    <div class="grid stats" style="grid-template-columns:repeat(2,1fr);">
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
  const testMaterials = getSeriesMaterials(seriesId).filter(function (material) {
    return String(material.type).toLowerCase().includes("test");
  });

  return `
    <div class="panel">
      <h3>Test PDFs</h3>

      <div class="list">
        ${
          testMaterials.length
            ? testMaterials
                .map(function (material) {
                  return `
                    <div class="item">
                      <h4>${material.title}</h4>
                      <div class="muted">${material.subject} • ${material.chapter}</div>

                      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn" onclick="openMaterial('${material.id}')">Open Test PDF</button>
                        <button class="btn secondary" onclick="toggleMaterialComplete('${material.id}')">
                          ${state.completedMaterials[String(material.id)] ? "Completed" : "Mark Completed"}
                        </button>
                      </div>
                    </div>
                  `;
                })
                .join("")
            : `
              <div class="item">
                <h4>No test PDF added yet</h4>
                <div class="muted">Upload test PDFs from Supabase later.</div>
              </div>
            `
        }
      </div>
    </div>
  `;
}

function mistakesPage(embedded, seriesId) {
  let wrongAttempts = getAttemptsArray().filter(function (attempt) {
    return attempt.status === "incorrect";
  });

  if (seriesId) {
    wrongAttempts = wrongAttempts.filter(function (attempt) {
      return attempt.seriesId === seriesId;
    });
  }

  const content = `
    <div class="panel">
      <h3>Mistake Book</h3>

      <div class="list">
        ${
          wrongAttempts.length
            ? wrongAttempts
                .map(function (attempt) {
                  const question = getLocalQuestions().find(function (q) {
                    return q.id === attempt.questionId;
                  });

                  return `
                    <div class="item">
                      <h4>${question ? question.question : "Question"}</h4>
                      <div class="muted">${attempt.subject} • ${attempt.chapter}</div>
                      <p><strong>Correct concept:</strong> ${question ? question.solution : ""}</p>
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

function analyticsPage(embedded, seriesId) {
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
            .map(function (subject) {
              let attempts = getAttemptsArray().filter(function (attempt) {
                return attempt.subject === subject;
              });

              if (seriesId) {
                attempts = attempts.filter(function (attempt) {
                  return attempt.seriesId === seriesId;
                });
              }

              const solved = attempts.filter(function (attempt) {
                return attempt.status !== "skipped";
              }).length;

              const correct = attempts.filter(function (attempt) {
                return attempt.status === "correct";
              }).length;

              const incorrect = attempts.filter(function (attempt) {
                return attempt.status === "incorrect";
              }).length;

              const skipped = attempts.filter(function (attempt) {
                return attempt.status === "skipped";
              }).length;

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

function weakAreaDetector(seriesId) {
  let wrongAttempts = getAttemptsArray().filter(function (attempt) {
    return attempt.status === "incorrect";
  });

  if (seriesId) {
    wrongAttempts = wrongAttempts.filter(function (attempt) {
      return attempt.seriesId === seriesId;
    });
  }

  const chapterMap = {};

  wrongAttempts.forEach(function (attempt) {
    chapterMap[attempt.chapter] = (chapterMap[attempt.chapter] || 0) + 1;
  });

  const weakChapters = Object.entries(chapterMap).sort(function (a, b) {
    return b[1] - a[1];
  });

  if (!weakChapters.length) {
    return `<p class="muted">No weak areas detected yet.</p>`;
  }

  return `
    <div class="list">
      ${weakChapters
        .map(function (entry) {
          return `
            <div class="item">
              <strong>${entry[0]}</strong>
              <div class="muted">${entry[1]} repeated mistake(s)</div>
            </div>
          `;
        })
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
                .map(function (material) {
                  return `
                    <div class="item">
                      <h4>${material.title}</h4>
                      <div class="muted">${material.type} • ${material.subject} • ${material.chapter}</div>
                      <p>${material.description || ""}</p>
                    </div>
                  `;
                })
                .join("")
            : `<p class="muted">Weekly updates will appear here.</p>`
        }
      </div>
    </div>
  `;
}

function globalUpdatesPage() {
  const announcements =
    typeof ANNOUNCEMENTS !== "undefined" && Array.isArray(ANNOUNCEMENTS)
      ? ANNOUNCEMENTS
      : [];

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
            announcements.length
              ? announcements
                  .map(function (announcement) {
                    return `
                      <div class="item">
                        <h4>${announcement.title}</h4>
                        <div class="muted">${announcement.date}</div>
                        <p>${announcement.message}</p>
                      </div>
                    `;
                  })
                  .join("")
              : `<p class="muted">No announcements yet.</p>`
          }
        </div>
      </div>

      <div class="panel">
        <h3>Recent PDFs</h3>

        <div class="list">
          ${getAllMaterials()
            .slice(0, 10)
            .map(function (material) {
              return `
                <div class="item">
                  <h4>${material.title}</h4>
                  <div class="muted">${material.subject} • ${material.type}</div>
                </div>
              `;
            })
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
          Request access first. Payment details are shared privately on Telegram.
        </p>
      </div>
    </div>

    <div class="grid cards">
      ${getAllSeries()
        .filter(function (series) {
          return !series.free;
        })
        .map(seriesCard)
        .join("")}
    </div>
  `);
}

function requestAccessPage(seriesId) {
  const series = getSeries(seriesId);
  const config = getConfig();

  state.paymentSeries = seriesId;
  state.view = "request-access";
  save();

  if (!currentUser) {
    document.getElementById("app").innerHTML = layout(`
      <div class="panel">
        <h2>Login Required</h2>
        <p class="muted">Create a free account first to get your unique User ID.</p>
        <button class="btn" onclick="setView('auth')">Login / Signup</button>
      </div>
    `);
    return;
  }

  const telegramLink = "https://t.me/" + String(config.telegramUsername || "").replace("@", "");

  document.getElementById("app").innerHTML = layout(`
    <div class="panel">
      <h2>Request Access: ${series.title}</h2>

      <p class="muted">
        Payment details are not shown publicly. DM admin on Telegram with your User ID and series name.
      </p>

      <div class="payment-box">
        <h3>Access Request</h3>

        <p><strong>Series:</strong> ${series.title}</p>
        <p><strong>Price:</strong> ₹${series.price}</p>
        <p><strong>Your User ID:</strong></p>
        <p style="word-break:break-all;">${currentUser.id}</p>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn secondary" onclick="copyUserId()">Copy User ID</button>
          <button class="btn warning" onclick="createAccessRequest('${series.id}')">Create Request</button>
        </div>

        <p class="muted" style="margin-top:14px;">
          After creating request, DM ${config.telegramUsername} on Telegram.
        </p>

        <a href="${telegramLink}" target="_blank">
          <button class="btn success">Open Telegram DM</button>
        </a>
      </div>
    </div>
  `);
}

async function createAccessRequest(seriesId) {
  if (!window.RANKGRID_SUPABASE) {
    alert("Supabase is not connected. Check supabase-config.js.");
    return;
  }

  if (!currentUser) {
    alert("Login first.");
    setView("auth");
    return;
  }

  const existing = remoteRequests.find(function (request) {
    return (
      request.series_id === seriesId &&
      request.user_id === currentUser.id &&
      request.status !== "rejected"
    );
  });

  if (existing) {
    alert("Request already exists. DM admin on Telegram with your User ID.");
    return;
  }

  const insertData = {
    user_id: currentUser.id,
    series_id: seriesId,
    status: "pending",
    telegram_username: currentProfile ? currentProfile.telegram_username : "",
    user_note: "Requested from website"
  };

  const result = await window.RANKGRID_SUPABASE
    .from("purchase_requests")
    .insert(insertData);

  if (result.error) {
    alert(result.error.message);
    return;
  }

  await loadRemoteData();

  alert("Request created. Now DM admin on Telegram with your User ID.");
  render();
}

function authPage() {
  return layout(`
    <div class="section-title">
      <div>
        <h2>Login / Signup</h2>
        <p class="muted">
          Create a free account to get your unique User ID and request access to premium series.
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
          Your unique User ID will be generated automatically.
        </p>
      </div>

      <div class="panel">
        <h3>Login</h3>

        <input class="field" id="loginEmail" type="email" placeholder="Email address">
        <input class="field" id="loginPassword" type="password" placeholder="Password">

        <button class="btn success" onclick="loginUser()">Login</button>
      </div>
    </div>
  `);
}

function profilePage() {
  if (!currentUser) return authPage();

  const myRequests = remoteRequests.filter(function (request) {
    return request.user_id === currentUser.id;
  });

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
          <tr><th>Field</th><th>Value</th></tr>
          <tr><td>Email</td><td>${currentUser.email}</td></tr>
          <tr><td>User ID</td><td style="word-break:break-all;">${currentUser.id}</td></tr>
          <tr><td>Name</td><td>${currentProfile && currentProfile.full_name ? currentProfile.full_name : "Not added"}</td></tr>
          <tr><td>Telegram</td><td>${currentProfile && currentProfile.telegram_username ? currentProfile.telegram_username : "Not added"}</td></tr>
          <tr><td>Admin</td><td>${currentIsAdmin ? "Yes" : "No"}</td></tr>
        </table>

        <button class="btn secondary" style="margin-top:12px;" onclick="copyUserId()">Copy User ID</button>
      </div>

      <div class="panel">
        <h3>My Access Requests</h3>

        <div class="list">
          ${
            myRequests.length
              ? myRequests
                  .map(function (request) {
                    const series = getSeries(request.series_id);

                    return `
                      <div class="item">
                        <h4>${series ? series.title : request.series_id}</h4>
                        <div class="muted">Status: ${request.status}</div>
                      </div>
                    `;
                  })
                  .join("")
              : `<p class="muted">No access requests yet.</p>`
          }
        </div>
      </div>
    </div>
  `);
}

async function signupUser() {
  if (!window.RANKGRID_SUPABASE) {
    alert("Supabase is not connected. Check supabase-config.js.");
    return;
  }

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const fullName = document.getElementById("signupName").value.trim();
  const telegram = document.getElementById("signupTelegram").value.trim();

  if (!email || !password) {
    alert("Enter email and password.");
    return;
  }

  const signupResult = await window.RANKGRID_SUPABASE.auth.signUp({
    email: email,
    password: password
  });

  if (signupResult.error) {
    alert(signupResult.error.message);
    return;
  }

  currentUser = signupResult.data.user;

  if (currentUser) {
    await window.RANKGRID_SUPABASE.from("profiles").upsert({
      id: currentUser.id,
      email: currentUser.email,
      full_name: fullName,
      telegram_username: telegram
    });
  }

  await loadCurrentUser();
  await loadRemoteData();

  alert("Account created. Your User ID is ready.");
  setView("profile");
}

async function loginUser() {
  if (!window.RANKGRID_SUPABASE) {
    alert("Supabase is not connected. Check supabase-config.js.");
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Enter email and password.");
    return;
  }

  const loginResult = await window.RANKGRID_SUPABASE.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (loginResult.error) {
    alert(loginResult.error.message);
    return;
  }

  await loadCurrentUser();
  await loadRemoteData();

  alert("Logged in successfully.");
  setView("profile");
}

async function logoutUser() {
  if (window.RANKGRID_SUPABASE) {
    await window.RANKGRID_SUPABASE.auth.signOut();
  }

  currentUser = null;
  currentProfile = null;
  currentIsAdmin = false;
  remoteRequests = [];

  state.view = "home";
  save();
  render();
}

async function loadCurrentUser() {
  currentUser = null;
  currentProfile = null;
  currentIsAdmin = false;

  if (!window.RANKGRID_SUPABASE) return;

  const userResult = await window.RANKGRID_SUPABASE.auth.getUser();

  currentUser = userResult.data && userResult.data.user ? userResult.data.user : null;

  if (!currentUser) return;

  const profileResult = await window.RANKGRID_SUPABASE
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .maybeSingle();

  currentProfile = profileResult.data || null;

  const adminResult = await window.RANKGRID_SUPABASE
    .from("admins")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  currentIsAdmin = !!adminResult.data;
}

async function loadRemoteData() {
  if (!window.RANKGRID_SUPABASE) return;

  try {
    const seriesResult = await window.RANKGRID_SUPABASE
      .from("series")
      .select("*")
      .order("created_at", { ascending: true });

    if (seriesResult.data) {
      remoteSeries = seriesResult.data;
    }
  } catch (error) {
    console.log("Series load skipped:", error);
  }

  try {
    const materialResult = await window.RANKGRID_SUPABASE
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (materialResult.data) {
      remoteMaterials = materialResult.data;
    }
  } catch (error) {
    console.log("Materials load skipped:", error);
  }

  if (currentUser) {
    try {
      const requestResult = await window.RANKGRID_SUPABASE
        .from("purchase_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (requestResult.data) {
        remoteRequests = requestResult.data;
      }
    } catch (error) {
      console.log("Requests load skipped:", error);
    }
  }
}

function copyUserId() {
  if (!currentUser) return;

  navigator.clipboard.writeText(currentUser.id);
  alert("User ID copied.");
}

function adminPage() {
  if (!currentUser) {
    return authPage();
  }

  if (!currentIsAdmin) {
    return layout(`
      <div class="panel">
        <h2>Admin Only</h2>
        <p class="muted">You do not have admin access.</p>
      </div>
    `);
  }

  const pending = remoteRequests.filter(function (request) {
    return request.status === "pending";
  });

  return layout(`
    <div class="section-title">
      <div>
        <h2>Admin Approval</h2>
        <p class="muted">Approve users after Telegram payment verification.</p>
      </div>
    </div>

    <div class="panel">
      <h3>Pending Requests</h3>

      <div class="list">
        ${
          pending.length
            ? pending
                .map(function (request) {
                  const series = getSeries(request.series_id);

                  return `
                    <div class="item">
                      <h4>${series ? series.title : request.series_id}</h4>

                      <div class="muted">Request ID: ${request.id}</div>
                      <div class="muted">User ID: ${request.user_id}</div>
                      <div class="muted">Telegram: ${request.telegram_username || "Not added"}</div>
                      <div class="muted">Status: ${request.status}</div>

                      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
                        <button class="btn success" onclick="approveRequest('${request.id}')">Approve</button>
                        <button class="btn danger" onclick="rejectRequest('${request.id}')">Reject</button>
                      </div>
                    </div>
                  `;
                })
                .join("")
            : `<p class="muted">No pending requests.</p>`
        }
      </div>
    </div>
  `);
}

async function approveRequest(requestId) {
  if (!currentIsAdmin) {
    alert("Admin only.");
    return;
  }

  const result = await window.RANKGRID_SUPABASE
    .from("purchase_requests")
    .update({
      status: "approved",
      approved_at: new Date().toISOString()
    })
    .eq("id", requestId);

  if (result.error) {
    alert(result.error.message);
    return;
  }

  await loadRemoteData();
  alert("Request approved.");
  render();
}

async function rejectRequest(requestId) {
  if (!currentIsAdmin) {
    alert("Admin only.");
    return;
  }

  const result = await window.RANKGRID_SUPABASE
    .from("purchase_requests")
    .update({
      status: "rejected"
    })
    .eq("id", requestId);

  if (result.error) {
    alert(result.error.message);
    return;
  }

  await loadRemoteData();
  alert("Request rejected.");
  render();
}

function bookmarksPage() {
  const savedQuestions = state.bookmarkedQuestions
    .map(function (id) {
      return getLocalQuestions().find(function (q) {
        return q.id === id;
      });
    })
    .filter(Boolean);

  const savedMaterials = state.bookmarkedMaterials
    .map(function (id) {
      return getAllMaterials().find(function (m) {
        return String(m.id) === String(id);
      });
    })
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
                  .map(function (material) {
                    return `
                      <div class="item">
                        <h4>${material.title}</h4>
                        <div class="muted">${material.subject} • ${material.chapter}</div>
                        <button class="btn secondary" style="margin-top:10px;" onclick="openMaterial('${material.id}')">Open</button>
                      </div>
                    `;
                  })
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
                  .map(function (question) {
                    return `
                      <div class="item">
                        <h4>${question.question}</h4>
                        <div class="muted">${question.subject} • ${question.chapter}</div>
                        <p>${question.solution}</p>
                      </div>
                    `;
                  })
                  .join("")
              : `<p class="muted">No question bookmarks yet.</p>`
          }
        </div>
      </div>
    </div>
  `);
}

function answerQuestion(questionId, selectedIndex) {
  const question = getLocalQuestions().find(function (q) {
    return q.id === questionId;
  });

  if (!question) return;

  state.attempts[questionId] = {
    questionId: questionId,
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
  const question = getLocalQuestions().find(function (q) {
    return q.id === questionId;
  });

  if (!question) return;

  state.attempts[questionId] = {
    questionId: questionId,
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
    alert("Question bookmarked.");
  } else {
    alert("Question already bookmarked.");
  }
}

function bookmarkMaterial(materialId) {
  const id = String(materialId);

  if (!state.bookmarkedMaterials.includes(id)) {
    state.bookmarkedMaterials.push(id);
    save();
    alert("PDF resource bookmarked.");
  } else {
    alert("PDF already bookmarked.");
  }
}

function toggleMaterialComplete(materialId) {
  const id = String(materialId);

  if (state.completedMaterials[id]) {
    delete state.completedMaterials[id];
  } else {
    state.completedMaterials[id] = true;
  }

  save();
  render();
}

async function openMaterial(materialId) {
  const material = getAllMaterials().find(function (m) {
    return String(m.id) === String(materialId);
  });

  if (!material) return;

  const series = getSeries(material.seriesId);

  if (!series.free && !isApprovedForSeries(material.seriesId)) {
    alert("This PDF is locked. Request access first.");
    return;
  }

  if (material.storagePath && window.RANKGRID_SUPABASE) {
    const result = await window.RANKGRID_SUPABASE.storage
      .from("pdfs")
      .createSignedUrl(material.storagePath, 300);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    window.open(result.data.signedUrl, "_blank");
    return;
  }

  if (material.fileUrl) {
    window.open(material.fileUrl, "_blank");
    return;
  }

  alert("PDF link/storage path not added yet.");
}

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

function searchCards(value) {
  const searchValue = String(value || "").toLowerCase();
  const cards = document.querySelectorAll(".searchable");

  cards.forEach(function (card) {
    const text = card.getAttribute("data-search") || "";
    card.style.display = text.includes(searchValue) ? "block" : "none";
  });
}

function capitalize(text) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

function render() {
  const app = document.getElementById("app");

  if (!app) return;

  try {
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
      app.innerHTML = seriesDetailPage(false);
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
      app.innerHTML = mistakesPage(false, null);
      return;
    }

    if (state.view === "analytics") {
      app.innerHTML = analyticsPage(false, null);
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

    if (state.view === "bookmarks") {
      app.innerHTML = bookmarksPage();
      return;
    }

    if (state.view === "updates") {
      app.innerHTML = globalUpdatesPage();
      return;
    }

    app.innerHTML = homePage();
  } catch (error) {
    console.error("Render error:", error);

    app.innerHTML = `
      <div style="padding:20px; color:white; background:#07111f; min-height:100vh; font-family:Arial;">
        <h2>RankGrid JEE loading error</h2>
        <p>There is a JavaScript error. Check app.js, data.js, or supabase-config.js.</p>
        <pre style="white-space:pre-wrap; background:#111; padding:12px; border-radius:12px;">${error.message}</pre>
      </div>
    `;
  }
}

async function initApp() {
  try {
    if (window.RANKGRID_SUPABASE) {
      await loadCurrentUser();
      await loadRemoteData();
    }
  } catch (error) {
    console.log("Startup skipped:", error);
  }

  render();
}

initApp();
