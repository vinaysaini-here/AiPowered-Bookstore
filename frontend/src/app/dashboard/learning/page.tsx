"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import LearningDashboard from "@/components/learning/LearningDashboard";

export default function DashboardLearningPage() {
  const { user, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  if (!mounted || !user) {
    return <div className="h-48 animate-pulse rounded-[1.75rem] bg-white" />;
  }

  return <LearningDashboard userName={user.name} />;
}
