export type BracketGroup = "winners" | "losers" | "finals";
export type MatchStatus = "pending" | "ready" | "completed";
export type MatchSlot = "A" | "B";

export type Match = {
  id: string;
  tournament_id: string;
  bracket: BracketGroup;
  round: number;
  match_order: number;
  team_a_id: string | null;
  team_b_id: string | null;
  score_a: number | null;
  score_b: number | null;
  winner_team_id: string | null;
  loser_team_id: string | null;
  status: MatchStatus;
  next_match_id: string | null;
  next_match_slot: MatchSlot | null;
  loser_next_match_id: string | null;
  loser_next_match_slot: MatchSlot | null;
  created_at: string;
  updated_at: string;
};

export type MatchWithTeams = Match & {
  team_a?: { id: string; name: string } | null;
  team_b?: { id: string; name: string } | null;
};
