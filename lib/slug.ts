/**
 * Utilitas pembuatan dan validasi slug URL user (PRD 6.2)
 */

/**
 * Daftar slug yang dicadangkan oleh sistem dan rute aplikasi agar tidak bentrok.
 */
export const RESERVED_SLUGS = new Set<string>([
  "admin",
  "api",
  "checkout",
  "demo",
  "invoice",
  "login",
  "logout",
  "robots",
  "sitemap",
  "_next",
  "favicon",
  "static",
  "public",
  "masalah",
  "solusi",
  "portofolio",
  "penawaran",
]);

/**
 * Mengubah nama pengguna menjadi slug URL yang bersih.
 * Aturan:
 * 1. Huruf kecil (lowercase).
 * 2. Menghapus aksen/diakritik via NFKD.
 * 3. Mengubah karakter non-alfanumerik menjadi tanda hubung (-).
 * 4. Merapikan tanda hubung berulang dan di ujung string.
 * 5. Membatasi panjang maksimal 60 karakter.
 *
 * @param name - Nama pengguna (mis. "Ahmad Habibi")
 * @returns Slug bersih (mis. "ahmad-habibi") atau string kosong jika hanya simbol
 */
export function slugify(name: string): string {
  if (!name) return "";

  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Hapus karakter aksen/diakritik
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Ganti semua non-alfanumerik dengan -
    .replace(/^-+|-+$/g, "") // Hapus tanda hubung di awal dan akhir
    .slice(0, 60)
    .replace(/-+$/, ""); // Pastikan tidak ada trailing dash setelah pemotongan 60 karakter
}

/**
 * Memeriksa apakah slug termasuk dalam daftar slug yang dicadangkan sistem.
 *
 * @param slug - Slug yang akan diperiksa (case-insensitive)
 * @returns true jika slug dicadangkan, false jika aman digunakan
 */
export function isReservedSlug(slug: string): boolean {
  if (!slug) return false;
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
}

/**
 * Memeriksa apakah format slug valid sesuai aturan skema database:
 * Huruf kecil dan angka dengan pemisah tanda hubung tunggal, panjang 3-60 karakter.
 *
 * @param slug - Slug yang akan divalidasi
 * @returns true jika format slug valid
 */
export function isValidSlugFormat(slug: string): boolean {
  if (!slug || slug.length < 3 || slug.length > 60) return false;
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Menghasilkan kandidat slug dengan sufiks numerik bertahap jika terjadi tabrakan unik (23505).
 * Percobaan 1: baseSlug (misal: "ahmad-habibi")
 * Percobaan 2: "ahmad-habibi-2"
 * Percobaan 3: "ahmad-habibi-3"
 * Memastikan total panjang tidak melebihi 60 karakter sesuai batasan skema database.
 *
 * @param baseSlug - Slug dasar yang telah divalidasi/dislugify
 * @param attempt - Nomor percobaan (1, 2, 3, ...)
 * @returns Slug kandidat dengan panjang <= 60 karakter
 */
export function getSlugCandidate(baseSlug: string, attempt: number): string {
  if (attempt <= 1) {
    return baseSlug.slice(0, 60).replace(/-+$/, "");
  }

  const suffix = `-${attempt}`;
  const maxBaseLength = 60 - suffix.length;
  const trimmedBase = baseSlug.slice(0, maxBaseLength).replace(/-+$/, "");
  return `${trimmedBase}${suffix}`;
}
