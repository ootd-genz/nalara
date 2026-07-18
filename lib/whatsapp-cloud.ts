type InvoiceTemplateInput = {
  to: string;
  customerName: string;
  orderId: string;
  packageName: string;
  amountLabel: string;
  invoiceUrl: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} belum dikonfigurasi.`);
  return value;
}

export async function sendPaidInvoiceTemplate(input: InvoiceTemplateInput) {
  const phoneNumberId = requiredEnv("WHATSAPP_PHONE_NUMBER_ID");
  const accessToken = requiredEnv("WHATSAPP_ACCESS_TOKEN");
  const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION ?? "v23.0";
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME ?? "nalara_invoice_paid";
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? "id";

  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${encodeURIComponent(phoneNumberId)}/messages`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: input.to,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: input.customerName },
                { type: "text", text: input.orderId },
                { type: "text", text: input.packageName },
                { type: "text", text: input.amountLabel },
                { type: "text", text: input.invoiceUrl },
              ],
            },
          ],
        },
      }),
    },
  );

  const payload = (await response.json().catch(() => ({}))) as {
    messages?: Array<{ id: string }>;
    error?: { message?: string };
  };
  if (!response.ok) throw new Error(payload.error?.message || "WhatsApp gagal mengirim invoice.");
  return payload.messages?.[0]?.id ?? null;
}
