import type { Match } from "./match";
import type { Team } from "./team";
import type { Tournament } from "./tournament";

export type Database = {
  public: {
    Tables: {
      tournaments: {
        Row: Tournament;
        Insert: Omit<Tournament, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Tournament>;
        Relationships: [];
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Team>;
        Relationships: [];
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Match>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
