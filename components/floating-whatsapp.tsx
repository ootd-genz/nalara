"use client";

import { MessageCircle } from "lucide-react";
import { getConsultationWhatsAppUrl } from "@/lib/site-config";
import { useContact } from "@/components/contact-provider";

export function FloatingWhatsApp() {
  const { whatsappNumber, trackClick } = useContact();
  const whatsappUrl = getConsultationWhatsAppUrl(whatsappNumber);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp fixed z-50 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_16px_50px_rgba(74,222,128,0.3)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      aria-label="Hubungi NALARA melalui WhatsApp"
      data-cta="floating-whatsapp"
      onClick={() => trackClick("floating")}
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">Konsultasi</span>
    </a>
  );
}
