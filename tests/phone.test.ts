import { describe, expect, it } from "vitest";
import { formatPhoneDisplay, normalizePhoneToWa } from "@/lib/phone";

describe("normalizePhoneToWa", () => {
  it("harus menormalisasi format nomor telepon valid ke format wa.me (628...)", () => {
    const expected = "6289517795206";

    expect(normalizePhoneToWa("089517795206")).toBe(expected);
    expect(normalizePhoneToWa("0895-1779-5206")).toBe(expected);
    expect(normalizePhoneToWa("+62 895 1779 5206")).toBe(expected);
    expect(normalizePhoneToWa("6289517795206")).toBe(expected);
  });

  it("harus menangani awalan 8 tanpa 0 atau 62 jika memenuhi panjang yang valid", () => {
    expect(normalizePhoneToWa("8951779206")).toBe("628951779206");
  });

  it("harus mengembalikan null untuk input tidak valid atau terlalu pendek", () => {
    expect(normalizePhoneToWa("123")).toBeNull();
    expect(normalizePhoneToWa("")).toBeNull();
    expect(normalizePhoneToWa("abc")).toBeNull();
    expect(normalizePhoneToWa("0812")).toBeNull();
  });
});

describe("formatPhoneDisplay", () => {
  it("harus memformat nomor WhatsApp menjadi format tampilan yang rapi", () => {
    expect(formatPhoneDisplay("6289517795206")).toBe("+62 895-1779-5206");
  });

  it("harus mengembalikan string aslinya jika bukan awalan 628", () => {
    expect(formatPhoneDisplay("12345")).toBe("12345");
  });
});
