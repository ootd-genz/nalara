"use server";

import { z } from "zod";
import { requireAdmin, AdminAuthError } from "@/lib/auth";
import {
  createUser,
  updateUser,
  setUserActive,
  deleteUser,
  type SiteUser,
} from "@/lib/site-users";
import { normalizePhoneToWa } from "@/lib/phone";
import { siteUrl } from "@/lib/site-url";
import { redirect } from "next/navigation";

export interface ActionResult<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string>;
}

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Nama minimal 2 karakter." })
    .max(80, { message: "Nama maksimal 80 karakter." }),
  phone: z
    .string()
    .trim()
    .min(9, { message: "Nomor telepon terlalu pendek." })
    .max(20, { message: "Nomor telepon maksimal 20 digit." })
    .refine((val) => normalizePhoneToWa(val) !== null, {
      message:
        "Format nomor telepon tidak valid. Gunakan format nomor Indonesia (contoh: 089517795206).",
    }),
});

const updateUserSchema = z.object({
  id: z.string().uuid({ message: "ID pengguna tidak valid." }),
  name: z
    .string()
    .trim()
    .min(2, { message: "Nama minimal 2 karakter." })
    .max(80, { message: "Nama maksimal 80 karakter." }),
  phone: z
    .string()
    .trim()
    .min(9, { message: "Nomor telepon terlalu pendek." })
    .max(20, { message: "Nomor telepon maksimal 20 digit." })
    .refine((val) => normalizePhoneToWa(val) !== null, {
      message:
        "Format nomor telepon tidak valid. Gunakan format nomor Indonesia (contoh: 089517795206).",
    }),
  slug: z.string().trim().optional(),
});

/**
 * Server Action: Tambah User Baru
 */
export async function createUserAction(
  formData: FormData
): Promise<ActionResult<SiteUser & { url: string }>> {
  try {
    // 1. Guard hak admin
    await requireAdmin();

    // 2. Parsing & validasi input Zod
    const rawData = {
      name: formData.get("name")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
    };

    const parsed = createUserSchema.safeParse(rawData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString();
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      return {
        ok: false,
        message: "Silakan perbaiki data yang belum sesuai.",
        fieldErrors,
      };
    }

    // 3. Eksekusi pembuatan di database
    const newUser = await createUser(parsed.data);
    const fullUrl = `${siteUrl}/${newUser.slug}`;

    return {
      ok: true,
      message: "Pengguna berhasil ditambahkan.",
      data: {
        ...newUser,
        url: fullUrl,
      },
    };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return { ok: false, message: error.message };
    }
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return { ok: false, message };
  }
}

/**
 * Server Action: Update User
 */
export async function updateUserAction(
  formData: FormData
): Promise<ActionResult<SiteUser & { url: string }>> {
  try {
    // 1. Guard hak admin
    await requireAdmin();

    const rawData = {
      id: formData.get("id")?.toString() || "",
      name: formData.get("name")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      slug: formData.get("slug")?.toString() || undefined,
    };

    const parsed = updateUserSchema.safeParse(rawData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString();
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      return {
        ok: false,
        message: "Silakan perbaiki data yang belum sesuai.",
        fieldErrors,
      };
    }

    const updated = await updateUser(parsed.data.id, {
      name: parsed.data.name,
      phone: parsed.data.phone,
      slug: parsed.data.slug || undefined,
    });

    return {
      ok: true,
      message: "Data pengguna berhasil diperbarui.",
      data: {
        ...updated,
        url: `${siteUrl}/${updated.slug}`,
      },
    };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return { ok: false, message: error.message };
    }
    const message =
      error instanceof Error ? error.message : "Gagal memperbarui pengguna.";
    return { ok: false, message };
  }
}

const idSchema = z
  .string()
  .uuid({ message: "ID pengguna harus berformat UUID yang valid." });

const toggleUserActiveSchema = z.object({
  id: idSchema,
  isActive: z.boolean(),
});

const deleteUserSchema = z.object({
  id: idSchema,
});

/**
 * Server Action: Ubah Status Aktif / Nonaktif
 */
export async function toggleUserActiveAction(
  id: string,
  isActive: boolean
): Promise<ActionResult<SiteUser>> {
  try {
    await requireAdmin();

    const parsed = toggleUserActiveSchema.safeParse({ id, isActive });
    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message || "Input tidak valid.",
      };
    }

    const updated = await setUserActive(parsed.data.id, parsed.data.isActive);
    return {
      ok: true,
      message: parsed.data.isActive
        ? "Pengguna berhasil diaktifkan."
        : "Pengguna berhasil dinonaktifkan.",
      data: updated,
    };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return { ok: false, message: error.message };
    }
    const message =
      error instanceof Error ? error.message : "Gagal mengubah status pengguna.";
    return { ok: false, message };
  }
}

/**
 * Server Action: Hapus User
 */
export async function deleteUserAction(id: string): Promise<ActionResult<void>> {
  try {
    await requireAdmin();

    const parsed = deleteUserSchema.safeParse({ id });
    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message || "ID pengguna tidak valid.",
      };
    }

    await deleteUser(parsed.data.id);
    return {
      ok: true,
      message: "Pengguna berhasil dihapus secara permanen.",
    };
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return { ok: false, message: error.message };
    }
    const message =
      error instanceof Error ? error.message : "Gagal menghapus pengguna.";
    return { ok: false, message };
  }
}

/**
 * Server Action: Logout
 */
export async function logoutAction(): Promise<void> {
  try {
    const { supabase } = await requireAdmin();
    await supabase.auth.signOut();
  } catch {
    // Abaikan jika sudah tidak login
  }
  redirect("/admin/login");
}
