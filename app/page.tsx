import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { getPublicTournaments } from "@/lib/data/tournaments";

export default async function HomePage() {
  const tournaments = await getPublicTournaments();

  return (
    <PageContainer>
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-court-100 bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-court-700">Badminton Bracket MVP</p>
          <h1 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">
            팀 등록부터 승자조·패자조 진행까지 한 화면에서 운영하세요.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            운영자는 대회를 만들고 팀을 등록한 뒤 자동 대진을 생성합니다. 참가자는 공개 링크로
            현재 경기와 결과를 바로 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-md bg-court-700 px-4 py-2 text-sm font-semibold text-white" href="/admin">
              운영자 대시보드
            </Link>
            <Link className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold" href="/login">
              로그인
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">공개 대회</h2>
          <div className="mt-4 space-y-3">
            {tournaments.length === 0 ? (
              <p className="text-sm text-slate-500">아직 공개된 대회가 없습니다.</p>
            ) : (
              tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))
            )}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
