import { createServerSupabase } from "@/lib/supabase/server";
import type { MatchWithTeams } from "@/types/match";
import type { Team } from "@/types/team";
import type { Tournament } from "@/types/tournament";

export async function getPublicTournaments(): Promise<Tournament[]> {
  const supabase = createServerSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getTournamentBundle(tournamentId: string): Promise<{
  tournament: Tournament | null;
  teams: Team[];
  matches: MatchWithTeams[];
}> {
  const supabase = createServerSupabase();

  if (!supabase) {
    return { tournament: null, teams: [], matches: [] };
  }

  const [{ data: tournament }, { data: teams }, { data: matches }] = await Promise.all([
    supabase.from("tournaments").select("*").eq("id", tournamentId).single(),
    supabase.from("teams").select("*").eq("tournament_id", tournamentId).order("seed"),
    supabase
      .from("matches")
      .select("*, team_a:teams!matches_team_a_id_fkey(id,name), team_b:teams!matches_team_b_id_fkey(id,name)")
      .eq("tournament_id", tournamentId)
      .order("bracket")
      .order("round")
      .order("match_order"),
  ]);

  return {
    tournament: tournament ?? null,
    teams: teams ?? [],
    matches: (matches ?? []) as MatchWithTeams[],
  };
}
