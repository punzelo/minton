import { NextResponse } from "next/server";
import { createApiSupabase } from "@/lib/supabase/api";

export async function DELETE(request: Request, { params }: { params: Promise<{ teamId: string }> }) {
  const supabase = createApiSupabase(request);
  const { teamId } = await params;

  if (!supabase) {
    return NextResponse.json({ message: "Supabase 환경변수가 필요합니다." }, { status: 500 });
  }

  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
