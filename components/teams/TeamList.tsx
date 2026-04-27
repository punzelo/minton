"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { Team } from "@/types/team";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createBrowserSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

export function TeamList({ teams }: { teams: Team[] }) {
  const router = useRouter();

  async function deleteTeam(teamId: string) {
    const headers = await getAuthHeader();
    await fetch(`/api/teams/${teamId}`, {
      method: "DELETE",
      headers,
    });
    router.refresh();
  }

  if (teams.length === 0) {
    return <p className="text-sm text-slate-500">등록된 팀이 없습니다.</p>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {teams.map((team) => (
        <div className="flex items-center justify-between gap-3 py-3" key={team.id}>
          <div>
            <p className="font-semibold">{team.seed ? `${team.seed}. ` : ""}{team.name}</p>
            <p className="text-sm text-slate-500">
              {[team.player1_name, team.player2_name].filter(Boolean).join(" / ")}
            </p>
          </div>
          <button className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => deleteTeam(team.id)} type="button" title="팀 삭제">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
