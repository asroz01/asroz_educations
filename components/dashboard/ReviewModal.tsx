"use client";

import { useEffect, useState } from "react";
import { X, User, Calendar, BookOpen, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import type { StudentReviewDetail, GradeWithExam, AttendanceWithClass } from "@/types/database";
import {
  fetchStudentReviewDetail,
  fetchStudentGrades,
  fetchStudentAttendance,
} from "@/supabase/queries/studentQueries";

interface ReviewModalProps {
  studentId: string;
  studentName: string;
  severity: "high" | "medium" | "low";
  reason: string;
  onClose: () => void;
}

const SEVERITY_STYLES = {
  high:   { badge: "bg-[#CF291D]/10 text-[#CF291D] border border-[#CF291D]/20",   dot: "bg-[#CF291D]"   },
  medium: { badge: "bg-amber-500/10 text-amber-600 border border-amber-500/20",    dot: "bg-amber-500"   },
  low:    { badge: "bg-blue-500/10 text-blue-600 border border-blue-500/20",        dot: "bg-blue-500"    },
};

const STATUS_ICON: Record<string, React.ElementType> = {
  present: CheckCircle2,
  absent:  XCircle,
  late:    Clock,
  excused: AlertCircle,
};

const STATUS_COLOR: Record<string, string> = {
  present: "text-emerald-600",
  absent:  "text-[#CF291D]",
  late:    "text-amber-500",
  excused: "text-blue-500",
};

const GRADE_COLOR = (marks: number) =>
  marks >= 75 ? "#CF291D" : marks >= 55 ? "#f59e0b" : "#6B7280";

function StatPill({ label, value, sub, color = "" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl bg-[#ECECEC] dark:bg-[#111111] shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.5),-1px_-1px_4px_rgba(255,255,255,0.03)]">
      <span className={`text-2xl font-bold ${color || "text-[#131313] dark:text-white"}`}>{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">{label}</span>
      {sub && <span className="text-[10px] text-[#1D1D1D]/30 dark:text-white/20">{sub}</span>}
    </div>
  );
}

export default function ReviewModal({ studentId, studentName, severity, reason, onClose }: ReviewModalProps) {
  const [detail, setDetail]         = useState<StudentReviewDetail | null>(null);
  const [grades, setGrades]         = useState<GradeWithExam[]>([]);
  const [attendance, setAttendance] = useState<AttendanceWithClass[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<"overview" | "grades" | "attendance">("overview");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    Promise.all([
      fetchStudentReviewDetail(studentId),
      fetchStudentGrades(studentId),
      fetchStudentAttendance(studentId, 60),
    ]).then(([d, g, a]) => {
      setDetail(d);
      setGrades(g);
      setAttendance(a);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [studentId]);

  // Build grade chart data
  const gradeChartData = grades.map((g) => ({
    label: `${g.exams.subject} T${g.exams.term}`,
    marks: Number(g.marks),
    total: g.exams.total_marks,
    pct:   Math.round((Number(g.marks) / g.exams.total_marks) * 100),
  }));

  // Build attendance calendar-style weekly summary (last 8 weeks)
  const attendanceByWeek = (() => {
    const weeks: { week: string; present: number; absent: number; late: number }[] = [];
    for (let w = 7; w >= 0; w--) {
      const end   = new Date(); end.setDate(end.getDate() - w * 7);
      const start = new Date(end); start.setDate(end.getDate() - 6);
      const label = `W${8 - w}`;
      const slice = attendance.filter((a) => {
        const d = new Date(a.date);
        return d >= start && d <= end;
      });
      weeks.push({
        week:    label,
        present: slice.filter((a) => a.status === "present").length,
        absent:  slice.filter((a) => a.status === "absent").length,
        late:    slice.filter((a) => a.status === "late").length,
      });
    }
    return weeks;
  })();

  const styles = SEVERITY_STYLES[severity];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[12px_12px_32px_rgba(0,0,0,0.18),-6px_-6px_20px_rgba(255,255,255,0.7)] dark:shadow-[12px_12px_32px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#BFBFBF]/30 dark:border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#CF291D]/10 dark:bg-[#CF291D]/20">
              <User size={18} className="text-[#CF291D]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#131313] dark:text-white">{studentName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize ${styles.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                  {severity} risk
                </span>
                <span className="text-[11px] text-[#1D1D1D]/40 dark:text-white/30">{reason}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-[#1D1D1D]/40 dark:text-white/30 hover:text-[#CF291D] bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.5)] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-[#BFBFBF]/20 dark:border-white/6">
          {(["overview", "grades", "attendance"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150 ${
                tab === t
                  ? "bg-[#CF291D] text-white shadow-[2px_2px_6px_rgba(207,41,29,0.35)]"
                  : "text-[#1D1D1D]/50 dark:text-white/35 hover:text-[#CF291D] hover:bg-[#BFBFBF]/20 dark:hover:bg-white/6"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="grid grid-cols-4 gap-3">
                {[1,2,3,4].map((i) => <div key={i} className="h-20 rounded-2xl bg-[#BFBFBF]/40 dark:bg-white/8" />)}
              </div>
              <div className="h-40 rounded-2xl bg-[#BFBFBF]/30 dark:bg-white/6" />
              <div className="h-40 rounded-2xl bg-[#BFBFBF]/30 dark:bg-white/6" />
            </div>
          ) : (
            <>
              {/* ── Overview tab ── */}
              {tab === "overview" && (
                <div className="space-y-5">
                  {/* Stat pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatPill label="Attendance" value={`${detail?.attendance_pct ?? "—"}%`} color={Number(detail?.attendance_pct) < 70 ? "text-[#CF291D]" : "text-emerald-600"} />
                    <StatPill label="Present" value={detail?.present_count ?? "—"} sub={`of ${detail?.total_sessions ?? "—"} days`} />
                    <StatPill label="Absent" value={detail?.absent_count ?? "—"} color="text-[#CF291D]" />
                    <StatPill label="Late" value={detail?.late_count ?? "—"} color="text-amber-500" />
                  </div>

                  {/* Student meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: User,     label: "Class",        value: detail?.class_name    ?? "—" },
                      { icon: Calendar, label: "Date of Birth", value: detail?.date_of_birth ?? "—" },
                      { icon: BookOpen, label: "Enrolled",      value: detail?.enrolled_at   ?? "—" },
                      { icon: User,     label: "Gender",        value: detail?.gender        ?? "—" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#111111] shadow-[3px_3px_7px_rgba(0,0,0,0.08),-2px_-2px_5px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.4)]">
                        <Icon size={14} className="text-[#CF291D] shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/30 uppercase tracking-wider font-semibold">{label}</p>
                          <p className="text-sm font-semibold text-[#131313] dark:text-white capitalize">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Intervention note */}
                  <div className={`flex items-start gap-3 p-4 rounded-2xl border ${styles.badge}`}>
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold mb-0.5">Intervention Required</p>
                      <p className="text-[11px] leading-relaxed opacity-80">
                        {severity === "high"
                          ? "Immediate contact with guardian recommended. Consider attendance counselling and academic support sessions."
                          : severity === "medium"
                          ? "Schedule a one-on-one review with the class teacher. Monitor for the next 2 weeks."
                          : "Keep monitoring. Notify teacher to provide additional support if trend continues."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Grades tab ── */}
              {tab === "grades" && (
                <div className="space-y-4">
                  {gradeChartData.length === 0 ? (
                    <p className="text-center text-sm text-[#1D1D1D]/40 dark:text-white/30 py-10">No grade records found.</p>
                  ) : (
                    <>
                      <div className="bg-[#ECECEC] dark:bg-[#111111] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.5)]">
                        <p className="text-xs font-semibold text-[#131313] dark:text-white mb-3">Score % per Exam</p>
                        <ResponsiveContainer width="100%" height={160}>
                          <BarChart data={gradeChartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#BFBFBF" strokeOpacity={0.3} vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#1D1D1D", opacity: 0.45 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#1D1D1D", opacity: 0.45 }} axisLine={false} tickLine={false} />
                            <Tooltip
                              contentStyle={{ background: "#ECECEC", border: "1px solid #BFBFBF", borderRadius: "10px", fontSize: 11 }}
                              formatter={(v) => [`${v}%`, "Score"]}
                            />
                            <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                              {gradeChartData.map((entry, i) => (
                                <Cell key={i} fill={GRADE_COLOR(entry.pct)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Grade rows */}
                      <div className="space-y-2">
                        {grades.map((g) => {
                          const pct  = Math.round((Number(g.marks) / g.exams.total_marks) * 100);
                          const prev = grades.find((x) => x.exams.subject === g.exams.subject && x.exams.term === g.exams.term - 1);
                          const diff = prev ? pct - Math.round((Number(prev.marks) / prev.exams.total_marks) * 100) : null;
                          const TrendIcon = diff === null ? Minus : diff >= 0 ? TrendingUp : TrendingDown;
                          return (
                            <div key={g.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.4)]">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#131313] dark:text-white truncate">{g.exams.title}</p>
                                <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/30">{g.exams.subject} · Term {g.exams.term}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {diff !== null && (
                                  <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${diff >= 0 ? "text-emerald-600" : "text-[#CF291D]"}`}>
                                    <TrendIcon size={10} />{Math.abs(diff)}pts
                                  </span>
                                )}
                                <span className={`text-sm font-bold ${pct >= 75 ? "text-[#CF291D]" : pct >= 55 ? "text-amber-500" : "text-[#1D1D1D]/50 dark:text-white/40"}`}>
                                  {pct}%
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-[#BFBFBF]/30 dark:bg-white/8 text-[#1D1D1D]/50 dark:text-white/30">
                                  {g.grade}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── Attendance tab ── */}
              {tab === "attendance" && (
                <div className="space-y-4">
                  {/* Weekly chart */}
                  <div className="bg-[#ECECEC] dark:bg-[#111111] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.5)]">
                    <p className="text-xs font-semibold text-[#131313] dark:text-white mb-3">Weekly Attendance (last 8 weeks)</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <AreaChart data={attendanceByWeek} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                          </linearGradient>
                          <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#CF291D" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#CF291D" stopOpacity={0}   />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#BFBFBF" strokeOpacity={0.3} />
                        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#1D1D1D", opacity: 0.45 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#1D1D1D", opacity: 0.45 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#ECECEC", border: "1px solid #BFBFBF", borderRadius: "10px", fontSize: 11 }} />
                        <Area type="monotone" dataKey="present" name="Present" stroke="#10b981" strokeWidth={2} fill="url(#gPresent)" dot={false} />
                        <Area type="monotone" dataKey="absent"  name="Absent"  stroke="#CF291D" strokeWidth={2} fill="url(#gAbsent)"  dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent attendance list */}
                  <div className="space-y-1.5">
                    {attendance.slice(0, 20).map((a) => {
                      const Icon = STATUS_ICON[a.status] ?? Minus;
                      return (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.35)]">
                          <Icon size={14} className={`shrink-0 ${STATUS_COLOR[a.status]}`} />
                          <span className="text-xs font-medium text-[#131313] dark:text-white flex-1">{a.date}</span>
                          <span className={`text-[10px] font-bold capitalize px-2 py-0.5 rounded-lg bg-[#BFBFBF]/25 dark:bg-white/6 ${STATUS_COLOR[a.status]}`}>
                            {a.status}
                          </span>
                          {a.classes && <span className="text-[10px] text-[#1D1D1D]/35 dark:text-white/25">{a.classes.name}</span>}
                        </div>
                      );
                    })}
                    {attendance.length === 0 && (
                      <p className="text-center text-sm text-[#1D1D1D]/40 dark:text-white/30 py-8">No attendance records found.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BFBFBF]/30 dark:border-white/8">
          <p className="text-[10px] text-[#1D1D1D]/30 dark:text-white/20">
            Data source: ASROZ Educations · Last updated now
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#B50717] shadow-[2px_2px_6px_rgba(181,7,23,0.3)] hover:bg-[#CF291D] transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
