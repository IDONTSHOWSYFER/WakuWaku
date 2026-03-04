import Link from "next/link";
import Image from "next/image";
import StatusPill from "./StatusPill";

export type MangaLite = {
  id: number;
  titre: string;
  description: string;
  cover: string | null;
  genres: string[];
  annee?: number | null;
  statutSuivi?: string | null;
};

export default function MangaCard({ manga }: { manga: MangaLite }) {
  return (
    <Link href={`/manga/${manga.id}`} className="glass card block hover:translate-y-[-2px] transition">
      <div className="flex gap-4">
        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/80 border border-white/70">
          {manga.cover ? (
            <Image src={manga.cover} alt={manga.titre} fill className="object-cover" />
          ) : (
            <div className="h-full w-full grid place-items-center text-xs text-zinc-500">sans cover</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-extrabold tracking-tight truncate">{manga.titre}</div>
              <div className="text-xs text-zinc-600 mt-1 line-clamp-2">
                {manga.description || "—"}
              </div>
            </div>
            {manga.statutSuivi ? <StatusPill status={manga.statutSuivi} /> : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {manga.genres.slice(0, 3).map((g) => (
              <span key={g} className="badge">{g}</span>
            ))}
            {manga.annee ? <span className="badge">{manga.annee}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}