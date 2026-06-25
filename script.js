
const clock = document.querySelector("#clock");
const battery = document.querySelector("#battery");

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

loadTheme();
initWindowLaunchers();
initPalette(openApp);
updateClock();
loadBattery();
setInterval(updateClock, 30000);
setTimeout(stageShowcase, 120);
