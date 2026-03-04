"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pushToast } from "@/components/toast/toastStore";
import { signIn } from "@/lib/authStore";

function withTimeout<T>(p: Promise<T>, ms = 12000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Timeout login (12s).")), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Connexion</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Accède à ta collection et à tes avis.
        </p>

        <div className="mt-4 space-y-3">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="input"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={async () => {
              const e = email.trim();
              if (!e || !password) {
                pushToast({ titre: "Champs manquants", message: "Email + mot de passe." });
                return;
              }

              setLoading(true);
              console.log("[login] start", e);

              try {
                const res = await withTimeout(signIn(e, password), 12000);
                console.log("[login] ok", res);

                pushToast({ titre: "Connecté", message: "Bienvenue 👋" });

                // IMPORTANT: on stoppe le loading AVANT navigation
                setLoading(false);
                router.replace("/profile");
              } catch (err: any) {
                console.error("[login] error", err);
                pushToast({
                  titre: "Connexion impossible",
                  message: err?.message ?? "Erreur inconnue",
                });
                setLoading(false);
              }
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <a className="underline text-zinc-700" href="/auth/register">
              Créer un compte
            </a>
            <a className="underline text-zinc-700" href="/auth/forgot">
              Mot de passe oublié
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}