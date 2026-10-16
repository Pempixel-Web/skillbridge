import "./StudentCard.css";

export default function StudentCard({ student }) {
  return (
    <div className="student-card">
      {/* Top Header: Avatar & Bookmark Icon */}
      <div className="card-header">
        <img
          src={student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"}
          alt={student.name}
          className="student-avatar"
        />
        <button className="bookmark-btn" aria-label="Save profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bookmark-icon">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {/* Student Info */}
      <h3 className="student-name">{student.name}</h3>
      <p className="student-role">{student.role}</p>

      {/* Skill Tags */}
      <div className="student-skills">
        {student.skills.map((skill, index) => (
          <span key={index} className="card-skill-tag">
            {skill}
          </span>
        ))}
      </div>

      {/* Bio / Description */}
      <p className="student-bio">{student.bio}</p>

      {/* View Profile Action */}
      <button className="view-profile-btn">
        View profile <span>→</span>
      </button>
    </div>
  );
}