import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return NextResponse.json(
      { ok: false, error: "ENV manquante", url: !!url, anon: !!anon },
      { status: 500 }
    );
  }

  // init juste pour valider que la lib marche
  createClient(url, anon);

  const r = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: anon },
    cache: "no-store",
  });

  return NextResponse.json({ ok: r.ok, status: r.status }, { status: r.ok ? 200 : 500 });
}