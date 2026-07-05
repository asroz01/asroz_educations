// Auto-maintained database types — keep in sync with migrations

export interface Student {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  class_id: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  address: string | null;
  enrolled_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  stream: string | null;
  teacher_id: string | null;
  created_at: string;
}

export interface Staff {
  id: string;
  full_name: string;
  role: "teacher" | "admin" | "finance" | "support";
  email: string | null;
  phone: string | null;
  subject: string | null;
  class_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string | null;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  recorded_by: string | null;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  class_id: string | null;
  term: 1 | 2 | 3;
  exam_date: string | null;
  total_marks: number;
  created_by: string | null;
  created_at: string;
}

export interface Grade {
  id: string;
  student_id: string;
  exam_id: string;
  marks: number | null;
  grade: string | null;
  remarks: string | null;
  recorded_by: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  method: "cash" | "bank_transfer" | "online" | null;
  reference: string | null;
  recorded_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string | null;
  module: string | null;
  ip_address: string | null;
  severity: "low" | "medium" | "high";
  created_at: string;
}

// ── View types ─────────────────────────────────────────────────

export interface AtRiskStudent {
  student_id: string;
  full_name: string;
  class_name: string;
  attendance_pct: number;
  score_drop_pts: number;
  consecutive_absences: number;
  severity: "high" | "medium" | "low";
  reason: string;
}

export interface StudentReviewDetail {
  student_id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  enrolled_at: string;
  class_name: string;
  total_sessions: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  attendance_pct: number;
}

// ── Joined query return types ──────────────────────────────────

export interface GradeWithExam extends Grade {
  exams: Pick<Exam, "title" | "subject" | "term" | "exam_date" | "total_marks">;
}

export interface AttendanceWithClass extends Attendance {
  classes: Pick<Class, "name"> | null;
}
