"use client";

import { Menu, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface DashboardNavbarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export default function DashboardNavbar({ title, subtitle, onMenuClick }: DashboardNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 mb-6 flex items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-2xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-right sm:block">
          <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
          <div className="text-xs text-slate-500">{user?.role || "user"}</div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
