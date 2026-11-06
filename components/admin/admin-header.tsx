"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/admin/actions";
import { LogOut, Shield, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  userEmail?: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-white text-lg">
              NALARA
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              Admin
            </span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors ml-3 pl-3 border-l border-zinc-800"
          >
            Lihat Website
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden md:inline-block text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
              {userEmail}
            </span>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
            ) : (
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
