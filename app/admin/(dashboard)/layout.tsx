import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/admin-header";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | undefined;

  try {
    const { user } = await requireAdmin();
    userEmail = user.email;
  } catch {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminHeader userEmail={userEmail} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </>
  );
}
