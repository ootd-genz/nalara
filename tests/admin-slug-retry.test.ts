import { describe, it, expect } from "vitest";
import { getSlugCandidate, isValidSlugFormat } from "@/lib/slug";

describe("getSlugCandidate", () => {
  it("mengembalikan baseSlug pada attempt 1", () => {
    expect(getSlugCandidate("ahmad-habibi", 1)).toBe("ahmad-habibi");
    expect(getSlugCandidate("ahmad-habibi", 0)).toBe("ahmad-habibi");
  });

  it("menambahkan sufiks angka pada attempt > 1", () => {
    expect(getSlugCandidate("ahmad-habibi", 2)).toBe("ahmad-habibi-2");
    expect(getSlugCandidate("ahmad-habibi", 3)).toBe("ahmad-habibi-3");
    expect(getSlugCandidate("ahmad-habibi", 20)).toBe("ahmad-habibi-20");
  });

  it("memotong base slug sehingga total panjang tidak melebihi 60 karakter", () => {
    const longSlug = "a".repeat(60);
    const candidate2 = getSlugCandidate(longSlug, 2);
    expect(candidate2.length).toBeLessThanOrEqual(60);
    expect(candidate2.endsWith("-2")).toBe(true);
    expect(isValidSlugFormat(candidate2)).toBe(true);

    const candidate20 = getSlugCandidate(longSlug, 20);
    expect(candidate20.length).toBeLessThanOrEqual(60);
    expect(candidate20.endsWith("-20")).toBe(true);
    expect(isValidSlugFormat(candidate20)).toBe(true);
  });

  it("tidak menghasilkan tanda hubung ganda saat base slug dipotong di posisi tanda hubung", () => {
    // "kata-kata-..." sampai mendekati 58 karakter
    const base = "kata-".repeat(12); // 60 karakter, berakhir dengan "-"
    const candidate = getSlugCandidate(base, 2);
    expect(candidate.includes("--")).toBe(false);
    expect(isValidSlugFormat(candidate)).toBe(true);
  });
});
