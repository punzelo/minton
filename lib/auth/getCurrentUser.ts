import { createServerSupabase } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = createServerSupabase();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
