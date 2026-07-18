import { NextResponse } from "next/server";
import { formatRupiah, starterPackage } from "@/lib/commerce";
import { getMidtransStatus, mapMidtransStatus } from "@/lib/midtrans";
import { getPaymentOrderByToken, updatePaymentOrder } from "@/lib/payment-orders";
import { siteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ message: "Nomor invoice tidak valid." }, { status: 400 });
  }

  try {
    let order = await getPaymentOrderByToken(token);
    if (!order) return NextResponse.json({ message: "Invoice tidak ditemukan." }, { status: 404 });

    if (!(["paid", "expired"] as string[]).includes(order.status)) {
      const midtrans = await getMidtransStatus(order.order_id);
      if (midtrans) {
        const amount = Math.round(Number(midtrans.gross_amount));
        if (midtrans.order_id !== order.order_id || amount !== order.amount) {
          await updatePaymentOrder(order.order_id, {
            status: "failed",
            last_error: "Midtrans amount/order mismatch",
          });
          return NextResponse.json({ message: "Tagihan gagal diverifikasi." }, { status: 409 });
        }

        order =
          (await updatePaymentOrder(order.order_id, {
            status: mapMidtransStatus(midtrans),
            midtrans_transaction_id: midtrans.transaction_id ?? null,
            payment_type: midtrans.payment_type ?? null,
            transaction_time: midtrans.transaction_time ?? null,
            paid_at: mapMidtransStatus(midtrans) === "paid" ? new Date().toISOString() : order.paid_at,
          })) ?? order;
      }
    }

    const amountLabel = formatRupiah(order.amount);
    const whatsappText = encodeURIComponent(
      `Halo NALARA, pembayaran saya sudah berhasil.\n\nInvoice: ${order.order_id}\nPaket: ${order.package_name}\nTotal: ${amountLabel}\nNama: ${order.customer_name}\nBisnis: ${order.business_name}\n\nInvoice online: ${siteUrl}/invoice/${order.public_token}`,
    );

    return NextResponse.json(
      {
        orderId: order.order_id,
        packageName: order.package_name,
        amount: order.amount,
        amountLabel,
        currency: order.currency,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        businessName: order.business_name,
        status: order.status,
        paymentType: order.payment_type ?? "QRIS",
        transactionId: order.midtrans_transaction_id,
        transactionTime: order.transaction_time,
        paidAt: order.paid_at,
        snapToken: order.status === "pending" ? order.snap_token : null,
        whatsappUrl: `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappText}`,
        expectedAmount: starterPackage.price,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Status pembayaran belum dapat diperiksa. Silakan coba lagi." },
      { status: 503 },
    );
  }
}
