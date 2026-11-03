// Central place for settings you may want to change.

export const APP_NAME = "SkillBridge";

// Only allow these email domains to sign up. Leave the array EMPTY to allow any email.
// Example: ["unilag.edu.ng"]  (also matches subdomains like st.unilag.edu.ng)
export const ALLOWED_EMAIL_DOMAINS = [];

export const LEVELS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
  "Postgraduate",
  "Graduate / Alumni",
];

export const MAX_SKILLS = 8;
export const BIO_MAX = 300;
export const AVATAR_MAX_MB = 2;

export const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    hint: "Anyone visiting SkillBridge can see my card. Best for being discovered.",
  },
  {
    value: "members",
    label: "Students only",
    hint: "Only logged-in students can see my profile.",
  },
  {
    value: "hidden",
    label: "Hidden",
    hint: "Nobody can find me. I can switch this on later.",
  },
];

export const REPORT_REASONS = [
  { value: "fake_or_impersonation", label: "Fake profile or impersonation" },
  { value: "harassment", label: "Harassment or unwanted messages" },
  { value: "spam_or_scam", label: "Spam or scam" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "other", label: "Something else" },
];

export function isAllowedEmail(email) {
  if (!ALLOWED_EMAIL_DOMAINS.length) return true;
  const e = String(email).trim().toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some(
    (d) => e.endsWith("@" + d) || e.endsWith("." + d),
  );
}
