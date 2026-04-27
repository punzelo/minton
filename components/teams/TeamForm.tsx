"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createBrowserSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

export function TeamForm({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const headers = await getAuthHeader();

    const response = await fetch(`/api/tournaments/${tournamentId}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        name: form.get("name"),
        player1Name: form.get("player1Name"),
        player2Name: form.get("player2Name"),
        seed: form.get("seed"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message ?? "팀 추가에 실패했습니다.");
      return;
    }

    formElement.reset();
    setMessage("");
    router.refresh();
  }

  return (
    <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
      <Input label="팀명" name="name" required />
      <Input label="시드" name="seed" type="number" min="1" />
      <Input label="선수 1" name="player1Name" required />
      <Input label="선수 2" name="player2Name" />
      {message ? <p className="text-sm text-red-600 md:col-span-2">{message}</p> : null}
      <div className="md:col-span-2">
        <Button type="submit">팀 추가</Button>
      </div>
    </form>
  );
}
