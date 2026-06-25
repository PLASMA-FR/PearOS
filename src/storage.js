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
  try {
    const value = store.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function setValue(key, value) {
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeValue(key) {
  try {
    store.removeItem(key);
  } catch {}
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
  return setValue(key, JSON.stringify(value));
}

function escapeHtml(value) {
  const node = document.createElement("div");
  node.textContent = value;
  return node.innerHTML;
}
