import { Link } from "react-router-dom";
import "./Account.css";

export default function Guidelines() {
  return (
    <main className="account-page">
      <div className="account-container narrow">
        <article className="account-card legal">
          <h1>Community Guidelines &amp; Privacy Notice</h1>
          <p className="muted">Last updated: October 2026</p>

          <h2>Be real, be respectful</h2>
          <ul>
            <li>Use your own name and your own photo. No impersonation or fake profiles.</li>
            <li>Treat every student with respect. Harassment, bullying, hate speech and unwanted romantic messages are not allowed.</li>
            <li>No spam, scams, or requests for money, passwords or private information.</li>
            <li>Only share work and skills that are truly yours.</li>
          </ul>

          <h2>Your information</h2>
          <ul>
            <li><strong>What we store:</strong> your name, university email, profile details (role, department, level, skills, bio, photo), your optional contact link, and the students you save.</li>
            <li><strong>What others see:</strong> your profile card, based on the visibility you choose (Public, Students only, or Hidden). Your email is never shown. Your contact link is only visible to logged-in students.</li>
            <li><strong>Your control:</strong> you can edit your profile, change your visibility, or permanently delete your account at any time from the Profile page.</li>
            <li>We don't sell your data.</li>
          </ul>

          <h2>Reporting and removal</h2>
          <p>
            See something that breaks these rules? Use <strong>Report profile</strong> on
            any student's page. Reports are reviewed, and profiles that break the rules
            may be removed.
          </p>

          <h2>Questions?</h2>
          <p>Email <a href="mailto:tech.pempixel@gmail.com">tech.pempixel@gmail.com</a>.</p>

          <p><Link to="/">← Back to SkillBridge</Link></p>
        </article>
      </div>
    </main>
  );
}
