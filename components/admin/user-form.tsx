"use client";

import { useState, useTransition, useMemo } from "react";
import { createUserAction } from "@/app/admin/actions";
import { normalizePhoneToWa, formatPhoneDisplay } from "@/lib/phone";
import { type SiteUser } from "@/lib/site-users";
import {
  UserPlus,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface UserFormProps {
  existingUsers: SiteUser[];
  onUserCreated?: (newUser: SiteUser) => void;
}

export function UserForm({ existingUsers, onUserCreated }: UserFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    name: string;
    phone_wa: string;
    url: string;
    slug: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Pratinjau normalisasi nomor
  const normalizedPreview = useMemo(() => {
    if (!phone.trim()) return null;
    const wa = normalizePhoneToWa(phone);
    if (!wa) return null;
    return formatPhoneDisplay(wa);
  }, [phone]);

  // Deteksi nomor duplikat (non-blocking warning)
  const duplicateWarningUser = useMemo(() => {
    if (!phone.trim()) return null;
    const wa = normalizePhoneToWa(phone);
    if (!wa) return null;
    return (
      existingUsers.find(
        (u) => u.phone_wa === wa || u.phone_raw === phone.trim()
      ) || null
    );
  }, [phone, existingUsers]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);

    startTransition(async () => {
      const res = await createUserAction(formData);

      if (!res.ok) {
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
        if (res.message && !res.fieldErrors) {
          setGeneralError(res.message);
        }
        return;
      }

      if (res.data) {
        setSuccessData({
          name: res.data.name,
          phone_wa: res.data.phone_wa,
          url: res.data.url,
          slug: res.data.slug,
        });
        setName("");
        setPhone("");
        if (onUserCreated) {
          onUserCreated(res.data);
        }
      }
    });
  };

  const handleCopyLink = () => {
    if (!successData?.url) return;
    navigator.clipboard.writeText(successData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Tambah Pengguna Baru
          </h2>
          <p className="text-xs text-zinc-400">
            Daftarkan nama dan nomor WhatsApp untuk membuat link personal otomatis.
          </p>
        </div>
      </div>

      {generalError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Success Card */}
      {successData && (
        <div className="mb-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <div className="flex items-center gap-2 mb-2 font-semibold text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengguna berhasil dibuat!</span>
          </div>

          <p className="text-xs text-zinc-300 mb-3">
            Halaman personal untuk{" "}
            <strong className="text-white">{successData.name}</strong> siap
            digunakan:
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-zinc-950/70 border border-emerald-500/20 p-2.5 rounded-lg mb-3">
            <span className="text-xs font-mono text-emerald-300 truncate flex-1 select-all px-1">
              {successData.url}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>

              <a
                href={successData.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Link</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Field: Nama */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2"
            >
              Nama Lengkap <span className="text-emerald-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              disabled={isPending}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              placeholder="Contoh: Ahmad Habibi"
              className={`w-full px-4 py-2.5 rounded-xl bg-zinc-950 border text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Field: Nomor Telepon */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2"
            >
              Nomor Telepon WhatsApp <span className="text-emerald-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              required
              disabled={isPending}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (fieldErrors.phone) {
                  setFieldErrors((prev) => ({ ...prev, phone: "" }));
                }
              }}
              placeholder="Contoh: 089517795206"
              className={`w-full px-4 py-2.5 rounded-xl bg-zinc-950 border text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                fieldErrors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              }`}
            />
            {fieldErrors.phone && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fieldErrors.phone}
              </p>
            )}

            {/* Pratinjau Normalisasi Nomor */}
            {normalizedPreview && (
              <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Format WhatsApp:{" "}
                <span className="font-mono font-medium">
                  {normalizedPreview}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Peringatan Nomor Duplikat (Non-blocking) */}
        {duplicateWarningUser && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-300">
                Peringatan Nomor Serupa
              </p>
              <p className="mt-0.5 text-amber-300/80">
                Nomor ini telah digunakan oleh pengguna:{" "}
                <strong className="text-white">
                  {duplicateWarningUser.name}
                </strong>{" "}
                (/{duplicateWarningUser.slug}). Anda tetap dapat menyimpannya
                jika ini disengaja.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/50 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Simpan Pengguna</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
