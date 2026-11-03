// All "talking to the data source" for the directory lives here.
import { supabase } from "../lib/supabaseClient.js";

// Shape the rest of the app already expects: { id, name, role, bio, skills, avatar }
export function toStudent(row) {
  return {
    id: row.id,
    name: row.full_name || "Unnamed student",
    role: row.role || "",
    department: row.department || "",
    level: row.level || "",
    bio: row.bio || "",
    skills: Array.isArray(row.skills) ? row.skills : [],
    avatar: row.avatar_url || "",
  };
}

const COLUMNS = "id, full_name, role, department, level, bio, avatar_url, skills";

// Directory list. Row Level Security decides what each visitor is allowed to see
// (guests only get "public" profiles; logged-in students also get "students only").
export async function fetchStudents({ signal } = {}) {
  let query = supabase
    .from("profiles")
    .select(COLUMNS)
    .eq("onboarding_complete", true)
    .neq("visibility", "hidden")
    .order("created_at", { ascending: false })
    .limit(200);
  if (signal) query = query.abortSignal(signal);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(toStudent);
}

export async function fetchStudentById(id, { signal } = {}) {
  let query = supabase.from("profiles").select(COLUMNS).eq("id", id).maybeSingle();
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return data ? toStudent(data) : null;
}
