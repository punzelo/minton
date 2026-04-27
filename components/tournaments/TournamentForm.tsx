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

export function TournamentForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const headers = await getAuthHeader();

    if (!headers.Authorization) {
      setMessage("로그인 세션을 찾지 못했습니다. 다시 로그인한 뒤 시도해주세요.");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description"),
        matchType: form.get("matchType"),
        isPublic: form.get("isPublic") === "on",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message ?? "대회 생성에 실패했습니다.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/admin/tournaments/${result.id}`);
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="대회명" name="name" required />
      <Input label="설명" name="description" />
      <label className="block text-sm font-medium text-slate-700">
        경기 방식
        <select
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          name="matchType"
          defaultValue="doubles"
        >
          <option value="doubles">복식</option>
          <option value="singles">단식</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input className="h-4 w-4" name="isPublic" type="checkbox" defaultChecked />
        공개 대회로 표시
      </label>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "생성 중" : "대회 만들기"}
      </Button>
    </form>
  );
}
