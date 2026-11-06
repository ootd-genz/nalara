import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { LandingPage } from "@/components/landing-page";
import { siteUrl } from "@/lib/site-url";
import {
  getActiveUserBySlug,
  getSlugStatus,
  type ActiveUserSummary,
  type SlugStatus,
} from "@/lib/site-users";
import { isReservedSlug, isValidSlugFormat } from "@/lib/slug";

interface UserLandingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: UserLandingPageProps): Promise<Metadata> {
  await params; // Memenuhi konvensi async params Next.js 16

  return {
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export default async function UserLandingPage({ params }: UserLandingPageProps) {
  const { slug: rawSlug } = await params;
  const decodedSlug = decodeURIComponent(rawSlug);
  const normalizedSlug = decodedSlug.toLowerCase();

  // 1. Jika slug asli berbeda dengan versi lowercase, lakukan redirect permanen (308)
  if (decodedSlug !== normalizedSlug) {
    permanentRedirect(`/${normalizedSlug}`);
  }

  // 2. Jika slug termasuk RESERVED_SLUGS atau format tidak valid -> notFound() tanpa query database
  if (!isValidSlugFormat(normalizedSlug) || isReservedSlug(normalizedSlug)) {
    notFound();
  }

  // 3. Ambil data user dari Supabase dengan penanganan error
  let user: ActiveUserSummary | null = null;
  let slugStatus: SlugStatus = "missing";

  try {
    user = await getActiveUserBySlug(normalizedSlug);
    if (!user) {
      slugStatus = await getSlugStatus(normalizedSlug);
    }
  } catch (error) {
    console.error("Gagal melakukan query Supabase untuk /[slug]:", error);
    redirect("/");
  }

  // Kasus aktif: render landing page dengan nomor user
  if (user) {
    return <LandingPage whatsappNumber={user.phone_wa} refSlug={user.slug} />;
  }

  // Kasus nonaktif: redirect ke halaman utama "/"
  if (slugStatus === "inactive") {
    redirect("/");
  }

  // Kasus tidak ditemukan: 404
  notFound();
}
