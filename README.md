# SkillBridge

A student talent discovery directory that helps university students find other students by their skills and interests.

**Live site:** https://skillbridggeeee.vercel.app/
**Repository:** https://github.com/Pempixel-Web/skillbridge
**Design (Figma):** https://www.figma.com/design/ocHlefvPtj6GQhMZ6LRUti/Untitled?node-id=0-1&t=klLT0hwtZ4XKapU7-1

## The problem

Students have useful skills (web development, design, writing, photography, video editing) but no easy way for others in their university to discover them. SkillBridge is a simple directory where a visitor can search and filter student profiles by skill.

**Target user:** a university student looking for someone with a specific skill to collaborate with.

## Technology stack

- React 19 + Vite
- JavaScript (ES modules), plain CSS
- ESLint (with `eslint-plugin-react-hooks`)
- Deployed on Vercel

## Features

- **Search** profiles by name, role, bio, or skill as you type
- **Filter** profiles by skill using chips
- **Loading, empty, and error states** with a **Try again** button when data fails to load
- Responsive layout with a mobile bottom navigation

## How each interaction works

- **Search:** `Directory` holds the search text in state. `SearchBar` is a controlled input that reports each keystroke upward. `Directory` then filters the student list with `Array.filter`, checking name, role, bio, and skills (case-insensitive).
- **Skill filter:** `Directory` holds the selected skill in state. `SkillFilter` renders one button per skill and reports clicks upward. A student passes the filter if their `skills` array includes the selected skill, or if "All skills" is selected.
- **Both together:** a student must match the search *and* the selected skill. If nothing matches, the user sees a "No students found" message.

## How data loading works (Week 2)

Profiles live in `public/students.json` and are fetched asynchronously by `src/api/students.js`. `Directory` tracks a single `status` value (`"loading"`, `"error"`, or `"success"`) and shows a different UI for each. "Empty" is derived: status is `"success"` but the list has zero students.

Retry works by changing an `attempt` counter that the fetching effect depends on, so clicking **Try again** re-runs the fetch.

### Try the different states

There is no backend, so the data layer includes demo switches. Add one to the URL:

| URL | What you will see |
|---|---|
| `/` | Loading for about 1.2 seconds, then the student cards |
| `/?simulate=empty` | "No students have joined yet" |
| `/?simulate=error` | Error message; **Try again** fails again |
| `/?simulate=flaky` | Error first, then **Try again** succeeds |

These switches live in one clearly marked block in `src/api/students.js` and are meant to be deleted when a real API replaces the JSON file.

## Component map

| Component | File | Responsibility | Props |
|---|---|---|---|
| `Navbar` | `src/components/Navbar.jsx` | Top navigation and mobile menu toggle | none |
| `Hero` | `src/components/Hero.jsx` | Headline section; composes `SearchBar` and `SkillFilter` | `search`, `setSearch`, `activeSkill`, `setActiveSkill` |
| `SearchBar` | `src/components/SearchBar.jsx` | Controlled search input | `value`, `onChange` |
| `SkillFilter` | `src/components/SkillFilter.jsx` | Row of skill filter chips | `skills`, `activeSkill`, `onChange` |
| `StudentCard` | `src/components/StudentCard.jsx` | One student profile card | `student` |
| `StateMessage` | `src/components/StateMessage.jsx` | Reusable loading / error / empty message | `title`, `role`, `children` |
| `BottomNav` | `src/components/BottomNav.jsx` | Mobile bottom navigation | none |
| `Footer` | `src/components/Footer.jsx` | Page footer | none |
| `Directory` (page) | `src/pages/Directory.jsx` | Owns search, filter, and loading state; decides what to render | none |

**Where state lives:** search text, selected skill, and the fetched student list all live in `Directory`, the nearest common parent of the components that need them. Child components receive values and callbacks as props and hold no data of their own.

## Project structure

```
public/students.json      Mock student data (fetched at runtime)
src/api/students.js       The only file that talks to the data source
src/data/skills.js        List of skills used by the filter chips
src/components/           Reusable UI components
src/pages/Directory.jsx   Main page
docs/                     Issue log and feedback response
```

## Getting started

**Requirements:** Node.js and npm.

```bash
npm install     # install dependencies
npm run dev     # start the dev server
npm run build   # production build
npm run lint    # run ESLint
npm run preview # preview the production build
```

## Documentation

- [Issue log](docs/issue-log.md)
- [Week 2 feedback response](docs/week-2-feedback-response.md)
- [Project plan](PROJECT_PLAN.md)

## Known limitations

- Data comes from a static JSON file, not a real backend.
- The **bookmark** and **View profile** buttons on cards do not do anything yet.
- The **Saved** and **Profile** links in the mobile navigation have no pages yet. Routing is planned for Week 3.
- No automated tests yet (planned for Week 3).
- Accessibility has had basic fixes only; a full audit with before/after scores is planned for Week 3.
