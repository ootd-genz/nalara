import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Memvalidasi dan mengambil variabel lingkungan Supabase untuk server.
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
 * Membuat Supabase client untuk lingkungan Server Components dan Server Actions (Next.js 16).
 * Memanfaatkan API cookies() yang bersifat async.
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll dipanggil dari Server Component; dapat diabaikan jika middleware/proxy menyegarkan sesi.
        }
      },
    },
  });
}
