"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/Navbar";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard Overview",
    subtitle: "A clean summary of your orders, study progress, and account activity.",
  },
  "/dashboard/profile": {
    title: "My Profile",
    subtitle: "Your account details and identity settings in one place.",
  },
  "/dashboard/orders": {
    title: "My Orders",
    subtitle: "Everything you've purchased, with invoices ready whenever you need them.",
  },
  "/dashboard/learning": {
    title: "Learning",
    subtitle: "Generate quizzes from purchased notes and track your learning progress.",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "A placeholder space for future account and product settings.",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.push("/login?redirect=dashboard");
    }
  }, [mounted, router, user]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted || !user) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-slate-900" />
      </div>
    );
  }

  const currentMeta = pageMeta[pathname] || pageMeta["/dashboard"];

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden bg-[#f7f7f5]">
      <div className="flex h-full">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-6">
            <DashboardNavbar
              title={currentMeta.title}
              subtitle={currentMeta.subtitle}
              onMenuClick={() => setSidebarOpen(true)}
            />
            <main className="pb-10">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
