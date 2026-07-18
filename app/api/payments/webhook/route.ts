import { NextResponse } from "next/server";
import { formatRupiah } from "@/lib/commerce";
import {
  getMidtransStatus,
  mapMidtransStatus,
  type MidtransStatus,
  verifyMidtransSignature,
} from "@/lib/midtrans";
import {
  claimWhatsappDelivery,
  getPaymentOrderByOrderId,
  markWhatsappDelivered,
  releaseWhatsappClaim,
  updatePaymentOrder,
} from "@/lib/payment-orders";
import { siteUrl } from "@/lib/site-url";
import { sendPaidInvoiceTemplate } from "@/lib/whatsapp-cloud";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let notification: MidtransStatus;
  try {
    notification = (await request.json()) as MidtransStatus;
  } catch {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (
    !notification.order_id ||
    !notification.status_code ||
    !notification.gross_amount ||
    !verifyMidtransSignature(notification)
  ) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  try {
    const trustedStatus = await getMidtransStatus(notification.order_id);
    if (!trustedStatus) {
      return NextResponse.json({ received: true, pending: true }, { status: 202 });
    }

    const order = await getPaymentOrderByOrderId(trustedStatus.order_id);
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const paidAmount = Math.round(Number(trustedStatus.gross_amount));
    if (paidAmount !== order.amount) {
      await updatePaymentOrder(order.order_id, {
        status: "failed",
        last_error: "Midtrans webhook amount mismatch",
      });
      return NextResponse.json({ message: "Amount mismatch" }, { status: 409 });
    }

    const status = mapMidtransStatus(trustedStatus);
    await updatePaymentOrder(order.order_id, {
      status,
      midtrans_transaction_id: trustedStatus.transaction_id ?? null,
      payment_type: trustedStatus.payment_type ?? null,
      transaction_time: trustedStatus.transaction_time ?? null,
      paid_at: status === "paid" ? new Date().toISOString() : order.paid_at,
    });

    if (status !== "paid") return NextResponse.json({ received: true, status });

    const claimedOrder = await claimWhatsappDelivery(order.order_id);
    if (!claimedOrder) {
      return NextResponse.json({ received: true, status, whatsapp: "already_processed" });
    }

    let whatsappMessageId: string | null;
    try {
      whatsappMessageId = await sendPaidInvoiceTemplate({
        to: claimedOrder.customer_phone,
        customerName: claimedOrder.customer_name,
        orderId: claimedOrder.order_id,
        packageName: claimedOrder.package_name,
        amountLabel: formatRupiah(claimedOrder.amount),
        invoiceUrl: `${siteUrl}/invoice/${claimedOrder.public_token}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "WhatsApp delivery failed";
      await releaseWhatsappClaim(order.order_id, message).catch(() => null);
      return NextResponse.json({ message: "WhatsApp delivery failed" }, { status: 502 });
    }

    await markWhatsappDelivered(order.order_id, whatsappMessageId);
    return NextResponse.json({ received: true, status, whatsapp: "sent" });
  } catch {
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}
