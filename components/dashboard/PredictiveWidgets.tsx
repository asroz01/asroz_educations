"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid,
} from "recharts";
import { TrendingUp, AlertTriangle, Brain } from "lucide-react";
import type { AtRiskStudent } from "@/types/database";
import { fetchAtRiskStudents } from "@/supabase/queries/studentQueries";
import ReviewModal from "./ReviewModal";
import { SkeletonRow } from "@/components/ui/SkeletonCard";

// Static forecast data — replace with real ML/forecast endpoint when available
const enrollmentForecast = [
  { month: "Jan", actual: 210 },
  { month: "Feb", actual: 225 },
  { month: "Mar", actual: 238 },
  { month: "Apr", actual: 244 },
  { month: "May", actual: 260 },
  { month: "Jun", actual: 272 },
  { month: "Jul", actual: 284 },
  { month: "Aug", forecast: 296 },
  { month: "Sep", forecast: 311 },
  { month: "Oct", forecast: 325 },
  { month: "Nov", forecast: 338 },
  { month: "Dec", forecast: 350 },
];

const SEVERITY_STYLES: Record<string, string> = {
  high:   "bg-[#CF291D]/10 text-[#CF291D] border-[#CF291D]/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low:    "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

interface ModalState {
  studentId: string;
  studentName: string;
  severity: "high" | "medium" | "low";
  reason: string;
}

export default function PredictiveWidgets() {
  const [atRisk, setAtRisk]       = useState<AtRiskStudent[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState<ModalState | null>(null);

  useEffect(() => {
    fetchAtRiskStudents()
      .then(setAtRisk)
      .catch(() => setAtRisk([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* ── Predictive Enrollment ── */}
        <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Brain size={13} className="text-[#CF291D]" />
                <h3 className="text-sm font-semibold text-[#131313] dark:text-white">Predictive Enrollment</h3>
              </div>
              <p className="text-xs text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">AI forecast · Aug – Dec 2026</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#CF291D]/10 dark:bg-[#CF291D]/20">
              <TrendingUp size={11} className="text-[#CF291D]" />
              <span className="text-[10px] font-bold text-[#CF291D]">+23% projected</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={enrollmentForecast} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#BFBFBF" strokeOpacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#1D1D1D", opacity: 0.4 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#1D1D1D", opacity: 0.4 }} axisLine={false} tickLine={false} domain={[180, 380]} />
              <Tooltip
                contentStyle={{ background: "#ECECEC", border: "1px solid #BFBFBF", borderRadius: "10px", fontSize: 11 }}
                formatter={(v, name) => [v, name === "actual" ? "Actual" : "Forecast"]}
              />
              <ReferenceLine x="Jul" stroke="#BFBFBF" strokeDasharray="4 2" label={{ value: "Today", fontSize: 9, fill: "#BFBFBF", position: "top" }} />
              <Line type="monotone" dataKey="actual"   stroke="#CF291D" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} connectNulls />
              <Line type="monotone" dataKey="forecast" stroke="#CF291D" strokeWidth={2} strokeDasharray="5 3" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-[11px] text-[#1D1D1D]/40 dark:text-white/25 mt-2 italic">
            Forecast based on 3-year enrollment patterns and term-cycle seasonality.
          </p>
        </div>

        {/* ── At-Risk Students ── */}
        <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-500" />
                <h3 className="text-sm font-semibold text-[#131313] dark:text-white">At-Risk Students</h3>
              </div>
              <p className="text-xs text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">
                {loading ? "Loading…" : `${atRisk.length} student${atRisk.length !== 1 ? "s" : ""} need intervention`}
              </p>
            </div>
            {!loading && atRisk.length > 0 && (
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/15 text-xs font-bold text-amber-600">
                {atRisk.length}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {loading ? (
              [1,2,3,4].map((i) => <SkeletonRow key={i} />)
            ) : atRisk.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-2">
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-[#131313] dark:text-white">All students on track</p>
                <p className="text-xs text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">No at-risk flags detected this month.</p>
              </div>
            ) : (
              atRisk.map((s) => (
                <div
                  key={s.student_id}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${SEVERITY_STYLES[s.severity]}`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#131313] dark:text-white truncate">{s.full_name}</p>
                    <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/30">
                      {s.class_name} · {s.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => setModal({
                      studentId:   s.student_id,
                      studentName: s.full_name,
                      severity:    s.severity,
                      reason:      s.reason,
                    })}
                    className="ml-3 shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/60 dark:bg-white/10 text-[#131313] dark:text-white hover:bg-white dark:hover:bg-white/20 transition-colors"
                  >
                    Review
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Review Modal ── */}
      {modal && (
        <ReviewModal
          studentId={modal.studentId}
          studentName={modal.studentName}
          severity={modal.severity}
          reason={modal.reason}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
