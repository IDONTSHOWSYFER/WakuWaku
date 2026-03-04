"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import MangaCard, { MangaLite } from "@/components/MangaCard";
import { getStatut } from "@/lib/storage";
import { getCurrentUser } from "@/lib/authStore";

type SortKey =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "START_DATE_DESC"
  | "TITLE_ROMAJI"
  | "TITLE_ROMAJI_DESC";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: "TRENDING_DESC", label: "Tendances" },
  { value: "POPULARITY_DESC", label: "Popularité" },
  { value: "SCORE_DESC", label: "Score" },
  { value: "START_DATE_DESC", label: "Plus récent" },
  { value: "TITLE_ROMAJI", label: "A → Z" },
  { value: "TITLE_ROMAJI_DESC", label: "Z → A" },
];

const RELEASES: { value: string; label: string }[] = [
  { value: "", label: "Parution (tous)" },
  { value: "RELEASING", label: "En cours" },
  { value: "FINISHED", label: "Terminé" },
  { value: "NOT_YET_RELEASED", label: "À venir" },
];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState<SortKey>("TRENDING_DESC");
  const [release, setRelease] = useState("");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MangaLite[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ état auth STABLE (évite que les deps changent en boucle)
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    setIsAuthed(!!getCurrentUser());
    const onFocus = () => setIsAuthed(!!getCurrentUser());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (genre) p.set("genre", genre);
    if (sort) p.set("sort", sort);
    if (release) p.set("release", release);
    return p.toString();
  }, [q, genre, sort, release]);

  // ✅ évite les requêtes en rafale (debounce + abort)
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setError(null);

    const t = window.setTimeout(async () => {
      try {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        setLoading(true);
        const r = await fetch(`/api/manga/search?${qs}`, { signal: ac.signal });
        const d = await r.json();

        const next = (d.items as any[]).map((m) => ({
          id: m.id,
          titre: m.titre,
          description: m.description,
          cover: m.cover,
          genres: m.genres,
          annee: m.annee,
          statutSuivi: isAuthed ? getStatut(m.id) : null,
        })) as MangaLite[];

        setItems(next);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError("Impossible de charger le catalogue.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(t);
  }, [qs, isAuthed]);

  return (
    <div className="space-y-4">
      <section className="glass card">
        <SectionTitle title="Catalogue" subtitle="Recherche, filtres et tri en temps réel." />

        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un manga (titre)..."
            />
            <button className="btn btn-soft" onClick={() => setQ("")}>
              Effacer
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select className="input" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">Genre (tous)</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select className="input" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select className="input" value={release} onChange={(e) => setRelease(e.target.value)}>
              {RELEASES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <button
              className="btn btn-soft"
              onClick={() => {
                setQ("");
                setGenre("");
                setSort("TRENDING_DESC");
                setRelease("");
              }}
            >
              Réinitialiser
            </button>
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
      </section>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass card skeleton h-[132px]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <MangaCard key={m.id} manga={m} />
          ))}
        </div>
      )}
    </div>
  );
}