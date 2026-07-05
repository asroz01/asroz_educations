// Server-side query functions — called from Server Components, Route Handlers,
// and Server Actions only. Uses the cookie-based SSR client so the session is
// always fresh and secret keys never reach the browser.

import { createClient } from "@/utils/supabase/server";
import type { AtRiskStudent, AuditLog } from "@/types/database";

// ── At-risk list (server render) ──────────────────────────────
export async function getAtRiskStudents(): Promise<AtRiskStudent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("at_risk_students")
    .select("*");

  if (error) { console.error(error); return []; }
  return (data ?? []) as AtRiskStudent[];
}

// ── Audit logs (server render — never expose raw logs client-side) ──
export async function getAuditLogs(limit = 50): Promise<AuditLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) { console.error(error); return []; }
  return (data ?? []) as AuditLog[];
}

// ── Dashboard KPIs (server render) ────────────────────────────
export async function getDashboardKpis() {
  const supabase   = await createClient();
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
