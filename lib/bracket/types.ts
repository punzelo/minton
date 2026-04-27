import type { Match, MatchSlot } from "@/types/match";
import type { Team } from "@/types/team";

export type GeneratedMatch = Omit<Match, "created_at" | "updated_at">;

export type MatchPointer = {
  id: string;
  slot: MatchSlot;
};

export type GenerateBracketInput = {
  tournamentId: string;
  teams: Team[];
};
