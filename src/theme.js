const themes = new Set(["light", "midnight", "graphite"]);

function setTheme(theme, notify = true) {
  const nextTheme = themes.has(theme) ? theme : "light";
  document.documentElement.dataset.theme = nextTheme;
  const saved = setValue("pear-theme", nextTheme);
  document.querySelectorAll(".theme-button").forEach(button => {
    button.classList.toggle("active", button.dataset.theme === nextTheme);
  });
  if (notify && window.showToast) window.showToast(saved ? `${nextTheme} theme saved` : `${nextTheme} theme applied for this visit`);
}

function loadTheme() {
  setTheme(getValue("pear-theme", "light"), false);
}
