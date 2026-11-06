import { requireAdmin } from "@/lib/auth";
import { listUsersWithStats, getGlobalCtaStats } from "@/lib/site-users";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    // Defense-in-depth: verifikasi ulang status admin di level page
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  // Mengambil data awal seluruh user beserta statistik klik CTA dari Supabase
  const [users, globalStats] = await Promise.all([
    listUsersWithStats(),
    getGlobalCtaStats(),
  ]);

  return <AdminDashboard initialUsers={users} globalStats={globalStats} />;
}
