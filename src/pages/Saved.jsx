import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { fetchSavedStudents } from "../api/profiles.js";
import StudentCard from "../components/StudentCard.jsx";
import StateMessage from "../components/StateMessage.jsx";
import "./Account.css";

export default function Saved() {
  const { user, savedIds } = useAuth();
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchSavedStudents(user.id)
      .then((list) => {
        if (!active) return;
        setStudents(list);
        setStatus("success");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [user.id, attempt]);

  // Cards disappear immediately when un-bookmarked
  const visible = students.filter((s) => savedIds.has(s.id));

  let content;
  if (status === "loading") {
    content = <StateMessage role="status">Loading your saved students…</StateMessage>;
  } else if (status === "error") {
    content = (
      <StateMessage role="alert" title="Couldn't load your saved students.">
        Check your connection and try again.
        <br />
        <button
          className="btn-secondary btn-small"
          style={{ marginTop: 16 }}
          onClick={() => {
            setStatus("loading");
            setAttempt((n) => n + 1);
          }}
        >
          Try again
        </button>
      </StateMessage>
    );
  } else if (visible.length === 0) {
    content = (
      <StateMessage title="Nothing saved yet.">
        Tap the bookmark on a student's card to keep them here.
        <br />
        <Link to="/#explore" className="btn-primary btn-link" style={{ marginTop: 16 }}>
          Explore students
        </Link>
      </StateMessage>
    );
  } else {
    content = (
      <div className="card-grid">
        {visible.map((s) => (
          <StudentCard key={s.id} student={s} />
        ))}
      </div>
    );
  }

  return (
    <main className="account-page">
      <div className="account-container">
        <header className="account-header">
          <div>
            <h1>Saved students</h1>
            <p>People you want to collaborate with.</p>
          </div>
        </header>
        {content}
      </div>
    </main>
  );
}
