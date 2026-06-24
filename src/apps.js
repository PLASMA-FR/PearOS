const terminalHistory = [];
let historyAt = 0;

function renderApp(id) {
  if (id === "finder") return finder();
  if (id === "terminal") return terminal();
  if (id === "notes") return notes();
  if (id === "devlogs") return devlogs();
  if (id === "settings") return settings();
  return about();
}

function wireApp(win, id, openApp) {
  if (id === "finder") wireFinder(win, openApp);
  if (id === "terminal") wireTerminal(win, openApp);
  if (id === "notes") win.querySelector("textarea").addEventListener("input", event => setValue("pear-note", event.target.value));
  if (id === "devlogs") wireLogs(win);
  if (id === "settings") win.querySelectorAll(".theme-button").forEach(button => button.addEventListener("click", () => setTheme(button.dataset.theme)));
}

function finder() {
  const buttons = Object.keys(folders).map((name, index) => `<button data-folder="${name}" class="${index ? "" : "active"}">${name}</button>`).join("");
  return `<div class="grid"><aside class="sidebar">${buttons}</aside><section class="files"></section></div>`;
}

function renderFolder(win, name) {
  win.querySelector(".files").innerHTML = folders[name].map(file => {
    const open = file[2] ? ` data-open="${file[2]}"` : "";
    return `<button class="file-button"${open}><strong>${file[0]}</strong><span>${file[1]}</span></button>`;
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
    const button = event.target.closest("[data-open]");
    if (button) openApp(button.dataset.open);
  });
}

function terminal() {
  return `<div class="terminal"><div class="terminal-output">pearOS Terminal\nType help to get started.</div><form><span>guest@pearOS %</span><input aria-label="Terminal command" autocomplete="off" spellcheck="false"></form></div>`;
}

function reply(command, openApp) {
  const value = command.trim().toLowerCase();
  if (!value) return "";
  if (value === "help") return "help, about, apps, open finder, open notes, open devlogs, open settings, clear, whoami";
  if (value === "about") return "pearOS is a static browser desktop built for a Hack Club WebOS mission.";
  if (value === "apps") return Object.values(appMeta).map(app => app[0]).join(", ");
  if (value === "whoami") return "guest student using a public pearOS demo";
  if (value === "clear") return "clear";
  if (value.startsWith("open ")) {
    const id = value.replace("open ", "").trim();
    if (appMeta[id]) {
      openApp(id);
      return `Opened ${appMeta[id][0]}.`;
    }
    return `No app named ${id}.`;
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
    else output.textContent += `\n\nguest@pearOS % ${command}\n${response}`;
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
  const note = getValue("pear-note", "pearOS idea: make a small desktop that feels polished but still honest enough for a student project. Keep it static, friendly, and easy to test.");
  return `<div class="note-card"><h2>Notes</h2><p class="help-text">This note saves in localStorage on your browser.</p><textarea class="notes-area" aria-label="pearOS note">${escapeHtml(note)}</textarea></div>`;
}

function devlogs() {
  const tabs = logs.map((log, index) => `<button class="tab-button ${index ? "" : "active"}" role="tab" data-log="${index}">Devlog ${index + 1}</button>`).join("");
  return `<div><div class="tabs" role="tablist">${tabs}</div><article class="devlog-text" tabindex="0"></article></div>`;
}

function renderLog(win, index) {
  win.querySelector(".devlog-text").innerHTML = `<h3>${logs[index][0]}</h3><p>${logs[index][1]}</p>`;
}

function wireLogs(win) {
  renderLog(win, 0);
  win.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
      win.querySelectorAll(".tab-button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderLog(win, Number(button.dataset.log));
    });
  });
}

function settings() {
  const theme = getValue("pear-theme", "light");
  return `<h2>Settings</h2><p class="help-text">Pick a theme. pearOS saves the choice locally.</p><div class="cards"><button class="theme-button ${theme === "light" ? "active" : ""}" data-theme="light"><strong>Pear Light</strong><span>Warm paper and soft green glass.</span></button><button class="theme-button ${theme === "midnight" ? "active" : ""}" data-theme="midnight"><strong>Midnight Green</strong><span>Dark desktop with bright pear accents.</span></button><button class="theme-button ${theme === "graphite" ? "active" : ""}" data-theme="graphite"><strong>Graphite</strong><span>Neutral and presentation friendly.</span></button></div>`;
}

function about() {
  return `<h2>About pearOS</h2><p>pearOS is a macOS-inspired web desktop with its own pear identity, made for Hack Club using plain HTML, CSS, and JavaScript.</p><p>No Apple logos, official icons, copied wallpapers, login screens, or build tools are used.</p><h3>Mission checklist</h3><ul class="checklist"><li>✓ Multiple draggable windows</li><li>✓ Original design, not a guide copy</li><li>✓ Three devlogs in the OS and Markdown files</li><li>✓ Extra feature: Command Palette</li><li>✓ Public and testable with no password</li></ul>`;
}
