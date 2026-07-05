import { createClient } from "@/utils/supabase/server";
import { fetchEnrollments } from "@/supabase/queries/enrollmentQueries";
import EnrollmentTable from "@/components/students/EnrollmentTable";
import type { EnrollmentFilters } from "@/supabase/queries/enrollmentQueries";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const filters: EnrollmentFilters = {
    search:        sp.search        ?? "",
    classId:       sp.class_id      ?? "",
    paymentStatus: sp.status        ?? "",
    month:         sp.month         ?? "",
    page:          Math.max(1, Number(sp.page ?? 1)),
    pageSize:      Number(sp.per_page ?? 20),
    sortField:     sp.sort          ?? "enrolled_at",
    sortDir:       (sp.dir === "asc" ? "asc" : "desc") as "asc" | "desc",
  };

  const [{ rows, total }, classesData] = await Promise.all([
    fetchEnrollments(filters),
    createClient().then(sb =>
      sb.from("classes").select("id, name, stream").order("name").then(r => r.data ?? [])
    ),
  ]);

  return (
    <EnrollmentTable
      initialRows={rows}
      total={total}
      filters={filters}
      classes={classesData}
    />
  );
}
