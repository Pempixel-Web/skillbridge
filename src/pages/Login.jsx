import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { useAuth } from "../context/useAuth.js";
import { friendlyAuthError } from "../lib/authErrors.js";
import { getPending } from "../lib/pendingAction.js";
import "./Auth.css";

export default function Login() {
  const { signIn, finishAuthFlow } = useAuth();
  const navigate = useNavigate();
  const pending = getPending();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [busy, setBusy] = useState(false);

  let banner = null;
  if (pending?.saveProfileId) banner = "Log in to save this student.";
  else if (pending?.next && pending.next !== "/") banner = "Please log in to continue.";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setUnverified(false);

    if (!email.trim() || !password) return setError("Enter your email and password.");

    setBusy(true);
    try {
      const { profile, userId } = await signIn({ email, password });
      if (!profile?.onboarding_complete) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate(await finishAuthFlow(userId), { replace: true });
      }
    } catch (err) {
      if (err.code === "email_not_confirmed" || /not confirmed/i.test(err.message || "")) {
        setUnverified(true);
      }
      setError(friendlyAuthError(err));
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to view profiles, save students and manage your own."
      banner={banner}
      footer={
        <>
          New to SkillBridge? <Link to="/signup">Create an account</Link>
        </>
      }
    >
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

        <PasswordField value={password} onChange={setPassword} disabled={busy} />

        <div className="auth-row-right">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
            {unverified && (
              <>
                {" "}
                <Link to="/verify-email" state={{ email: email.trim() }}>
                  Resend verification email
                </Link>
              </>
            )}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
