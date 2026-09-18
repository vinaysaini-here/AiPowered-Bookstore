"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import ProfileSummary from "@/components/dashboard/ProfileSummary";

export default function DashboardProfilePage() {
  const { user, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  if (!mounted || !user) {
    return <div className="h-40 animate-pulse rounded-[1.75rem] bg-white" />;
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <ProfileSummary user={user} />

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Profile Details</h2>
        <p className="mt-2 max-w-2xl text-slate-500">
          This area is ready for profile editing whenever you want to add account update actions.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Display Name</div>
            <div className="mt-3 text-lg font-bold text-slate-900">{user.name}</div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email</div>
            <div className="mt-3 text-lg font-bold text-slate-900">{user.email}</div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Role</div>
            <div className="mt-3 text-lg font-bold capitalize text-slate-900">{user.role}</div>
          </div>
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Next Step</div>
            <div className="mt-3 text-sm text-slate-600">
              Add profile edit actions here later without disturbing the dashboard shell.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
