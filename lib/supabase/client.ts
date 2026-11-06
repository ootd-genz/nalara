import { createBrowserClient } from "@supabase/ssr";

/**
 * Memvalidasi dan mengambil variabel lingkungan Supabase untuk browser.
 */
function getSupabaseEnv() {
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
 * Membuat Supabase client untuk lingkungan browser (Client Component / login form).
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
