"use client";

import { useState } from "react";
import { pushToast } from "@/components/toast/toastStore";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-lg mx-auto">
      <div className="glass card rounded-[1.75rem] p-6">
        <h1 className="text-2xl font-extrabold">Mot de passe oublié</h1>
        <p className="text-sm text-zinc-600 mt-1">
          On t’envoie un lien de réinitialisation.
        </p>

        <div className="mt-4 space-y-3">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                  redirectTo: `${location.origin}/auth/reset`,
                });
                if (error) throw error;
                pushToast({ titre: "Email envoyé", message: "Vérifie ta boîte mail." });
              } catch (e: any) {
                pushToast({ titre: "Erreur", message: e.message });
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </div>
      </div>
    </div>
  );
}