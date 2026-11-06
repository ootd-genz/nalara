import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CTA_LOCATIONS,
  PACKAGES,
  isValidCtaLocation,
  isValidPackage,
  trackCtaClick,
} from "@/lib/cta-tracking";
import { POST } from "@/app/api/track-cta/route";

describe("CTA Tracking Helper (lib/cta-tracking.ts)", () => {
  it("harus memvalidasi semua lokasi CTA yang diizinkan", () => {
    const expectedLocations = [
      "hero",
      "offer-beginner",
      "offer-starter",
      "offer-business",
      "floating",
      "footer",
      "portfolio-banner",
    ];

    expect(CTA_LOCATIONS).toEqual(expectedLocations);

    for (const loc of expectedLocations) {
      expect(isValidCtaLocation(loc)).toBe(true);
    }

    expect(isValidCtaLocation("unknown-cta")).toBe(false);
    expect(isValidCtaLocation("")).toBe(false);
    expect(isValidCtaLocation(null)).toBe(false);
    expect(isValidCtaLocation(undefined)).toBe(false);
  });

  it("harus memvalidasi nama paket yang diizinkan", () => {
    expect(PACKAGES).toEqual(["beginner", "starter", "business"]);
    expect(isValidPackage("beginner")).toBe(true);
    expect(isValidPackage("starter")).toBe(true);
    expect(isValidPackage("business")).toBe(true);
    expect(isValidPackage("enterprise")).toBe(false);
    expect(isValidPackage(null)).toBe(false);
  });

  it("trackCtaClick harus berjalan tanpa melempar error saat window/navigator tidak ada atau ada", () => {
    // Skenario aman ketika dipanggil di lingkungan apapun
    expect(() => {
      trackCtaClick({
        slug: "ahmad-habibi",
        ctaLocation: "hero",
      });
    }).not.toThrow();
  });
});

describe("Route Handler POST /api/track-cta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("harus merespons 204 (No Content) pada payload yang valid", async () => {
    const req = new Request("http://localhost:3000/api/track-cta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "ahmad-habibi",
        ctaLocation: "offer-starter",
        package: "starter",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(204);
  });

  it("harus merespons 204 secara senyap jika body kosong atau JSON tidak valid", async () => {
    const emptyReq = new Request("http://localhost:3000/api/track-cta", {
      method: "POST",
      body: "",
    });
    const resEmpty = await POST(emptyReq);
    expect(resEmpty.status).toBe(204);

    const invalidJsonReq = new Request("http://localhost:3000/api/track-cta", {
      method: "POST",
      body: "{ corrupted json",
    });
    const resInvalid = await POST(invalidJsonReq);
    expect(resInvalid.status).toBe(204);
  });

  it("harus merespons 204 secara senyap jika lokasi CTA tidak valid", async () => {
    const req = new Request("http://localhost:3000/api/track-cta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "ahmad-habibi",
        ctaLocation: "unregistered-location",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(204);
  });

  it("harus menerima slug 'default' untuk klik dari landing page utama '/'", async () => {
    const req = new Request("http://localhost:3000/api/track-cta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "default",
        ctaLocation: "floating",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(204);
  });
});
