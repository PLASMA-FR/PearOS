let topZ = 30;
let activeApp = "desktop";
const openWindows = new Map();
const desktop = document.querySelector("#desktop");
const activeLabel = document.querySelector("#activeApp");
const mobile = matchMedia("(max-width:760px)");

function area(width, height) {
  return {
    left: 8,
    top: 44,
    right: Math.max(8, innerWidth - width - 8),
    bottom: Math.max(44, innerHeight - height - 96)
  };
}

function mobileBox() {
  return {
    left: 10,
    top: 52,
    width: Math.max(300, innerWidth - 20),
    height: Math.max(260, innerHeight - 132)
  };
}

function clamp(box) {
  if (mobile.matches) return mobileBox();
  const width = Math.min(Math.max(box.width || 520, 320), Math.max(320, innerWidth - 20));
  const height = Math.min(Math.max(box.height || 340, 240), Math.max(240, innerHeight - 126));
  const bounds = area(width, height);
  return {
    width,
    height,
    left: Math.min(Math.max(box.left || 90, bounds.left), bounds.right),
    top: Math.min(Math.max(box.top || 70, bounds.top), bounds.bottom)
  };
}

function geometry(id) {
  const stored = getJson("pear-windows", {});
  if (stored[id]) return clamp(stored[id]);
  const index = Object.keys(appMeta).indexOf(id);
  const app = appMeta[id];
  return clamp({ left: 96 + index * 32, top: 72 + index * 24, width: app[3], height: app[4] });
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
  all[id] = {
    left: parseFloat(win.style.left),
    top: parseFloat(win.style.top),
    width: parseFloat(win.style.width),
    height: parseFloat(win.style.height)
  };
  setJson("pear-windows", all);
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
  if (!win) return;
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
    place(win, geometry(id));
    return;
  }
  save(id, win);
  win.classList.add("maximized");
  place(win, {
    left: mobile.matches ? 10 : 12,
    top: mobile.matches ? 52 : 48,
    width: mobile.matches ? innerWidth - 20 : innerWidth - 24,
    height: mobile.matches ? innerHeight - 132 : innerHeight - 134
  });
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
  win.innerHTML = `<div class="titlebar"><div class="controls"><button class="close" aria-label="Close ${app[0]}"></button><button class="minimize" aria-label="Minimize ${app[0]}"></button><button class="maximize" aria-label="Maximize ${app[0]}"></button></div><span class="title">${app[0]}</span><span class="small">pearOS</span></div><div class="window-body"></div><div class="resize-handle" tabindex="0" role="separator" aria-label="Resize ${app[0]}"></div>`;
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
    win.remove();
    openWindows.delete(id);
    activeApp = "desktop";
    activeLabel.textContent = "Desktop";
    updateDock();
  });
  win.querySelector(".minimize").addEventListener("click", event => {
    event.stopPropagation();
    win.classList.add("minimized");
    activeLabel.textContent = "Desktop";
    updateDock();
  });
  win.querySelector(".maximize").addEventListener("click", event => {
    event.stopPropagation();
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
      win.style.width = `${Math.min(Math.max(startWidth + moveEvent.clientX - startX, 320), innerWidth - parseFloat(win.style.left) - 8)}px`;
      win.style.height = `${Math.min(Math.max(startHeight + moveEvent.clientY - startY, 240), innerHeight - parseFloat(win.style.top) - 96)}px`;
    };
    const stop = () => {
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

function initWindowLaunchers() {
  document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => openApp(button.dataset.open));
  });
  window.addEventListener("resize", () => {
    openWindows.forEach((win, id) => place(win, win.classList.contains("maximized") ? mobileBox() : clamp(geometry(id))));
  });
}
