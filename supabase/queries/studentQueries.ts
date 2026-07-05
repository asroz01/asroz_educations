// Client-side query functions — called from "use client" components.
// Each function creates a fresh browser client so it can be used in
// React hooks without violating the singleton rule.

import { createClient } from "@/utils/supabase/client";
import type {
  AtRiskStudent,
  StudentReviewDetail,
  GradeWithExam,
  AttendanceWithClass,
} from "@/types/database";

// ── At-risk list (dashboard widget) ───────────────────────────
export async function fetchAtRiskStudents(): Promise<AtRiskStudent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("at_risk_students")
    .select("*");

  if (error) throw new Error(`fetchAtRiskStudents: ${error.message}`);
  return (data ?? []) as AtRiskStudent[];
}

// ── Student summary for Review modal header ────────────────────
export async function fetchStudentReviewDetail(
  studentId: string
): Promise<StudentReviewDetail | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("student_review_detail")
    .select("*")
    .eq("student_id", studentId)
    .single();

  if (error) { console.error(error); return null; }
  return data as StudentReviewDetail;
}

// ── Grade history for Review modal chart ──────────────────────
export async function fetchStudentGrades(
  studentId: string
): Promise<GradeWithExam[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("grades")
    .select("*, exams(title, subject, term, exam_date, total_marks)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`fetchStudentGrades: ${error.message}`);
  return (data ?? []) as GradeWithExam[];
}

// ── Attendance history (last N days) ──────────────────────────
export async function fetchStudentAttendance(
  studentId: string,
  days = 60
): Promise<AttendanceWithClass[]> {
  const supabase = createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("attendance")
    .select("*, classes(name)")
    .eq("student_id", studentId)
    .gte("date", since.toISOString().split("T")[0])
    .order("date", { ascending: false });

  if (error) throw new Error(`fetchStudentAttendance: ${error.message}`);
  return (data ?? []) as AttendanceWithClass[];
}

// ── Dashboard KPIs (client-side) ──────────────────────────────
export async function fetchDashboardKpis() {
  const supabase = createClient();

  const today      = new Date().toISOString().split("T")[0];
  const in14Days   = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                       .toISOString().split("T")[0];

  const [studentsRes, paymentsRes, examsRes, gradesRes] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("payments").select("amount").gte("payment_date", monthStart),
    supabase.from("exams").select("id", { count: "exact", head: true }).gte("exam_date", today).lte("exam_date", in14Days),
    supabase.from("grades").select("marks"),
  ]);

  const totalStudents  = studentsRes.count ?? 0;
  const monthlyRevenue = (paymentsRes.data ?? []).reduce((s, r) => s + Number(r.amount), 0);
  const upcomingExams  = examsRes.count ?? 0;
  const allMarks       = (gradesRes.data ?? []).map((r) => Number(r.marks)).filter(Boolean);
  const avgScore       = allMarks.length
    ? Math.round((allMarks.reduce((a, b) => a + b, 0) / allMarks.length) * 10) / 10
    : 0;

  return { totalStudents, monthlyRevenue, upcomingExams, avgScore };
}
