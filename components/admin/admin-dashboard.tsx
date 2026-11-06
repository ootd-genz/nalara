"use client";

import { useState } from "react";
import {
  type SiteUser,
  type SiteUserWithStats,
  type GlobalCtaStats,
} from "@/lib/site-users";
import { UserForm } from "@/components/admin/user-form";
import { UserList } from "@/components/admin/user-list";
import { MousePointerClick, TrendingUp, Users } from "lucide-react";

interface AdminDashboardProps {
  initialUsers: SiteUserWithStats[];
  globalStats?: GlobalCtaStats;
}

export function AdminDashboard({
  initialUsers,
  globalStats,
}: AdminDashboardProps) {
  const [users, setUsers] = useState<SiteUserWithStats[]>(initialUsers);

  const handleUserCreated = (newUser: SiteUser) => {
    const userWithStats: SiteUserWithStats = {
      ...newUser,
      total_clicks: 0,
      clicks_7d: 0,
    };
    setUsers((prev) => [userWithStats, ...prev]);
  };

  // Ringkasan metrik global / user
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const totalUserClicks = users.reduce((sum, u) => sum + (u.total_clicks || 0), 0);
  const userClicks7d = users.reduce((sum, u) => sum + (u.clicks_7d || 0), 0);

  const displayTotalClicks = globalStats?.total_clicks ?? totalUserClicks;
  const displayClicks7d = globalStats?.clicks_7d ?? userClicks7d;

  return (
    <div className="space-y-8">
      {/* Ringkasan Statistik Metrik Lead CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Pengguna */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Total Pengguna</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white font-heading">
                {totalUsers}
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                ({activeUsers} aktif)
              </span>
            </div>
          </div>
        </div>

        {/* Klik 7 Hari Terakhir */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Klik 7 Hari Terakhir</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-emerald-400 font-heading">
                {displayClicks7d}
              </span>
              <span className="text-xs text-zinc-500">interaksi lead</span>
            </div>
          </div>
        </div>

        {/* Total Semua Klik */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Total Seluruh Klik CTA</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white font-heading">
                {displayTotalClicks}
              </span>
              <span className="text-xs text-zinc-500">sepanjang waktu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Tambah User */}
      <UserForm existingUsers={users} onUserCreated={handleUserCreated} />

      {/* Daftar Pengguna */}
      <UserList users={users} onUsersChange={setUsers} />
    </div>
  );
}
