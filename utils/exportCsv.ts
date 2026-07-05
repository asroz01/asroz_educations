import type { EnrollmentRow } from "@/supabase/queries/enrollmentQueries";

export function exportToCsv(rows: EnrollmentRow[], filename = "enrollment.csv") {
  const headers = [
    "Name", "Class", "Stream", "Enrolled At",
    "Payment Status", "Guardian", "Guardian Phone", "Gender",
  ];

  const lines = rows.map((r) => [
    r.full_name,
    r.class_name ?? "",
    r.stream     ?? "",
    r.enrolled_at,
    r.payment_status,
    r.guardian_name  ?? "",
    r.guardian_phone ?? "",
    r.gender         ?? "",
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));

  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
