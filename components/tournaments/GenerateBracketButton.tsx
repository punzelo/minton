"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Network } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createBrowserSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

export function GenerateBracketButton({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleClick() {
    const headers = await getAuthHeader();
    const response = await fetch(`/api/tournaments/${tournamentId}/generate-bracket`, {
      method: "POST",
      headers,
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message ?? "대진 생성에 실패했습니다.");
      return;
    }

    setMessage("");
    router.refresh();
  }

  return (
    <div>
      <Button className="gap-2" onClick={handleClick} type="button">
        <Network size={16} />
        대진 자동 생성
      </Button>
      {message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
