import { createClient } from "@supabase/supabase-js";

// These come from the .env file in the project root (see SETUP_GUIDE.md).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith("http") &&
    !SUPABASE_URL.includes("YOUR-PROJECT-ID") &&
    !SUPABASE_ANON_KEY.includes("YOUR-ANON"),
);

export const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : "https://placeholder.supabase.co",
  isSupabaseConfigured ? SUPABASE_ANON_KEY : "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // handles the link in verification / reset emails
    },
  },
);
