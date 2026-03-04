"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { onAuthChange, signOut, getMyProfile, type AuthUser } from "@/lib/authStore";
import { pushToast } from "@/components/toast/toastStore";

type Suggest = {
  id: number;
  titre: string;
  cover: string | null;
  annee?: number | null;
  genres?: string[];
};

type ProfileLite = {
  username?: string | null;
  avatar_url?: string | null;
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-xl text-sm font-extrabold text-zinc-700 hover:text-zinc-900 hover:bg-white/60 transition"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [mounted, setMounted] = useState(false);

  // Supabase auth + profile
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileLite | null>(null);

  // Search
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggest[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);

    return onAuthChange(async (u) => {
      setUser(u);

      if (!u) {
        setProfile(null);
        return;
      }

      const p = await getMyProfile().catch(() => null);
      setProfile(
        p
          ? {
              username: (p as any).username ?? null,
              avatar_url: (p as any).avatar_url ?? null,
            }
          : null
      );
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Suggestions
  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setItems([]);
      setLoading(false);
      return;
    }

    const t = window.setTimeout(async () => {
      try {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        setLoading(true);
        setOpen(true);

        const r = await fetch(`/api/manga/search?q=${encodeURIComponent(query)}&sort=TRENDING_DESC`, {
          signal: ac.signal,
        });
        const d = await r.json();

        const next = (d.items as any[])
          .slice(0, 7)
          .map((m) => ({
            id: m.id,
            titre: m.titre,
            cover: m.cover,
            annee: m.annee ?? null,
            genres: m.genres ?? [],
          })) as Suggest[];

        setItems(next);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(t);
  }, [q]);

  const avatarSrc = profile?.avatar_url || "/branding/logo.png";
  const displayName = profile?.username || (user?.email ? user.email.split("@")[0] : "Profil");

  return (
    <header className="sticky top-0 z-40 py-4">
      <div className="glass card flex items-center justify-between gap-3 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden">
            <Image src="/branding/logo.png" alt="Waku Waku" fill sizes="64px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold tracking-tight leading-tight">Waku Waku</div>
          </div>
        </Link>

        {/* Search */}
        <div ref={boxRef} className="relative hidden md:block w-[min(520px,40vw)]">
          <div className="flex items-center gap-2">
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => q.trim() && setOpen(true)}
              placeholder="Rechercher un manga..."
            />
            {q ? (
              <button
                className="btn btn-soft"
                onClick={() => {
                  setQ("");
                  setItems([]);
                  setOpen(false);
                }}
                aria-label="Effacer"
              >
                Effacer
              </button>
            ) : null}
          </div>

          {open ? (
            <div className="absolute mt-2 w-full bg-white rounded-[1.5rem] p-2 border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              {loading ? (
                <div className="p-3 text-sm text-zinc-600">Recherche…</div>
              ) : items.length === 0 ? (
                <div className="p-3 text-sm text-zinc-600">Aucun résultat. Essaie un autre titre.</div>
              ) : (
                <div className="flex flex-col">
                  {items.map((m) => (
                    <Link
                      key={m.id}
                      href={`/manga/${m.id}`}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-white/60 transition"
                      onClick={() => setOpen(false)}
                    >
                      <div className="relative h-12 w-9 overflow-hidden rounded-xl border border-white/70 bg-white/80 shrink-0">
                        {m.cover ? <Image src={m.cover} alt={m.titre} fill sizes="36px" className="object-cover" /> : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-sm text-zinc-900 truncate">{m.titre}</div>
                        <div className="text-xs text-zinc-600 truncate">
                          {m.annee ? m.annee : "—"} • {(m.genres || []).slice(0, 2).join(", ")}
                        </div>
                      </div>

                      <span className="badge">Voir</span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-2 px-2">
                <Link
                  href={`/search?q=${encodeURIComponent(q.trim())}`}
                  className="text-xs font-extrabold text-zinc-700 hover:text-zinc-900 transition"
                  onClick={() => setOpen(false)}
                >
                  Ouvrir le catalogue →
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* Nav + User */}
        <div className="flex items-center gap-1">
          <nav className="hidden sm:flex items-center">
            <NavLink href="/">Découvrir</NavLink>
            <NavLink href="/search">Catalogue</NavLink>
            <NavLink href="/collection">Collection</NavLink>
          </nav>

          {!mounted ? null : user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                href="/profile"
                className="px-3 py-2 rounded-xl hover:bg-white/60 transition inline-flex items-center gap-2"
                title="Profil"
              >
                <div className="relative h-8 w-8 rounded-xl overflow-hidden border border-white/70 bg-white/80">
                  <Image src={avatarSrc} alt="Avatar" fill sizes="32px" className="object-cover" />
                </div>
                <span className="hidden lg:inline text-sm font-extrabold text-zinc-800">{displayName}</span>
              </Link>

              <button
                className="btn btn-soft"
                onClick={async () => {
                  try {
                    await signOut();
                    setUser(null);
                    setProfile(null);
                    pushToast({ titre: "Déconnecté" });
                  } catch (e: any) {
                    pushToast({ titre: "Erreur", message: e?.message ?? "Impossible de se déconnecter." });
                  }
                }}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link className="ml-2 btn btn-primary" href="/auth/login">
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Mobile shortcut */}
      <div className="md:hidden mt-2">
        <div className="glass card px-4 py-3">
          <Link className="btn btn-soft w-full justify-center" href="/search">
            Rechercher dans le catalogue
          </Link>
        </div>
      </div>
    </header>
  );
}