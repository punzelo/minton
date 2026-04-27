import { NextResponse } from "next/server";
import { createApiSupabase } from "@/lib/supabase/api";

export async function GET(request: Request, { params }: { params: Promise<{ tournamentId: string }> }) {
  const supabase = createApiSupabase(request);
  const { tournamentId } = await params;

  if (!supabase) {
    return NextResponse.json({ tournament: null, teams: [], matches: [] });
  }

  const [{ data: tournament }, { data: teams }, { data: matches }] = await Promise.all([
    supabase.from("tournaments").select("*").eq("id", tournamentId).single(),
    supabase.from("teams").select("*").eq("tournament_id", tournamentId).order("seed"),
    supabase.from("matches").select("*").eq("tournament_id", tournamentId).order("round"),
  ]);

  return NextResponse.json({ tournament, teams: teams ?? [], matches: matches ?? [] });
}
