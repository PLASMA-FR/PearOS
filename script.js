
const clock = document.querySelector("#clock");
const battery = document.querySelector("#battery");
const appRunner = document.querySelector("#appRunner");
const runnerList = document.querySelector("#runnerList");

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
  runnerList.innerHTML = Object.entries(appMeta).map(([id, app]) => `
    <button type="button" data-runner-open="${id}">
      <span class="phone-glyph ${app[2]}">${app[1]}</span>
      <strong>${app[0]}</strong>
      <small>${escapeHtml(appDetail(id))}</small>
      <em>OPEN</em>
    </button>`).join("");

  runnerList.addEventListener("click", event => {
    const button = event.target.closest("[data-runner-open]");
    if (!button) return;
    openApp(button.dataset.runnerOpen);
  });

  document.querySelector("[data-close-runner]").addEventListener("click", () => {
    appRunner.classList.add("runner-hidden");
  });

  document.querySelectorAll("[data-show-runner]").forEach(button => {
    button.addEventListener("click", () => appRunner.classList.remove("runner-hidden"));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !appRunner.classList.contains("runner-hidden")) {
      appRunner.classList.add("runner-hidden");
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
setTimeout(stageShowcase, 120);
