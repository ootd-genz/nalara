import { ContactProvider } from "@/components/contact-provider";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { Announcement } from "@/components/sections/announcement";
import { ClientWork } from "@/components/sections/client-work";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Offer } from "@/components/sections/offer";
import { Problems } from "@/components/sections/problems";
import { Solutions } from "@/components/sections/solutions";

interface LandingPageProps {
  whatsappNumber: string;
  refSlug?: string;
}

export function LandingPage({ whatsappNumber, refSlug }: LandingPageProps) {
  return (
    <ContactProvider whatsappNumber={whatsappNumber} refSlug={refSlug}>
      <main>
        <Announcement />
        <Hero />
        <Problems />
        <Solutions />
        <ClientWork />
        <Offer />
        <Footer />
        <FloatingWhatsApp />
      </main>
    </ContactProvider>
  );
}
