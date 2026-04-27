import type { MatchWithTeams } from "@/types/match";
import { Badge } from "@/components/ui/Badge";

export function MatchCard({ match, admin = false }: { match: MatchWithTeams; admin?: boolean }) {
  const teamA = match.team_a?.name ?? "대기";
  const teamB = match.team_b?.name ?? "대기";

  return (
    <div className="min-w-[220px] rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500">R{match.round} · M{match.match_order}</p>
        <Badge className={match.status === "ready" ? "bg-court-100 text-court-700" : ""}>{match.status}</Badge>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
          <span className={match.winner_team_id === match.team_a_id ? "font-bold text-court-700" : ""}>{teamA}</span>
          <span>{match.score_a ?? "-"}</span>
        </div>
        <div className="flex justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
          <span className={match.winner_team_id === match.team_b_id ? "font-bold text-court-700" : ""}>{teamB}</span>
          <span>{match.score_b ?? "-"}</span>
        </div>
      </div>
      {admin ? <a className="mt-3 block text-xs font-semibold text-court-700" href={`/admin/tournaments/${match.tournament_id}/matches#${match.id}`}>결과 입력</a> : null}
    </div>
  );
}
