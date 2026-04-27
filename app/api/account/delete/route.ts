import { NextResponse } from "next/server";
import { createApiSupabase } from "@/lib/supabase/api";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  const userSupabase = createApiSupabase(request);
  const serviceSupabase = createServiceSupabase();

  if (!userSupabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 필요합니다." }, { status: 500 });
  }

  if (!serviceSupabase) {
    return NextResponse.json({ message: "SUPABASE_SERVICE_ROLE_KEY가 서버 환경변수에 필요합니다." }, { status: 500 });
  }

  const { data: userData, error: userError } = await userSupabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const userId = userData.user.id;

  const { error: tournamentError } = await serviceSupabase.from("tournaments").delete().eq("owner_id", userId);

  if (tournamentError) {
    return NextResponse.json({ message: tournamentError.message }, { status: 400 });
  }

  const { error: profileError } = await serviceSupabase.from("profiles").delete().eq("id", userId);

  if (profileError) {
    return NextResponse.json({ message: profileError.message }, { status: 400 });
  }

  const { error: deleteError } = await serviceSupabase.auth.admin.deleteUser(userId);

  if (deleteError) {
    return NextResponse.json({ message: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
