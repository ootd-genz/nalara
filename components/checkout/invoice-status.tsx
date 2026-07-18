"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/site-config";

type InvoiceData = {
  orderId: string;
  packageName: string;
  amount: number;
  amountLabel: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  status: "creating" | "pending" | "paid" | "failed" | "expired";
  paymentType: string;
  transactionId: string | null;
  transactionTime: string | null;
  paidAt: string | null;
  snapToken: string | null;
  whatsappUrl: string;
};

const statusCopy = {
  creating: { title: "Tagihan sedang dibuat", text: "Tunggu sebentar, kami sedang menyiapkan pembayaran Anda." },
  pending: { title: "Menunggu pembayaran", text: "Selesaikan pembayaran QRIS. Status diperiksa otomatis setiap beberapa detik." },
  paid: { title: "Pembayaran berhasil", text: "Invoice sudah aktif. Anda akan diarahkan ke WhatsApp NALARA." },
  failed: { title: "Pembayaran belum berhasil", text: "Pembayaran ditolak atau dibatalkan. Silakan hubungi NALARA untuk bantuan." },
  expired: { title: "Tagihan kedaluwarsa", text: "Masa berlaku QRIS telah berakhir. Hubungi NALARA melalui WhatsApp untuk melanjutkan." },
} as const;

export function InvoiceStatus({ token }: { token: string }) {
  const [data, setData] = useState<InvoiceData | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const redirected = useRef(false);

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/payments/status?token=${encodeURIComponent(token)}`, { cache: "no-store" });
      const payload = (await response.json()) as InvoiceData & { message?: string };
      if (!response.ok) throw new Error(payload.message || "Invoice belum dapat diperiksa.");
      setData(payload);
      setError("");
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Invoice belum dapat diperiksa.");
    } finally {
      setChecking(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void checkStatus(), 0);
    return () => window.clearTimeout(timer);
  }, [checkStatus]);

  useEffect(() => {
    if (!data || !["creating", "pending"].includes(data.status)) return;
    const interval = window.setInterval(() => void checkStatus(), 4_000);
    return () => window.clearInterval(interval);
  }, [checkStatus, data]);

  useEffect(() => {
    if (data?.status !== "paid" || redirected.current) return;
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          redirected.current = true;
          window.location.assign(data.whatsappUrl);
          return 0;
        }
        return current - 1;
      });
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [data]);

  if (checking && !data) {
    return <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-white/10 bg-[var(--card)]"><div className="text-center"><LoaderCircle className="mx-auto size-8 animate-spin text-[var(--accent)]" /><p className="mt-4 text-sm text-[var(--muted-foreground)]">Memverifikasi invoice...</p></div></div>;
  }

  if (!data) {
    return <div className="rounded-[28px] border border-red-400/20 bg-red-400/5 p-8 text-center"><AlertCircle className="mx-auto size-10 text-red-300" /><h1 className="font-heading mt-4 text-2xl font-bold text-white">Invoice belum ditemukan</h1><p className="mt-3 text-sm text-[var(--muted-foreground)]">{error}</p><Button asChild className="mt-6"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Hubungi via WhatsApp</a></Button></div>;
  }

  const copy = statusCopy[data.status];
  const isPaid = data.status === "paid";
  const isPending = data.status === "pending" || data.status === "creating";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.68fr] lg:items-start">
      <section className="invoice-card overflow-hidden rounded-[28px] border border-white/10 bg-[var(--card)] shadow-2xl">
        <div className={`p-6 sm:p-8 ${isPaid ? "bg-[var(--accent)]/[0.08]" : "bg-white/[0.025]"}`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${isPaid ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "bg-white/8 text-white"}`}>
                {isPaid ? <CheckCircle2 aria-hidden="true" /> : <Clock3 aria-hidden="true" />}
              </div>
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Invoice NALARA</p><h1 className="font-heading mt-1 text-2xl font-bold text-white sm:text-3xl">{copy.title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">{copy.text}</p></div>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold uppercase ${isPaid ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "bg-amber-300/10 text-amber-200"}`}>{data.status}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Nomor invoice</p><p className="mt-2 break-all font-mono text-sm font-bold text-white">{data.orderId}</p></div>
            <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Metode pembayaran</p><p className="mt-2 font-bold text-white">{data.paymentType?.toUpperCase() || "QRIS"}</p></div>
            <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Ditagihkan kepada</p><p className="mt-2 font-bold text-white">{data.customerName}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">{data.businessName} · {data.customerEmail}</p></div>
            <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Waktu transaksi</p><p className="mt-2 font-bold text-white">{data.transactionTime ?? "Menunggu pembayaran"}</p></div>
          </div>
          <div className="my-7 h-px bg-white/8" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-heading text-lg font-bold text-white">{data.packageName}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">1 × layanan pembuatan website</p></div><p className="font-heading text-4xl font-extrabold tracking-[-0.05em] text-[var(--accent)]">{data.amountLabel}</p></div>
          {data.transactionId && <p className="mt-7 break-all rounded-xl bg-black/15 p-3 text-xs text-[var(--muted-foreground)]">ID transaksi Midtrans: {data.transactionId}</p>}
        </div>
      </section>

      <aside className="no-print space-y-4 lg:sticky lg:top-8">
        <div className="rounded-[24px] border border-white/10 bg-[#111612] p-5 sm:p-6">
          {isPaid ? (
            <>
              <CheckCircle2 className="size-8 text-[var(--accent)]" aria-hidden="true" />
              <h2 className="font-heading mt-4 text-xl font-bold text-white">Semua sudah beres</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Invoice juga dikirim melalui WhatsApp Cloud API. Anda akan membuka chat NALARA dalam {countdown} detik.</p>
              <Button asChild className="mt-5 w-full"><a href={data.whatsappUrl}><MessageCircle aria-hidden="true" /> Lanjut ke WhatsApp sekarang</a></Button>
            </>
          ) : isPending ? (
            <>
              <MessageCircle className="size-8 text-[var(--accent)]" aria-hidden="true" />
              <h2 className="font-heading mt-4 text-xl font-bold text-white">Lanjut melalui WhatsApp</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Hubungi NALARA untuk melanjutkan pemesanan dan mendapatkan instruksi berikutnya.</p>
              <Button asChild className="mt-5 w-full"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Buka WhatsApp</a></Button>
            </>
          ) : (
            <>
              <AlertCircle className="size-8 text-amber-200" aria-hidden="true" />
              <h2 className="font-heading mt-4 text-xl font-bold text-white">Perlu bantuan?</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Hubungi tim NALARA melalui WhatsApp untuk bantuan dan pemesanan.</p>
              <Button asChild className="mt-5 w-full"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Hubungi via WhatsApp</a></Button>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => window.print()}><Download aria-hidden="true" /> Cetak invoice</Button>
          <Button variant="outline" onClick={() => void checkStatus()} disabled={checking}><RefreshCw className={checking ? "animate-spin" : ""} aria-hidden="true" /> Periksa status</Button>
        </div>
        {error && <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-100" role="alert">{error}</p>}
        <Button asChild variant="ghost" className="w-full"><Link href="/">Kembali ke halaman utama</Link></Button>
      </aside>
    </div>
  );
}
