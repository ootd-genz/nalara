import { redirect } from "next/navigation";
import {
  defaultWhatsAppMessage,
  getBeginnerWhatsAppMessage,
  getBusinessWhatsAppMessage,
  getStarterWhatsAppMessage,
  getWhatsAppUrl,
  siteConfig,
} from "@/lib/site-config";
import { getActiveUserBySlug } from "@/lib/site-users";
import { isReservedSlug, isValidSlugFormat } from "@/lib/slug";

interface CheckoutPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function resolveMessage(packageParam?: string, customMessage?: string): string {
  if (customMessage) return customMessage;
  if (!packageParam) return defaultWhatsAppMessage;

  const pkg = packageParam.toLowerCase();
  if (pkg === "beginner" || pkg === "website-beginner") {
    return getBeginnerWhatsAppMessage();
  }
  if (pkg === "starter" || pkg === "website-starter") {
    return getStarterWhatsAppMessage();
  }
  if (pkg === "business" || pkg === "website-business") {
    return getBusinessWhatsAppMessage();
  }
  return defaultWhatsAppMessage;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;

  const rawRef = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const rawPackage = Array.isArray(params.package)
    ? params.package[0]
    : Array.isArray(params.paket)
      ? params.paket[0]
      : (params.package ?? params.paket);
  const rawMessage = Array.isArray(params.text)
    ? params.text[0]
    : Array.isArray(params.message)
      ? params.message[0]
      : (params.text ?? params.message);

  let targetNumber = siteConfig.whatsappNumber;

  if (rawRef && typeof rawRef === "string") {
    const cleanRef = rawRef.trim().toLowerCase();
    if (isValidSlugFormat(cleanRef) && !isReservedSlug(cleanRef)) {
      try {
        const user = await getActiveUserBySlug(cleanRef);
        if (user?.phone_wa) {
          targetNumber = user.phone_wa;
        }
      } catch (error) {
        console.error("Gagal memeriksa user ref pada checkout:", error);
        // Fallback aman ke nomor default jika query gagal
      }
    }
  }

  const message = resolveMessage(
    typeof rawPackage === "string" ? rawPackage : undefined,
    typeof rawMessage === "string" ? rawMessage : undefined
  );

  redirect(getWhatsAppUrl(targetNumber, message));
}
