import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/useAuth.js";
import { friendlyAuthError } from "../lib/authErrors.js";
import "./Auth.css";

export default function ForgotPassword() {
  const { sendResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Enter your email address.");
    setBusy(true);
    try {
      await sendResetEmail(email);
      setSent(true);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to choose a new password."
      footer={<Link to="/login">← Back to log in</Link>}
    >
      {sent ? (
        <p className="form-success" role="status">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
          Check your inbox and spam folder. The link expires after a short time.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={busy}
              required
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
