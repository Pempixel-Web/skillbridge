import { useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import StudentCard from "../components/StudentCard.jsx";
import { fetchStudents } from "../api/students.js";

export default function Directory() {
  // --- Filter state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All skills");

  // --- Data-loading state ---
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "success"
  const [attempt, setAttempt] = useState(0); // bump this to retry

  // Fetch students (re-runs whenever `attempt` changes)
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await fetchStudents({
          signal: controller.signal,
          attempt,
        });
        setStudents(data);
        setStatus("success");
      } catch (err) {
        if (err.name === "AbortError") return; // we cancelled on purpose
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, [attempt]);

  function handleRetry() {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }

  // Real-time filter logic for search input & filter pill chips
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesSkill =
      selectedSkill === "All skills" || student.skills.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  // Decide what to show. Order matters: each branch assumes the earlier ones were false.
  let content;
  if (status === "loading") {
    content = <Message role="status">Loading students…</Message>;
  } else if (status === "error") {
    content = (
      <Message role="alert" title="Couldn't load students.">
        Check your connection and try again.
        <br />
        <button onClick={handleRetry} style={{ marginTop: "16px" }}>
          Try again
        </button>
      </Message>
    );
  } else if (students.length === 0) {
    content = (
      <Message title="No students have joined yet.">Check back soon.</Message>
    );
  } else if (filteredStudents.length === 0) {
    content = (
      <Message title="No students found matching your criteria.">
        Try adjusting your search query or choosing a different skill filter.
      </Message>
    );
  } else {
    content = (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    );
  }

  return (
    <main className="directory-page">
      {/* Hero Section with interactive search and skill filter props */}
      <Hero
        search={searchQuery}
        setSearch={setSearchQuery}
        activeSkill={selectedSkill}
        setActiveSkill={setSelectedSkill}
      />

      {/* Explore Students Grid Section */}
      <section
        className="explore-section"
        style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 4.3%" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0b1e43" }}>
            Explore Students
          </h2>
          {status === "success" && (
            <span
              style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}
            >
              Showing {filteredStudents.length} student
              {filteredStudents.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {content}
      </section>
    </main>
  );
}

// Small helper for loading / error / empty messages (same file, not exported)
function Message({ title, children, role }) {
  return (
    <div
      role={role}
      style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}
    >
      {title && <p style={{ fontSize: "18px", fontWeight: "600" }}>{title}</p>}
      <p style={{ fontSize: "14px", marginTop: "8px" }}>{children}</p>
    </div>
  );
}
