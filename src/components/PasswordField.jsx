import { useState } from "react";

function strength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 8) return { level: 0, label: "Too short" };
  if (score <= 2) return { level: 1, label: "Weak" };
  if (score === 3) return { level: 2, label: "Okay" };
  return { level: 3, label: "Strong" };
}

export default function PasswordField({
  id = "password",
  label = "Password",
  value,
  onChange,
  autoComplete = "current-password",
  showStrength = false,
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);
  const s = strength(value);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={showStrength ? "At least 8 characters" : "Your password"}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {showStrength && value && (
        <div className="strength" aria-live="polite">
          <div className="strength-bars">
            {[1, 2, 3].map((n) => (
              <span key={n} className={s.level >= n ? `on level-${s.level}` : ""} />
            ))}
          </div>
          <span className="strength-label">{s.label}</span>
        </div>
      )}
    </div>
  );
}
