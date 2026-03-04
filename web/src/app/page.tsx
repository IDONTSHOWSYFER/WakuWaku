"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import MangaCard, { MangaLite } from "@/components/MangaCard";
import { getStatut } from "@/lib/storage";
import { pushToast } from "@/components/toast/toastStore";

type Tab = "TRENDING_DESC" | "POPULARITY_DESC" | "SCORE_DESC";

const tabs: { key: Tab; label: string }[] = [
  { key: "TRENDING_DESC", label: "Tendances" },
  { key: "POPULARITY_DESC", label: "Populaires" },
  { key: "SCORE_DESC", label: "Mieux notés" },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("TRENDING_DESC");
  const [items, setItems] = useState<MangaLite[] | null>(null);

  async function load() {
    setItems(null);
    const r = await fetch(`/api/manga/trending?tab=${tab}`);
if (!r.ok) {
  setItems([]);
  pushToast({ titre: "Mode dégradé", message: "Impossible de charger la sélection pour le moment." });
  return;
}
const text = await r.text();
if (!text) {
  console.error("Empty response from trending API");
  setItems([]);
  return;
}
const d = JSON.parse(text);
    const withStatut = (d.items as any[]).map((m) => ({
      id: m.id,
      titre: m.titre,
      description: m.description,
      cover: m.cover,
      genres: m.genres,
      annee: m.annee,
      statutSuivi: getStatut(m.id),
    })) as MangaLite[];
    setItems(withStatut);
  }

  useEffect(() => { load(); }, [tab]);

  return (
    <div className="space-y-6">
      <section className="glass card rounded-[1.85rem] p-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Ton hub manga. Clair. Rapide. Addictif.
        </h1>
        <p className="mt-2 text-zinc-700 max-w-2xl">
          Découvrez le catalogue, organisez votre collection 
          et publiez tes <br></br>avis en quelques secondes.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a className="btn btn-primary" href="/search">Explorer le catalogue</a>
          <a className="btn btn-soft" href="/collection">Ouvrir ma collection</a>
          <button
            className="btn btn-soft"
            onClick={() => {
              // "Au hasard" : on change de tab et on scroll
              const r = tabs[Math.floor(Math.random() * tabs.length)].key;
              setTab(r);
              pushToast({ titre: "Mode découverte", message: "Sélection aléatoire appliquée." });
            }}
          >
            Au hasard
          </button>
        </div>

        <div className="mt-5 flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`btn ${tab === t.key ? "btn-primary" : "btn-soft"}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle title="Découvrir" subtitle="Une sélection dynamique basée sur les tendances et la popularité." />
        {!items ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass card skeleton h-[132px]" />)}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(m => <MangaCard key={m.id} manga={m} />)}
          </div>
        )}
      </section>
    </div>
  );
}