import { NextResponse } from "next/server";
import { anilistQuery, normalizeMediaLite } from "@/lib/anilist";

const QUERY = `
query SearchManga(
  $page:Int,
  $perPage:Int,
  $search:String,
  $genreIn:[String],
  $sort:[MediaSort],
  $status:MediaStatus
) {
  Page(page:$page, perPage:$perPage) {
    pageInfo { total currentPage lastPage hasNextPage }
    media(
      type:MANGA,
      search:$search,
      genre_in:$genreIn,
      sort:$sort,
      status:$status
    ) {
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

  const q = (searchParams.get("q") || "").trim();
  const genre = (searchParams.get("genre") || "").trim();
  const sortKey = (searchParams.get("sort") || "TRENDING_DESC").trim();
  const release = (searchParams.get("release") || "").trim();
  const page = Number(searchParams.get("page") || "1");

  try {
    const variables: any = {
      page,
      perPage: 18,
      sort: [sortKey],
    };
    if (q) variables.search = q;
    if (genre) variables.genreIn = [genre];
    if (release) variables.status = release;

    const data = await anilistQuery<any>(QUERY, variables);

    if (data?.errors?.length) {
      return NextResponse.json(
        { items: [], pageInfo: { total: 0, currentPage: page, lastPage: page, hasNextPage: false }, error: data.errors },
        { status: 200 }
      );
    }

    const media = data?.data?.Page?.media ?? [];
    const pageInfo = data?.data?.Page?.pageInfo ?? { total: 0, currentPage: page, lastPage: page, hasNextPage: false };

    return NextResponse.json({ items: media.map(normalizeMediaLite), pageInfo }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { items: [], pageInfo: { total: 0, currentPage: page, lastPage: page, hasNextPage: false }, error: String(e?.message ?? e) },
      { status: 200 }
    );
  }
}