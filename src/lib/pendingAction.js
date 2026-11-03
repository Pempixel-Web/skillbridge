// Remembers what a visitor was trying to do before they had to sign up / log in,
// so we can finish it afterwards (e.g. "save this student", "open this profile").
// Stored in localStorage so it survives opening the verification email in a new tab.

const KEY = "skillbridge:pending";

export function setPending(action) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...action, at: Date.now() }));
  } catch {
    /* storage unavailable – safe to ignore */
  }
}

export function getPending() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Ignore anything older than 3 days
    if (Date.now() - (data.at || 0) > 3 * 24 * 60 * 60 * 1000) {
      clearPending();
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearPending() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

// Only allow in-app paths (stops "open redirect" tricks)
export function safePath(path) {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
    ? path
    : "/";
}
