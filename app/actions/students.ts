"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface AddStudentInput {
  // Personal
  full_name:        string;
  date_of_birth:    string;
  gender:           string;
  mobile:           string;
  school_name:      string;
  address:          string;
  // Document
  document_type:    string;
  document_number:  string;
  document_url:     string | null;
  // Parents
  father_name:      string;
  father_mobile:    string;
  father_occupation:string;
  father_age:       number;
  mother_name:      string;
  mother_mobile:    string;
  // Class
  class_id:         string | null;
}

export async function addStudent(formData: FormData) {
  const supabase = await createClient();

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") {
    return { error: "Only admins can add students directly" };
  }

  // Upload document if provided
  let docUrl: string | null = null;
  const docFile = formData.get("document_image") as File | null;

  if (docFile && docFile.size > 0) {
    const ext  = docFile.name.split(".").pop();
    const path = `admin-added/${Date.now()}-${docFile.name.replace(/\s/g, "_")}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("registration-docs")
      .upload(path, docFile, { upsert: true });
    if (!uploadErr) docUrl = path;
  }

  // Lookup or resolve class_id
  const classId  = (formData.get("class_id") as string) || null;
  const fullName = formData.get("full_name") as string;

  // Insert into students table (admin-enrolled = auto-approved)
  const { data: student, error: stuErr } = await supabase
    .from("students")
    .insert({
      full_name:     fullName,
      date_of_birth: formData.get("date_of_birth") as string || null,
      gender:        formData.get("gender")         as string || null,
      class_id:      classId,
      guardian_name: formData.get("father_name")    as string,
      guardian_phone:formData.get("father_mobile")  as string,
      address:       formData.get("address")        as string,
      enrolled_at:   new Date().toISOString().split("T")[0],
      is_active:     true,
    })
    .select("id")
    .single();

  if (stuErr) return { error: stuErr.message };

  // Log to audit
  await supabase.from("audit_logs").insert({
    actor:     user.email ?? "Admin",
    action:    "Enrolled new student",
    target:    `${fullName} (ID: ${student.id})`,
    module:    "Students",
    ip_address:"dashboard",
    severity:  "low",
  });

  revalidatePath("/dashboard");
  revalidatePath("/students");

  return { success: true, studentId: student.id };
}

export async function fetchClasses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("classes")
    .select("id, name, stream")
    .order("name");
  return data ?? [];
}

// ── Enrollment table mutations (called from client via Server Actions) ──

export async function updatePaymentStatus(
  studentId: string,
  status: "paid" | "pending" | "overdue"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ payment_status: status })
    .eq("id", studentId);
  if (error) return { error: error.message };
  revalidatePath("/students");
  return { success: true };
}

export async function deleteStudent(studentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ is_active: false })
    .eq("id", studentId);
  if (error) return { error: error.message };
  revalidatePath("/students");
  return { success: true };
}

export async function bulkUpdatePaymentStatus(
  ids: string[],
  status: "paid" | "pending" | "overdue"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ payment_status: status })
    .in("id", ids);
  if (error) return { error: error.message };
  revalidatePath("/students");
  return { success: true };
}
