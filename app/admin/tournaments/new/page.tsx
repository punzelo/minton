import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { TournamentForm } from "@/components/tournaments/TournamentForm";

export default function NewTournamentPage() {
  return (
    <PageContainer>
      <Card className="max-w-2xl">
        <h1 className="text-2xl font-bold">새 대회 만들기</h1>
        <p className="mt-1 text-sm text-slate-500">MVP는 더블 엘리미네이션 대진을 자동 생성합니다.</p>
        <div className="mt-6">
          <TournamentForm />
        </div>
      </Card>
    </PageContainer>
  );
}
