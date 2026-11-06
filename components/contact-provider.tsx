"use client";

import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";
import { getWhatsAppUrl } from "@/lib/site-config";
import {
  trackCtaClick,
  type CtaLocation,
  type PackageName,
} from "@/lib/cta-tracking";

interface ContactContextValue {
  whatsappNumber: string;
  ref?: string;
  trackClick: (location: CtaLocation, packageName?: PackageName) => void;
}

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({
  whatsappNumber,
  refSlug,
  children,
}: {
  whatsappNumber: string;
  refSlug?: string;
  children: ReactNode;
}) {
  const trackClick = useCallback(
    (location: CtaLocation, packageName?: PackageName) => {
      trackCtaClick({
        slug: refSlug || "default",
        ctaLocation: location,
        package: packageName,
      });
    },
    [refSlug]
  );

  const value = useMemo(
    () => ({ whatsappNumber, ref: refSlug, trackClick }),
    [whatsappNumber, refSlug, trackClick]
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact(): ContactContextValue {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact harus digunakan di dalam <ContactProvider>");
  }
  return context;
}

export function useWhatsAppUrl(): (message?: string) => string {
  const { whatsappNumber } = useContact();
  return (message?: string) => getWhatsAppUrl(whatsappNumber, message);
}

export function useCtaTracker(): (location: CtaLocation, packageName?: PackageName) => void {
  const { trackClick } = useContact();
  return trackClick;
}

export function useCheckoutUrl(): string {
  const { ref } = useContact();
  return ref ? `/checkout?ref=${encodeURIComponent(ref)}` : "/checkout";
}
