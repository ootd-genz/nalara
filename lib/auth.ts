import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Tipe error otentikasi / otorisasi admin
 */
export class AdminAuthError extends Error {
  constructor(
    message: string,
    public code: "UNAUTHENTICATED" | "FORBIDDEN" = "UNAUTHENTICATED"
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

/**
 * Memastikan request dipanggil oleh akun admin yang sah (defense-in-depth).
 * Memeriksa:
 * 1. Keberadaan sesi aktif via supabase.auth.getUser() (bukan getSession).
 * 2. Keberadaan record user_id di tabel public.admins.
 *
 * @throws AdminAuthError jika belum login (UNAUTHENTICATED) atau bukan admin (FORBIDDEN)
 * @returns { user, supabase } client server yang membawa sesi terautentikasi
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AdminAuthError(
      "Sesi telah berakhir atau tidak valid. Silakan login kembali.",
      "UNAUTHENTICATED"
    );
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    throw new AdminAuthError(
      "Akun ini tidak memiliki akses admin.",
      "FORBIDDEN"
    );
  }

  return { user, supabase };
}

/**
 * Memeriksa apakah user tertentu terdaftar sebagai admin di database.
 */
export async function checkIsAdmin(user: User): Promise<boolean> {
  if (!user || !user.id) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return !error && !!data;
}
