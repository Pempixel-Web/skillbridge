// All "talking to the data source" lives in this one file.
// Later, swapping to a real backend means editing only this file.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Shared helper: fetch a JSON file, with demo failure modes.
async function getJson(url, { signal, attempt = 0 } = {}) {
  // --- Demo helpers: delete this block when you get a real API ---
  const mode = new URLSearchParams(window.location.search).get("simulate");
  await sleep(1200); // fake network delay so you can SEE the loading state
  if (mode === "error") throw new Error("Simulated server failure");
  if (mode === "flaky" && attempt === 0) throw new Error("Simulated flaky failure");
  if (mode === "empty") return [];
  // ---------------------------------------------------------------

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export const fetchStudents = (options) => getJson("/students.json", options);

export const fetchExploreStudents = (options) =>
  getJson("/explore-students.json", options);
