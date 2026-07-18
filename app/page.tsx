import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { Announcement } from "@/components/sections/announcement";
import { ClientWork } from "@/components/sections/client-work";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Offer } from "@/components/sections/offer";
import { Problems } from "@/components/sections/problems";
import { Solutions } from "@/components/sections/solutions";

export default function Home() {
  return <main><Announcement /><Hero /><Problems /><Solutions /><ClientWork /><Offer /><Footer /><FloatingWhatsApp /></main>;
}
