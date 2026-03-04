"use client";

import { supabase } from "@/lib/supabaseClient";

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

/** Inscription (Supabase Auth) */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  // Optionnel: créer un profile "vide" immédiatement (si user dispo)
  const u = data.user;
  if (u) {
    await ensureProfile(u.id, null, null).catch(() => {});
  }

  return data;
}

/** Connexion (Supabase Auth) */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

/** Déconnexion */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/** Compat: ancien code importait logout() */
export async function logout() {
  return signOut();
}

/** Récupère l'utilisateur courant via Supabase (async) */
export async function getSessionUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const u = data.user;
  if (!u) return null;
  return { id: u.id, email: u.email ?? null };
}

/**
 * Compat: ancien code utilisait getCurrentUser() synchrone.
 * On retourne null (SSR-safe). Les composants doivent écouter onAuthChange().
 */
export function getCurrentUser(): AuthUser | null {
  return null;
}

/** Écouter les changements d'auth (login/logout) */
export function onAuthChange(cb: (user: AuthUser | null) => void) {
  // premier call
  getSessionUser().then(cb).catch(() => cb(null));

  const { data: sub } = supabase.auth.onAuthStateChange(async () => {
    cb(await getSessionUser());
  });

  return () => sub.subscription.unsubscribe();
}

/** -------- Profiles (public.profiles) -------- */

/** S'assure qu'un profile existe (upsert) */
async function ensureProfile(
  userId: string,
  username: string | null,
  avatar_url: string | null
) {
  // upsert => crée si absent, met à jour si présent
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

/** Lire le profil courant */
export async function getMyProfile(): Promise<Profile | null> {
  const u = await getSessionUser();
  if (!u) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, created_at, updated_at")
    .eq("id", u.id)
    .maybeSingle();

  if (error) {
    // si table vide / row pas trouvée, on la crée
    await ensureProfile(u.id, null, null).catch(() => {});
    return null;
  }

  // Si pas de row => on crée
  if (!data) {
    await ensureProfile(u.id, null, null);
    return null;
  }

  return data as Profile;
}

/**
 * ✅ updateProfile : ce que ProfilePage attend
 * - username / avatar_url => dans public.profiles
 * - email => via supabase.auth.updateUser({ email })
 */
export async function updateProfile(input: {
  username?: string;
  avatar_url?: string;
  email?: string;
}) {
  const u = await getSessionUser();
  if (!u) throw new Error("Non connecté.");

  const { username, avatar_url, email } = input;

  // 1) Update email si fourni
  if (email && email.trim()) {
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    if (error) throw new Error(error.message);
  }

  // 2) Update profiles si username/avatar fournis
  if (typeof username !== "undefined" || typeof avatar_url !== "undefined") {
    await ensureProfile(
      u.id,
      typeof username !== "undefined" ? username.trim() || null : null,
      typeof avatar_url !== "undefined" ? avatar_url.trim() || null : null
    );
  }

  return true;
}

/**
 * ✅ changePassword : ce que ProfilePage attend (si tu l'utilises)
 * nécessite que l'utilisateur soit connecté
 */
export async function changePassword(newPassword: string) {
  const pwd = (newPassword || "").trim();
  if (pwd.length < 8) {
    throw new Error("Mot de passe trop court (min 8 caractères).");
  }
  const { error } = await supabase.auth.updateUser({ password: pwd });
  if (error) throw new Error(error.message);
  return true;
}