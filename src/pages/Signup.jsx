import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { useAuth } from "../context/useAuth.js";
import { friendlyAuthError } from "../lib/authErrors.js";
import { ALLOWED_EMAIL_DOMAINS, isAllowedEmail } from "../config.js";
import { getPending } from "../lib/pendingAction.js";
import "./Auth.css";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const pending = getPending();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  let banner = null;
  if (pending?.saveProfileId) banner = "Create a free account to save this student.";
  else if (pending?.next?.startsWith("/students/"))
    banner = "Create a free account to view full student profiles.";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 2) return setError("Please enter your full name.");
    if (!isAllowedEmail(email))
      return setError(
        `Please use your university email (${ALLOWED_EMAIL_DOMAINS.map((d) => "@" + d).join(", ")}).`,
      );
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (!agree) return setError("Please accept the Community Guidelines to continue.");

    setBusy(true);
    try {
      const { needsVerification } = await signUp({ fullName, email, password });
      try {
        localStorage.setItem("skillbridge:verify-email", email.trim());
      } catch {
        /* ignore */
      }
      navigate(needsVerification ? "/verify-email" : "/onboarding", {
        replace: true,
        state: { email: email.trim() },
      });
    } catch (err) {
      setError(
        err.code === "already_registered" ? err.message : friendlyAuthError(err),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join your campus talent community. It takes less than a minute."
      banner={banner}
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            maxLength={80}
            placeholder="e.g. Amaka Okafor"
            disabled={busy}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">
            {ALLOWED_EMAIL_DOMAINS.length ? "University email" : "Email address"}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder={ALLOWED_EMAIL_DOMAINS.length ? `you@${ALLOWED_EMAIL_DOMAINS[0]}` : "you@university.edu"}
            disabled={busy}
            required
          />
        </div>

        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          showStrength
          disabled={busy}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={busy}
          />
          <span>
            I agree to the{" "}
            <Link to="/guidelines" target="_blank">
              Community Guidelines &amp; Privacy Notice
            </Link>
            .
          </span>
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
