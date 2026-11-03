import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const STEPS = [
  { title: "The basics", subtitle: "Tell students who you are." },
  { title: "Your skills", subtitle: "This is how people will discover you." },
  { title: "Almost done", subtitle: "Add a photo, a bio, and choose your privacy." },
];

export default function Onboarding() {
  const { user, profile, isComplete, refreshProfile, finishAuthFlow } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => formFromProfile(profile));
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [busy, setBusy] = useState(false);
  const finishing = useRef(false);

  // Already finished? Nothing to do here.
  useEffect(() => {
    if (isComplete && !finishing.current) navigate("/", { replace: true });
  }, [isComplete, navigate]);

  // Keep any existing contact link if the student is resuming
  useEffect(() => {
    if (!user) return;
    fetchContact(user.id).then((link) => {
      if (link) setForm((f) => (f.contact_link ? f : { ...f, contact_link: link }));
    });
  }, [user]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  function validateStep(n) {
    if (n === 0) return validateBasics(form);
    if (n === 1) return validateSkills(form);
    return validateAbout(form);
  }

  function next() {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0 });
    }
  }

  async function finish() {
    const e = validateStep(2);
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    setSaveError("");
    finishing.current = true;
    try {
      await saveOwnProfile(user.id, form, { complete: true });
      await refreshProfile();
      navigate(await finishAuthFlow(user.id), { replace: true });
    } catch (err) {
      finishing.current = false;
      setSaveError(err.message || "Couldn't save your profile. Please try again.");
      setBusy(false);
    }
  }

  const last = step === STEPS.length - 1;

  return (
    <main className="auth-page onboarding-page">
      <div className="auth-card onboarding-card">
        <div className="progress" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          <div className="progress-bar">
            <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <span className="progress-text">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        <h1>{STEPS[step].title}</h1>
        <p className="auth-subtitle">{STEPS[step].subtitle}</p>

        {step === 0 && <BasicsSection form={form} set={set} errors={errors} />}
        {step === 1 && <SkillsSection form={form} set={set} errors={errors} />}
        {step === 2 && (
          <AboutSection form={form} set={set} userId={user.id} errors={errors} />
        )}

        {saveError && <p className="form-error" role="alert">{saveError}</p>}

        <div className="wizard-actions">
          {step > 0 ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep((s) => s - 1)}
              disabled={busy}
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {last ? (
            <button type="button" className="btn-primary" onClick={finish} disabled={busy}>
              {busy ? "Saving…" : "Finish & join"}
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={next}>
              Continue
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
