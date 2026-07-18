export type PaymentOrderStatus = "creating" | "pending" | "paid" | "failed" | "expired";

export type PaymentOrder = {
  id: string;
  order_id: string;
  public_token: string;
  package_id: string;
  package_name: string;
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  business_name: string;
  status: PaymentOrderStatus;
  snap_token: string | null;
  midtrans_transaction_id: string | null;
  payment_type: string | null;
  transaction_time: string | null;
  paid_at: string | null;
  whatsapp_claimed_at: string | null;
  whatsapp_sent_at: string | null;
  whatsapp_message_id: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

type NewPaymentOrder = Omit<
  PaymentOrder,
  | "id"
  | "snap_token"
  | "midtrans_transaction_id"
  | "payment_type"
  | "transaction_time"
  | "paid_at"
  | "whatsapp_claimed_at"
  | "whatsapp_sent_at"
  | "whatsapp_message_id"
  | "last_error"
  | "created_at"
  | "updated_at"
>;

function getSupabaseConfig() {
  const baseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!baseUrl || !serviceRoleKey) {
    throw new Error("Penyimpanan order belum dikonfigurasi.");
  }

  return { baseUrl: baseUrl.replace(/\/$/, ""), serviceRoleKey };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { baseUrl, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Order store gagal (${response.status}): ${detail.slice(0, 240)}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function createPaymentOrder(order: NewPaymentOrder) {
  const rows = await supabaseRequest<PaymentOrder[]>("payment_orders", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(order),
  });
  if (!rows[0]) throw new Error("Order gagal disimpan.");
  return rows[0];
}

export async function getPaymentOrderByToken(token: string) {
  const rows = await supabaseRequest<PaymentOrder[]>(
    `payment_orders?public_token=eq.${encodeURIComponent(token)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function getPaymentOrderByOrderId(orderId: string) {
  const rows = await supabaseRequest<PaymentOrder[]>(
    `payment_orders?order_id=eq.${encodeURIComponent(orderId)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function updatePaymentOrder(
  orderId: string,
  changes: Partial<PaymentOrder>,
  expectedStatus?: PaymentOrderStatus,
) {
  const statusFilter = expectedStatus ? `&status=eq.${expectedStatus}` : "";
  const rows = await supabaseRequest<PaymentOrder[]>(
    `payment_orders?order_id=eq.${encodeURIComponent(orderId)}${statusFilter}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(changes),
    },
  );
  return rows[0] ?? null;
}

export async function claimWhatsappDelivery(orderId: string) {
  const rows = await supabaseRequest<PaymentOrder[]>("rpc/claim_payment_whatsapp", {
    method: "POST",
    body: JSON.stringify({ p_order_id: orderId }),
  });
  return rows[0] ?? null;
}

export async function releaseWhatsappClaim(orderId: string, message: string) {
  await updatePaymentOrder(orderId, {
    whatsapp_claimed_at: null,
    last_error: message.slice(0, 500),
  });
}

export async function markWhatsappDelivered(orderId: string, messageId: string | null) {
  await updatePaymentOrder(orderId, {
    whatsapp_sent_at: new Date().toISOString(),
    whatsapp_message_id: messageId,
    last_error: null,
  });
}
