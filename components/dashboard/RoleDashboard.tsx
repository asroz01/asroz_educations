"use client";

import { useRole } from "@/context/RoleContext";
import { Users, DollarSign, CalendarCheck, TrendingUp, BookOpen, FileText, Clock } from "lucide-react";
import KpiCard from "./KpiCard";

// Each role gets its own KPI data slice
const ROLE_KPIS = {
  admin: [
    { label: "Total Active Students", value: "1,284", sub: "All classes", icon: Users, trend: "up" as const, trendLabel: "38 enrolled this month", accent: true },
    { label: "Revenue Collected",     value: "LKR 2.4M", sub: "July 2026", icon: DollarSign, trend: "up" as const, trendLabel: "+12% vs last month" },
    { label: "Upcoming Exams",        value: "9", sub: "Next 14 days", icon: CalendarCheck, trend: "neutral" as const, trendLabel: "3 this week" },
    { label: "Avg. Exam Score",       value: "76.4%", sub: "Term 3 · All classes", icon: TrendingUp, trend: "up" as const, trendLabel: "+4.2pts vs Term 2" },
  ],
  teacher: [
    { label: "My Classes",      value: "4", sub: "Active this term", icon: BookOpen, trend: "neutral" as const, trendLabel: "2 exams upcoming", accent: true },
    { label: "My Students",     value: "132", sub: "Across all classes", icon: Users, trend: "up" as const, trendLabel: "5 new this week" },
    { label: "Papers Pending",  value: "2", sub: "Awaiting upload", icon: FileText, trend: "down" as const, trendLabel: "Due in 3 days" },
    { label: "Avg. Class Score", value: "71.8%", sub: "My classes · Term 3", icon: TrendingUp, trend: "up" as const, trendLabel: "+3.1pts vs Term 2" },
  ],
  student: [
    { label: "My Courses",       value: "6", sub: "Enrolled this term", icon: BookOpen, trend: "neutral" as const, trendLabel: "1 new added", accent: true },
    { label: "Avg. Score",       value: "68.5%", sub: "All subjects", icon: TrendingUp, trend: "up" as const, trendLabel: "+5pts vs Term 2" },
    { label: "Upcoming Exams",   value: "3", sub: "Next 14 days", icon: CalendarCheck, trend: "neutral" as const, trendLabel: "Next: Maths on Fri" },
    { label: "Attendance",       value: "87%", sub: "This term", icon: Clock, trend: "down" as const, trendLabel: "Below 90% target" },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  admin:   "Admin · Global View",
  teacher: "Teacher · Class View",
  student: "Student · Personal View",
};

export default function RoleDashboard() {
  const { role } = useRole();
  const kpis = ROLE_KPIS[role];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1D1D1D]/35 dark:text-white/25">
          {ROLE_LABELS[role]}
        </span>
        <div className="flex-1 h-px bg-[#BFBFBF]/40 dark:bg-white/8" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>
    </div>
  );
}
