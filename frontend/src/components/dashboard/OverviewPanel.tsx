"use client";

import { useEffect, useState } from "react";
import { BookOpen, Package, Target, TrendingUp } from "lucide-react";
import api from "@/lib/axios";
import DashboardCard from "@/components/dashboard/DashboardCard";
import OrderHistorySection from "@/components/dashboard/OrderHistorySection";
import { LearningAnalytics } from "@/types/learning";

const emptyAnalytics: LearningAnalytics = {
  totalQuizzesAttempted: 0,
  averageScore: 0,
  strongTopics: [],
  weakTopics: [],
  topicBreakdown: [],
  performanceHistory: [],
};

export default function OverviewPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics>(emptyAnalytics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, analyticsRes] = await Promise.all([
          api.get("/orders/myorders"),
          api.get("/analytics"),
        ]);
        setOrders(ordersRes.data || []);
        setAnalytics(analyticsRes.data.data || emptyAnalytics);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Orders" value={orders.length} hint="Your complete purchase history" icon={Package} tone="sky" />
        <DashboardCard title="Learning Score" value={`${analytics.averageScore}%`} hint="Average quiz performance" icon={TrendingUp} tone="emerald" />
        <DashboardCard title="Quizzes Attempted" value={analytics.totalQuizzesAttempted} hint="Practice sessions completed" icon={Target} tone="amber" />
        <DashboardCard title="Total Spend" value={`Rs. ${totalSpent.toFixed(0)}`} hint="Across all purchased notes and books" icon={BookOpen} tone="rose" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <OrderHistorySection orders={orders} loading={loading} compact />

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Learning Progress</h2>
          <p className="mt-1 text-sm text-slate-500">A quick summary from your smart learning dashboard.</p>

          <div className="mt-6 space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-500">Average accuracy</div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div className="text-4xl font-extrabold tracking-tight text-slate-900">{analytics.averageScore}%</div>
                <div className="min-w-28 text-right text-sm text-slate-500">{analytics.totalQuizzesAttempted} attempts</div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-slate-900" style={{ width: `${Math.min(analytics.averageScore, 100)}%` }} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="text-sm font-bold text-emerald-800">Strong Topics</div>
                <div className="mt-3 space-y-3">
                  {analytics.strongTopics.length === 0 ? (
                    <div className="text-sm text-emerald-700">Your top-performing topics will show here once you attempt a few quizzes.</div>
                  ) : (
                    analytics.strongTopics.map((topic) => (
                      <div key={topic.topic} className="rounded-2xl bg-white/80 p-3">
                        <div className="font-semibold text-emerald-900">{topic.topic}</div>
                        <div className="mt-1 text-sm text-emerald-700">{topic.averageAccuracy}% average accuracy</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
                <div className="text-sm font-bold text-amber-800">Weak Topics</div>
                <div className="mt-3 space-y-3">
                  {analytics.weakTopics.length === 0 ? (
                    <div className="text-sm text-amber-700">Weak topics will appear here when the system finds areas to revisit.</div>
                  ) : (
                    analytics.weakTopics.map((topic) => (
                      <div key={topic.topic} className="rounded-2xl bg-white/80 p-3">
                        <div className="font-semibold text-amber-900">{topic.topic}</div>
                        <div className="mt-1 text-sm text-amber-700">{topic.averageAccuracy}% average accuracy</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
