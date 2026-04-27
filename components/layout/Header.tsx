"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createBrowserSupabase();

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase?.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="text-lg font-bold text-court-900" href="/">
          Badminton Bracket
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link className="text-slate-600 hover:text-court-700" href="/admin">
            대시보드
          </Link>
          {user ? (
            <>
              <Link className="hidden max-w-[180px] truncate text-slate-500 hover:text-court-700 sm:inline" href="/account">
                {user.email}
              </Link>
              <button className="text-slate-600 hover:text-court-700" onClick={handleLogout} type="button">
                로그아웃
              </button>
            </>
          ) : (
            <Link className="text-slate-600 hover:text-court-700" href="/login">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
