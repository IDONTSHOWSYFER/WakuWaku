"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/authStore";
import { pushToast } from "@/components/toast/toastStore";

export default function ForgotPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="glass card">
        <h1 className="text-2xl font-extrabold">Réinitialiser le mot de passe</h1>
        <p className="text-sm text-zinc-600 mt-1">
          MVP : simulation d’envoi. À brancher sur la base + email plus tard.
        </p>

        <div className="mt-4 space-y-2">
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              forgotPassword(email.trim());
              pushToast({ titre: "Demande envoyée", message: "Si ce compte existe, tu recevras un email." });
              window.location.href = "/auth/login";
            }}
          >
            Envoyer
          </button>
          <a className="btn btn-soft w-full" href="/auth/login">Retour</a>
        </div>
      </div>
    </div>
  );
}