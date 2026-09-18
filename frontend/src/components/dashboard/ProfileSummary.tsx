"use client";

import { Mail, ShieldCheck, UserCircle2 } from "lucide-react";

interface ProfileSummaryProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  compact?: boolean;
}

export default function ProfileSummary({ user, compact = false }: ProfileSummaryProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className={`flex ${compact ? "items-center gap-4" : "flex-col items-center text-center"} `}>
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-slate-100 text-slate-700">
          <UserCircle2 size={40} />
        </div>
        <div className={compact ? "" : "mt-5"}>
          <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
          <p className="mt-1 text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Mail size={16} />
            Email Address
          </div>
          <div className="mt-2 text-base font-semibold text-slate-900">{user.email}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <ShieldCheck size={16} />
            Account Role
          </div>
          <div className="mt-2 text-base font-semibold capitalize text-slate-900">{user.role}</div>
        </div>
      </div>
    </div>
  );
}
