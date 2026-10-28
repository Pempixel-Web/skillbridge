import SearchBar from "./SearchBar.jsx";
import SkillFilter from "./SkillFilter.jsx";
import { SKILLS } from "../data/skills.js";
import "./Hero.css";

export default function Hero({
  search = "",
  setSearch = () => {},
  activeSkill = "All skills",
  setActiveSkill = () => {},
}) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <span className="hero-badge">
            <span className="badge-dot" />
            STUDENT TALENT DIRECTORY
          </span>

          <h1>
            Discover talented
            <span> students around you.</span>
          </h1>

          <p className="hero-description">
            Find skills, explore student profiles, and discover your next
            collaborator.
          </p>

          <SearchBar value={search} onChange={setSearch} />

          {/* Popular Div */}
          <SkillFilter
            skills={SKILLS}
            activeSkill={activeSkill}
            onChange={setActiveSkill}
          />
        </div>

        <div className="hero-visual">
          <img
            src="https://res.cloudinary.com/rclvnovx/image/upload/v1792151342/Real_Skills_Real_People_Bigger_Ideas.png"
            alt="Students showcasing their skills and connecting with other students"
          />
        </div>
      </div>
    </section>
  );
}
