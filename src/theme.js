const themes = new Set(["light", "midnight", "graphite"]);

function setTheme(theme) {
  const nextTheme = themes.has(theme) ? theme : "light";
  document.documentElement.dataset.theme = nextTheme;
  setValue("pear-theme", nextTheme);
  document.querySelectorAll(".theme-button").forEach(button => {
    button.classList.toggle("active", button.dataset.theme === nextTheme);
  });
}

function loadTheme() {
  setTheme(getValue("pear-theme", "light"));
}
