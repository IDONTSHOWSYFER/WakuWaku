"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGate from "@/components/AuthGate";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  getCollection,
  getStatut,
  removeFromCollection,
  setStatut,
} from "@/lib/storage";
import { pushToast } from "@/components/toast/toastStore";
import type { StatutLecture } from "@/lib/types";
import Link from "next/link";
import { useAuthUser } from "@/lib/authStore";

const labels: Record<StatutLecture, string> = {
  WISHLIST: "Wishlist",
  OWNED: "Possédé",
  READING: "En cours",
  READ: "Lu",
};

export default function CollectionPage() {
  const { user, loading } = useAuthUser();

  // localStorage collection (pour l’instant)
  const [items, setItems] = useState(() => getCollection());

  // resync sur focus (ou quand user change)
  useEffect(() => {
    const onFocus = () => setItems(getCollection());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    setItems(getCollection());
  }, [user?.id]);

  const sorted = useMemo(
    () => items.slice().sort((a, b) => b.updatedAt - a.updatedAt),
    [items]
  );

  if (loading) {
    return <div className="glass card rounded-[1.75rem] p-6 skeleton h-[220px]" />;
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <SectionTitle
          title="Collection"
          subtitle="Ta wishlist et tes statuts de lecture."
        />
        <AuthGate message="Connecte-toi pour accéder à ta collection." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Collection"
        subtitle="Gère tes statuts (Wishlist → Possédé → En cours → Lu)."
      />

      {sorted.length === 0 ? (
        <div className="glass card p-6">
          <div className="font-extrabold">Aucun manga pour le moment</div>
          <div className="text-sm text-zinc-700 mt-1">
            Ajoute un manga depuis le catalogue.
          </div>
          <div className="mt-3">
            <Link className="btn btn-primary" href="/search">
              Explorer le catalogue
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((x) => (
            <div
              key={x.mangaId}
              className="glass card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <div className="text-sm font-extrabold text-zinc-700">
                  Manga #{x.mangaId}
                </div>
                <div className="text-xs text-zinc-600 mt-1">
                  Statut : {labels[x.statut]}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  className="input"
                  value={getStatut(x.mangaId) ?? ""}
                  onChange={(e) => {
                    const v = e.target.value as StatutLecture;
                    setStatut(x.mangaId, v);
                    setItems(getCollection());
                    pushToast({ titre: "Statut mis à jour" });
                  }}
                >
                  <option value="WISHLIST">Wishlist</option>
                  <option value="OWNED">Possédé</option>
                  <option value="READING">En cours</option>
                  <option value="READ">Lu</option>
                </select>

                <button
                  className="btn btn-soft"
                  onClick={() => {
                    removeFromCollection(x.mangaId);
                    setItems(getCollection());
                    pushToast({ titre: "Retiré de la collection" });
                  }}
                >
                  Retirer
                </button>

                <Link className="btn btn-primary" href={`/manga/${x.mangaId}`}>
                  Ouvrir
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}