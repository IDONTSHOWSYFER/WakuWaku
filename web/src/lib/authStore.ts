"use client";

import { supabase } from "@/lib/supabaseClient";

export type AuthUser = {
  id: string;
  email: string | null;
};

/** Inscription */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
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

/** Récupérer l'utilisateur session (asynchrone) */
export async function getSessionUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const u = data.user;
  if (!u) return null;
  return { id: u.id, email: u.email };
}

/**
 * Compat: ancien code utilisait getCurrentUser() synchrone.
 * Ici on renvoie null (SSR-safe), et on fournit un helper react via onAuthChange().
 */
export function getCurrentUser(): AuthUser | null {
  // IMPORTANT: Supabase = async. Les composants doivent écouter onAuthChange().
  return null;
}

/** Compat: ancien code utilisait logout() */
export async function logout() {
  return signOut();
}

/** Ecouter les changements d'auth */
export function onAuthChange(cb: (user: AuthUser | null) => void) {
  // premier call
  getSessionUser().then(cb).catch(() => cb(null));

  const { data: sub } = supabase.auth.onAuthStateChange(async () => {
    cb(await getSessionUser());
  });

  return () => sub.subscription.unsubscribe();
}