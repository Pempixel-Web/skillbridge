import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCard.css";
import { useAuth } from "../context/useAuth.js";
import { setPending } from "../lib/pendingAction.js";

export default function StudentCard({ student }) {
  const { user, isComplete, isSaved, setSaved } = useAuth();
  const navigate = useNavigate();
  const [saveError, setSaveError] = useState("");

  const saved = isSaved(student.id);
  const isMe = user?.id === student.id;

  // Guests are sent to sign up (we remember what they wanted to do).
  // Students who haven't finished their profile are sent to onboarding.
  function gate(pending) {
    setPending(pending);
    navigate(user ? "/onboarding" : "/signup");
  }

  async function handleSave() {
    setSaveError("");
    if (!user || !isComplete) {
      return gate({ next: "/#explore", saveProfileId: student.id });
    }
    try {
      await setSaved(student.id, !saved);
    } catch {
      setSaveError("Couldn't save. Try again.");
    }
  }

  function handleView() {
    const target = `/students/${student.id}`;
    if (!user || !isComplete) return gate({ next: target });
    navigate(target);
  }

  return (
    <div className="student-card">
      {/* Top Header: Avatar & Bookmark Icon */}
      <div className="card-header">
        <img
          src={
            student.avatar ||
            "https://res.cloudinary.com/rclvnovx/image/upload/v1792170963/Screenshot_2026-10-16_181518.png"
          }
          alt={student.name}
          className="student-avatar"
        />
        {!isMe && (
          <button
            className="bookmark-btn"
            onClick={handleSave}
            aria-label={
              saved
                ? `Remove ${student.name} from saved`
                : `Save ${student.name}`
            }
            aria-pressed={saved}
            style={saved ? { color: "#3b4df5" } : undefined}
          >
            <svg
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className="bookmark-icon"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        )}
      </div>

      {/* Student Info */}
      <h3 className="student-name">{student.name}</h3>
      <p className="student-role">{student.role}</p>
      {(student.department || student.level) && (
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
          {[student.department, student.level].filter(Boolean).join(" · ")}
        </p>
      )}

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

      {saveError && (
        <p
          role="alert"
          style={{ color: "#b42318", fontSize: 12, margin: "0 0 8px" }}
        >
          {saveError}
        </p>
      )}

      {/* View Profile Action */}
      <button className="view-profile-btn" onClick={handleView}>
        {isMe ? "View my profile" : "View profile"} <span>→</span>
      </button>
    </div>
  );
}
