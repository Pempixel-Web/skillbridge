# ADR 1: Load student profiles from a static JSON file through an API module

## Context
In Week 1, student profiles were hardcoded inside React components. Week 2 requires real asynchronous data with loading, empty, and error states, and the project has no backend. I also want to avoid API keys in the repo, and I am working alone, part-time, so setup cost matters.

## Decision
We will store the profiles in `public/students.json` and fetch them with `fetch` and `async/await` from a single module, `src/api/students.js`. Components never call `fetch` directly. The module also contains clearly marked demo switches (`?simulate=error`, `empty`, `flaky`) and an artificial delay so every state can be demonstrated without a backend.

## Rationale
- **A real asynchronous fetch:** the component code is the same as it would be with a real API, so it exercises everything the task asks for (async handling, status states, retry).
- **No setup and no secrets:** nothing to install or host, and no keys to leak.
- **One place to change:** because only `src/api/students.js` knows where data comes from, replacing the JSON file with a real API later means editing one file.
- **Rejected: keeping hardcoded arrays.** There would be nothing asynchronous to handle.
- **Rejected: JSON Server or MSW.** Both would work but add dependencies and configuration for a small app; the JSON file gives the same learning value for less risk.
- **Rejected: a public API.** I could not find a public API that matched student profiles, and dummy-data APIs would not fit the idea.
- **Rejected: building my own backend.** Too large for the three-week, part-time scope.

## Status
Accepted

## Consequences
- **Positive:** every UI state can be tested and demonstrated; the data layer is swappable; no secrets in the repo.
- **Negative:** the data is read-only and public (anyone can open `/students.json`); there is no persistence, so features like saved favourites must be handled on the client in Week 3; the demo switches add code that must be removed or kept out of a production build later; a static file cannot show real server behaviour such as slow queries or authentication failures.
