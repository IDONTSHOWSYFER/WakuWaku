"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pushToast } from "@/components/toast/toastStore";
import { signUp } from "@/lib/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Créer un compte</h1>
        <p className="text-sm text-zinc-600 mt-1">Quelques secondes et c’est parti.</p>

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
                await signUp(email.trim(), password);
                pushToast({
                  titre: "Compte créé",
                  message: "Tu peux maintenant te connecter.",
                });
                router.push("/auth/login");
              } catch (e: any) {
                pushToast({ titre: "Inscription impossible", message: e.message });
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          <div className="text-sm">
            <a className="underline text-zinc-700" href="/auth/login">J’ai déjà un compte</a>
          </div>
        </div>
      </div>
    </div>
  );
}