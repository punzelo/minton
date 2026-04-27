import Link from "next/link";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { getPublicTournaments } from "@/lib/data/tournaments";

export default async function AdminPage() {
  const tournaments = await getPublicTournaments();

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">운영자 대시보드</h1>
          <p className="mt-1 text-sm text-slate-500">MVP에서는 현재 공개 대회 목록을 함께 보여줍니다.</p>
        </div>
        <Link className="inline-flex items-center gap-2 rounded-md bg-court-700 px-4 py-2 text-sm font-semibold text-white" href="/admin/tournaments/new">
          <Plus size={16} />
          새 대회
        </Link>
      </div>
      <Card>
        <h2 className="mb-4 text-lg font-semibold">대회 목록</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {tournaments.length === 0 ? (
            <p className="text-sm text-slate-500">대회가 없습니다.</p>
          ) : (
            tournaments.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} />)
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
