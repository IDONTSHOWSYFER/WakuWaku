"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/authStore";
import { pushToast } from "@/components/toast/toastStore";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <section className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Créer un compte</h1>
        <p className="text-sm text-zinc-600 mt-1">Active la wishlist, la collection et les avis.</p>

        <div className="hr" />

        <div className="space-y-3">
          <div>
            <label className="text-xs font-extrabold text-zinc-700">Username</label>
            <input className="input mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-extrabold text-zinc-700">Email</label>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-extrabold text-zinc-700">Mot de passe</label>
            <input
              className="input mt-1"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="8+ caractères, 1 maj, 1 min, 1 chiffre"
            />
          </div>

          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={() => {
              try {
                setLoading(true);
                register(username, email, pw);
                pushToast({ titre: "Compte créé" });
                router.push("/");
                router.refresh();
              } catch (e: any) {
                pushToast({ titre: "Création impossible", message: e?.message ?? "Erreur" });
              } finally {
                setLoading(false);
              }
            }}
          >
            Créer mon compte
          </button>

          <div className="text-sm text-zinc-700">
            Déjà un compte ? <a className="underline" href="/auth/login">Se connecter</a>
          </div>
        </div>
      </section>
    </div>
  );
}