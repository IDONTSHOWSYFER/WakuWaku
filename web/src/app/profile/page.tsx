"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  changePassword,
  getMyProfile,
  getSessionUser,
  signIn,
  updateProfile,
} from "@/lib/authStore";
import { pushToast } from "@/components/toast/toastStore";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState<{ id: string; email: string | null } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const u = await getSessionUser();
      setUser(u);

      if (!u) {
        setAvatarUrl("");
        setUsername("");
        setEmail("");
        return;
      }

      setEmail(u.email ?? "");

      const p = await getMyProfile();
      setAvatarUrl(p?.avatar_url ?? "");
      setUsername(p?.username ?? "");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    refresh();

    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return <div className="glass card rounded-[1.75rem] p-6 skeleton h-[320px]" />;
  }

  if (!user) {
    return (
      <section className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Profil</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Connecte-toi pour personnaliser ton compte.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn btn-primary" href="/auth/login">
            Se connecter
          </Link>
          <Link className="btn btn-soft" href="/auth/register">
            Créer un compte
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Profil</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Gère tes informations et ton avatar.
        </p>

        <div className="hr" />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="w-full md:w-[260px]">
            <div className="relative h-[180px] w-[180px] rounded-[1.75rem] overflow-hidden bg-white/80 border border-zinc-200">
              <Image
                src={avatarUrl || "/branding/logo.png"}
                alt="Avatar"
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>

            <div className="mt-3 space-y-2">
              <label className="text-xs font-extrabold text-zinc-700">
                Photo (URL)
              </label>
              <input
                className="input"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />

              <label className="text-xs font-extrabold text-zinc-700">
                Ou importer depuis ton PC
              </label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = async () => {
                    const dataUrl = String(reader.result || "");
                    setAvatarUrl(dataUrl);
                    pushToast({
                      titre: "Aperçu",
                      message: "N’oublie pas d’enregistrer 🙂",
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <p className="text-xs text-zinc-500">
                (Pour un vrai upload “pro”, on utilisera Supabase Storage ensuite.)
              </p>
            </div>
          </div>

          {/* Infos */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="text-xs font-extrabold text-zinc-700">
                Username
              </label>
              <input
                className="input mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-zinc-700">
                Email
              </label>
              <input
                className="input mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-zinc-500 mt-1">
                Supabase peut demander une confirmation email selon ta config.
              </p>
            </div>

            <button
              className="btn btn-primary"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await updateProfile({
                    username,
                    avatar_url: avatarUrl,
                    email,
                  });
                  pushToast({ titre: "Profil mis à jour" });
                  await refresh();
                } catch (e: any) {
                  pushToast({
                    titre: "Erreur",
                    message: e?.message ?? "Impossible de mettre à jour.",
                  });
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>

            <div className="hr" />

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="text-xs font-extrabold text-zinc-700">
                  Ancien mot de passe
                </label>
                <input
                  className="input mt-1"
                  type="password"
                  value={oldPw}
                  onChange={(e) => setOldPw(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-extrabold text-zinc-700">
                  Nouveau mot de passe
                </label>
                <input
                  className="input mt-1"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-zinc-600">
              Mot de passe fort : 8 caractères min, 1 majuscule, 1 minuscule, 1
              chiffre.
            </p>

            <button
              className="btn btn-soft"
              disabled={changingPw}
              onClick={async () => {
                setChangingPw(true);
                try {
                  // On re-auth avec ancien mdp (utile pour éviter changement si vieux mdp faux)
                  if (!user.email) throw new Error("Email introuvable.");
                  if (!oldPw.trim()) throw new Error("Ancien mot de passe requis.");
                  if (!newPw.trim()) throw new Error("Nouveau mot de passe requis.");

                  await signIn(user.email, oldPw); // re-auth
                  await changePassword(newPw); // change

                  setOldPw("");
                  setNewPw("");
                  pushToast({ titre: "Mot de passe changé" });
                } catch (e: any) {
                  pushToast({
                    titre: "Erreur",
                    message: e?.message ?? "Impossible de changer le mot de passe.",
                  });
                } finally {
                  setChangingPw(false);
                }
              }}
            >
              {changingPw ? "Changement..." : "Changer le mot de passe"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}