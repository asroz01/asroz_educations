// ─────────────────────────────────────────────────────────────────
//  enrollmentQueries.ts — SERVER ONLY (imported by Server Components
//  and Server Actions only — never imported directly by Client Components)
// ─────────────────────────────────────────────────────────────────
import { createClient } from "@/utils/supabase/server";

export interface EnrollmentFilters {
  search:        string;
  classId:       string;
  paymentStatus: string;
  month:         string; // "YYYY-MM" or ""
  page:          number;
  pageSize:      number;
  sortField:     string;
  sortDir:       "asc" | "desc";
}

export interface EnrollmentRow {
  id:             string;
  full_name:      string;
  gender:         string | null;
  date_of_birth:  string | null;
  enrolled_at:    string;
  is_active:      boolean;
  payment_status: "paid" | "pending" | "overdue";
  outstanding_balance: number;
  guardian_name:  string | null;
  guardian_phone: string | null;
  class_id:       string | null;
  class_name:     string | null;
  stream:         string | null;
}

export async function fetchEnrollments(filters: EnrollmentFilters) {
  const supabase = await createClient();

  let query = supabase
    .from("enrollment_list")
    .select("*", { count: "exact" });

  if (filters.search.trim()) {
    query = query.ilike("full_name", `%${filters.search.trim()}%`);
  }

  if (filters.classId) {
    query = query.eq("class_id", filters.classId);
  }

  if (filters.paymentStatus) {
    query = query.eq("payment_status", filters.paymentStatus);
  }

  if (filters.month) {
    const [y, m] = filters.month.split("-");
    const start  = `${y}-${m}-01`;
    const end    = new Date(Number(y), Number(m), 0).toISOString().split("T")[0];
    query = query.gte("enrolled_at", start).lte("enrolled_at", end);
  }

  const allowedSorts = ["full_name", "enrolled_at", "payment_status", "class_name"];
  const field = allowedSorts.includes(filters.sortField) ? filters.sortField : "enrolled_at";
  query = query.order(field, { ascending: filters.sortDir === "asc" });

  const from = (filters.page - 1) * filters.pageSize;
  const to   = from + filters.pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) console.error("[fetchEnrollments]", error.message);

  return {
    rows:  (data ?? []) as EnrollmentRow[],
    total: count ?? 0,
  };
}
