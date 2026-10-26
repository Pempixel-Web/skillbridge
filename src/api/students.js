const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Inside the function before the fetch;
const mode = new URLSearchParams(window.location.search).get("simulate");
await sleep(1200);
if (mode === "error") throw new Error("Simulated failure");
if (mode === "empty") return [];


export async function fetchStudents({ signal } = {}) {
  const response = await fetch("/students.json", { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}