import { useRef, useState } from "react";
import { SKILLS } from "../data/skills.js";
import { uploadAvatar } from "../api/profiles.js";
import { BIO_MAX, LEVELS, MAX_SKILLS, VISIBILITY_OPTIONS } from "../config.js";

const SUGGESTED = SKILLS.filter((s) => s !== "All skills");

function FieldError({ id, message }) {
  return message ? (
    <p className="field-error" id={id} role="alert">
      {message}
    </p>
  ) : null;
}

/* ---------- Section 1: the basics ---------- */
export function BasicsSection({ form, set, errors = {} }) {
  return (
    <div className="form-section">
      <div className="field">
        <label htmlFor="full_name">Full name</label>
        <input
          id="full_name"
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          maxLength={80}
          aria-invalid={!!errors.full_name}
        />
        <FieldError message={errors.full_name} />
      </div>

      <div className="field">
        <label htmlFor="role">What do you do?</label>
        <input
          id="role"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          placeholder="e.g. Frontend Developer, Photographer, UI/UX Designer"
          maxLength={80}
          aria-invalid={!!errors.role}
        />
        <FieldError message={errors.role} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="department">Department / course</label>
          <input
            id="department"
            value={form.department}
            onChange={(e) => set("department", e.target.value)}
            placeholder="e.g. Computer Science"
            maxLength={100}
            aria-invalid={!!errors.department}
          />
          <FieldError message={errors.department} />
        </div>

        <div className="field">
          <label htmlFor="level">Level</label>
          <select
            id="level"
            value={form.level}
            onChange={(e) => set("level", e.target.value)}
            aria-invalid={!!errors.level}
          >
            <option value="">Select level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <FieldError message={errors.level} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Section 2: skills ---------- */
export function SkillsSection({ form, set, errors = {} }) {
  const [custom, setCustom] = useState("");
  const [note, setNote] = useState("");
  const atMax = form.skills.length >= MAX_SKILLS;

  function toggle(skill) {
    setNote("");
    if (form.skills.includes(skill)) {
      set("skills", form.skills.filter((s) => s !== skill));
    } else if (!atMax) {
      set("skills", [...form.skills, skill]);
    } else {
      setNote(`You can pick up to ${MAX_SKILLS} skills.`);
    }
  }

  function addCustom() {
    const value = custom.trim().replace(/\s+/g, " ").slice(0, 30);
    if (value.length < 2) return;
    const exists = form.skills.some((s) => s.toLowerCase() === value.toLowerCase());
    if (exists) return setCustom("");
    if (atMax) return setNote(`You can pick up to ${MAX_SKILLS} skills.`);
    set("skills", [...form.skills, value]);
    setCustom("");
    setNote("");
  }

  const extras = form.skills.filter((s) => !SUGGESTED.includes(s));

  return (
    <div className="form-section">
      <p className="form-help">
        Choose the skills people can find you by. Picked {form.skills.length}/{MAX_SKILLS}.
      </p>

      <div className="chip-grid" role="group" aria-label="Skills">
        {[...SUGGESTED, ...extras].map((skill) => {
          const on = form.skills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              className={`pick-chip ${on ? "on" : ""}`}
              aria-pressed={on}
              onClick={() => toggle(skill)}
            >
              {on && <span aria-hidden="true">✓ </span>}
              {skill}
            </button>
          );
        })}
      </div>

      {/* A div (not a form) because this section can sit inside another form */}
      <div className="custom-skill">
        <label htmlFor="custom-skill" className="sr-only">
          Add another skill
        </label>
        <input
          id="custom-skill"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Add another skill, e.g. React, Figma, Copywriting"
          maxLength={30}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <button type="button" className="btn-secondary btn-small" onClick={addCustom}>
          Add
        </button>
      </div>

      {note && <p className="field-hint">{note}</p>}
      <FieldError message={errors.skills} />
    </div>
  );
}

/* ---------- Section 3: about you, photo, privacy ---------- */
export function AboutSection({ form, set, userId, errors = {} }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadAvatar(userId, file);
      set("avatar_url", url);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  const initial = (form.full_name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="form-section">
      <div className="avatar-row">
        {form.avatar_url ? (
          <img src={form.avatar_url} alt="Your profile" className="avatar-preview" />
        ) : (
          <span className="avatar-preview avatar-fallback" aria-hidden="true">
            {initial}
          </span>
        )}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            hidden
          />
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : form.avatar_url ? "Change photo" : "Upload photo"}
          </button>
          {form.avatar_url && (
            <button
              type="button"
              className="btn-text"
              onClick={() => set("avatar_url", "")}
            >
              Remove
            </button>
          )}
          <p className="field-hint">JPG, PNG or WebP, up to 2MB. Optional.</p>
          {uploadError && <p className="field-error" role="alert">{uploadError}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="bio">
          Short bio <span className="optional">(optional)</span>
        </label>
        <textarea
          id="bio"
          rows={4}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          maxLength={BIO_MAX + 50}
          placeholder="What do you love building or creating? What kind of projects do you want to join?"
          aria-invalid={!!errors.bio}
        />
        <div className="counter" data-over={form.bio.length > BIO_MAX}>
          {form.bio.length}/{BIO_MAX}
        </div>
        <FieldError message={errors.bio} />
      </div>

      <div className="field">
        <label htmlFor="contact_link">
          Link for people to reach you <span className="optional">(optional)</span>
        </label>
        <input
          id="contact_link"
          type="url"
          value={form.contact_link}
          onChange={(e) => set("contact_link", e.target.value)}
          placeholder="https://linkedin.com/in/you  or  https://wa.me/234..."
          maxLength={200}
          aria-invalid={!!errors.contact_link}
        />
        <p className="field-hint">
          LinkedIn, portfolio, WhatsApp or any link you're comfortable sharing. Only
          logged-in students can see it. Don't share anything private.
        </p>
        <FieldError message={errors.contact_link} />
      </div>

      <fieldset className="visibility">
        <legend>Who can find your profile?</legend>
        {VISIBILITY_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`radio-card ${form.visibility === opt.value ? "on" : ""}`}
          >
            <input
              type="radio"
              name="visibility"
              value={opt.value}
              checked={form.visibility === opt.value}
              onChange={() => set("visibility", opt.value)}
            />
            <span>
              <strong>{opt.label}</strong>
              <small>{opt.hint}</small>
            </span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
