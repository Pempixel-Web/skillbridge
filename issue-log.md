# Issue Log

Bugs and problems found while building SkillBridge, the options I considered, and how I fixed them.

## Week 2

### 1. Student data was hardcoded inside components
- **Date:** 26 Oct 2026
- **Problem:** The student profiles were written directly in `Directory.jsx` (and duplicated in another file), so there was no way to show loading, empty, or error states.
- **Options considered:** (a) keep the arrays and fake the states with timers; (b) set up JSON Server or MSW; (c) move the data to a JSON file and fetch it.
- **Fix:** Option (c). Data now lives in `public/students.json` and is fetched by `src/api/students.js`. It is the simplest option that is still a real asynchronous fetch.
- **Status:** Fixed

### 2. `fetch` does not fail on 404 or 500 responses
- **Problem:** A wrong URL returned an error page, but my code treated it as success and tried to read it as JSON.
- **Options considered:** Rely on `try/catch` alone, or check the response myself.
- **Fix:** `fetch` only rejects on network failure, so I check `response.ok` and throw an error when it is false. That sends HTTP failures into the same error state as network failures.
- **Status:** Fixed

### 3. ESLint rejected setting "loading" inside `useEffect`
- **Problem:** My first version called `setStatus("loading")` at the top of the effect. The `react-hooks/set-state-in-effect` lint rule flagged it.
- **Options considered:** Disable the rule, or restructure.
- **Fix:** Restructured instead of silencing the rule. The initial state is already `"loading"`. For retries, the click handler sets the status and bumps an `attempt` counter, which is a dependency of the effect, so the fetch re-runs. State changes now happen where their cause is.
- **Status:** Fixed

### 4. Requests fired twice in development
- **Problem:** The Network tab showed two requests for the same data.
- **Cause:** `<StrictMode>` runs effects twice in development to expose missing cleanups.
- **Options considered:** Remove StrictMode, or make the effect safe to run twice.
- **Fix:** Kept StrictMode. The effect creates an `AbortController` and aborts it in the cleanup function, ignoring the resulting `AbortError`. This also prevents stale responses from updating state after unmount. It does not happen in production.
- **Status:** Fixed

### 5. Console warning from a misspelled attribute in the Navbar
- **Problem:** The console showed "Received `false` for a non-boolean attribute `airal-expanded`".
- **Cause:** A typo in `Navbar.jsx`: `airal-expanded` instead of `aria-expanded`. React only converts booleans to strings for real `aria-*` attributes.
- **Fix:** Corrected the spelling. This also fixed an accessibility bug, because screen readers could not tell whether the menu was open.
- **Status:** Fixed

### 6. "Showing 0 students" appeared while data was loading
- **Problem:** The student count displayed before any data arrived, which was misleading.
- **Fix:** The count only renders when `status === "success"`.
- **Status:** Fixed

### 7. `Hero` component was doing too many jobs
- **Problem:** `Hero.jsx` contained the headline, the search form, the skill chips, the skills list, and the image. `SkillFilter.jsx` was an empty file, and `Hero.jsx` also had a large commented-out copy of itself.
- **Options considered:** Leave it, or split it into smaller components.
- **Fix:** Extracted `SearchBar` and `SkillFilter`, moved the skills list to `src/data/skills.js`, and deleted the dead commented code. `Hero` now only composes the pieces.
- **Status:** Fixed

### 8. Duplicate profile card markup
- **Problem:** `ExploreStudents.jsx` repeated the same card markup as `StudentCard.jsx`, and nothing used it. It also depended on packages the project did not have.
- **Fix:** Deleted it. One pattern now comes from one component (`StudentCard`).
- **Status:** Fixed

### 9. Search input had no accessible label
- **Problem:** The search field relied on placeholder text only, which screen readers do not treat as a label.
- **Fix:** Added an `aria-label` to the input, plus `aria-pressed` on the skill chips so assistive tech knows which filter is active.
- **Status:** Fixed
