"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  UserCircle2,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: UserCircle2 },
  { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Learning", href: "/dashboard/learning", icon: BookOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-[#0f172a] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Workspace</div>
              <div className="mt-1 text-xl font-bold tracking-tight">AI Bookstore</div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="border-b border-slate-800 px-6 py-5">
            <div className="text-sm font-semibold text-slate-100">{user?.name}</div>
            <div className="mt-1 text-sm text-slate-400">{user?.email}</div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.18)]"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={onClose} />}
    </>
  );
}
