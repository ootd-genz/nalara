"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, LoaderCircle, LockKeyhole, MessageCircle, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah, starterPackage } from "@/lib/commerce";
import { openQrisPayment } from "@/lib/snap-client";

type CheckoutResponse = {
  message?: string;
  invoiceUrl?: string;
  checkoutToken?: string;
  snapToken?: string;
};

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[var(--accent)]/60 focus:ring-4 focus:ring-[var(--accent)]/10";

export function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Menyiapkan tagihan QRIS yang aman...");

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: starterPackage.id,
          customer: {
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
            businessName: form.get("businessName"),
          },
          consent: form.get("consent") === "on",
          website: form.get("website"),
        }),
      });
      const payload = (await response.json()) as CheckoutResponse;
      if (!response.ok || !payload.snapToken || !payload.invoiceUrl) {
        throw new Error(payload.message || "Tagihan belum dapat dibuat.");
      }

      setInvoiceUrl(payload.invoiceUrl);
      setMessage("Tagihan siap. Pilih aplikasi pembayaran untuk memindai QRIS.");
      await openQrisPayment(payload.snapToken, {
        onSuccess: () => router.push(payload.invoiceUrl!),
        onPending: () => router.push(payload.invoiceUrl!),
        onError: () => {
          setLoading(false);
          setMessage("Pembayaran belum berhasil. Anda dapat mencoba kembali dari halaman invoice.");
        },
        onClose: () => {
          setLoading(false);
          setMessage("Pembayaran ditutup. Tagihan tetap tersimpan dan dapat dilanjutkan kapan saja.");
        },
      });
    } catch (error) {
      setLoading(false);
      setMessage(error instanceof Error ? error.message : "Checkout belum dapat diproses.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr_.72fr] lg:items-start">
      <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-[var(--card)] p-5 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Langkah 1 dari 3</p>
            <h1 className="font-heading mt-2 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Lengkapi data pemesan</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">Data ini dipakai untuk membuat invoice dan mengirim konfirmasi pembayaran ke WhatsApp Anda.</p>
          </div>
          <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] sm:flex"><LockKeyhole aria-hidden="true" /></div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-white">Nama lengkap
            <input className={inputClass} name="name" autoComplete="name" placeholder="Contoh: Budi Santoso" minLength={2} maxLength={80} required />
          </label>
          <label className="text-sm font-semibold text-white">Nama bisnis
            <input className={inputClass} name="businessName" autoComplete="organization" placeholder="Contoh: Toko Budi" minLength={2} maxLength={100} required />
          </label>
          <label className="text-sm font-semibold text-white">Email invoice
            <input className={inputClass} type="email" name="email" autoComplete="email" placeholder="nama@email.com" maxLength={120} required />
          </label>
          <label className="text-sm font-semibold text-white">Nomor WhatsApp
            <input className={inputClass} type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="08xxxxxxxxxx" minLength={9} maxLength={18} required />
          </label>
        </div>
        <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <div className="mt-8 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.055] p-4">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-black"><QrCode className="size-5" aria-hidden="true" /></div>
            <div>
              <div className="flex flex-wrap items-center gap-2"><h2 className="font-heading font-bold text-white">Bayar dengan QRIS</h2><span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--accent-foreground)]">DIREKOMENDASIKAN</span></div>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">Diproses oleh Midtrans. Dapat dibayar melalui aplikasi bank atau dompet digital yang mendukung QRIS.</p>
            </div>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl text-sm leading-6 text-[var(--muted-foreground)]">
          <input className="mt-1 size-4 accent-[var(--accent)]" type="checkbox" name="consent" required />
          <span>Saya sudah memeriksa data dan menyetujui tagihan sebesar <strong className="text-white">{formatRupiah(starterPackage.price)}</strong>.</span>
        </label>

        <Button className="mt-7 w-full" size="lg" type="submit" disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <QrCode aria-hidden="true" />}
          {loading ? "Menyiapkan pembayaran..." : `Lanjut bayar ${formatRupiah(starterPackage.price)}`}
        </Button>

        {message && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm leading-6 text-[var(--muted-foreground)]" role="status">
            {message} {invoiceUrl && <Link className="font-bold text-[var(--accent)] underline" href={invoiceUrl}>Buka invoice</Link>}
          </div>
        )}
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[var(--muted-foreground)]"><ShieldCheck className="size-4 text-[var(--accent)]" aria-hidden="true" />Harga ditetapkan oleh server dan tidak dapat diubah dari browser.</p>
      </form>

      <aside className="space-y-5 lg:sticky lg:top-8">
        <div className="rounded-[28px] border border-white/10 bg-[#111612] p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Ringkasan tagihan</p>
          <h2 className="font-heading mt-3 text-2xl font-bold text-white">{starterPackage.name}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{starterPackage.description}</p>
          <div className="my-6 h-px bg-white/8" />
          <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]"><span>Harga paket</span><span>{formatRupiah(starterPackage.price)}</span></div>
          <div className="mt-3 flex items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]"><span>Biaya admin</span><span>Ditampilkan oleh Midtrans</span></div>
          <div className="my-6 h-px bg-white/8" />
          <div className="flex items-end justify-between gap-4"><span className="font-bold text-white">Total tagihan</span><span className="font-heading text-3xl font-extrabold text-[var(--accent)]">{formatRupiah(starterPackage.price)}</span></div>
          <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">Nominal utama selalu Rp69.000. Jika kanal pembayaran mengenakan biaya, rinciannya akan terlihat sebelum Anda menyetujui pembayaran.</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
          <p className="font-heading font-bold text-white">Setelah pembayaran</p>
          <ol className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
            {["Pembayaran diverifikasi otomatis", "Invoice tampil dan dikirim ke WhatsApp", "Anda diarahkan ke chat NALARA"].map((item) => <li className="flex gap-3" key={item}><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-foreground)]"><Check className="size-3" /></span>{item}</li>)}
          </ol>
        </div>

        <Button asChild variant="ghost" className="w-full"><Link href="/"><ArrowLeft aria-hidden="true" /> Kembali ke halaman utama</Link></Button>
        <p className="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]"><MessageCircle className="size-4" aria-hidden="true" />Butuh bantuan? Gunakan tombol WhatsApp di halaman utama.</p>
      </aside>
    </div>
  );
}
