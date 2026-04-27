import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();

  return token.length > 0 ? token : null;
}

export function createApiSupabase(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  const authorization = request.headers.get("authorization") ?? "";

  return createClient<Database>(url, key, {
    global: {
      headers: authorization ? { Authorization: authorization } : {},
    },
    auth: {
      persistSession: false,
    },
  });
}

export async function getRequestUser(request: Request) {
  const supabase = createApiSupabase(request);
  const token = getBearerToken(request);

  if (!supabase || !token) {
    return { supabase, user: null, error: null };
  }

  const { data, error } = await supabase.auth.getUser(token);

  return {
    supabase,
    user: data.user ?? null,
    error,
  };
}
