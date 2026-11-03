import { EyeOff, MessageCircleQuestion, Network, DoorOpen } from "lucide-react";

import { Link } from "react-router-dom";
import "./About.css";

// const PROBLEMS = [
//   {
//     icon: EyeOff,
//     title: "Skills stay hidden",
//     text: "A first-year who edits videos brilliantly or a final-year who designs beautiful posters is usually known only to their own classmates. Everyone else on campus has no idea they exist.",
//   },
//   {
//     icon: "💬",
//     title: "Finding help means guessing",
//     text: "Today, looking for a designer or a developer means posting in group chats and hoping the right person sees it. It is slow, random, and easy to miss.",
//   },
//   {
//     icon: "🧱",
//     title: "Departments live in silos",
//     text: "A Computer Science student with an app idea rarely meets the Fine Arts student who could design it. Talent exists on campus, but it is spread across departments and levels that never mix.",
//   },
//   {
//     icon: "🚪",
//     title: "Opportunities go to the already-known",
//     text: "Project teams, competitions, and side gigs usually go to people who are already popular or well connected. Quiet, new, or off-campus students get left out, even when they are just as good.",
//   },
// ];

// import { EyeOff, MessageCircleQuestion, Network, DoorOpen } from "lucide-react";

const PROBLEMS = [
  {
    icon: EyeOff,
    title: "Skills stay hidden",
    text: "A first-year who edits videos brilliantly or a final-year who designs beautiful posters is usually known only to their own classmates. Everyone else on campus has no idea they exist.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Finding help means guessing",
    text: "Today, looking for a designer or a developer means posting in group chats and hoping the right person sees it. It is slow, random, and easy to miss.",
  },
  {
    icon: Network,
    title: "Departments live in silos",
    text: "A Computer Science student with an app idea rarely meets the Fine Arts student who could design it. Talent exists on campus, but it is spread across departments and levels that never mix.",
  },
  {
    icon: DoorOpen,
    title: "Opportunities go to the already-known",
    text: "Project teams, competitions, and side gigs usually go to people who are already popular or well connected. Quiet, new, or off-campus students get left out, even when they are just as good.",
  },
];

const SOLUTIONS = [
  {
    icon: "🔎",
    title: "Search by name, role, or skill",
    text: 'Type what you need, like "Figma" or "photographer", and results narrow down as you type.',
  },
  {
    icon: "🏷️",
    title: "Filter with skill chips",
    text: "One tap on a skill such as Design, Writing, or Development shows only the students who have it.",
  },
  {
    icon: "🪪",
    title: "Profiles that show real strengths",
    text: "Each profile gives a student's role, skills, and a short bio, so you know who they are before you reach out.",
  },
  {
    icon: "🔖",
    title: "Save people you like",
    text: "Bookmark the profiles you want to come back to, so a good collaborator is never lost.",
    soon: true,
  },
];

const PRINCIPLES = [
  {
    title: "Privacy first",
    text: "Students should decide what appears on their profile and who can find them. The current version uses fictional profiles and publishes no real contact details.",
  },
  {
    title: "Safe by design",
    text: "Harassment, impersonation, and scams have no place here. Reporting tools, clear community guidelines, and a way to remove abusive profiles are planned before any real launch.",
  },
  {
    title: "Simple and fast",
    text: "A lightweight, easy-to-use directory that works on a phone as well as on a laptop, because that is where students actually are.",
  },
];

export default function About() {
  return (
    <main className="about-page">
      {/* ---------- Hero ---------- */}
      <section className="about-hero">
        <div className="about-container about-hero-inner">
          <span className="about-badge">
            <span className="about-badge-dot" />
            ABOUT SKILLBRIDGE
          </span>
          <h1>
            Every campus is full of talent.
            <span> Most of it stays invisible.</span>
          </h1>
          <p className="about-lead">
            SkillBridge is a student talent directory. It helps university
            students find each other by what they can do, so the right people
            meet, collaborate, and build things together.
          </p>
          <div className="about-actions">
            <Link to="/#explore" className="about-btn about-btn-primary">
              Explore students
            </Link>
            <Link to="/how-it-works" className="about-btn about-btn-ghost">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- The problem ---------- */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-eyebrow">THE PROBLEM</span>
            <h2>Students have skills. Other students just can't find them.</h2>
            <p>
              Universities bring thousands of talented people together, yet
              there is no simple way to see who can do what. That gap hurts both
              sides.
            </p>
          </div>

          <div className="about-grid about-grid-2">
            {/* {PROBLEMS.map((item) => (
              <article className="about-card" key={item.title}>
                <span className="about-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))} */}

            {PROBLEMS.map((item) => {
              const Icon = item.icon;

              return (
                <article className="about-card" key={item.title}>
                  <span className="about-icon" aria-hidden="true">
                    <Icon size={24} strokeWidth={1.8} />
                  </span>

                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Before / after ---------- */}
      <section className="about-section about-section-tint">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-eyebrow">THE DIFFERENCE</span>
            <h2>From asking around to finding in seconds</h2>
          </div>

          <div className="about-compare">
            <div className="about-compare-col about-compare-before">
              <h3>Without SkillBridge</h3>
              <ul>
                <li>Post in group chats and wait for replies</li>
                <li>Only work with friends and classmates</li>
                <li>Talented students never get noticed</li>
                <li>Good ideas stall for lack of the right teammate</li>
              </ul>
            </div>
            <div className="about-compare-col about-compare-after">
              <h3>With SkillBridge</h3>
              <ul>
                <li>Search a skill and see who has it instantly</li>
                <li>Meet collaborators across departments and levels</li>
                <li>Every student gets a place to be seen</li>
                <li>Projects start with the right people on board</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The solution ---------- */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-eyebrow">OUR SOLUTION</span>
            <h2>A bridge between skill and opportunity</h2>
            <p>
              SkillBridge puts every student's abilities in one place that is
              easy to search, so finding the right person feels effortless.
            </p>
          </div>

          <div className="about-grid about-grid-4">
            {SOLUTIONS.map((item) => (
              <article
                className="about-card about-card-solution"
                key={item.title}
              >
                <span className="about-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <h3>
                  {item.title}
                  {item.soon && <span className="about-soon">Coming soon</span>}
                </h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Who it's for ---------- */}
      <section className="about-section about-section-tint">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-eyebrow">WHO IT'S FOR</span>
            <h2>Built for both sides of every collaboration</h2>
          </div>

          <div className="about-grid about-grid-2">
            <article className="about-audience">
              <h3>Students with a skill to share</h3>
              <p>
                Developers, designers, writers, photographers, video editors,
                and more. Get found for what you do best, even if you are new on
                campus or not the loudest voice in the room.
              </p>
            </article>
            <article className="about-audience">
              <h3>Students looking for the right person</h3>
              <p>
                Need a designer for your project, a developer for your idea, or
                a writer for your magazine? Discover people with the exact skill
                you need, in one search.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- Principles ---------- */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-eyebrow">WHAT WE STAND FOR</span>
            <h2>A community students can trust</h2>
          </div>

          <div className="about-grid about-grid-3">
            {PRINCIPLES.map((item) => (
              <article className="about-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Where we are ---------- */}
      <section className="about-section about-section-tight">
        <div className="about-container">
          <div className="about-status">
            <span className="about-eyebrow">WHERE WE ARE TODAY</span>
            <h2>An early version, growing step by step</h2>
            <p>
              SkillBridge is currently a working prototype. The students you see
              are fictional sample profiles, and no real student information is
              collected. Searching and filtering work today. Opening full
              profiles and saving favourites are on the way.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="about-section about-section-tight">
        <div className="about-container">
          <div className="about-cta">
            <h2>Ready to find your next collaborator?</h2>
            <p>
              Browse the directory and see how easy it is to make the right
              connection.
            </p>
            <div className="about-actions about-actions-center">
              <Link to="/#explore" className="about-btn about-btn-light">
                Explore students
              </Link>
              <Link to="/how-it-works" className="about-btn about-btn-outline">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
