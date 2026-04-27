import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Tournament } from "@/types/tournament";
import { Badge } from "@/components/ui/Badge";

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Link className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-court-500" href={`/tournaments/${tournament.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{tournament.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{formatDate(tournament.created_at)}</p>
        </div>
        <Badge>{tournament.status}</Badge>
      </div>
      {tournament.description ? <p className="mt-3 line-clamp-2 text-sm text-slate-600">{tournament.description}</p> : null}
    </Link>
  );
}
