export type TeamStatus = "active" | "eliminated";

export type Team = {
  id: string;
  tournament_id: string;
  name: string;
  player1_name: string;
  player2_name: string | null;
  seed: number | null;
  status: TeamStatus;
  created_at: string;
};
