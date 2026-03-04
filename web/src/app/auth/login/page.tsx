"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/authStore";
import { pushToast } from "@/components/toast/toastStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <section className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Connexion</h1>
        <p className="text-sm text-zinc-600 mt-1">Accède à ta collection et tes avis.</p>

        <div className="hr" />

        <div className="space-y-3">
          <div>
            <label className="text-xs font-extrabold text-zinc-700">Email</label>
            <input
              className="input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: valentin@mail.com"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-zinc-700">Mot de passe</label>
            <input
              className="input mt-1"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={() => {
              try {
                setLoading(true);
                login(email, pw);
                pushToast({ titre: "Connecté" });
                router.push("/");
                router.refresh();
              } catch (e: any) {
                pushToast({ titre: "Connexion impossible", message: e?.message ?? "Erreur" });
              } finally {
                setLoading(false);
              }
            }}
          >
            Se connecter
          </button>

          <div className="text-sm text-zinc-700 flex justify-between">
            <a className="underline" href="/auth/register">Créer un compte</a>
            <a className="underline" href="/auth/forgot">Mot de passe oublié</a>
          </div>
        </div>
      </section>
    </div>
  );
}