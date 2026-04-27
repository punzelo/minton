"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { MatchWithTeams } from "@/types/match";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createBrowserSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

export function MatchResultForm({ match }: { match: MatchWithTeams }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const canSubmit = match.team_a_id && match.team_b_id && match.status !== "completed";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const headers = await getAuthHeader();

    const response = await fetch(`/api/matches/${match.id}/result`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        scoreA: form.get("scoreA"),
        scoreB: form.get("scoreB"),
        winnerTeamId: form.get("winnerTeamId"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message ?? "결과 저장에 실패했습니다.");
      return;
    }

    setMessage("");
    router.refresh();
  }

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-4" id={match.id} onSubmit={handleSubmit}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold">{match.bracket} R{match.round} M{match.match_order}</h3>
        <span className="text-xs font-semibold text-slate-500">{match.status}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input label={`${match.team_a?.name ?? "팀 A"} 점수`} name="scoreA" type="number" min="0" required disabled={!canSubmit} />
        <Input label={`${match.team_b?.name ?? "팀 B"} 점수`} name="scoreB" type="number" min="0" required disabled={!canSubmit} />
      </div>
      <label className="mt-3 block text-sm font-medium text-slate-700">
        승자
        <select className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" name="winnerTeamId" required disabled={!canSubmit}>
          <option value="">선택</option>
          {match.team_a_id ? <option value={match.team_a_id}>{match.team_a?.name ?? "팀 A"}</option> : null}
          {match.team_b_id ? <option value={match.team_b_id}>{match.team_b?.name ?? "팀 B"}</option> : null}
        </select>
      </label>
      {message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null}
      <Button className="mt-4" disabled={!canSubmit} type="submit">
        결과 저장
      </Button>
    </form>
  );
}
