// Turn raw Supabase errors into messages a student can understand.
export function friendlyAuthError(error) {
  const msg = (error?.message || "").toLowerCase();
  const code = error?.code || "";
  if (code === "email_not_confirmed" || msg.includes("email not confirmed"))
    return "Please verify your email first. Check your inbox (and spam folder).";
  if (msg.includes("invalid login credentials"))
    return "Email or password is incorrect.";
  if (msg.includes("rate limit") || code === "over_email_send_rate_limit" || error?.status === 429)
    return "Too many attempts. Please wait a few minutes and try again.";
  if (msg.includes("password") && msg.includes("least"))
    return "Password is too short. Use at least 8 characters.";
  if (msg.includes("same password") || code === "same_password")
    return "Your new password must be different from the old one.";
  if (msg.includes("database error saving new user") || msg.includes("university email"))
    return "Please sign up with your university email address.";
  if (msg.includes("failed to fetch") || msg.includes("network"))
    return "Network problem. Check your connection and try again.";
  return error?.message || "Something went wrong. Please try again.";
}
