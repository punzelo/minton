import { notFound } from "next/navigation";
import { BracketView } from "@/components/brackets/BracketView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { getTournamentBundle } from "@/lib/data/tournaments";

export default async function PublicTournamentPage({ params }: { params: Promise<{ tournamentId: string }> }) {
  const { tournamentId } = await params;
  const { tournament, teams, matches } = await getTournamentBundle(tournamentId);

  if (!tournament) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-sm font-semibold text-court-700">공개 대진표</p>
        <h1 className="mt-1 text-2xl font-bold">{tournament.name}</h1>
        <p className="mt-1 text-sm text-slate-500">상태: {tournament.status} · 참가팀 {teams.length}개</p>
      </div>
      <Card>
        <BracketView matches={matches} />
      </Card>
    </PageContainer>
  );
}
