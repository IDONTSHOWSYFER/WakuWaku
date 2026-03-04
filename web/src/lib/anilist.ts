import { z } from "zod";

const API = "https://graphql.anilist.co";

export type MangaLiteAPI = {
  id: number;
  titre: string;
  description: string;
  cover: string | null;
  genres: string[];
  annee?: number | null;
  popularite?: number | null;
};

function stripHtml(s: string) {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const MediaLiteSchema = z.object({
  id: z.number(),
  title: z.object({
    romaji: z.string().nullable().optional(),
    english: z.string().nullable().optional(),
    native: z.string().nullable().optional(),
  }),
  description: z.string().nullable().optional(),
  coverImage: z.object({
    extraLarge: z.string().nullable().optional(),
    large: z.string().nullable().optional(),
  }).optional(),
  genres: z.array(z.string()).default([]),
  startDate: z.object({ year: z.number().nullable().optional() }).optional(),
  popularity: z.number().nullable().optional(),
});

export async function anilistQuery<T>(query: string, variables: Record<string, any>) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Erreur AniList: ${res.status}`);
  return res.json() as Promise<T>;
}

export function normalizeMediaLite(m: any): MangaLiteAPI {
  const parsed = MediaLiteSchema.parse(m);
  const titre = parsed.title.english || parsed.title.romaji || parsed.title.native || "Sans titre";
  return {
    id: parsed.id,
    titre,
    description: stripHtml(parsed.description || ""),
    cover: parsed.coverImage?.extraLarge || parsed.coverImage?.large || null,
    genres: parsed.genres || [],
    annee: parsed.startDate?.year ?? null,
    popularite: parsed.popularity ?? null,
  };
}