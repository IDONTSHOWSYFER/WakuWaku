import { NextResponse } from "next/server";
import { anilistQuery } from "@/lib/anilist";

const QUERY = `
query MangaDetail($id:Int) {
  Media(id:$id, type:MANGA) {
    id
    title { romaji english native }
    description
    coverImage { extraLarge large }
    genres
    startDate { year }
    popularity
    averageScore
    status
    chapters
    volumes
  }
}
`;

function stripHtml(s: string) {
  return (s || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  const p = ctx.params instanceof Promise ? await ctx.params : ctx.params;
  const id = Number(p.id);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    const data = await anilistQuery<any>(QUERY, { id });
    const media = data?.data?.Media;

    if (!media) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    const titre =
      media.title.english || media.title.romaji || media.title.native || "Sans titre";

    return NextResponse.json(
      {
        id: media.id,
        titre,
        description: stripHtml(media.description || ""),
        cover: media.coverImage?.extraLarge || media.coverImage?.large || null,
        genres: media.genres || [],
        annee: media.startDate?.year ?? null,
        popularite: media.popularity ?? null,
        score: media.averageScore ?? null,
        statutParution: media.status ?? null,
        chapitres: media.chapters ?? null,
        volumes: media.volumes ?? null,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}