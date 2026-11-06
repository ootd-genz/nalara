import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  allPackages,
  getPackageById,
  staticLandingPackage,
} from "@/lib/commerce";
import {
  getStaticLandingWhatsAppMessage,
  getStaticLandingWhatsAppUrl,
  staticLandingWhatsappUrl,
} from "@/lib/site-config";
import { isReservedSlug, RESERVED_SLUGS } from "@/lib/slug";
import { demoCategories, demoTemplates } from "@/lib/demo-templates";
import sitemap from "@/app/sitemap";

describe("Paket Baru Rp200.000 (staticLandingPackage)", () => {
  it("harus memiliki harga Rp200.000 dan mata uang IDR", () => {
    expect(staticLandingPackage.price).toBe(200_000);
    expect(staticLandingPackage.currency).toBe("IDR");
    expect(staticLandingPackage.name).toBe("Landing Page Statis");
  });

  it("harus terdaftar dalam allPackages dan dapat diakses melalui getPackageById", () => {
    expect(allPackages).toContain(staticLandingPackage);
    expect(getPackageById(staticLandingPackage.id)).toBe(staticLandingPackage);
  });

  it("harus menyertakan pesan WhatsApp yang menyebutkan harga dan nama paket", () => {
    const defaultMsg = getStaticLandingWhatsAppMessage();
    expect(defaultMsg).toContain("Landing Page Statis");
    expect(defaultMsg).toContain("200.000");

    const templateMsg = getStaticLandingWhatsAppMessage("Finexy FinTech Dashboard");
    expect(templateMsg).toContain("Finexy FinTech Dashboard");
    expect(templateMsg).toContain("200.000");
  });

  it("harus menghasilkan tautan WhatsApp yang valid", () => {
    const url = getStaticLandingWhatsAppUrl("6289517795206", "Fashion Editorial");
    expect(url).toContain("https://wa.me/6289517795206?text=");
    expect(url).toContain(encodeURIComponent("Fashion Editorial"));
    expect(staticLandingWhatsappUrl).toBeDefined();
  });
});

describe("Keamanan Rute /demo dan RESERVED_SLUGS", () => {
  it("harus menyertakan 'demo' dalam RESERVED_SLUGS agar tidak bentrok dengan [slug]", () => {
    expect(RESERVED_SLUGS.has("demo")).toBe(true);
    expect(isReservedSlug("demo")).toBe(true);
    expect(isReservedSlug("DEMO")).toBe(true);
  });

  it("harus menyertakan /demo dalam sitemap", () => {
    const entries = sitemap();
    const demoEntry = entries.find((e) => e.url.endsWith("/demo"));
    expect(demoEntry).toBeDefined();
    expect(demoEntry?.priority).toBe(0.8);
  });
});

describe("Koleksi Template Demo (/demo)", () => {
  it("harus memiliki tepat 10 template dari folder landingpage", () => {
    expect(demoTemplates.length).toBe(10);
  });

  it("semua template harus memiliki file fisik yang ada di public/demos/", () => {
    for (const t of demoTemplates) {
      const relativePath = t.demoUrl.replace(/^\//, "");
      const fullPath = path.resolve(process.cwd(), "public", relativePath.replace(/^demos\//, "demos/"));
      expect(fs.existsSync(fullPath), `File fisik tidak ditemukan: ${fullPath}`).toBe(true);
      expect(fs.statSync(fullPath).size).toBeGreaterThan(0);
    }
  });

  it("semua template harus memiliki kategori yang terdaftar dalam demoCategories", () => {
    const validCategoryKeys = new Set(demoCategories.map((c) => c.key));
    for (const t of demoTemplates) {
      expect(validCategoryKeys.has(t.category)).toBe(true);
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.tags.length).toBeGreaterThan(0);
    }
  });
});
