
const clock = document.querySelector("#clock");
const battery = document.querySelector("#battery");
const appRunner = document.querySelector("#appRunner");
const runnerList = document.querySelector("#runnerList");
const runnerSearch = document.querySelector("#runnerSearch");
const toast = document.querySelector("#toast");
let runnerSelected = 0;
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1900);
}

window.showToast = showToast;

function updateClock() {
  clock.textContent = new Date().toLocaleString([], {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  });
}

function loadBattery() {
  battery.textContent = "Power";
  if (!navigator.getBattery) return;
  navigator.getBattery().then(info => {
    const update = () => battery.textContent = info.charging ? "Power" : `${Math.round(info.level * 100)}%`;
    update();
    info.addEventListener("levelchange", update);
    info.addEventListener("chargingchange", update);
  }).catch(() => {});
}

function appDetail(id) {
  const app = Object.values(folders)
    .flat()
    .find(item => item.app === id);
  return app ? app.detail : appMeta[id][5];
}

function initRunner(openApp) {
  const runnerMatches = () => {
    const query = runnerSearch.value.trim().toLowerCase();
    return Object.entries(appMeta).filter(([, app]) => app[0].toLowerCase().includes(query) || app[5].toLowerCase().includes(query));
  };

  const renderRunner = () => {
    const items = runnerMatches();
    if (runnerSelected >= items.length) runnerSelected = Math.max(0, items.length - 1);
    runnerList.innerHTML = items.map(([id, app], index) => `
      <button type="button" id="runner-${id}" data-runner-open="${id}" role="option" aria-selected="${index === runnerSelected ? "true" : "false"}" class="${index === runnerSelected ? "selected" : ""}">
        <span class="phone-glyph ${app[2]}" aria-hidden="true">${app[1]}</span>
        <strong>${app[0]}</strong>
        <small>${escapeHtml(appDetail(id))}</small>
        <em>OPEN</em>
      </button>`).join("") || `<p class="runner-empty">No apps found</p>`;
    runnerList.setAttribute("aria-activedescendant", items[runnerSelected] ? `runner-${items[runnerSelected][0]}` : "");
  };

  const showRunner = () => {
    appRunner.classList.remove("runner-hidden");
    runnerSelected = 0;
    runnerSearch.value = "";
    renderRunner();
    runnerSearch.focus();
  };

  const hideRunner = () => {
    appRunner.classList.add("runner-hidden");
  };

  const openRunnerSelection = () => {
    const items = runnerMatches();
    if (!items[runnerSelected]) return;
    openApp(items[runnerSelected][0]);
    hideRunner();
  };

  renderRunner();

  runnerList.addEventListener("click", event => {
    const button = event.target.closest("[data-runner-open]");
    if (!button) return;
    openApp(button.dataset.runnerOpen);
    hideRunner();
  });

  document.querySelector("[data-close-runner]").addEventListener("click", () => {
    hideRunner();
  });

  document.querySelectorAll("[data-show-runner]").forEach(button => {
    button.addEventListener("click", showRunner);
  });

  runnerSearch.addEventListener("input", () => {
    runnerSelected = 0;
    renderRunner();
  });

  runnerSearch.addEventListener("keydown", event => {
    const items = runnerMatches();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      runnerSelected = items.length ? Math.min(items.length - 1, runnerSelected + 1) : 0;
      renderRunner();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      runnerSelected = Math.max(0, runnerSelected - 1);
      renderRunner();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openRunnerSelection();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      hideRunner();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !appRunner.classList.contains("runner-hidden")) {
      hideRunner();
    }
  });
}

loadTheme();
initRunner(openApp);
initWindowLaunchers();
initPalette(openApp);
updateClock();
loadBattery();
setInterval(updateClock, 30000);
