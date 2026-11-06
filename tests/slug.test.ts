import { describe, expect, it } from "vitest";
import { isReservedSlug, isValidSlugFormat, slugify } from "@/lib/slug";

describe("slugify", () => {
  it("harus mengubah nama standar menjadi format kebab-case", () => {
    expect(slugify("Ahmad Habibi")).toBe("ahmad-habibi");
  });

  it("harus membersihkan spasi berlebih dan titik/karakter pemisah", () => {
    expect(slugify("  Siti  N. Aisyah ")).toBe("siti-n-aisyah");
  });

  it("harus menormalisasi karakter beraksen/diakritik", () => {
    expect(slugify("Zoë Müller")).toBe("zoe-muller");
  });

  it("harus menghasilkan string kosong jika nama hanya berisi simbol", () => {
    expect(slugify("@#$%^&*()_+")).toBe("");
    expect(slugify("   ")).toBe("");
  });

  it("harus membatasi panjang slug maksimal 60 karakter tanpa trailing dash", () => {
    const longName = "A".repeat(80);
    const result = slugify(longName);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result.endsWith("-")).toBe(false);
  });
});

describe("isReservedSlug", () => {
  it("harus mengenali slug yang dicadangkan sistem secara case-insensitive", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("Admin")).toBe(true);
    expect(isReservedSlug("CHECKOUT")).toBe(true);
    expect(isReservedSlug("api")).toBe(true);
    expect(isReservedSlug("invoice")).toBe(true);
  });

  it("harus mengembalikan false untuk slug nama pengguna biasa", () => {
    expect(isReservedSlug("ahmad-habibi")).toBe(false);
    expect(isReservedSlug("siti-n-aisyah")).toBe(false);
  });
});

describe("isValidSlugFormat", () => {
  it("harus memvalidasi slug yang valid", () => {
    expect(isValidSlugFormat("ahmad-habibi")).toBe(true);
    expect(isValidSlugFormat("user-123")).toBe(true);
    expect(isValidSlugFormat("abc")).toBe(true);
  });

  it("harus menolak slug yang terlalu pendek atau terlalu panjang", () => {
    expect(isValidSlugFormat("ab")).toBe(false);
    expect(isValidSlugFormat("a".repeat(61))).toBe(false);
  });

  it("harus menolak slug dengan karakter tidak diizinkan atau format dash salah", () => {
    expect(isValidSlugFormat("ahmad_habibi")).toBe(false);
    expect(isValidSlugFormat("-ahmad-habibi")).toBe(false);
    expect(isValidSlugFormat("ahmad-habibi-")).toBe(false);
    expect(isValidSlugFormat("ahmad--habibi")).toBe(false);
    expect(isValidSlugFormat("Ahmad-Habibi")).toBe(false);
  });
});
