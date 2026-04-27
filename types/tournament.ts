export type TournamentStatus = "draft" | "ready" | "ongoing" | "completed";
export type MatchType = "singles" | "doubles";
export type BracketType = "double_elimination";

export type Tournament = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  match_type: MatchType;
  bracket_type: BracketType;
  status: TournamentStatus;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
