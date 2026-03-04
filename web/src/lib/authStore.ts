"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string | null;
};

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AuthState = {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
};

/** Inscription (Supabase Auth) */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  // si user dispo => on s'assure d'une row profile
  if (data.user) {
    await ensureProfile(data.user.id, null, null).catch(() => {});
  }

  return data;
}

/** Connexion */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

/** Déconnexion */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/** Compat */
export async function logout() {
  return signOut();
}

/** User session (async) */
export async function getSessionUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const u = data.user;
  if (!u) return null;
  return { id: u.id, email: u.email ?? null }; // ✅ fix TS
}

/** -------- Profiles (public.profiles) -------- */

async function ensureProfile(userId: string, username: string | null, avatar_url: string | null) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      username,
      avatar_url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
  if (error) throw new Error(error.message);
}

export async function getMyProfile(): Promise<Profile | null> {
  const u = await getSessionUser();
  if (!u) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, created_at, updated_at")
    .eq("id", u.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!data) {
    await ensureProfile(u.id, null, null);
    return null;
  }

  return data as Profile;
}

/** Update profile + email */
export async function updateProfile(input: {
  username?: string;
  avatar_url?: string;
  email?: string;
}) {
  const u = await getSessionUser();
  if (!u) throw new Error("Non connecté.");

  const { username, avatar_url, email } = input;

  if (email && email.trim()) {
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    if (error) throw new Error(error.message);
  }

  if (typeof username !== "undefined" || typeof avatar_url !== "undefined") {
    await ensureProfile(
      u.id,
      typeof username !== "undefined" ? username.trim() || null : null,
      typeof avatar_url !== "undefined" ? avatar_url.trim() || null : null
    );
  }

  return true;
}

/** Change password (requires logged user) */
export async function changePassword(newPassword: string) {
  const pwd = (newPassword || "").trim();
  if (pwd.length < 8) throw new Error("Mot de passe trop court (min 8 caractères).");
  const { error } = await supabase.auth.updateUser({ password: pwd });
  if (error) throw new Error(error.message);
  return true;
}

/** Hook global : remplace getCurrentUser() partout */
export function useAuthUser(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const u = await getSessionUser();
      if (cancelled) return;
      if (!u) {
        setState({ user: null, profile: null, loading: false });
        return;
      }
      const p = await getMyProfile().catch(() => null);
      if (cancelled) return;
      setState({ user: u, profile: p, loading: false });
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const u = await getSessionUser();
      if (cancelled) return;
      if (!u) {
        setState({ user: null, profile: null, loading: false });
        return;
      }
      const p = await getMyProfile().catch(() => null);
      if (cancelled) return;
      setState({ user: u, profile: p, loading: false });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}