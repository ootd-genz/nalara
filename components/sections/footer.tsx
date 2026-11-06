"use client";

import { AtSign, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { getConsultationWhatsAppUrl, instagramUrl, siteConfig } from "@/lib/site-config";
import { useContact } from "@/components/contact-provider";

export function Footer() {
  const { whatsappNumber, trackClick } = useContact();
  const whatsappUrl = getConsultationWhatsAppUrl(whatsappNumber);

  return (
    <footer className="border-t border-white/6 py-8">
      <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandLogo />
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">{siteConfig.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" size="sm">
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <AtSign aria-hidden="true" /> {siteConfig.instagramHandle}
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick("footer")}
            >
              <MessageCircle aria-hidden="true" /> WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
