import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { normalizePhoneToWa } from "@/lib/phone";
import {
  slugify,
  isReservedSlug,
  isValidSlugFormat,
  getSlugCandidate,
} from "@/lib/slug";

/**
 * Tipe data pengguna sesuai kolom tabel site_users di Supabase (PRD 7.2)
 */
export interface SiteUser {
  id: string;
  name: string;
  slug: string;
  phone_raw: string;
  phone_wa: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Tipe data pengguna dengan statistik klik CTA WhatsApp
 */
export interface SiteUserWithStats extends SiteUser {
  total_clicks: number;
  clicks_7d: number;
}

export interface GlobalCtaStats {
  total_clicks: number;
  clicks_7d: number;
}

/**
 * Tipe data publik yang dikembalikan untuk landing page dinamis /[slug]
 */
export interface ActiveUserSummary {
  name: string;
  slug: string;
  phone_wa: string;
}

export type SlugStatus = "active" | "inactive" | "missing";

export interface CreateUserInput {
  name: string;
  phone: string;
}

export interface UpdateUserInput {
  name: string;
  phone: string;
  slug?: string;
}

/**
 * Eksekusi query langsung ke database untuk mengambil data user aktif.
 * Menggunakan client publik (tanpa cookies) agar dapat di-cache secara aman.
 */
async function fetchActiveUserFromDb(
  slug: string
): Promise<ActiveUserSummary | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_users")
    .select("name, slug, phone_wa")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as ActiveUserSummary) || null;
}

/**
 * Mengambil informasi user aktif berdasarkan slug dengan Next.js 16 Data Cache.
 * - Cache key di-namespace per slug (mencegah kebocoran data antar user).
 * - Cache tag: 'site-users' dan 'site-user-${slug}'.
 * - TTL revalidasi: 60 detik (stale-while-revalidate), serta on-demand invalidation.
 *
 * @param slug - Slug unik user (case-insensitive)
 * @returns { name, slug, phone_wa } jika ditemukan dan aktif, atau null jika tidak ditemukan/nonaktif
 */
export async function getActiveUserBySlug(
  slug: string
): Promise<ActiveUserSummary | null> {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();

  try {
    const getCached = unstable_cache(
      async () => fetchActiveUserFromDb(normalized),
      [`site-user-by-slug-${normalized}`],
      {
        revalidate: 60,
        tags: ["site-users", `site-user-${normalized}`],
      }
    );

    return await getCached();
  } catch {
    return fetchActiveUserFromDb(normalized);
  }
}

/**
 * Mengambil ID user dari database berdasarkan slug.
 */
async function fetchUserIdFromDb(slug: string): Promise<string | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_users")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return (data as { id: string }).id;
}

/**
 * Mengambil ID user berdasarkan slug dengan Data Cache (untuk tracking klik CTA).
 */
export async function getUserIdBySlug(slug: string): Promise<string | null> {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();

  try {
    const getCached = unstable_cache(
      async () => fetchUserIdFromDb(normalized),
      [`site-user-id-${normalized}`],
      {
        revalidate: 60,
        tags: ["site-users", `site-user-${normalized}`],
      }
    );

    return await getCached();
  } catch {
    return fetchUserIdFromDb(normalized);
  }
}

/**
 * Eksekusi RPC get_slug_status ke database secara langsung via client publik.
 */
async function fetchSlugStatusFromDb(slug: string): Promise<SlugStatus> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_slug_status", {
    p_slug: slug,
  });

  if (error) {
    throw error;
  }

  return (data as SlugStatus) || "missing";
}

/**
 * Memeriksa status slug menggunakan RPC get_slug_status dengan Next.js 16 Data Cache.
 * Mengembalikan 'active', 'inactive', atau 'missing'.
 *
 * @param slug - Slug yang akan diperiksa
 * @returns Status slug: 'active' | 'inactive' | 'missing'
 */
export async function getSlugStatus(slug: string): Promise<SlugStatus> {
  if (!slug) return "missing";
  const normalized = slug.toLowerCase().trim();

  const getCached = unstable_cache(
    async () => fetchSlugStatusFromDb(normalized),
    [`slug-status-${normalized}`],
    {
      revalidate: 60,
      tags: ["site-users", `site-user-${normalized}`],
    }
  );

  return getCached();
}

/**
 * Mengambil semua daftar user (khusus admin, dilindungi RLS).
 *
 * @param query - Kata kunci pencarian opsional (nama atau nomor telepon)
 */
export async function listUsers(query?: string): Promise<SiteUser[]> {
  const supabase = await createClient();

  let req = supabase
    .from("site_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (query && query.trim()) {
    const q = query.trim();
    // Cari di nama, phone_raw, atau phone_wa
    req = req.or(`name.ilike.%${q}%,phone_raw.ilike.%${q}%,phone_wa.ilike.%${q}%`);
  }

  const { data, error } = await req;
  if (error) {
    throw error;
  }

  return (data as SiteUser[]) || [];
}

/**
 * Mengambil daftar user beserta statistik klik CTA WhatsApp (7 hari & total).
 */
export async function listUsersWithStats(
  query?: string
): Promise<SiteUserWithStats[]> {
  const users = await listUsers(query);
  if (users.length === 0) return [];

  const supabase = await createClient();
  const statsMap = new Map<string, { total_clicks: number; clicks_7d: number }>();

  try {
    const { data, error } = await supabase.rpc("get_user_cta_stats");
    if (!error && Array.isArray(data)) {
      for (const row of data) {
        if (row.user_id) {
          statsMap.set(row.user_id, {
            total_clicks: Number(row.total_clicks || 0),
            clicks_7d: Number(row.clicks_7d || 0),
          });
        }
      }
    } else {
      // Fallback: query langsung tabel cta_clicks jika RPC belum dieksekusi
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: clicksData } = await supabase
        .from("cta_clicks")
        .select("user_id, created_at")
        .not("user_id", "is", null);

      if (clicksData && Array.isArray(clicksData)) {
        for (const row of clicksData) {
          const uid = row.user_id as string;
          const curr = statsMap.get(uid) || { total_clicks: 0, clicks_7d: 0 };
          curr.total_clicks += 1;
          if (row.created_at >= sevenDaysAgo) {
            curr.clicks_7d += 1;
          }
          statsMap.set(uid, curr);
        }
      }
    }
  } catch (err) {
    console.warn("Gagal mengambil statistik klik CTA, menggunakan nilai 0:", err);
  }

  return users.map((u) => {
    const stat = statsMap.get(u.id) || { total_clicks: 0, clicks_7d: 0 };
    return {
      ...u,
      total_clicks: stat.total_clicks,
      clicks_7d: stat.clicks_7d,
    };
  });
}

/**
 * Mengambil statistik global klik CTA WhatsApp (seluruh klik).
 */
export async function getGlobalCtaStats(): Promise<GlobalCtaStats> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.rpc("get_global_cta_stats");
    if (!error && Array.isArray(data) && data.length > 0) {
      return {
        total_clicks: Number(data[0].total_clicks || 0),
        clicks_7d: Number(data[0].clicks_7d || 0),
      };
    }

    // Fallback: query tabel langsung
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: totalCount } = await supabase
      .from("cta_clicks")
      .select("*", { count: "exact", head: true });
    const { count: recentCount } = await supabase
      .from("cta_clicks")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo);

    return {
      total_clicks: totalCount || 0,
      clicks_7d: recentCount || 0,
    };
  } catch {
    return { total_clicks: 0, clicks_7d: 0 };
  }
}

/**
 * Menambahkan user baru (hanya admin, ditegakkan oleh RLS Supabase).
 * Membuat slug otomatis dari nama, menormalisasi nomor WhatsApp,
 * dan menangani tabrakan slug unik (23505) dengan retry hingga 20 kali.
 */
export async function createUser({
  name,
  phone,
}: CreateUserInput): Promise<SiteUser> {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    throw new Error("Nama harus berukuran antara 2 hingga 80 karakter.");
  }

  const phoneWa = normalizePhoneToWa(trimmedPhone);
  if (!phoneWa) {
    throw new Error(
      "Nomor telepon tidak valid. Gunakan format nomor Indonesia (contoh: 089517795206 atau +6289517795206)."
    );
  }

  const baseSlug = slugify(trimmedName);
  if (!baseSlug) {
    throw new Error("Nama tidak dapat diubah menjadi slug URL yang valid.");
  }

  // Jika slug dasar ternyata adalah reserved slug (misal: "admin"), awali kandidat dengan sufiks
  let startAttempt = 1;
  if (isReservedSlug(baseSlug)) {
    startAttempt = 2;
  }

  const supabase = await createClient();

  for (let attempt = startAttempt; attempt <= startAttempt + 20; attempt++) {
    const candidate = getSlugCandidate(baseSlug, attempt);
    if (isReservedSlug(candidate)) continue;

    const { data, error } = await supabase
      .from("site_users")
      .insert({
        name: trimmedName,
        slug: candidate,
        phone_raw: trimmedPhone,
        phone_wa: phoneWa,
        is_active: true,
      })
      .select()
      .single();

    if (!error && data) {
      revalidateTag(`site-user-${candidate}`, { expire: 0 });
      revalidateTag("site-users", { expire: 0 });
      revalidatePath(`/${candidate}`);
      revalidatePath("/admin");
      return data as SiteUser;
    }

    // Kode 23505 adalah PostgreSQL unique_violation untuk kolom slug
    if (error?.code === "23505") {
      continue;
    }

    throw error;
  }

  throw new Error(
    "Gagal membuat slug unik setelah 20 percobaan. Silakan coba nama lain."
  );
}

/**
 * Mengubah data user (nama, nomor telepon, dan opsional slug manual).
 * Slug TIDAK berubah otomatis saat nama diubah.
 */
export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<SiteUser> {
  const supabase = await createClient();

  // Ambil record saat ini
  const { data: existing, error: fetchError } = await supabase
    .from("site_users")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error("User tidak ditemukan.");
  }

  const trimmedName = input.name.trim();
  const trimmedPhone = input.phone.trim();

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    throw new Error("Nama harus berukuran antara 2 hingga 80 karakter.");
  }

  const phoneWa = normalizePhoneToWa(trimmedPhone);
  if (!phoneWa) {
    throw new Error(
      "Nomor telepon tidak valid. Gunakan format nomor Indonesia (contoh: 089517795206)."
    );
  }

  let targetSlug = existing.slug;

  // Jika admin secara eksplisit mengubah slug
  if (input.slug && input.slug.trim()) {
    const customSlug = input.slug.toLowerCase().trim();
    if (customSlug !== existing.slug) {
      if (!isValidSlugFormat(customSlug)) {
        throw new Error(
          "Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung tunggal (3–60 karakter)."
        );
      }
      if (isReservedSlug(customSlug)) {
        throw new Error("Slug ini dicadangkan oleh sistem dan tidak dapat digunakan.");
      }

      // Periksa keunikan
      const { data: conflict } = await supabase
        .from("site_users")
        .select("id")
        .eq("slug", customSlug)
        .neq("id", id)
        .maybeSingle();

      if (conflict) {
        throw new Error("Slug ini sudah digunakan oleh user lain.");
      }

      targetSlug = customSlug;
    }
  }

  const { data, error } = await supabase
    .from("site_users")
    .update({
      name: trimmedName,
      phone_raw: trimmedPhone,
      phone_wa: phoneWa,
      slug: targetSlug,
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw error || new Error("Gagal memperbarui data user.");
  }

  // Revalidasi cache
  revalidateTag(`site-user-${existing.slug}`, { expire: 0 });
  revalidatePath(`/${existing.slug}`);
  if (targetSlug !== existing.slug) {
    revalidateTag(`site-user-${targetSlug}`, { expire: 0 });
    revalidatePath(`/${targetSlug}`);
  }
  revalidateTag("site-users", { expire: 0 });
  revalidatePath("/admin");

  return data as SiteUser;
}

/**
 * Mengubah status aktif/nonaktif user.
 */
export async function setUserActive(
  id: string,
  isActive: boolean
): Promise<SiteUser> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_users")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw error || new Error("Gagal mengubah status aktif user.");
  }

  revalidateTag(`site-user-${data.slug}`, { expire: 0 });
  revalidateTag("site-users", { expire: 0 });
  revalidatePath(`/${data.slug}`);
  revalidatePath("/admin");

  return data as SiteUser;
}

/**
 * Menghapus user secara permanen.
 */
export async function deleteUser(id: string): Promise<void> {
  const supabase = await createClient();

  // Ambil slug sebelum dihapus untuk revalidasi
  const { data: existing } = await supabase
    .from("site_users")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("site_users").delete().eq("id", id);

  if (error) {
    throw error;
  }

  if (existing?.slug) {
    revalidateTag(`site-user-${existing.slug}`, { expire: 0 });
    revalidatePath(`/${existing.slug}`);
  }
  revalidateTag("site-users", { expire: 0 });
  revalidatePath("/admin");
}
