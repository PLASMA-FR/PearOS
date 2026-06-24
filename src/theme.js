function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  setValue("pear-theme", theme);
  document.querySelectorAll(".theme-button").forEach(button => {
    button.classList.toggle("active", button.dataset.theme === theme);
  });
}

function loadTheme() {
  setTheme(getValue("pear-theme", "light"));
}
