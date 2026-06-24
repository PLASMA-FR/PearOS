
const clock = document.querySelector("#clock");
const battery = document.querySelector("#battery");

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function loadBattery() {
  if (!navigator.getBattery) return;
  navigator.getBattery().then(info => {
    const update = () => battery.textContent = `${Math.round(info.level * 100)}%`;
    update();
    info.addEventListener("levelchange", update);
  }).catch(() => {});
}

loadTheme();
initWindowLaunchers();
initPalette(openApp);
updateClock();
loadBattery();
setInterval(updateClock, 30000);
setTimeout(() => openApp("finder"), 120);
