import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { getUserIdBySlug } from "@/lib/site-users";
import { CTA_LOCATIONS, PACKAGES } from "@/lib/cta-tracking";

// Schema validasi payload
const trackCtaSchema = z.object({
  slug: z.string().trim().min(1).max(100),
  ctaLocation: z.enum(CTA_LOCATIONS),
  package: z.enum(PACKAGES).nullable().optional(),
});

// In-memory sliding window rate limiter & dedupe sederhana (tanpa IP atau data pribadi)
// Batasi maksimal 60 event per menit per target slug + ctaLocation untuk menghindari spam bot
interface RateLimitBucket {
  timestamps: number[];
  lastTime: number;
}
const rateLimitBuckets = new Map<string, RateLimitBucket>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;
const MIN_INTERVAL_MS = 300; // Dedupe burst identik dalam 300ms

function isRateLimited(key: string, now: number): boolean {
  let bucket = rateLimitBuckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [now], lastTime: now };
    rateLimitBuckets.set(key, bucket);
    return false;
  }

  // Dedupe klik sangat cepat (burst)
  if (now - bucket.lastTime < MIN_INTERVAL_MS) {
    return true;
  }
  bucket.lastTime = now;

  // Filter timestamp yang berada di dalam window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (bucket.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  bucket.timestamps.push(now);

  // Bersihkan map jika sudah terlalu besar
  if (rateLimitBuckets.size > 500) {
    for (const [k, b] of rateLimitBuckets.entries()) {
      if (b.timestamps.length === 0 || now - b.lastTime > WINDOW_MS * 2) {
        rateLimitBuckets.delete(k);
      }
    }
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return new Response(null, { status: 204 });
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return new Response(null, { status: 204 });
    }

    const validation = trackCtaSchema.safeParse(parsedJson);
    if (!validation.success) {
      return new Response(null, { status: 204 });
    }

    const { slug, ctaLocation, package: pkg } = validation.data;
    const normalizedSlug = slug.toLowerCase();

    // Cek in-memory rate limiting
    const rateLimitKey = `${normalizedSlug}:${ctaLocation}:${pkg || ""}`;
    if (isRateLimited(rateLimitKey, Date.now())) {
      // Abaikan request tanpa error
      return new Response(null, { status: 204 });
    }

    // Jika konfigurasi Supabase tidak tersedia (misal di test environment), return 204 senyap
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return new Response(null, { status: 204 });
    }

    // Resolusi user_id jika bukan slug default
    let userId: string | null = null;
    if (normalizedSlug !== "default") {
      try {
        userId = await getUserIdBySlug(normalizedSlug);
      } catch (err) {
        console.warn("Gagal resolusi userId dari slug:", err);
      }
    }

    // Simpan ke Supabase via client publik (anon)
    const supabase = createPublicClient();
    const { error } = await supabase.from("cta_clicks").insert({
      user_id: userId,
      slug: normalizedSlug,
      cta_location: ctaLocation,
      package: pkg || null,
    });

    if (error) {
      // Jika error (misal tabel belum dimigrasi di lokal), log warning dan tetap return 204
      console.warn("Gagal menyimpan cta_clicks:", error.message);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.warn("Error tak terduga pada /api/track-cta:", error);
    return new Response(null, { status: 204 });
  }
}
