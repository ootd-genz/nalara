"use client";

type SnapResult = { order_id?: string; transaction_status?: string };

type SnapOptions = {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
  enabledPayments?: string[];
  language?: "id" | "en";
  uiMode?: "auto" | "qr" | "deeplink";
};

declare global {
  interface Window {
    snap?: { pay: (token: string, options?: SnapOptions) => void };
  }
}

let snapLoader: Promise<void> | null = null;

export function loadMidtransSnap() {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser tidak tersedia."));
  if (window.snap) return Promise.resolve();
  if (snapLoader) return snapLoader;

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  if (!clientKey) return Promise.reject(new Error("Midtrans belum dikonfigurasi."));

  snapLoader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("#midtrans-snap-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Midtrans gagal dimuat.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "midtrans-snap-script";
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.dataset.clientKey = clientKey;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Midtrans gagal dimuat."));
    document.head.appendChild(script);
  });

  return snapLoader;
}

export async function openQrisPayment(token: string, options: SnapOptions) {
  await loadMidtransSnap();
  if (!window.snap) throw new Error("Midtrans belum siap. Silakan muat ulang halaman.");
  window.snap.pay(token, {
    ...options,
    enabledPayments: ["other_qris"],
    language: "id",
    uiMode: "qr",
  });
}
