import { BIO_MAX } from "../config.js";

/* ---------- state helper ---------- */
export function formFromProfile(profile, contactLink = "") {
  return {
    full_name: profile?.full_name || "",
    role: profile?.role || "",
    department: profile?.department || "",
    level: profile?.level || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    visibility: profile?.visibility || "public",
    contact_link: contactLink || "",
  };
}

/* ---------- validation ---------- */
export function validateBasics(f) {
  const e = {};
  if (f.full_name.trim().length < 2) e.full_name = "Enter your full name.";
  if (f.role.trim().length < 2) e.role = "Tell us what you do, e.g. “UI/UX Designer”.";
  if (f.department.trim().length < 2) e.department = "Enter your department or course.";
  if (!f.level) e.level = "Choose your level.";
  return e;
}

export function validateSkills(f) {
  const e = {};
  if (f.skills.length === 0) e.skills = "Pick at least one skill.";
  return e;
}

export function validateAbout(f) {
  const e = {};
  if (f.bio.length > BIO_MAX) e.bio = `Keep your bio under ${BIO_MAX} characters.`;
  const link = f.contact_link.trim();
  if (link) {
    try {
      const u = new URL(link);
      if (!["http:", "https:"].includes(u.protocol)) throw new Error();
    } catch {
      e.contact_link = "Enter a full link starting with https://";
    }
  }
  return e;
}
