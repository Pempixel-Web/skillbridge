import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { AuthContext } from "./auth-context.js";
import {
  fetchOwnProfile,
  
  fetchSavedIds,
  addSaved,
  removeSaved,
  deleteMyAccount,
} from "../api/profiles.js";
import { clearPending, getPending, safePath } from "../lib/pendingAction.js";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileReady, setProfileReady] = useState(false);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const savedRef = useRef(savedIds);
  useEffect(() => {
    savedRef.current = savedIds;
  }, [savedIds]);

  const user = session?.user ?? null;
  const userId = user?.id ?? null;

  /* ---- 1. Track the Supabase session ---- */
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setSessionChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        // Keep this callback synchronous (Supabase recommends not awaiting inside it)
        setSession(newSession ?? null);
        setSessionChecked(true);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ---- 2. Load profile + bookmarks whenever the logged-in user changes ---- */
  useEffect(() => {
    if (!sessionChecked) return;
    let cancelled = false;

    async function load() {
      if (!userId) {
        setProfile(null);
        setSavedIds(new Set());
        setProfileReady(true);
        return;
      }
      setProfileReady(false);
      try {
        const [p, ids] = await Promise.all([
          fetchOwnProfile(userId),
          fetchSavedIds(userId),
        ]);
        if (cancelled) return;
        setProfile(p);
        setSavedIds(new Set(ids));
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setProfileReady(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId, sessionChecked]);

  const loading = !sessionChecked || !profileReady;

  /* ---- Auth actions ---- */
  const signUp = useCallback(async ({ fullName, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });
    if (error) throw error;

    // Supabase hides whether an email is already registered by returning a user
    // with no identities. Tell the student gently.
    if (
      data.user &&
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0
    ) {
      const err = new Error(
        "An account with this email may already exist. Try logging in instead.",
      );
      err.code = "already_registered";
      throw err;
    }
    // session is null when email confirmation is required (the normal setup)
    return { needsVerification: !data.session };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    const p = await fetchOwnProfile(data.user.id).catch(() => null);
    return { profile: p, userId: data.user.id };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    clearPending();
  }, []);

  const resendVerification = useCallback(async (email) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) throw error;
  }, []);

  const sendResetEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!userId) return null;
    const p = await fetchOwnProfile(userId);
    setProfile(p);
    return p;
  }, [userId]);

  const deleteAccount = useCallback(async () => {
    await deleteMyAccount();
    await supabase.auth.signOut();
    clearPending();
  }, []);

  /* ---- Bookmarks (optimistic: the UI updates instantly, rolls back on failure) ---- */
  const isSaved = useCallback((id) => savedIds.has(id), [savedIds]);

  const setSaved = useCallback(
    async (profileId, shouldSave, uid = userId) => {
      if (!uid) return;
      const before = savedRef.current;
      const next = new Set(before);
      if (shouldSave) next.add(profileId);
      else next.delete(profileId);
      setSavedIds(next);
      try {
        if (shouldSave) await addSaved(uid, profileId);
        else await removeSaved(uid, profileId);
      } catch (err) {
        setSavedIds(before);
        throw err;
      }
    },
    [userId],
  );

  /* ---- After login / onboarding: finish whatever the visitor came to do ---- */
  // Returns the path to send them to.
  const finishAuthFlow = useCallback(
    async (uid = userId) => {
      const pending = getPending();
      clearPending();
      if (!pending) return "/";
      if (pending.saveProfileId && uid && pending.saveProfileId !== uid) {
        try {
          await setSaved(pending.saveProfileId, true, uid);
        } catch {
          /* the student can just tap bookmark again */
        }
      }
      return safePath(pending.next);
    },
    [setSaved, userId],
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isComplete: Boolean(profile?.onboarding_complete),
      savedIds,
      isSaved,
      setSaved,
      signUp,
      signIn,
      signOut,
      resendVerification,
      sendResetEmail,
      updatePassword,
      refreshProfile,
      deleteAccount,
      finishAuthFlow,
    }),
    [
      user,
      profile,
      loading,
      savedIds,
      isSaved,
      setSaved,
      signUp,
      signIn,
      signOut,
      resendVerification,
      sendResetEmail,
      updatePassword,
      refreshProfile,
      deleteAccount,
      finishAuthFlow,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
