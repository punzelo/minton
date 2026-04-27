import { NextResponse } from "next/server";
import { createApiSupabase } from "@/lib/supabase/api";

export async function POST(request: Request, { params }: { params: Promise<{ tournamentId: string }> }) {
  const supabase = createApiSupabase(request);
  const { tournamentId } = await params;

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 필요합니다." }, { status: 500 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("teams")
    .insert({
      tournament_id: tournamentId,
      name: body.name,
      player1_name: body.player1Name,
      player2_name: body.player2Name || null,
      seed: body.seed ? Number(body.seed) : null,
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
