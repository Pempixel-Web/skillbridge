import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/useAuth.js";
import { friendlyAuthError } from "../lib/authErrors.js";
import "./Auth.css";

const COOLDOWN = 60;

export default function VerifyEmail() {
  const { resendVerification } = useAuth();
  const location = useLocation();

  let email = location.state?.email || "";
  if (!email) {
    try {
      email = localStorage.getItem("skillbridge:verify-email") || "";
    } catch {
      /* ignore */
    }
  }

  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    setError("");
    setMessage("");
    try {
      await resendVerification(email);
      setMessage("Verification email sent. Check your inbox and spam folder.");
      setCooldown(COOLDOWN);
    } catch (err) {
      setError(friendlyAuthError(err));
    }
  }

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={
        email
          ? `We sent a verification link to ${email}. Click it to activate your account.`
          : "We sent you a verification link. Click it to activate your account."
      }
      footer={
        <>
          Already verified? <Link to="/login">Log in</Link>
        </>
      }
    >
      {/* <div className="verify-icon" aria-hidden="true">✉️</div> */}

      <ol className="verify-steps">
        <li>Open the email from SkillBridge.</li>
        <li>
          Click <strong>Confirm your email</strong>.
        </li>
        <li>Finish setting up your profile.</li>
      </ol>

      {message && (
        <p className="form-success" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {email ? (
        <button
          type="button"
          className="btn-secondary"
          onClick={handleResend}
          disabled={cooldown > 0}
        >
          {cooldown > 0
            ? `Resend email in ${cooldown}s`
            : "Resend verification email"}
        </button>
      ) : (
        <Link to="/signup" className="btn-secondary btn-link">
          Back to sign up
        </Link>
      )}

      <p className="auth-hint">
        Can't find it? Check your spam folder, or{" "}
        <Link to="/signup">use a different email</Link>.
      </p>
    </AuthLayout>
  );
}
