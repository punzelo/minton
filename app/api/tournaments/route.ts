import { NextResponse } from "next/server";
import { createApiSupabase } from "@/lib/supabase/api";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json([]);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("tournaments").select("*").eq("is_public", true).order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = createApiSupabase(request);

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 필요합니다." }, { status: 500 });
  }

  const body = await request.json();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tournaments")
    .insert({
      owner_id: userData.user.id,
      name: body.name,
      description: body.description ?? null,
      match_type: body.matchType ?? "doubles",
      bracket_type: "double_elimination",
      status: "draft",
      is_public: Boolean(body.isPublic),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
