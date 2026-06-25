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
  paletteInput.setAttribute("aria-activedescendant", items[selected] ? `palette-${items[selected][0]}` : "");
  results.innerHTML = items.map(([id, app], index) => `<button type="button" id="palette-${id}" class="palette-result ${index === selected ? "selected" : ""}" role="option" aria-selected="${index === selected ? "true" : "false"}" data-open="${id}"><span class="app-glyph ${app[2]}" aria-hidden="true">${app[1]}</span><strong>${app[0]}</strong><small>${app[5]}</small></button>`).join("") || `<div class="palette-empty" role="option" aria-selected="true">No apps found</div>`;
}

function isTyping(target) {
  return target && target.closest && target.closest("input, textarea, [contenteditable='true']");
}

function initPalette(openApp) {
  const open = () => {
    if (palette.open) {
      paletteInput.focus();
      return;
    }
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
      selected = items.length ? Math.min(items.length - 1, selected + 1) : 0;
      renderPalette();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      selected = Math.max(0, selected - 1);
      renderPalette();
    }
    if (event.key === "Escape") close();
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
  results.addEventListener("mousemove", event => {
    const button = event.target.closest("[data-open]");
    if (!button) return;
    const items = matches();
    selected = items.findIndex(([id]) => id === button.dataset.open);
    renderPalette();
  });
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !isTyping(event.target)) {
      event.preventDefault();
      open();
    }
  });
  document.querySelectorAll("[data-palette]").forEach(button => {
    button.addEventListener("click", open);
  });
}
