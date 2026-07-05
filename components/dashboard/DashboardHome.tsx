"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuickActions from "./QuickActions";
import EnrollmentChart from "./EnrollmentChart";
import ExamChart from "./ExamChart";
import ActivityFeed from "./ActivityFeed";
import RoleDashboard from "./RoleDashboard";
import PredictiveWidgets from "./PredictiveWidgets";
import AddStudentModal from "./AddStudentModal";
import SkeletonCard, { SkeletonChart, SkeletonRow } from "@/components/ui/SkeletonCard";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-28 rounded-lg bg-[#BFBFBF]/50 dark:bg-white/10" />
          <div className="h-3.5 w-48 rounded-lg bg-[#BFBFBF]/35 dark:bg-white/8" />
        </div>
        <div className="h-9 w-56 rounded-xl bg-[#BFBFBF]/40 dark:bg-white/8" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SkeletonChart /><SkeletonChart />
      </div>
      <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5)] space-y-3">
        {[1,2,3,4,5].map((i) => <SkeletonRow key={i} />)}
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const router  = useRouter();
  const [loading,          setLoading]          = useState(true);
  const [showAddStudent,   setShowAddStudent]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <>
      <div className="space-y-6">
        {/* Page title + quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#131313] dark:text-white">Overview</h1>
            <p className="text-sm text-[#1D1D1D]/45 dark:text-white/30 mt-0.5">
              ASROZ Educations · Academic Year 2026
            </p>
          </div>
          <QuickActions onAddStudent={() => setShowAddStudent(true)} />
        </div>

        {/* Role-adaptive KPI row */}
        <RoleDashboard />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <EnrollmentChart />
          <ExamChart />
        </div>

        {/* AI predictive section */}
        <PredictiveWidgets />

        {/* Activity feed */}
        <ActivityFeed />
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
