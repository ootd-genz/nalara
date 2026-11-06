import { describe, it, expect } from "vitest";
import {
  siteConfig,
  whatsappUrl,
  beginnerWhatsappUrl,
  starterWhatsappUrl,
  businessWhatsappUrl,
  catalogWhatsappUrl,
  onlineStoreWhatsappUrl,
  getConsultationWhatsAppUrl,
  getBeginnerWhatsAppUrl,
  getStarterWhatsAppUrl,
  getBusinessWhatsAppUrl,
  getBeginnerWhatsAppMessage,
  getStarterWhatsAppMessage,
  getBusinessWhatsAppMessage,
  defaultWhatsAppMessage,
} from "@/lib/site-config";

describe("Regression Baseline WhatsApp URLs (Sesuai docs/audit.md)", () => {
  it("harus memiliki nomor default NALARA 6289517795206", () => {
    expect(siteConfig.whatsappNumber).toBe("6289517795206");
  });

  it("harus menghasilkan tautan WhatsApp konsultasi utama yang sama persis dengan baseline", () => {
    expect(whatsappUrl).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(defaultWhatsAppMessage)}`
    );
  });

  it("harus menghasilkan tautan WhatsApp Paket Beginner yang sama persis dengan baseline", () => {
    expect(beginnerWhatsappUrl).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(getBeginnerWhatsAppMessage())}`
    );
  });

  it("harus menghasilkan tautan WhatsApp Paket Starter yang sama persis dengan baseline", () => {
    expect(starterWhatsappUrl).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(getStarterWhatsAppMessage())}`
    );
    expect(catalogWhatsappUrl).toBe(starterWhatsappUrl);
  });

  it("harus menghasilkan tautan WhatsApp Paket Business yang sama persis dengan baseline", () => {
    expect(businessWhatsappUrl).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(getBusinessWhatsAppMessage())}`
    );
    expect(onlineStoreWhatsappUrl).toBe(businessWhatsappUrl);
  });

  it("harus menghasilkan tautan WhatsApp dinamis untuk user tanpa mengubah template pesan", () => {
    const userPhone = "6289517795206";

    expect(getConsultationWhatsAppUrl(userPhone)).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(defaultWhatsAppMessage)}`
    );

    expect(getBeginnerWhatsAppUrl(userPhone)).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(getBeginnerWhatsAppMessage())}`
    );

    expect(getStarterWhatsAppUrl(userPhone)).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(getStarterWhatsAppMessage())}`
    );

    expect(getBusinessWhatsAppUrl(userPhone)).toBe(
      `https://wa.me/6289517795206?text=${encodeURIComponent(getBusinessWhatsAppMessage())}`
    );
  });

  it("harus menjaga defaultWhatsAppMessage tetap utuh sesuai teks produksi", () => {
    expect(defaultWhatsAppMessage).toBe(
      "Halo NALARA, saya ingin konsultasi paket pembuatan website untuk bisnis saya. Nama bisnis: ... Jenis produk/jasa: ... Paket yang diminati: ..."
    );
  });
});
