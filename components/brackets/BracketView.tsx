import type { BracketGroup, MatchWithTeams } from "@/types/match";
import { MatchCard } from "@/components/brackets/MatchCard";

const labels: Record<BracketGroup, string> = {
  winners: "승자조",
  losers: "패자조",
  finals: "결승",
};

export function BracketView({ matches, admin = false }: { matches: MatchWithTeams[]; admin?: boolean }) {
  const groups: BracketGroup[] = ["winners", "losers", "finals"];

  if (matches.length === 0) {
    return <p className="text-sm text-slate-500">아직 생성된 대진표가 없습니다.</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const groupMatches = matches.filter((match) => match.bracket === group);
        const rounds = [...new Set(groupMatches.map((match) => match.round))].sort((a, b) => a - b);

        if (groupMatches.length === 0) {
          return null;
        }

        return (
          <section key={group}>
            <h2 className="mb-4 text-lg font-bold">{labels[group]}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {rounds.map((round) => (
                <div className="space-y-3" key={round}>
                  <p className="text-sm font-semibold text-slate-500">라운드 {round}</p>
                  {groupMatches
                    .filter((match) => match.round === round)
                    .sort((a, b) => a.match_order - b.match_order)
                    .map((match) => (
                      <MatchCard admin={admin} key={match.id} match={match} />
                    ))}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
