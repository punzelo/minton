"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createBrowserSupabase } from "@/lib/supabase/client";

function getEmailRedirectTo() {
  return `${window.location.origin}/login`;
}

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createBrowserSupabase();

    if (!supabase) {
      setMessage(".env.local에 Supabase URL과 anon key를 설정해주세요.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const mode = String(form.get("mode"));

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getEmailRedirectTo(),
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        setMessage("회원가입 확인 메일을 보냈습니다. 메일 인증 후 로그인해주세요.");
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        setMessage("로그인 세션을 만들지 못했습니다. 이메일 인증 여부를 확인해주세요.");
        return;
      }
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <PageContainer>
      <Card className="mx-auto max-w-md">
        <h1 className="text-xl font-bold">운영자 로그인</h1>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input label="이메일" name="email" type="email" required />
          <Input label="비밀번호" name="password" type="password" required minLength={6} />
          <label className="block text-sm font-medium text-slate-700">
            모드
            <select
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              name="mode"
              defaultValue="signin"
            >
              <option value="signin">로그인</option>
              <option value="signup">회원가입</option>
            </select>
          </label>
          {message ? <p className="text-sm text-red-600">{message}</p> : null}
          <Button type="submit">계속</Button>
        </form>
      </Card>
    </PageContainer>
  );
}
