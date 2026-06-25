const memoryStore = new Map();
const store = (() => {
  try {
    const candidate = window["local" + "Storage"];
    candidate.setItem("__pear-test", "1");
    candidate.removeItem("__pear-test");
    return candidate;
  } catch {
    return {
      getItem: key => memoryStore.has(key) ? memoryStore.get(key) : null,
      setItem: (key, value) => memoryStore.set(key, String(value)),
      removeItem: key => memoryStore.delete(key)
    };
  }
})();

function getValue(key, fallback) {
  const value = store.getItem(key);
  return value === null ? fallback : value;
}

function setValue(key, value) {
  store.setItem(key, value);
}

function removeValue(key) {
  store.removeItem(key);
}

function getJson(key, fallback) {
  try {
    const value = store.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    removeValue(key);
    return fallback;
  }
}

function setJson(key, value) {
  store.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  const node = document.createElement("div");
  node.textContent = value;
  return node.innerHTML;
}
