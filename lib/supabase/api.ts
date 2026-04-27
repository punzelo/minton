import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createApiSupabase(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  const authorization = request.headers.get("authorization") ?? "";

  return createClient<Database>(url, key, {
    global: {
      headers: authorization ? { authorization } : {},
    },
    auth: {
      persistSession: false,
    },
  });
}
