// When a student clicks an email link that failed (expired, already used, wrong URL),
// Supabase sends them back with the error in the URL hash, e.g.
//   /#error=access_denied&error_code=otp_expired&error_description=...
// We capture it at startup (before Supabase clears the URL) so we can explain it.

function readLinkError() {
  try {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.includes("error")) return null;
    const params = new URLSearchParams(hash);
    const code = params.get("error_code");
    const error = params.get("error");
    if (!code && !error) return null;
    return { code: code || error };
  } catch {
    return null;
  }
}

export const initialLinkError = readLinkError();
