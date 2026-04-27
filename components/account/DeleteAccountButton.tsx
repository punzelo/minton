"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createBrowserSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

export function DeleteAccountButton() {
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("계정과 내가 만든 대회 데이터를 모두 삭제합니다. 계속할까요?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setMessage("");

    const headers = await getAuthHeader();
    const response = await fetch("/api/account/delete", {
      method: "DELETE",
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message ?? "계정 삭제에 실패했습니다.");
      setIsDeleting(false);
      return;
    }

    await createBrowserSupabase()?.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div>
      <Button className="gap-2" disabled={isDeleting} onClick={handleDelete} type="button" variant="danger">
        <Trash2 size={16} />
        {isDeleting ? "삭제 중" : "계정 삭제"}
      </Button>
      {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
