import { ArrowUpRight } from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { fetchStudentById } from "../api/students.js";
import { fetchContact, reportProfile } from "../api/profiles.js";
import { REPORT_REASONS } from "../config.js";
import "./Auth.css";
import "./Account.css";

export default function StudentProfile() {
  const { id } = useParams();
  const { user, isSaved, setSaved } = useAuth();

  // result is tagged with the id it belongs to, so a stale result is never shown
  const [result, setResult] = useState({
    id: null,
    status: "loading",
    student: null,
    contact: "",
  });
  const status = result.id === id ? result.status : "loading"; // loading | error | notfound | ready
  const student = result.student;
  const contact = result.contact;
  const [saveError, setSaveError] = useState("");

  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [reportMsg, setReportMsg] = useState({ type: "", text: "" });
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const s = await fetchStudentById(id, { signal: controller.signal });
        if (!s)
          return setResult({
            id,
            status: "notfound",
            student: null,
            contact: "",
          });
        const c = await fetchContact(id);
        if (controller.signal.aborted) return;
        setResult({ id, status: "ready", student: s, contact: c });
      } catch (err) {
        if (err.name === "AbortError" || controller.signal.aborted) return;
        setResult({ id, status: "error", student: null, contact: "" });
      }
    })();
    return () => controller.abort();
  }, [id]);

  const isMe = user?.id === id;
  const saved = isSaved(id);

  async function toggleSave() {
    setSaveError("");
    try {
      await setSaved(id, !saved);
    } catch {
      setSaveError("Couldn't update your saved list. Please try again.");
    }
  }

  async function submitReport(e) {
    e.preventDefault();
    if (!reason)
      return setReportMsg({ type: "error", text: "Choose a reason." });
    setReporting(true);
    try {
      await reportProfile(user.id, id, reason, details);
      setReportMsg({
        type: "success",
        text: "Thanks. We've received your report and will review it.",
      });
      setReportOpen(false);
      setReason("");
      setDetails("");
    } catch {
      setReportMsg({
        type: "error",
        text: "Couldn't send your report. Please try again.",
      });
    } finally {
      setReporting(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="account-page">
        <p className="account-state" role="status">
          Loading profile…
        </p>
      </main>
    );
  }

  if (status === "error" || status === "notfound") {
    return (
      <main className="account-page">
        <div className="account-state" role="alert">
          <h1>
            {status === "notfound"
              ? "Profile not found"
              : "Couldn't load this profile"}
          </h1>
          <p>
            {status === "notfound"
              ? "This student may have changed their privacy settings or left SkillBridge."
              : "Check your connection and try again."}
          </p>
          <Link to="/#explore" className="btn-primary btn-link">
            Back to students
          </Link>
        </div>
      </main>
    );
  }

  const initial = student.name.charAt(0).toUpperCase();
  const meta = [student.department, student.level].filter(Boolean).join(" · ");

  return (
    <main className="account-page">
      <div className="account-container narrow">
        <Link to="/#explore" className="back-link">
          ← Back to students
        </Link>

        <article className="account-card profile-view">
          <div className="profile-top">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="profile-avatar"
              />
            ) : (
              <span
                className="profile-avatar avatar-fallback"
                aria-hidden="true"
              >
                {initial}
              </span>
            )}
            <div className="profile-heading">
              <h1>{student.name}</h1>
              {student.role && <p className="profile-role">{student.role}</p>}
              {meta && <p className="profile-meta">{meta}</p>}
            </div>
          </div>

          {student.skills.length > 0 && (
            <>
              <h2>Skills</h2>
              <div className="tag-row">
                {student.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}

          {student.bio && (
            <>
              <h2>About</h2>
              <p className="profile-bio">{student.bio}</p>
            </>
          )}

          <h2>Get in touch</h2>
          {contact ? (
            <a
              href={contact}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn-primary btn-link"
            >
              {/* Contact {student.name.split(" ")[0]} ↗ */}
              Contact {student.name.split(" ")[0]}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : (
            <p className="muted">
              {isMe
                ? "You haven't added a contact link. Add one from your profile page."
                : "This student hasn't shared a contact link yet."}
            </p>
          )}
          {contact && (
            <p className="field-hint">
              This link opens in a new tab. Be respectful, and never share
              passwords or send money to someone you haven't met.
            </p>
          )}

          <div className="profile-actions">
            {isMe ? (
              <Link to="/profile" className="btn-secondary btn-link">
                Edit my profile
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={toggleSave}
                >
                  {saved ? "★ Saved" : "☆ Save student"}
                </button>
                <button
                  type="button"
                  className="btn-text danger-text"
                  onClick={() => {
                    setReportOpen((o) => !o);
                    setReportMsg({ type: "", text: "" });
                  }}
                >
                  Report profile
                </button>
              </>
            )}
          </div>
          {saveError && (
            <p className="form-error" role="alert">
              {saveError}
            </p>
          )}

          {reportMsg.text && !reportOpen && (
            <p
              className={
                reportMsg.type === "success" ? "form-success" : "form-error"
              }
              role={reportMsg.type === "success" ? "status" : "alert"}
            >
              {reportMsg.text}
            </p>
          )}

          {reportOpen && !isMe && (
            <form onSubmit={submitReport} className="report-form" noValidate>
              <h2>Report this profile</h2>
              <div className="field">
                <label htmlFor="reason">What's the problem?</label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="details">
                  More details <span className="optional">(optional)</span>
                </label>
                <textarea
                  id="details"
                  rows={3}
                  maxLength={500}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              {reportMsg.type === "error" && (
                <p className="form-error" role="alert">
                  {reportMsg.text}
                </p>
              )}
              <div className="wizard-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setReportOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-danger"
                  disabled={reporting}
                >
                  {reporting ? "Sending…" : "Send report"}
                </button>
              </div>
            </form>
          )}
        </article>
      </div>
    </main>
  );
}
