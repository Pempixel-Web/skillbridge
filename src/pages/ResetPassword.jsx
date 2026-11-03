import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { useAuth } from "../context/useAuth.js";
import { friendlyAuthError } from "../lib/authErrors.js";
import "./Auth.css";

export default function ResetPassword() {
  const { user, loading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => navigate("/", { replace: true }), 1800);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <AuthLayout title="Reset your password">
        <p className="auth-hint" role="status">Checking your reset link…</p>
      </AuthLayout>
    );
  }

  // The reset email link logs the student in temporarily. No session = bad / expired link.
  if (!user) {
    return (
      <AuthLayout
        title="Link expired"
        subtitle="This password reset link is invalid or has expired."
        footer={<Link to="/login">Back to log in</Link>}
      >
        <Link to="/forgot-password" className="btn-primary btn-link">
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Choose a new password" subtitle="Make it at least 8 characters.">
      {done ? (
        <p className="form-success" role="status">
          Password updated. Taking you to SkillBridge…
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <PasswordField
            id="new-password"
            label="New password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            showStrength
            disabled={busy}
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Update password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
