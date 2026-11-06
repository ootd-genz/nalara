/**
 * Utilitas normalisasi dan formatting nomor telepon WhatsApp (PRD 6.1)
 */

/**
 * Menormalisasi nomor telepon input admin menjadi format wa.me yang valid (628xxxxxxxxxx).
 * Aturan:
 * 1. Menghapus semua karakter non-digit.
 * 2. Awalan '0' diganti '62'.
 * 3. Awalan '8' ditambah '62' di depannya.
 * 4. Awalan '62' dibiarkan.
 * 5. Validasi format: harus diawali '628' dengan total panjang 10–15 digit.
 *
 * @param input - Input nomor telepon mentah
 * @returns Nomor format WhatsApp (misal "6289517795206") atau null jika tidak valid
 */
export function normalizePhoneToWa(input: string): string | null {
  if (!input) return null;

  let n = input.replace(/\D/g, "");

  if (n.startsWith("0")) {
    n = "62" + n.slice(1);
  } else if (n.startsWith("8")) {
    n = "62" + n;
  }

  if (!/^628\d{7,12}$/.test(n)) {
    return null;
  }

  return n;
}

/**
 * Memformat nomor wa.me menjadi tampilan yang rapi untuk antarmuka pengguna.
 * Contoh: "6289517795206" -> "+62 895-1779-5206"
 *
 * @param phoneWa - Nomor ter-normalisasi (628xxxxxxxx)
 * @returns Teks nomor dengan pemformatan tampilan
 */
export function formatPhoneDisplay(phoneWa: string): string {
  if (!phoneWa || !phoneWa.startsWith("628")) {
    return phoneWa;
  }

  const nationalDigits = phoneWa.slice(2); // "89517795206"
  // Format standar Indonesia: 3 digit pertama, 4 digit kedua, sisa digit berikutnya
  if (nationalDigits.length >= 9) {
    const part1 = nationalDigits.slice(0, 3);
    const part2 = nationalDigits.slice(3, 7);
    const part3 = nationalDigits.slice(7);
    return `+62 ${part1}-${part2}-${part3}`;
  }

  return `+${phoneWa}`;
}
