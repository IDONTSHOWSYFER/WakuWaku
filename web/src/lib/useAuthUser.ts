"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { AuthUser, Profile } from "@/lib/authStore";

/**
 * user = auth user + profil (public.profiles)
 */
export type AuthUserWithProfile = AuthUser & {
  username: string | null;
  avatar_url: string | null;
};

async function fetchUserAndProfile(): Promise<AuthUserWithProfile | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const u = data.user;
  if (!u) return null;

  const email = u.email ?? null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", u.id)
    .maybeSingle();

  const p = (profile as Profile | null) ?? null;

  return {
    id: u.id,
    email,
    username: p?.username ?? null,
    avatar_url: p?.avatar_url ?? null,
  };
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const u = await fetchUserAndProfile().catch(() => null);
      if (!alive) return;
      setUser(u);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const u = await fetchUserAndProfile().catch(() => null);
      if (!alive) return;
      setUser(u);
      setLoading(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, setUser };
}