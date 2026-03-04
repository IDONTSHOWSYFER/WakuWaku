"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import StatusPill from "@/components/StatusPill";
import EmptyState from "@/components/ui/EmptyState";
import AuthGate from "@/components/AuthGate";

import {
  getAvis,
  getStatut,
  removeAvis,
  removeFromCollection,
  setAvis,
  setStatut,
} from "@/lib/storage";
import type { StatutLecture } from "@/lib/types";
import { pushToast } from "@/components/toast/toastStore";
import { getCurrentUser } from "@/lib/authStore";

type Detail = {
  id: number;
  titre: string;
  description: string;
  cover: string | null;
  genres: string[];
  annee: number | null;
  popularite: number | null;
  score: number | null;
  statutParution: string | null;
  chapitres: number | null;
  volumes: number | null;
};

const options: { value: StatutLecture; label: string }[] = [
  { value: "WISHLIST", label: "Wishlist" },
  { value: "OWNED", label: "Possédé" },
  { value: "READING", label: "En cours" },
  { value: "READ", label: "Lu" },
];

export default function MangaDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [user, setUser] = useState(() => getCurrentUser());
  const [data, setData] = useState<Detail | null>(null);
  const [statut, setStatutState] = useState<StatutLecture | null>(null);

  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");

  // Re-sync user quand tu reviens sur l'onglet
  useEffect(() => {
    const onFocus = () => setUser(getCurrentUser());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(`/api/manga/${id}`);
        const d = await r.json();

        if (cancelled) return;

        if (!r.ok || d?.error) {
          setData(null);
          return;
        }

        setData(d);
      } catch {
        if (!cancelled) setData(null);
      }
    })();

    // Avis/collection : charge seulement si connecté
    if (user) {
      setStatutState(getStatut(id));
      const a = getAvis(id);
      setNote(a?.note ?? 0);
      setCommentaire(a?.commentaire ?? "");
    } else {
      setStatutState(null);
      setNote(0);
      setCommentaire("");
    }

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const meta = useMemo(() => {
    if (!data) return "";
    const parts = [
      data.annee ? `${data.annee}` : null,
      data.volumes ? `${data.volumes} vol.` : null,
      data.chapitres ? `${data.chapitres} ch.` : null,
      data.score ? `Score ${data.score}` : null,
    ].filter(Boolean);
    return parts.join(" • ");
  }, [data]);

  if (data === null) {
    return (
      <EmptyState
        title="Introuvable"
        desc="Ce manga n’existe pas (ou l’API ne répond pas)."
      />
    );
  }

  if (!data) return <div className="glass card skeleton h-[420px]" />;

  return (
    <div className="space-y-4">
      <button className="btn btn-soft" onClick={() => router.back()}>
        ← Retour
      </button>

      <section className="glass card rounded-[1.75rem] p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative h-[320px] w-[220px] overflow-hidden rounded-[1.75rem] bg-white/80 border border-white/70 shrink-0">
            {data.cover ? (
              <Image
                src={data.cover}
                alt={data.titre}
                fill
                sizes="(max-width: 768px) 220px, 220px"
                className="object-cover"
                priority
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {data.titre}
                </h1>
                <div className="text-sm text-zinc-600 mt-1">{meta}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.genres.map((g) => (
                    <span key={g} className="badge">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {user && statut ? (
                <StatusPill status={statut} />
              ) : (
                <span className="badge">Non suivi</span>
              )}
            </div>

            <div className="hr" />

            <p className="text-zinc-800 whitespace-pre-line leading-relaxed">
              {data.description || "Aucune description disponible."}
            </p>

            <div className="hr" />

            {/* Actions collection (uniquement connecté) */}
            {user ? (
              <div className="grid gap-2 sm:grid-cols-3 items-stretch">
                <select
                  className="input"
                  value={statut ?? ""}
                  onChange={(e) =>
                    setStatutState((e.target.value || null) as any)
                  }
                >
                  <option value="">Non suivi</option>
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!statut) {
                      pushToast({
                        titre: "Choisis un statut",
                        message: "Wishlist / Possédé / En cours / Lu",
                      });
                      return;
                    }
                    setStatut(id, statut);
                    pushToast({
                      titre: "Enregistré",
                      message: `Statut : ${statut}`,
                    });
                  }}
                >
                  Enregistrer
                </button>

                <button
                  className="btn btn-soft"
                  onClick={() => {
                    removeFromCollection(id);
                    setStatutState(null);
                    pushToast({
                      titre: "Retiré",
                      message: "Supprimé de ta collection.",
                    });
                  }}
                >
                  Retirer
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/40 border border-white/70 px-4 py-3 text-sm text-zinc-700">
                Connecte-toi pour ajouter ce manga à ta collection / wishlist.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AVIS : consultable par tous, écriture seulement connecté */}
      <section className="glass card rounded-[1.75rem] p-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-extrabold">Avis</h2>
          {user ? (
            <button
              className="btn btn-danger"
              onClick={() => {
                removeAvis(id);
                setNote(0);
                setCommentaire("");
                pushToast({ titre: "Avis supprimé" });
              }}
            >
              Supprimer
            </button>
          ) : null}
        </div>

<div className="flex items-center justify-between gap-3">
  <span className="text-sm font-extrabold text-zinc-700">Note</span>

  <div className="flex items-center gap-3">
    <div className={`flex gap-1 ${!user ? "opacity-60" : ""}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const active = n <= note;

        return (
          <button
            key={n}
            type="button"
            disabled={!user}
            onClick={() => setNote(n)}
            aria-label={`${n} étoile`}
            title={!user ? "Connecte-toi pour noter" : `${n}/5`}
            className={[
              "h-9 w-9 rounded-xl border transition grid place-items-center text-lg",
              active
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white/70 border-white/70 hover:bg-white/90 text-zinc-900",
              !user ? "cursor-not-allowed" : "",
            ].join(" ")}
          >
            ★
          </button>
        );
      })}
    </div>

    <span className="text-sm font-extrabold text-zinc-700 tabular-nums">
      {note}/5
    </span>
  </div>

          {/* Commentaire */}
          <textarea
            className={`input min-h-[120px] ${!user ? "opacity-70" : ""}`}
            disabled={!user}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder={
              user
                ? "Écris un avis court (optionnel)…"
                : "Connecte-toi pour écrire un avis…"
            }
          />

          {user ? (
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (note < 0 || note > 5) {
                    pushToast({
                      titre: "Note invalide",
                      message: "Choisis une note entre 0 et 5.",
                    });
                    return;
                  }
                  setAvis(id, note, commentaire);
                  pushToast({
                    titre: "Avis enregistré",
                    message: note ? `Note : ${note}/5` : "Commentaire mis à jour",
                  });
                }}
              >
                Publier
              </button>

              <button
                className="btn btn-soft"
                onClick={() => {
                  setNote(0);
                  setCommentaire("");
                  pushToast({ titre: "Brouillon effacé" });
                }}
              >
                Effacer
              </button>
            </div>
          ) : (
            <div className="mt-1">
              <AuthGate message="Pour publier un avis, connecte-toi ou crée un compte." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}