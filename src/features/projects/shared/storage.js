// Safe wrappers: storage can be unavailable (private mode, SSR, quota).
export function readJSON(key, fallback, area = 'local') {
  try {
    const store = area === 'session' ? window.sessionStorage : window.localStorage;
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
export function writeJSON(key, value, area = 'local') {
  try {
    const store = area === 'session' ? window.sessionStorage : window.localStorage;
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
