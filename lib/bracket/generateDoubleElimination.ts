import type { GeneratedMatch } from "@/lib/bracket/types";
import type { Team } from "@/types/team";

function nextPowerOfTwo(value: number) {
  return 2 ** Math.ceil(Math.log2(value));
}

function createMatch(params: Partial<GeneratedMatch> & Pick<GeneratedMatch, "tournament_id" | "bracket" | "round" | "match_order">): GeneratedMatch {
  return {
    id: crypto.randomUUID(),
    tournament_id: params.tournament_id,
    bracket: params.bracket,
    round: params.round,
    match_order: params.match_order,
    team_a_id: params.team_a_id ?? null,
    team_b_id: params.team_b_id ?? null,
    score_a: null,
    score_b: null,
    winner_team_id: null,
    loser_team_id: null,
    status: params.status ?? "pending",
    next_match_id: null,
    next_match_slot: null,
    loser_next_match_id: null,
    loser_next_match_slot: null,
  };
}

export function generateDoubleElimination(tournamentId: string, teams: Team[]): GeneratedMatch[] {
  if (teams.length < 2) {
    throw new Error("대진 생성에는 최소 2팀이 필요합니다.");
  }

  const bracketSize = nextPowerOfTwo(teams.length);

  if (![4, 8, 16].includes(bracketSize)) {
    throw new Error("MVP는 4팀, 8팀, 16팀 규모의 브래킷을 지원합니다.");
  }

  const sortedTeams = [...teams].sort((a, b) => (a.seed ?? 9999) - (b.seed ?? 9999) || a.created_at.localeCompare(b.created_at));
  const slots: Array<Team | null> = Array.from({ length: bracketSize }, (_, index) => sortedTeams[index] ?? null);
  const rounds = Math.log2(bracketSize);
  const winners: GeneratedMatch[][] = [];
  const losers: GeneratedMatch[][] = [];
  const matches: GeneratedMatch[] = [];

  for (let round = 1; round <= rounds; round += 1) {
    const count = bracketSize / 2 ** round;
    winners[round] = [];

    for (let order = 1; order <= count; order += 1) {
      const firstRoundTeamA = round === 1 ? slots[(order - 1) * 2]?.id ?? null : null;
      const firstRoundTeamB = round === 1 ? slots[(order - 1) * 2 + 1]?.id ?? null : null;
      const match = createMatch({
        tournament_id: tournamentId,
        bracket: "winners",
        round,
        match_order: order,
        team_a_id: firstRoundTeamA,
        team_b_id: firstRoundTeamB,
        status: round === 1 && firstRoundTeamA && firstRoundTeamB ? "ready" : "pending",
      });

      winners[round][order - 1] = match;
      matches.push(match);
    }
  }

  const loserRoundCount = Math.max(2, (rounds - 1) * 2);

  for (let round = 1; round <= loserRoundCount; round += 1) {
    const pairIndex = Math.ceil(round / 2);
    const count = Math.max(1, bracketSize / 2 ** (pairIndex + 1));
    losers[round] = [];

    for (let order = 1; order <= count; order += 1) {
      const match = createMatch({
        tournament_id: tournamentId,
        bracket: "losers",
        round,
        match_order: order,
      });

      losers[round][order - 1] = match;
      matches.push(match);
    }
  }

  const final = createMatch({
    tournament_id: tournamentId,
    bracket: "finals",
    round: 1,
    match_order: 1,
  });
  matches.push(final);

  for (let round = 1; round <= rounds; round += 1) {
    winners[round].forEach((match, index) => {
      if (round < rounds) {
        const target = winners[round + 1][Math.floor(index / 2)];
        match.next_match_id = target.id;
        match.next_match_slot = index % 2 === 0 ? "A" : "B";
      } else {
        match.next_match_id = final.id;
        match.next_match_slot = "A";
      }

      const loserRound = round === 1 ? 1 : Math.min((round - 1) * 2, loserRoundCount);
      const target = losers[loserRound][Math.min(Math.floor(index / 2), losers[loserRound].length - 1)];
      match.loser_next_match_id = target.id;
      match.loser_next_match_slot = index % 2 === 0 ? "A" : "B";
    });
  }

  for (let round = 1; round <= loserRoundCount; round += 1) {
    losers[round].forEach((match, index) => {
      if (round < loserRoundCount) {
        const target = losers[round + 1][Math.min(Math.floor(index / 2), losers[round + 1].length - 1)];
        match.next_match_id = target.id;
        match.next_match_slot = index % 2 === 0 ? "A" : "B";
      } else {
        match.next_match_id = final.id;
        match.next_match_slot = "B";
      }
    });
  }

  return matches;
}
