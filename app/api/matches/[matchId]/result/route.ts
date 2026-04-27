import { NextResponse } from "next/server";
import { getReadyStatus, getSlotPatch, markEliminated, pickLoser } from "@/lib/bracket/advanceMatchResult";
import { createApiSupabase } from "@/lib/supabase/api";

export async function POST(request: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const supabase = createApiSupabase(request);
  const { matchId } = await params;

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 필요합니다." }, { status: 500 });
  }

  const body = await request.json();
  const winnerTeamId = body.winnerTeamId as string;
  const scoreA = Number(body.scoreA);
  const scoreB = Number(body.scoreB);

  const { data: match, error: matchError } = await supabase.from("matches").select("*").eq("id", matchId).single();

  if (matchError || !match) {
    return NextResponse.json({ message: matchError?.message ?? "경기를 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const loserTeamId = pickLoser(match, winnerTeamId);

    const { error: updateError } = await supabase
      .from("matches")
      .update({
        score_a: scoreA,
        score_b: scoreB,
        winner_team_id: winnerTeamId,
        loser_team_id: loserTeamId,
        status: "completed",
      })
      .eq("id", matchId);

    if (updateError) {
      return NextResponse.json({ message: updateError.message }, { status: 400 });
    }

    if (match.next_match_id && match.next_match_slot) {
      const { data: nextMatch } = await supabase.from("matches").select("*").eq("id", match.next_match_id).single();
      if (nextMatch) {
        const patch = getSlotPatch(match.next_match_slot, winnerTeamId);
        await supabase
          .from("matches")
          .update({ ...patch, status: getReadyStatus(nextMatch, patch) })
          .eq("id", nextMatch.id);
      }
    }

    if (loserTeamId && match.loser_next_match_id && match.loser_next_match_slot) {
      const { data: loserNextMatch } = await supabase.from("matches").select("*").eq("id", match.loser_next_match_id).single();
      if (loserNextMatch) {
        const patch = getSlotPatch(match.loser_next_match_slot, loserTeamId);
        await supabase
          .from("matches")
          .update({ ...patch, status: getReadyStatus(loserNextMatch, patch) })
          .eq("id", loserNextMatch.id);
      }
    } else if (loserTeamId) {
      await supabase.from("teams").update(markEliminated(loserTeamId)).eq("id", loserTeamId);
    }

    await supabase.from("tournaments").update({ status: "ongoing" }).eq("id", match.tournament_id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "결과 저장 실패" }, { status: 400 });
  }
}
