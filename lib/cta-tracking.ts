export const CTA_LOCATIONS = [
  "hero",
  "offer-beginner",
  "offer-starter",
  "offer-business",
  "floating",
  "footer",
  "portfolio-banner",
] as const;

export type CtaLocation = (typeof CTA_LOCATIONS)[number];

export const PACKAGES = ["beginner", "starter", "business"] as const;
export type PackageName = (typeof PACKAGES)[number];

export interface TrackCtaPayload {
  slug?: string | null;
  ctaLocation: CtaLocation;
  package?: PackageName | null;
}

export function isValidCtaLocation(loc: unknown): loc is CtaLocation {
  return typeof loc === "string" && (CTA_LOCATIONS as readonly string[]).includes(loc);
}

export function isValidPackage(pkg: unknown): pkg is PackageName {
  return typeof pkg === "string" && (PACKAGES as readonly string[]).includes(pkg);
}

// Memory cache sisi klien untuk debounce klik ganda (1.5 detik per slug + lokasi)
const recentClientClicks = new Map<string, number>();
const CLIENT_DEBOUNCE_MS = 1500;

/**
 * Mencatat klik CTA WhatsApp secara asinkron dan senyap (silent).
 * Menggunakan navigator.sendBeacon jika didukung, dengan fallback fetch keepalive.
 * Tidak menunda atau memblokir navigasi pengunjung ke WhatsApp.
 */
export function trackCtaClick(payload: TrackCtaPayload): void {
  if (typeof window === "undefined") return;

  const slug = (payload.slug || "default").trim().toLowerCase();
  const ctaLocation = payload.ctaLocation;
  const pkg = payload.package || null;

  if (!isValidCtaLocation(ctaLocation)) return;

  // Deduplikasi client-side
  const dedupeKey = `${slug}:${ctaLocation}:${pkg || ""}`;
  const now = Date.now();
  const lastClick = recentClientClicks.get(dedupeKey);

  if (lastClick && now - lastClick < CLIENT_DEBOUNCE_MS) {
    return;
  }
  recentClientClicks.set(dedupeKey, now);

  // Bersihkan cache yang sudah kadaluarsa
  if (recentClientClicks.size > 50) {
    for (const [key, timestamp] of recentClientClicks.entries()) {
      if (now - timestamp > CLIENT_DEBOUNCE_MS * 2) {
        recentClientClicks.delete(key);
      }
    }
  }

  const bodyData = JSON.stringify({
    slug,
    ctaLocation,
    package: pkg,
  });

  try {
    const endpoint = "/api/track-cta";

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([bodyData], { type: "application/json" });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    }

    // Fallback: fetch dengan keepalive agar request tetap terkirim saat tab berpindah
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyData,
      keepalive: true,
    }).catch(() => {
      // Senyap: jangan log error atau ganggu pengalaman pengunjung
    });
  } catch {
    // Senyap
  }
}
