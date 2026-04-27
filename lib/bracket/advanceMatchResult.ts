import type { Match, MatchSlot } from "@/types/match";
import type { Team } from "@/types/team";

export function pickLoser(match: Match, winnerTeamId: string) {
  if (match.team_a_id === winnerTeamId) {
    return match.team_b_id;
  }

  if (match.team_b_id === winnerTeamId) {
    return match.team_a_id;
  }

  throw new Error("승자 팀이 이 경기에 배정되어 있지 않습니다.");
}

export function getSlotPatch(slot: MatchSlot, teamId: string) {
  return slot === "A" ? { team_a_id: teamId } : { team_b_id: teamId };
}

export function getReadyStatus(match: Pick<Match, "team_a_id" | "team_b_id">, patch: Partial<Pick<Match, "team_a_id" | "team_b_id">>) {
  const teamA = patch.team_a_id ?? match.team_a_id;
  const teamB = patch.team_b_id ?? match.team_b_id;

  return teamA && teamB ? "ready" : "pending";
}

export function markEliminated(teamId: string): Partial<Team> {
  return {
    status: "eliminated",
  };
}
