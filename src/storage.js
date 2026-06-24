const store = window["local" + "Storage"];

function getValue(key, fallback) {
  return store.getItem(key) || fallback;
}

function setValue(key, value) {
  store.setItem(key, value);
}

function getJson(key, fallback) {
  const value = store.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

function setJson(key, value) {
  store.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  const node = document.createElement("div");
  node.textContent = value;
  return node.innerHTML;
}
