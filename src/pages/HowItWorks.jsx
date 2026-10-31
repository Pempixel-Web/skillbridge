import { Link } from "react-router-dom";
import "./HowItWorks.css";

const STEPS = [
  {
    title: "Open the directory",
    text: "Click Discover in the menu, or the Explore students button. You land on the student directory, where every profile is shown as a card with a name, role, skills, and a short bio.",
    tip: "Cards load in a moment. If the connection is slow, you will see a loading message first.",
  },
  {
    title: "Search for a student or a skill",
    text: "Type in the search bar at the top. SkillBridge looks through names, roles, bios, and skills as you type, so results update instantly. No need to press Enter.",
    tip: "Try \"Figma\", \"writer\", or a student's name. Capital letters don't matter.",
  },
  {
    title: "Narrow it down with skill chips",
    text: "Tap a skill chip under the search bar, such as Design, Writing, or Development, to show only students who have that skill. Tap All skills to see everyone again.",
    tip: "Search and chips work together. A student must match both to appear.",
  },
  {
    title: "Open a profile",
    text: "Found someone interesting? Use View profile on their card to learn more about what they do and how they work.",
    tip: "Full profile pages are being built and will arrive in an upcoming update.",
    soon: true,
  },
  {
    title: "Save the people you like",
    text: "Tap the bookmark icon on a card to save that student as a favourite, so you can come back to them when you are ready to reach out.",
    tip: "Saving favourites is planned for an upcoming update.",
    soon: true,
  },
];

const EXAMPLES = [
  {
    need: "I need a designer for my group project",
    action: "Tap the Design chip, then look through the cards.",
  },
  {
    need: "I want someone who knows React",
    action: "Type \"React\" in the search bar and the matching students appear.",
  },
  {
    need: "I need a good writer who also understands tech",
    action: "Tap Writing, then type \"documentation\" to narrow it further.",
  },
];

const STATES = [
  {
    title: "Loading",
    text: "A short message while student profiles are being fetched.",
  },
  {
    title: "No results",
    text: "If nothing matches, you will see \"No students found\". Try a different word or choose another skill chip.",
  },
  {
    title: "Something went wrong",
    text: "If profiles can't load, you will see an error message with a Try again button. Check your connection and tap it.",
  },
];

const FAQS = [
  {
    q: "Do I need an account to use SkillBridge?",
    a: "No. In this version anyone can open the directory, search, and filter without signing up.",
  },
  {
    q: "Are the students on the site real?",
    a: "Not yet. The profiles shown are fictional samples used to build and test the platform. No real student information is collected.",
  },
  {
    q: "Can I contact a student directly?",
    a: "Not in this version. Messaging and contact features are not included yet, partly to protect student privacy and safety.",
  },
  {
    q: "Why does searching show nothing?",
    a: "Check the spelling, or clear the search box. Also check that a skill chip isn't limiting the results. Tap All skills to reset.",
  },
  {
    q: "Does it work on my phone?",
    a: "Yes. SkillBridge is designed to work on both phones and computers, and phones get a handy bottom navigation bar.",
  },
];

export default function HowItWorks() {
  return (
    <main className="hiw-page">
      {/* ---------- Hero ---------- */}
      <section className="hiw-hero">
        <div className="hiw-container hiw-hero-inner">
          <span className="hiw-badge">
            <span className="hiw-badge-dot" />
            HOW IT WORKS
          </span>
          <h1>
            From "who can do this?"
            <span> to the right person in seconds.</span>
          </h1>
          <p className="hiw-lead">
            SkillBridge is simple to use. Follow these steps to find students by
            their skills and start your next collaboration.
          </p>
          <div className="hiw-actions">
            <Link to="/#explore" className="hiw-btn hiw-btn-primary">
              Try it now
            </Link>
            <Link to="/about" className="hiw-btn hiw-btn-ghost">
              Why SkillBridge exists
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Steps ---------- */}
      <section className="hiw-section">
        <div className="hiw-container">
          <div className="hiw-heading">
            <span className="hiw-eyebrow">STEP BY STEP</span>
            <h2>Five steps to find your collaborator</h2>
          </div>

          <ol className="hiw-steps">
            {STEPS.map((step, index) => (
              <li className="hiw-step" key={step.title}>
                <span className="hiw-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="hiw-step-body">
                  <h3>
                    {step.title}
                    {step.soon && <span className="hiw-soon">Coming soon</span>}
                  </h3>
                  <p>{step.text}</p>
                  <p className="hiw-tip">
                    <strong>Tip:</strong> {step.tip}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Examples ---------- */}
      <section className="hiw-section hiw-section-tint">
        <div className="hiw-container">
          <div className="hiw-heading">
            <span className="hiw-eyebrow">IN PRACTICE</span>
            <h2>Real situations, quick answers</h2>
            <p>Here is how you would use SkillBridge for common student needs.</p>
          </div>

          <div className="hiw-grid hiw-grid-3">
            {EXAMPLES.map((item) => (
              <article className="hiw-card" key={item.need}>
                <p className="hiw-quote">“{item.need}”</p>
                <p className="hiw-action">
                  <span aria-hidden="true">→</span> {item.action}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What you'll see ---------- */}
      <section className="hiw-section">
        <div className="hiw-container">
          <div className="hiw-heading">
            <span className="hiw-eyebrow">GOOD TO KNOW</span>
            <h2>What you might see along the way</h2>
            <p>SkillBridge always tells you what is happening, so you are never left guessing.</p>
          </div>

          <div className="hiw-grid hiw-grid-3">
            {STATES.map((item) => (
              <article className="hiw-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="hiw-section hiw-section-tint">
        <div className="hiw-container hiw-narrow">
          <div className="hiw-heading">
            <span className="hiw-eyebrow">FAQ</span>
            <h2>Common questions</h2>
          </div>

          <div className="hiw-faq">
            {FAQS.map((item) => (
              <details className="hiw-faq-item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="hiw-section hiw-section-tight">
        <div className="hiw-container">
          <div className="hiw-cta">
            <h2>Ready to make the right connection?</h2>
            <p>Jump into the directory and find someone with the skill you need.</p>
            <div className="hiw-actions hiw-actions-center">
              <Link to="/#explore" className="hiw-btn hiw-btn-light">
                Explore students
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
