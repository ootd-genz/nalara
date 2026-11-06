import { LandingPage } from "@/components/landing-page";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return <LandingPage whatsappNumber={siteConfig.whatsappNumber} />;
}
