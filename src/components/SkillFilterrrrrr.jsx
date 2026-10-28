import './Hero.css'
export default function skillfilter() {
  return (
    <>
      <div className="popular-skills" aria-label="Filter by skill">
        {skills.map((skill) => (
          <button
            key={skill}
            type="button"
            className={`skill-chip ${activeSkill === skill ? "active" : ""}`}
            onClick={() => setActiveSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>
    </>
  );
}
