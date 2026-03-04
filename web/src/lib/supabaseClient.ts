import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL manquante (.env.local)");
if (!anon) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY manquante (.env.local)");

export const supabase = createClient(url, anon);