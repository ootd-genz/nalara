import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Pastikan file .env.local sudah dikonfigurasi."
    );
  }

  return { url, anonKey };
}

/**
 * Client Supabase stateless khusus untuk pembacaan data publik server-side.
 * Tidak mengakses cookies/header dinamis sehingga aman digunakan di dalam Next.js Data Cache (unstable_cache).
 */
export function createPublicClient() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
