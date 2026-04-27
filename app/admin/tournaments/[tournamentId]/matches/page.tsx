import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { MatchResultForm } from "@/components/matches/MatchResultForm";
import { getTournamentBundle } from "@/lib/data/tournaments";

export default async function AdminMatchesPage({ params }: { params: Promise<{ tournamentId: string }> }) {
  const { tournamentId } = await params;
  const { tournament, matches } = await getTournamentBundle(tournamentId);

  if (!tournament) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">경기 결과 입력</h1>
        <p className="mt-1 text-sm text-slate-500">{tournament.name}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.length === 0 ? (
          <p className="text-sm text-slate-500">먼저 대진표를 생성해주세요.</p>
        ) : (
          matches.map((match) => <MatchResultForm key={match.id} match={match} />)
        )}
      </div>
    </PageContainer>
  );
}
