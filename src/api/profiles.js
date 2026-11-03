// Everything about the logged-in student's own data: profile, avatar,
// bookmarks, reports and account deletion.
import { supabase } from "../lib/supabaseClient.js";
import { toStudent } from "./students.js";
import { AVATAR_MAX_MB } from "../config.js";

export async function fetchOwnProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchContact(profileId) {
  const { data } = await supabase
    .from("profile_contacts")
    .select("contact_link")
    .eq("profile_id", profileId)
    .maybeSingle();
  return data?.contact_link || "";
}

export async function saveOwnProfile(userId, form, { complete = false } = {}) {
  const payload = {
    full_name: form.full_name.trim(),
    role: form.role.trim(),
    department: form.department.trim(),
    level: form.level,
    bio: form.bio.trim(),
    avatar_url: form.avatar_url || null,
    skills: form.skills,
    visibility: form.visibility,
  };
  if (complete) payload.onboarding_complete = true;

  const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
  if (error) throw error;

  const link = (form.contact_link || "").trim();
  if (link) {
    const { error: cErr } = await supabase
      .from("profile_contacts")
      .upsert({ profile_id: userId, contact_link: link });
    if (cErr) throw cErr;
  } else {
    await supabase.from("profile_contacts").delete().eq("profile_id", userId);
  }
}

export async function uploadAvatar(userId, file) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Please choose a JPG, PNG or WebP image.");
  }
  if (file.size > AVATAR_MAX_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${AVATAR_MAX_MB}MB.`);
  }
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/avatar-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { cacheControl: "3600", upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

/* ---------- Bookmarks ---------- */
export async function fetchSavedIds(userId) {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select("profile_id")
    .eq("user_id", userId);
  if (error) throw error;
  return (data || []).map((r) => r.profile_id);
}

export async function addSaved(userId, profileId) {
  const { error } = await supabase
    .from("saved_profiles")
    .upsert({ user_id: userId, profile_id: profileId }, { ignoreDuplicates: true });
  if (error) throw error;
}

export async function removeSaved(userId, profileId) {
  const { error } = await supabase
    .from("saved_profiles")
    .delete()
    .eq("user_id", userId)
    .eq("profile_id", profileId);
  if (error) throw error;
}

export async function fetchSavedStudents(userId) {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select(
      "created_at, profiles(id, full_name, role, department, level, bio, avatar_url, skills)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).filter((r) => r.profiles).map((r) => toStudent(r.profiles));
}

/* ---------- Reports & account ---------- */
export async function reportProfile(reporterId, profileId, reason, details) {
  const { error } = await supabase.from("reports").insert({
    reporter_id: reporterId,
    profile_id: profileId,
    reason,
    details: (details || "").trim().slice(0, 500),
  });
  if (error) throw error;
}

export async function deleteMyAccount() {
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
}
