let selected = 0;
const palette = document.querySelector("#palette");
const paletteInput = document.querySelector("#paletteInput");
const results = document.querySelector("#paletteResults");

function matches() {
  const query = paletteInput.value.trim().toLowerCase();
  return Object.entries(appMeta).filter(([, app]) => app[0].toLowerCase().includes(query));
}

function renderPalette() {
  const items = matches();
  if (selected >= items.length) selected = Math.max(0, items.length - 1);
  results.innerHTML = items.map(([id, app], index) => `<button type="button" class="palette-result ${index === selected ? "selected" : ""}" role="option" data-open="${id}"><span class="app-glyph ${app[2]}">${app[1]}</span><strong>${app[0]}</strong></button>`).join("") || `<div class="palette-result selected">No apps found</div>`;
}

function isTyping(target) {
  return target.closest("input, textarea, [contenteditable='true']");
}

function initPalette(openApp) {
  const open = () => {
    selected = 0;
    paletteInput.value = "";
    renderPalette();
    palette.showModal();
    paletteInput.focus();
  };
  const close = () => {
    if (palette.open) palette.close();
  };
  paletteInput.addEventListener("input", () => {
    selected = 0;
    renderPalette();
  });
  paletteInput.addEventListener("keydown", event => {
    const items = matches();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      selected = Math.min(items.length - 1, selected + 1);
      renderPalette();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      selected = Math.max(0, selected - 1);
      renderPalette();
    }
    if (event.key === "Enter" && items[selected]) {
      event.preventDefault();
      openApp(items[selected][0]);
      close();
    }
  });
  results.addEventListener("click", event => {
    const button = event.target.closest("[data-open]");
    if (!button) return;
    openApp(button.dataset.open);
    close();
  });
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !isTyping(event.target)) {
      event.preventDefault();
      open();
    }
  });
}
