"use client";

import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone?: "slate" | "sky" | "emerald" | "amber" | "rose";
}

const toneMap = {
  slate: "bg-slate-100 text-slate-700",
  sky: "bg-sky-100 text-sky-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
};

export default function DashboardCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = "slate",
}: DashboardCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
          <div className="mt-2 text-sm text-slate-500">{hint}</div>
        </div>
        <div className={`rounded-2xl p-3 ${toneMap[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
