import { createHash, timingSafeEqual } from "node:crypto";

type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
};

export type MidtransStatus = {
  order_id: string;
  transaction_id?: string;
  transaction_status: string;
  status_code: string;
  gross_amount: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_time?: string;
  settlement_time?: string;
  signature_key?: string;
};

function getServerKey() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi.");
  return serverKey;
}

function isProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

function basicAuth() {
  return `Basic ${Buffer.from(`${getServerKey()}:`).toString("base64")}`;
}

export async function createSnapTransaction(input: {
  orderId: string;
  amount: number;
  packageName: string;
  customer: CustomerDetails;
  finishUrl: string;
}) {
  const endpoint = isProduction()
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const response = await fetch(endpoint, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: basicAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: { order_id: input.orderId, gross_amount: input.amount },
      item_details: [
        {
          id: "WEB-STARTER",
          price: input.amount,
          quantity: 1,
          name: input.packageName,
          brand: "NALARA",
          category: "Digital Service",
          merchant_name: "NALARA",
        },
      ],
      customer_details: {
        first_name: input.customer.name,
        email: input.customer.email,
        phone: input.customer.phone,
        billing_address: {
          first_name: input.customer.name,
          email: input.customer.email,
          phone: input.customer.phone,
          address: input.customer.businessName,
          country_code: "IDN",
        },
      },
      enabled_payments: ["other_qris"],
      expiry: { unit: "minutes", duration: 30 },
      callbacks: { finish: input.finishUrl },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    token?: string;
    redirect_url?: string;
    error_messages?: string[];
  };

  if (!response.ok || !payload.token) {
    throw new Error(payload.error_messages?.join(" ") || "Midtrans gagal membuat transaksi.");
  }

  return { token: payload.token, redirectUrl: payload.redirect_url ?? null };
}

export async function getMidtransStatus(orderId: string): Promise<MidtransStatus | null> {
  const base = isProduction() ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
  const response = await fetch(`${base}/v2/${encodeURIComponent(orderId)}/status`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: basicAuth(),
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) return null;
  const payload = (await response.json().catch(() => ({}))) as MidtransStatus & {
    status_message?: string;
  };
  if (!response.ok) throw new Error(payload.status_message || "Gagal membaca status Midtrans.");
  return payload;
}

export function verifyMidtransSignature(payload: MidtransStatus) {
  if (!payload.signature_key) return false;
  const expected = createHash("sha512")
    .update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${getServerKey()}`)
    .digest("hex");
  const received = payload.signature_key.toLowerCase();
  if (!/^[a-f0-9]{128}$/.test(received) || expected.length !== received.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex"));
  } catch {
    return false;
  }
}

export function mapMidtransStatus(status: MidtransStatus | null) {
  if (!status) return "pending" as const;
  if (
    status.transaction_status === "settlement" ||
    (status.transaction_status === "capture" && status.fraud_status === "accept")
  ) {
    return "paid" as const;
  }
  if (status.transaction_status === "expire") return "expired" as const;
  if (["deny", "cancel", "failure"].includes(status.transaction_status)) return "failed" as const;
  return "pending" as const;
}
