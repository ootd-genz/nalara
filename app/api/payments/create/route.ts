import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getPackageById } from "@/lib/commerce";
import { createSnapTransaction } from "@/lib/midtrans";
import { createPaymentOrder, updatePaymentOrder } from "@/lib/payment-orders";
import { siteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutBody = {
  packageId?: unknown;
  customer?: {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    businessName?: unknown;
  };
  consent?: unknown;
  website?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function normalizeWhatsappPhone(value: unknown) {
  let digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  if (!digits.startsWith("62")) digits = `62${digits}`;
  return digits;
}

function createOrderId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `NAL-${date}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ message: "Data checkout tidak valid." }, { status: 400 });
  }

  if (cleanText(body.website, 120)) {
    return NextResponse.json({ message: "Permintaan tidak dapat diproses." }, { status: 400 });
  }

  const selectedPackage = getPackageById(body.packageId);
  const name = cleanText(body.customer?.name, 80);
  const email = cleanText(body.customer?.email, 120).toLowerCase();
  const phone = normalizeWhatsappPhone(body.customer?.phone);
  const businessName = cleanText(body.customer?.businessName, 100);

  if (!selectedPackage) {
    return NextResponse.json({ message: "Paket tidak tersedia." }, { status: 400 });
  }
  if (name.length < 2 || businessName.length < 2) {
    return NextResponse.json({ message: "Lengkapi nama dan nama bisnis Anda." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Alamat email belum valid." }, { status: 400 });
  }
  if (!/^62\d{8,13}$/.test(phone)) {
    return NextResponse.json({ message: "Nomor WhatsApp belum valid." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ message: "Persetujuan diperlukan sebelum membayar." }, { status: 400 });
  }

  const orderId = createOrderId();
  const publicToken = randomBytes(32).toString("hex");
  const invoiceUrl = `${siteUrl}/invoice/${publicToken}`;

  try {
    await createPaymentOrder({
      order_id: orderId,
      public_token: publicToken,
      package_id: selectedPackage.id,
      package_name: selectedPackage.name,
      amount: selectedPackage.price,
      currency: selectedPackage.currency,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      business_name: businessName,
      status: "creating",
    });

    const transaction = await createSnapTransaction({
      orderId,
      amount: selectedPackage.price,
      packageName: selectedPackage.name,
      customer: { name, email, phone, businessName },
      finishUrl: invoiceUrl,
    });

    await updatePaymentOrder(orderId, {
      status: "pending",
      snap_token: transaction.token,
    }, "creating");

    return NextResponse.json(
      {
        orderId,
        invoiceUrl,
        checkoutToken: publicToken,
        snapToken: transaction.token,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout gagal diproses.";
    await updatePaymentOrder(orderId, { status: "failed", last_error: message }).catch(() => null);
    const unconfigured = message.includes("belum dikonfigurasi") || message.includes("Order store");
    return NextResponse.json(
      {
        message: unconfigured
          ? "Pembayaran sedang disiapkan. Silakan hubungi NALARA atau coba lagi setelah konfigurasi selesai."
          : "Midtrans belum dapat membuat tagihan. Silakan coba lagi.",
      },
      { status: unconfigured ? 503 : 502 },
    );
  }
}
