import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { fetchContact, saveOwnProfile } from "../api/profiles.js";
import { AboutSection, BasicsSection, SkillsSection } from "../components/ProfileSections.jsx";
import {
  formFromProfile,
  validateAbout,
  validateBasics,
  validateSkills,
} from "../lib/profileForm.js";
import "./Auth.css";
import "./Account.css";

export default function Profile() {
  const { user, profile, refreshProfile, signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => formFromProfile(profile));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let active = true;
    fetchContact(user.id).then((link) => {
      if (active && link) setForm((f) => ({ ...f, contact_link: link }));
    });
    return () => {
      active = false;
    };
  }, [user.id]);

  const set = (field, value) => {
    setStatus({ type: "", text: "" });
    setForm((f) => ({ ...f, [field]: value }));
  };

  async function handleSave(e) {
    e.preventDefault();
    const all = { ...validateBasics(form), ...validateSkills(form), ...validateAbout(form) };
    setErrors(all);
    if (Object.keys(all).length) {
      return setStatus({ type: "error", text: "Please fix the highlighted fields." });
    }
    setBusy(true);
    try {
      await saveOwnProfile(user.id, form);
      await refreshProfile();
      setStatus({ type: "success", text: "Profile saved." });
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Couldn't save. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  async function handleDelete() {
    setDeleteError("");
    setDeleting(true);
    try {
      await deleteAccount();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.message || "Couldn't delete your account. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <main className="account-page">
      <div className="account-container">
        <header className="account-header">
          <div>
            <h1>My profile</h1>
            <p>{user.email}</p>
          </div>
          <div className="account-header-actions">
            <Link to={`/students/${user.id}`} className="btn-secondary btn-small btn-link">
              View my public card
            </Link>
            <button type="button" className="btn-secondary btn-small" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <form onSubmit={handleSave} noValidate className="account-card">
          <h2>The basics</h2>
          <BasicsSection form={form} set={set} errors={errors} />

          <h2>Skills</h2>
          <SkillsSection form={form} set={set} errors={errors} />

          <h2>About you &amp; privacy</h2>
          <AboutSection form={form} set={set} userId={user.id} errors={errors} />

          {status.text && (
            <p
              className={status.type === "success" ? "form-success" : "form-error"}
              role={status.type === "success" ? "status" : "alert"}
            >
              {status.text}
            </p>
          )}

          <div className="save-bar">
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>

        <section className="account-card danger-zone">
          <h2>Delete account</h2>
          <p>
            This permanently removes your account, profile and saved students. This
            can't be undone.
          </p>
          <label htmlFor="confirm-delete" className="field-hint">
            Type <strong>DELETE</strong> to confirm
          </label>
          <div className="danger-row">
            <input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
            <button
              type="button"
              className="btn-danger"
              disabled={confirmText !== "DELETE" || deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete my account"}
            </button>
          </div>
          {deleteError && <p className="form-error" role="alert">{deleteError}</p>}
        </section>
      </div>
    </main>
  );
}
