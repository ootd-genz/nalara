import { redirect } from "next/navigation";
import { whatsappUrl } from "@/lib/site-config";

export default function CheckoutPage() {
  redirect(whatsappUrl);
}
