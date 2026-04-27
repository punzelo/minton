import { NextResponse } from "next/server";
import { generateDoubleElimination } from "@/lib/bracket/generateDoubleElimination";
import { createApiSupabase } from "@/lib/supabase/api";

export async function POST(request: Request, { params }: { params: Promise<{ tournamentId: string }> }) {
  const supabase = createApiSupabase(request);
  const { tournamentId } = await params;

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 필요합니다." }, { status: 500 });
  }

  const { data: teams, error: teamError } = await supabase.from("teams").select("*").eq("tournament_id", tournamentId).order("seed");

  if (teamError) {
    return NextResponse.json({ message: teamError.message }, { status: 400 });
  }

  try {
    const matches = generateDoubleElimination(tournamentId, teams ?? []);

    await supabase.from("matches").delete().eq("tournament_id", tournamentId);
    const { error } = await supabase.from("matches").insert(matches);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    await supabase.from("tournaments").update({ status: "ready" }).eq("id", tournamentId);

    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "대진 생성 실패" }, { status: 400 });
  }
}
