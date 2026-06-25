const terminalHistory = [];
let historyAt = 0;

function renderApp(id) {
  if (id === "finder") return finder();
  if (id === "terminal") return terminal();
  if (id === "notes") return notes();
  if (id === "calculator") return calculator();
  if (id === "sketch") return sketch();
  if (id === "pearcatch") return pearCatch();
  if (id === "pairs") return pairs();
  if (id === "devlogs") return devlogs();
  if (id === "settings") return settings();
  return about();
}

function wireApp(win, id, openApp) {
  if (id === "finder") wireFinder(win, openApp);
  if (id === "terminal") wireTerminal(win, openApp);
  if (id === "notes") wireNotes(win);
  if (id === "calculator") wireCalculator(win);
  if (id === "sketch") wireSketch(win);
  if (id === "pearcatch") wirePearCatch(win);
  if (id === "pairs") wirePairs(win);
  if (id === "devlogs") wireLogs(win);
  if (id === "settings") wireSettings(win);
}

function folderNames() {
  return Object.keys(folders);
}

function finder() {
  const buttons = folderNames()
    .map((name, index) => `<button data-folder="${name}" class="${index ? "" : "active"}">${name}</button>`)
    .join("");

  return `<div class="finder-shell">
    <aside class="sidebar"><span class="sidebar-title">Favorites</span>${buttons}</aside>
    <section class="finder-content">
      <header class="finder-heading">
        <div><small>pearOS</small><h2>Applications</h2></div>
        <span class="finder-count">6 items</span>
      </header>
      <div class="files" aria-label="Files"></div>
    </section>
  </div>`;
}

function fileGlyph(file) {
  if (file.app && appMeta[file.app]) return `<span class="app-glyph ${appMeta[file.app][2]}">${appMeta[file.app][1]}</span>`;
  if (file.kind === "Code") return `<span class="doc-glyph">JS</span>`;
  if (file.kind === "Stylesheet") return `<span class="doc-glyph">CSS</span>`;
  if (file.kind === "System") return `<span class="doc-glyph">SYS</span>`;
  return `<span class="doc-glyph">TXT</span>`;
}

function renderFolder(win, name, selectedIndex = 0) {
  const files = folders[name] || [];
  win.dataset.folder = name;
  const heading = win.querySelector(".finder-heading h2");
  const count = win.querySelector(".finder-count");
  if (heading) heading.textContent = name;
  if (count) count.textContent = `${files.length} ${files.length === 1 ? "item" : "items"}`;
  win.querySelector(".files").innerHTML = files.map((file, index) => {
    const selected = index === selectedIndex ? " selected" : "";
    return `<button class="file-button${selected}" data-file-index="${index}">
      ${fileGlyph(file)}
      <span><strong>${escapeHtml(file.name)}</strong></span>
    </button>`;
  }).join("");
}

function wireFinder(win, openApp) {
  renderFolder(win, "Applications");
  win.querySelectorAll("[data-folder]").forEach(button => {
    button.addEventListener("click", () => {
      win.querySelectorAll("[data-folder]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderFolder(win, button.dataset.folder);
    });
  });
  win.addEventListener("click", event => {
    const launch = event.target.closest("[data-open]");
    if (launch) {
      openApp(launch.dataset.open);
      return;
    }
    const fileButton = event.target.closest("[data-file-index]");
    if (!fileButton) return;
    win.querySelectorAll("[data-file-index]").forEach(item => item.classList.remove("selected"));
    fileButton.classList.add("selected");
  });
  win.addEventListener("dblclick", event => {
    const fileButton = event.target.closest("[data-file-index]");
    if (!fileButton) return;
    const file = folders[win.dataset.folder][Number(fileButton.dataset.fileIndex)];
    if (file.app) openApp(file.app);
  });
}

function terminal() {
  return `<div class="terminal">
    <div class="terminal-output">pear@pearos ~ $ hello, world! 🍐

pear@pearos ~ $ </div>
    <form><span>pear@pearos ~ $</span><input aria-label="Terminal command" autocomplete="off" spellcheck="false"></form>
  </div>`;
}

function appIdFromText(value) {
  const normalized = value.replace(/\s+/g, "");
  return Object.keys(appMeta).find(id => id === normalized || appMeta[id][0].toLowerCase().replace(/\s+/g, "") === normalized);
}

function reply(command, openApp) {
  const value = command.trim().toLowerCase();
  if (!value) return "";
  if (value === "help") {
    return [
      "help                 show commands",
      "apps                 list apps",
      "open calculator      open an app",
      "theme midnight       switch theme",
      "reset layout         restore window positions",
      "date                 show local date",
      "whoami               show current user",
      "clear                clear terminal"
    ].join("\n");
  }
  if (value === "about") return "pearOS is a static browser desktop built for a Hack Club WebOS mission.";
  if (value === "apps") return Object.values(appMeta).map(app => app[0]).join(", ");
  if (value === "whoami") return "guest student using a public pearOS demo";
  if (value === "date") return new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  if (value === "clear") return "clear";
  if (value === "reset layout") {
    resetWindowLayout();
    return "Window layout reset.";
  }
  if (value === "theme") return "Themes: light, midnight, graphite";
  if (value.startsWith("theme ")) {
    const theme = value.replace("theme ", "").trim();
    if (["light", "midnight", "graphite"].includes(theme)) {
      setTheme(theme);
      return `Theme changed to ${theme}.`;
    }
    return `No theme named ${theme}.`;
  }
  if (value.startsWith("open ")) {
    const id = appIdFromText(value.replace("open ", "").trim());
    if (appMeta[id]) {
      openApp(id);
      return `Opened ${appMeta[id][0]}.`;
    }
    return `No app named ${value.replace("open ", "").trim()}.`;
  }
  return `${command}: command not found. Try help.`;
}

function wireTerminal(win, openApp) {
  const form = win.querySelector("form");
  const input = win.querySelector("input");
  const output = win.querySelector(".terminal-output");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const command = input.value.trim();
    if (!command) return;
    terminalHistory.push(command);
    historyAt = terminalHistory.length;
    const response = reply(command, openApp);
    if (response === "clear") output.textContent = "";
    else output.textContent += `\n\npear@pearos ~ $ ${command}\n${response}`;
    input.value = "";
    output.scrollTop = output.scrollHeight;
  });
  input.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      historyAt = Math.max(0, historyAt - 1);
      input.value = terminalHistory[historyAt] || "";
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      historyAt = Math.min(terminalHistory.length, historyAt + 1);
      input.value = terminalHistory[historyAt] || "";
    }
  });
  setTimeout(() => input.focus(), 50);
}

function notes() {
  const note = getValue("pear-note", "This is a note that saves locally so you can capture ideas, plans, and to-dos without distractions.");
  return `<div class="note-card">
    <header class="note-header">
      <div><h2>Welcome to pearOS</h2><p class="help-text">This is a note that saves locally so you can capture ideas, plans, and to-dos without distractions.</p></div>
      <span class="note-count">Saved locally</span>
    </header>
    <textarea class="notes-area" aria-label="pearOS note">${escapeHtml(note)}</textarea>
  </div>`;
}

function wireNotes(win) {
  const area = win.querySelector("textarea");
  const count = win.querySelector(".note-count");
  area.addEventListener("input", event => {
    setValue("pear-note", event.target.value);
    count.textContent = "Saved locally";
  });
}

function calculator() {
  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"];
  return `<div class="calculator-app">
    <output class="calc-display" aria-live="polite">0</output>
    <div class="calc-keys">
      <button data-calc="clear">C</button>
      <button data-calc="back">⌫</button>
      <button data-calc="(">(</button>
      <button data-calc=")">)</button>
      ${keys.map(key => `<button data-calc="${key}" class="${key === "=" ? "calc-equals" : ""}">${key}</button>`).join("")}
    </div>
  </div>`;
}

function wireCalculator(win) {
  const display = win.querySelector(".calc-display");
  let expression = "";
  const render = () => {
    display.textContent = expression || "0";
  };
  win.addEventListener("click", event => {
    const button = event.target.closest("[data-calc]");
    if (!button) return;
    const value = button.dataset.calc;
    if (value === "clear") expression = "";
    else if (value === "back") expression = expression.slice(0, -1);
    else if (value === "=") {
      try {
        if (!/^[\d+\-*/().\s]+$/.test(expression)) throw new Error("bad expression");
        const result = Function(`"use strict"; return (${expression})`)();
        expression = Number.isFinite(result) ? String(Math.round(result * 1000000) / 1000000) : "Error";
      } catch {
        expression = "Error";
      }
    } else {
      expression = expression === "Error" ? value : `${expression}${value}`;
    }
    render();
  });
}

function sketch() {
  return `<div class="sketch-app">
    <div class="sketch-tools">
      <button class="swatch active" data-color="#3f6f27" style="background:#3f6f27" aria-label="Green ink"></button>
      <button class="swatch" data-color="#d2a348" style="background:#d2a348" aria-label="Gold ink"></button>
      <button class="swatch" data-color="#24352a" style="background:#24352a" aria-label="Dark ink"></button>
      <button class="secondary-action" data-clear-sketch>Clear</button>
    </div>
    <canvas class="sketch-canvas" aria-label="Sketch canvas"></canvas>
  </div>`;
}

function wireSketch(win) {
  const canvas = win.querySelector(".sketch-canvas");
  const context = canvas.getContext("2d");
  let color = "#3f6f27";
  let drawing = false;
  let last = null;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 5;
  };
  const point = event => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const draw = event => {
    if (!drawing) return;
    const next = point(event);
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(last.x, last.y);
    context.lineTo(next.x, next.y);
    context.stroke();
    last = next;
  };

  resize();
  setTimeout(resize, 60);
  canvas.addEventListener("pointerdown", event => {
    drawing = true;
    last = point(event);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", event => {
    drawing = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => {
    drawing = false;
  });
  win.querySelectorAll("[data-color]").forEach(button => {
    button.addEventListener("click", () => {
      color = button.dataset.color;
      win.querySelectorAll("[data-color]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
  win.querySelector("[data-clear-sketch]").addEventListener("click", () => context.clearRect(0, 0, canvas.width, canvas.height));
}

function pearCatch() {
  return `<div class="game-app pear-catch">
    <header><strong>Score <span data-score>0</span></strong><strong>Time <span data-time>30</span>s</strong></header>
    <div class="catch-field">
      <button class="catch-pear" data-catch aria-label="Catch pear"></button>
    </div>
    <button class="primary-action" data-start-catch>Start</button>
  </div>`;
}

function wirePearCatch(win) {
  const field = win.querySelector(".catch-field");
  const pear = win.querySelector("[data-catch]");
  const scoreText = win.querySelector("[data-score]");
  const timeText = win.querySelector("[data-time]");
  let score = 0;
  let time = 30;
  let timer = null;

  const movePear = () => {
    const maxX = Math.max(10, field.clientWidth - pear.offsetWidth - 10);
    const maxY = Math.max(10, field.clientHeight - pear.offsetHeight - 10);
    pear.style.left = `${10 + Math.random() * (maxX - 10)}px`;
    pear.style.top = `${10 + Math.random() * (maxY - 10)}px`;
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  win.querySelector("[data-start-catch]").addEventListener("click", () => {
    score = 0;
    time = 30;
    scoreText.textContent = score;
    timeText.textContent = time;
    movePear();
    stop();
    timer = setInterval(() => {
      if (!document.body.contains(win)) return stop();
      time -= 1;
      timeText.textContent = time;
      if (time <= 0) stop();
    }, 1000);
  });
  pear.addEventListener("click", () => {
    if (!timer) return;
    score += 1;
    scoreText.textContent = score;
    movePear();
  });
  movePear();
}

function pairs() {
  const symbols = ["🍐", "⌘", "✎", ">_", "🍐", "⌘", "✎", ">_"]
    .sort(() => Math.random() - .5);
  return `<div class="pairs-app">
    <header><strong>Pear Pairs</strong><span data-pairs-status>Find every match</span></header>
    <div class="pairs-grid">
      ${symbols.map((symbol, index) => `<button data-card="${index}" data-symbol="${symbol}" aria-label="Hidden card"><span>${symbol}</span></button>`).join("")}
    </div>
  </div>`;
}

function wirePairs(win) {
  const status = win.querySelector("[data-pairs-status]");
  let open = [];
  let matched = 0;
  win.addEventListener("click", event => {
    const card = event.target.closest("[data-card]");
    if (!card || card.classList.contains("open") || card.classList.contains("matched") || open.length === 2) return;
    card.classList.add("open");
    open.push(card);
    if (open.length !== 2) return;
    const [first, second] = open;
    if (first.dataset.symbol === second.dataset.symbol) {
      first.classList.add("matched");
      second.classList.add("matched");
      matched += 2;
      open = [];
      status.textContent = matched === 8 ? "All matched" : `${matched / 2} matches`;
      return;
    }
    status.textContent = "Try again";
    setTimeout(() => {
      first.classList.remove("open");
      second.classList.remove("open");
      open = [];
      status.textContent = `${matched / 2} matches`;
    }, 700);
  });
}

function devlogs() {
  const tabs = logs.map((log, index) => `<button class="tab-button ${index ? "" : "active"}" role="tab" aria-selected="${index ? "false" : "true"}" data-log="${index}">Devlog ${index + 1}</button>`).join("");
  return `<div class="devlog-app"><div class="tabs" role="tablist">${tabs}</div><article class="devlog-text" tabindex="0"></article></div>`;
}

function renderLog(win, index) {
  win.querySelector(".devlog-text").innerHTML = `<h3>${logs[index][0]}</h3><p>${logs[index][1]}</p>`;
}

function wireLogs(win) {
  renderLog(win, 0);
  win.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
      win.querySelectorAll(".tab-button").forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      renderLog(win, Number(button.dataset.log));
    });
  });
}

function settings() {
  const theme = getValue("pear-theme", "light");
  const themeButton = (id, title, detail, colors) => `<button class="theme-button ${theme === id ? "active" : ""}" data-theme="${id}">
    <span class="swatches">${colors.map(color => `<i style="background:${color}"></i>`).join("")}</span>
    <strong>${title}</strong>
    <span>${detail}</span>
  </button>`;

  return `<div class="settings-app">
    <h2>Settings</h2>
    <section class="settings-section">
      <h3>Appearance</h3>
      <div class="cards">
        ${themeButton("light", "Pear Light", "Warm paper, green glass, and teal highlights.", ["#f7f0de", "#76a943", "#2f8c9d"])}
        ${themeButton("midnight", "Midnight Green", "Dark desktop with bright pear accents.", ["#0d1511", "#8fcf67", "#345e80"])}
        ${themeButton("graphite", "Graphite", "Neutral surfaces with a softer pear accent.", ["#232428", "#a5b66a", "#718195"])}
      </div>
    </section>
    <section class="settings-section">
      <h3>Windows</h3>
      <button class="secondary-action" data-action="reset-layout">Reset window layout</button>
    </section>
  </div>`;
}

function wireSettings(win) {
  win.querySelectorAll(".theme-button").forEach(button => {
    button.addEventListener("click", () => setTheme(button.dataset.theme));
  });
  win.querySelector("[data-action='reset-layout']").addEventListener("click", () => resetWindowLayout());
}

function about() {
  return `<div class="about-app">
    <h2>About pearOS</h2>
    <p>pearOS is a macOS-inspired web desktop with its own pear identity, made for Hack Club using plain HTML, CSS, and JavaScript.</p>
    <div class="about-grid">
      <div><strong>Stack</strong><span>Static HTML, CSS, JS</span></div>
      <div><strong>Storage</strong><span>Browser localStorage</span></div>
      <div><strong>Access</strong><span>No password gate</span></div>
    </div>
    <h3>Mission checklist</h3>
    <ul class="checklist">
      <li>✓ Multiple draggable windows</li>
      <li>✓ Original design, not a guide copy</li>
      <li>✓ Three devlogs in the OS and Markdown files</li>
      <li>✓ Extra feature: Command Palette</li>
      <li>✓ Public and testable with no password</li>
    </ul>
  </div>`;
}
