"use client";

import { useState, useTransition, useMemo } from "react";
import {
  type SiteUser,
  type SiteUserWithStats,
} from "@/lib/site-users";
import {
  toggleUserActiveAction,
  deleteUserAction,
  updateUserAction,
} from "@/app/admin/actions";
import { formatPhoneDisplay } from "@/lib/phone";
import { siteUrl } from "@/lib/site-url";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  Pencil,
  Trash2,
  Users,
  AlertCircle,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";

interface UserListProps {
  users: SiteUserWithStats[];
  onUsersChange: (updater: (prev: SiteUserWithStats[]) => SiteUserWithStats[]) => void;
}

export function UserList({ users, onUsersChange }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");

  // State Dialog Hapus
  const [deleteTarget, setDeleteTarget] = useState<SiteUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Modal Edit
  const [editingUser, setEditingUser] = useState<SiteUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [showSlugField, setShowSlugField] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // State Dialog Konfirmasi Ubah Slug
  const [slugConfirmOpen, setSlugConfirmOpen] = useState(false);

  const [, startTransition] = useTransition();

  // Filter client-side
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((u) => {
      if (activeTab === "active" && !u.is_active) return false;
      if (activeTab === "inactive" && u.is_active) return false;

      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.slug.toLowerCase().includes(q) ||
        u.phone_raw.toLowerCase().includes(q) ||
        u.phone_wa.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, activeTab]);

  // Statistik ringkas
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.is_active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [users]);

  // Salin link
  const handleCopyLink = (user: SiteUser) => {
    const fullUrl = `${siteUrl}/${user.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(user.id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === user.id ? null : curr));
    }, 2000);
  };

  // Toggle Aktif / Nonaktif
  const handleToggleActive = (user: SiteUser) => {
    const newStatus = !user.is_active;

    // Optimistic UI update
    onUsersChange((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u))
    );

    startTransition(async () => {
      const res = await toggleUserActiveAction(user.id, newStatus);
      if (!res.ok) {
        // Rollback
        onUsersChange((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_active: user.is_active } : u
          )
        );
        alert(res.message);
      }
    });
  };

  // Buka Modal Edit
  const openEditModal = (user: SiteUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditPhone(user.phone_raw);
    setEditSlug(user.slug);
    setShowSlugField(false);
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditError(null);
    setShowSlugField(false);
  };

  // Eksekusi Update User
  const executeUpdate = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    setEditError(null);

    const formData = new FormData();
    formData.append("id", editingUser.id);
    formData.append("name", editName);
    formData.append("phone", editPhone);
    if (showSlugField && editSlug.trim() !== editingUser.slug) {
      formData.append("slug", editSlug);
    }

    const res = await updateUserAction(formData);
    setIsUpdating(false);

    if (!res.ok) {
      setEditError(res.message);
      return;
    }

    if (res.data) {
      onUsersChange((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...(res.data as SiteUser) }
            : u
        )
      );
      closeEditModal();
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Jika slug diubah, konfirmasi terlebih dahulu
    if (showSlugField && editSlug.trim() !== editingUser.slug) {
      setSlugConfirmOpen(true);
      return;
    }

    executeUpdate();
  };

  // Eksekusi Hapus User
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const res = await deleteUserAction(deleteTarget.id);
    setIsDeleting(false);

    if (res.ok) {
      onUsersChange((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header & Tab Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Daftar Pengguna ({stats.total})
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Kelola URL personal, status aktif, dan nomor WhatsApp setiap mitra.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "all"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Semua ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "active"
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Aktif ({stats.active})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inactive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "inactive"
                ? "bg-zinc-800 text-zinc-300"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Nonaktif ({stats.inactive})
          </button>
        </div>
      </div>

      {/* Bar Pencarian */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama, nomor telepon, atau slug URL..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            {searchQuery
              ? "Tidak ada pengguna yang cocok"
              : "Belum ada pengguna terdaftar"}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ditemukan pengguna dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.`
              : "Tambahkan pengguna pertama menggunakan formulir di atas untuk mulai membuat URL personal."}
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {filteredUsers.length > 0 && (
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">URL Personal</th>
                <th className="py-3 px-4">Nomor WhatsApp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Klik (7h / Total)</th>
                <th className="py-3 px-4">Dibuat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/50">
              {filteredUsers.map((user) => {
                const isCopied = copiedId === user.id;
                const fullUrl = `${siteUrl}/${user.slug}`;
                const formattedDate = new Date(
                  user.created_at
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-zinc-850/50 transition-colors group"
                  >
                    {/* Nama */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {user.name}
                    </td>

                    {/* URL Personal */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-zinc-300">
                        <span className="text-zinc-500">/</span>
                        <span className="font-medium text-emerald-400">
                          {user.slug}
                        </span>
                      </div>
                    </td>

                    {/* Nomor */}
                    <td className="py-3.5 px-4">
                      <div className="text-zinc-200">
                        {formatPhoneDisplay(user.phone_wa)}
                      </div>
                      {user.phone_raw !== user.phone_wa && (
                        <div className="text-[11px] text-zinc-500">
                          Asli: {user.phone_raw}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user)}
                        title={
                          user.is_active
                            ? "Klik untuk menonaktifkan"
                            : "Klik untuk mengaktifkan"
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${
                          user.is_active
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/60"
                            : "bg-zinc-800/60 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/60"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.is_active ? "bg-emerald-400" : "bg-zinc-500"
                          }`}
                        />
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>

                    {/* Klik CTA (7 Hari / Total) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
                        <span className="font-semibold text-emerald-400">
                          {user.clicks_7d ?? 0}
                        </span>
                        <span className="text-zinc-600">/</span>
                        <span className="text-zinc-300">
                          {user.total_clicks ?? 0}
                        </span>
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                      {formattedDate}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Salin link */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(user)}
                          title="Salin Link"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Buka link */}
                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Buka Link di Tab Baru"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          title="Edit Pengguna"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Hapus */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          title="Hapus Pengguna"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Stacked Card View */}
      {filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 gap-3 lg:hidden">
          {filteredUsers.map((user) => {
            const isCopied = copiedId === user.id;
            const fullUrl = `${siteUrl}/${user.slug}`;
            const formattedDate = new Date(
              user.created_at
            ).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={user.id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{user.name}</h4>
                    <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 mt-0.5">
                      <span className="text-zinc-500">/</span>
                      <span>{user.slug}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(user)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      user.is_active
                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                        : "bg-zinc-800/60 text-zinc-400 border-zinc-700/50"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.is_active ? "bg-emerald-400" : "bg-zinc-500"
                      }`}
                    />
                    {user.is_active ? "Aktif" : "Nonaktif"}
                  </button>
                </div>

                <div className="text-xs text-zinc-400 space-y-1 pt-1 border-t border-zinc-850">
                  <div className="flex items-center justify-between">
                    <span>WhatsApp:</span>
                    <span className="text-zinc-200 font-mono">
                      {formatPhoneDisplay(user.phone_wa)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Klik (7h / Total):</span>
                    <span className="font-mono text-emerald-400 font-semibold text-xs">
                      {user.clicks_7d ?? 0} <span className="text-zinc-500 font-normal">/</span> {user.total_clicks ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dibuat:</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(user)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 hover:text-white"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>

                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(user)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(user)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 bg-zinc-900 border border-zinc-800"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full text-zinc-100 shadow-2xl relative">
            <button
              type="button"
              onClick={closeEditModal}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              Edit Pengguna
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Perbarui nama atau nomor telepon pengguna.
            </p>

            {editError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Opsi Edit Slug Manual (Advanced) */}
              <div className="pt-2 border-t border-zinc-800">
                {!showSlugField ? (
                  <button
                    type="button"
                    onClick={() => setShowSlugField(true)}
                    className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Ubah Slug URL Manual (Lanjutan)...</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-amber-400 uppercase">
                      Slug URL Manual
                    </label>
                    <div className="flex items-center rounded-xl bg-zinc-950 border border-amber-500/30 px-3">
                      <span className="text-zinc-500 text-xs font-mono">/</span>
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="w-full py-2 px-1 bg-transparent text-sm text-white font-mono focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-amber-300/80 flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        Peringatan: Mengubah slug akan membuat link lama tidak
                        lagi dapat diakses.
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Ubah Slug */}
      <ConfirmDialog
        isOpen={slugConfirmOpen}
        title="Ubah Alamat Slug URL?"
        message={`Anda akan mengubah slug dari "/${editingUser?.slug}" menjadi "/${editSlug}".\n\nLink lama yang telah dibagikan tidak akan berfungsi lagi. Pengunjung yang membuka link lama akan dialihkan ke halaman 404.\n\nApakah Anda yakin ingin melanjutkan?`}
        confirmLabel="Ya, Ubah Slug"
        cancelLabel="Batal"
        isLoading={isUpdating}
        onConfirm={() => {
          setSlugConfirmOpen(false);
          executeUpdate();
        }}
        onCancel={() => setSlugConfirmOpen(false)}
      />

      {/* Dialog Konfirmasi Hapus User */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Hapus Pengguna?"
        message={`Apakah Anda yakin ingin menghapus pengguna "${deleteTarget?.name}" secara permanen?\n\nAlamat personal "/${deleteTarget?.slug}" akan langsung terhapus dan pengunjung akan mendapatkan respons 404.`}
        confirmLabel="Hapus Permanen"
        cancelLabel="Batal"
        isDestructive
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
