"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pushToast } from "@/components/toast/toastStore";
import { signIn } from "@/lib/authStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Connexion</h1>
        <p className="text-sm text-zinc-600 mt-1">Accède à ta collection et à tes avis.</p>

        <div className="mt-4 space-y-3">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await signIn(email.trim(), password);
                pushToast({ titre: "Connecté", message: "Bienvenue 👋" });
                router.push("/profile");
              } catch (e: any) {
                pushToast({ titre: "Connexion impossible", message: e.message });
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <a className="underline text-zinc-700" href="/auth/register">Créer un compte</a>
            <a className="underline text-zinc-700" href="/auth/forgot">Mot de passe oublié</a>
          </div>
        </div>
      </div>
    </div>
  );
}