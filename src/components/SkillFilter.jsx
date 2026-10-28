import "./Hero.css";

export default function SkillFilter({ skills, activeSkill, onChange }) {
  return (
    <div className="popular-skills" role="group" aria-label="Filter by skill">
      {skills.map((skill) => (
        <button
          key={skill}
          type="button"
          className={`skill-chip ${activeSkill === skill ? "active" : ""}`}
          aria-pressed={activeSkill === skill}
          onClick={() => onChange(skill)}
        >
          {skill}
        </button>
      ))}
    </div>
  );
}
