import Link from "next/link";
import { notFound } from "next/navigation";
import { BracketView } from "@/components/brackets/BracketView";
import { PageContainer } from "@/components/layout/PageContainer";
import { TeamForm } from "@/components/teams/TeamForm";
import { TeamList } from "@/components/teams/TeamList";
import { GenerateBracketButton } from "@/components/tournaments/GenerateBracketButton";
import { Card } from "@/components/ui/Card";
import { getTournamentBundle } from "@/lib/data/tournaments";

export default async function AdminTournamentPage({ params }: { params: Promise<{ tournamentId: string }> }) {
  const { tournamentId } = await params;
  const { tournament, teams, matches } = await getTournamentBundle(tournamentId);

  if (!tournament) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tournament.name}</h1>
          <p className="mt-1 text-sm text-slate-500">상태: {tournament.status} · 팀 {teams.length}개</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" href={`/tournaments/${tournament.id}`}>
            공개 페이지
          </Link>
          <Link className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" href={`/admin/tournaments/${tournament.id}/matches`}>
            결과 입력
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold">팀 등록</h2>
            <TeamForm tournamentId={tournament.id} />
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-semibold">팀 목록</h2>
            <TeamList teams={teams} />
            <div className="mt-5">
              <GenerateBracketButton tournamentId={tournament.id} />
            </div>
          </Card>
        </div>
        <Card>
          <BracketView admin matches={matches} />
        </Card>
      </div>
    </PageContainer>
  );
}
