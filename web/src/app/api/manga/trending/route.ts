import { NextResponse } from "next/server";
import { anilistQuery, normalizeMediaLite } from "@/lib/anilist";

const QUERY = `
query TrendingManga($page:Int,$perPage:Int,$sort:[MediaSort]) {
  Page(page:$page, perPage:$perPage) {
    media(type:MANGA, sort:$sort) {
      id
      title { romaji english native }
      description
      coverImage { extraLarge large }
      genres
      startDate { year }
      popularity
    }
  }
}
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") || "TRENDING_DESC";

  try {
    const data = await anilistQuery<any>(QUERY, { page: 1, perPage: 12, sort: [tab] });
    const items = (data?.data?.Page?.media || []).map(normalizeMediaLite);
    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    // IMPORTANT: toujours renvoyer un JSON valide
    return NextResponse.json(
      { items: [], error: "AniList indisponible (temporaire)." },
      { status: 200 }
    );
  }
}