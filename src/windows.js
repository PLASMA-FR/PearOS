let topZ = 30;
let activeApp = "desktop";
const openWindows = new Map();
const desktop = document.querySelector("#desktop");
const activeLabel = document.querySelector("#activeApp");
const mobile = matchMedia("(max-width:760px)");
const layoutVersion = "pear-showcase-v1";

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function dockSpace() {
  return mobile.matches ? 118 : 112;
}

function area(width, height) {
  return {
    left: 10,
    top: 46,
    right: Math.max(10, innerWidth - width - 10),
    bottom: Math.max(46, innerHeight - height - dockSpace())
  };
}

function mobileBox() {
  return {
    left: 10,
    top: 50,
    width: Math.max(1, innerWidth - 20),
    height: Math.max(180, innerHeight - 136)
  };
}

function maximizeBox() {
  return mobile.matches ? mobileBox() : {
    left: 14,
    top: 48,
    width: Math.max(320, innerWidth - 28),
    height: Math.max(280, innerHeight - 146)
  };
}

function clamp(box) {
  if (mobile.matches) return mobileBox();
  const maxWidth = Math.max(320, innerWidth - 20);
  const maxHeight = Math.max(260, innerHeight - dockSpace() - 46);
  const width = Math.min(Math.max(box.width ?? 560, 320), maxWidth);
  const height = Math.min(Math.max(box.height ?? 360, 260), maxHeight);
  const bounds = area(width, height);
  return {
    width,
    height,
    left: Math.min(Math.max(box.left ?? 90, bounds.left), bounds.right),
    top: Math.min(Math.max(box.top ?? 70, bounds.top), bounds.bottom)
  };
}

function defaultGeometry(id) {
  if (!mobile.matches && innerWidth >= 980) {
    const staged = {
      finder: {
        left: clampNumber(innerWidth * .45, 560, innerWidth - 690),
        top: clampNumber(innerHeight * .12, 112, 150),
        width: 635,
        height: 440
      },
      notes: {
        left: clampNumber(innerWidth * .48, 575, innerWidth - 520),
        top: clampNumber(innerHeight * .54, 455, innerHeight - 330),
        width: 365,
        height: 270
      },
      terminal: {
        left: clampNumber(innerWidth * .72, 760, innerWidth - 430),
        top: clampNumber(innerHeight * .36, 330, 370),
        width: 260,
        height: 420
      }
    };
    if (staged[id]) return clamp(staged[id]);
  }
  const index = Math.max(0, Object.keys(appMeta).indexOf(id));
  const app = appMeta[id];
  return clamp({ left: 96 + index * 34, top: 74 + index * 24, width: app[3], height: app[4] });
}

function geometry(id) {
  const stored = getJson("pear-windows", {});
  return stored[id] ? clamp(stored[id]) : defaultGeometry(id);
}

function currentBox(win) {
  return {
    left: parseFloat(win.style.left),
    top: parseFloat(win.style.top),
    width: parseFloat(win.style.width),
    height: parseFloat(win.style.height)
  };
}

function place(win, box) {
  win.style.left = `${box.left}px`;
  win.style.top = `${box.top}px`;
  win.style.width = `${box.width}px`;
  win.style.height = `${box.height}px`;
}

function save(id, win) {
  if (mobile.matches || win.classList.contains("maximized")) return;
  const all = getJson("pear-windows", {});
  all[id] = currentBox(win);
  setJson("pear-windows", all);
}

function setDesktopActive() {
  activeApp = "desktop";
  activeLabel.textContent = "Desktop";
  openWindows.forEach(win => win.classList.remove("active"));
  updateDock();
}

function visibleWindows(exceptId) {
  return [...openWindows.entries()]
    .filter(([id, win]) => id !== exceptId && !win.classList.contains("minimized"))
    .sort((a, b) => Number(b[1].style.zIndex || 0) - Number(a[1].style.zIndex || 0));
}

function focusNextWindow(exceptId) {
  const next = visibleWindows(exceptId)[0];
  if (next) focusWindow(next[0]);
  else setDesktopActive();
}

function updateDock() {
  document.querySelectorAll(".dock button").forEach(button => {
    const id = button.dataset.open;
    const win = openWindows.get(id);
    button.classList.toggle("running", Boolean(win));
    button.classList.toggle("active", id === activeApp && Boolean(win) && !win.classList.contains("minimized"));
  });
}

function focusWindow(id) {
  const win = openWindows.get(id);
  if (!win || win.classList.contains("minimized")) return;
  topZ += 1;
  activeApp = id;
  win.style.zIndex = topZ;
  openWindows.forEach(item => item.classList.remove("active"));
  win.classList.add("active");
  activeLabel.textContent = appMeta[id][0];
  updateDock();
}

function maximizeWindow(win, id) {
  if (win.classList.contains("maximized")) {
    win.classList.remove("maximized");
    const restored = getJson(`pear-restore-${id}`, null);
    place(win, clamp(restored || geometry(id)));
    removeValue(`pear-restore-${id}`);
    save(id, win);
    return;
  }
  setJson(`pear-restore-${id}`, currentBox(win));
  save(id, win);
  win.classList.add("maximized");
  place(win, maximizeBox());
}

function openApp(id) {
  if (!appMeta[id]) return;
  let win = openWindows.get(id);
  if (win) {
    win.classList.remove("minimized");
    focusWindow(id);
    return;
  }
  const app = appMeta[id];
  win = document.createElement("section");
  win.className = "window";
  win.dataset.app = id;
  win.setAttribute("role", "region");
  win.setAttribute("aria-label", `${app[0]} window`);
  win.innerHTML = `<div class="titlebar">
    <div class="controls">
      <button class="close" aria-label="Close ${app[0]}"></button>
      <button class="minimize" aria-label="Minimize ${app[0]}"></button>
      <button class="maximize" aria-label="Maximize ${app[0]}"></button>
    </div>
    <span class="title">${app[0]}</span>
    <span class="small">${app[5]}</span>
  </div>
  <div class="window-body"></div>
  <div class="resize-handle" tabindex="0" role="separator" aria-label="Resize ${app[0]}"></div>`;
  place(win, geometry(id));
  desktop.appendChild(win);
  openWindows.set(id, win);
  win.querySelector(".window-body").innerHTML = renderApp(id);
  wireWindow(win, id);
  wireApp(win, id, openApp);
  focusWindow(id);
}

function wireWindow(win, id) {
  win.addEventListener("pointerdown", () => focusWindow(id));
  win.querySelector(".close").addEventListener("click", event => {
    event.stopPropagation();
    const wasActive = activeApp === id;
    win.remove();
    openWindows.delete(id);
    if (wasActive) focusNextWindow(id);
    else updateDock();
  });
  win.querySelector(".minimize").addEventListener("click", event => {
    event.stopPropagation();
    win.classList.add("minimized");
    win.classList.remove("active");
    if (activeApp === id) focusNextWindow(id);
    else updateDock();
  });
  win.querySelector(".maximize").addEventListener("click", event => {
    event.stopPropagation();
    maximizeWindow(win, id);
    focusWindow(id);
  });
  win.querySelector(".titlebar").addEventListener("dblclick", event => {
    if (event.target.closest("button")) return;
    maximizeWindow(win, id);
    focusWindow(id);
  });
  drag(win, id);
  resize(win, id);
}

function drag(win, id) {
  const bar = win.querySelector(".titlebar");
  bar.addEventListener("pointerdown", event => {
    if (mobile.matches || event.target.closest("button") || win.classList.contains("maximized")) return;
    event.preventDefault();
    focusWindow(id);
    bar.setPointerCapture(event.pointerId);
    win.classList.add("dragging");
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = parseFloat(win.style.left);
    const startTop = parseFloat(win.style.top);
    const move = moveEvent => {
      const bounds = area(parseFloat(win.style.width), parseFloat(win.style.height));
      win.style.left = `${Math.min(Math.max(startLeft + moveEvent.clientX - startX, bounds.left), bounds.right)}px`;
      win.style.top = `${Math.min(Math.max(startTop + moveEvent.clientY - startY, bounds.top), bounds.bottom)}px`;
    };
    const stop = () => {
      win.classList.remove("dragging");
      if (bar.hasPointerCapture(event.pointerId)) bar.releasePointerCapture(event.pointerId);
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", stop);
      bar.removeEventListener("pointercancel", stop);
      save(id, win);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);
  });
}

function resize(win, id) {
  const handle = win.querySelector(".resize-handle");
  handle.addEventListener("pointerdown", event => {
    if (mobile.matches || win.classList.contains("maximized")) return;
    event.preventDefault();
    focusWindow(id);
    handle.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = parseFloat(win.style.width);
    const startHeight = parseFloat(win.style.height);
    const move = moveEvent => {
      const maxWidth = innerWidth - parseFloat(win.style.left) - 10;
      const maxHeight = innerHeight - parseFloat(win.style.top) - dockSpace();
      win.style.width = `${Math.min(Math.max(startWidth + moveEvent.clientX - startX, 320), maxWidth)}px`;
      win.style.height = `${Math.min(Math.max(startHeight + moveEvent.clientY - startY, 260), maxHeight)}px`;
    };
    const stop = () => {
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      save(id, win);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  });
}

function resetWindowLayout() {
  removeValue("pear-windows");
  setValue("pear-layout-version", layoutVersion);
  openWindows.forEach((win, id) => {
    removeValue(`pear-restore-${id}`);
    win.classList.remove("maximized");
    win.classList.remove("minimized");
    place(win, defaultGeometry(id));
  });
  focusNextWindow();
}

function ensureLayoutVersion() {
  if (getValue("pear-layout-version", "") === layoutVersion) return;
  removeValue("pear-windows");
  Object.keys(appMeta).forEach(id => removeValue(`pear-restore-${id}`));
  setValue("pear-layout-version", layoutVersion);
}

function stageShowcase() {
  ["finder", "notes", "terminal"].forEach(openApp);
  const order = [
    ["finder", 34],
    ["terminal", 36],
    ["notes", 37]
  ];
  order.forEach(([id, z]) => {
    const win = openWindows.get(id);
    if (!win) return;
    win.classList.remove("active", "minimized", "maximized");
    win.style.zIndex = z;
    place(win, defaultGeometry(id));
  });
  activeApp = "finder";
  activeLabel.textContent = "Finder";
  const finder = openWindows.get("finder");
  if (finder) finder.classList.add("active");
  updateDock();
}

function initWindowLaunchers() {
  ensureLayoutVersion();
  document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => openApp(button.dataset.open));
  });
  desktop.addEventListener("pointerdown", event => {
    if (event.target === desktop) setDesktopActive();
  });
  window.addEventListener("resize", () => {
    openWindows.forEach((win, id) => place(win, win.classList.contains("maximized") ? maximizeBox() : clamp(currentBox(win) || geometry(id))));
  });
}
