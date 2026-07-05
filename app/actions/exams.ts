"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ExamData } from "@/types/exam";

export async function saveExam(
  data: ExamData,
  examId?: string
): Promise<{ error: string } | { success: true; examId: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // subject is now nullable — send empty string or whatever the user typed
  const payload = {
    title:        data.header.title   || "Untitled Exam",
    subject:      data.header.subject || "",
    subtitle:     data.header.subtitle,
    instructions: `Duration: ${data.header.duration} minutes`,
    duration:     data.header.duration,
    total_marks:  data.header.totalMarks,
    questions:    data.questions,
    logo_url:     data.header.logoUrl,
    status:       "draft" as const,
  };

  if (examId) {
    const { error } = await supabase.from("exams").update(payload).eq("id", examId);
    if (error) return { error: error.message };
    revalidatePath("/exams");
    return { success: true as const, examId };
  }

  const { data: created, error } = await supabase
    .from("exams")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/exams");
  return { success: true as const, examId: created.id as string };
}

// Debounced auto-draft — upsert into exam_drafts by user (one draft per user)
export async function saveDraft(data: ExamData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("exam_drafts").upsert(
    {
      user_id:    user.id,
      title:      data.header.title || "Untitled",
      data:       data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}

export async function loadDraft(): Promise<ExamData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("exam_drafts")
    .select("data")
    .eq("user_id", user.id)
    .single();

  return (data?.data as ExamData) ?? null;
}

export async function checkPremium(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("teacher_settings")
    .select("is_premium")
    .eq("user_id", user.id)
    .single();
  return data?.is_premium ?? false;
}

export async function uploadCustomLogo(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("logo") as File;
  if (!file?.size) return { error: "No file provided" };

  const ext  = file.name.split(".").pop();
  const path = `logos/${user.id}/custom-logo.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("registration-docs")
    .upload(path, file, { upsert: true });
  if (upErr) return { error: upErr.message };

  const { data: signed } = await supabase.storage
    .from("registration-docs")
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  await supabase.from("teacher_settings").upsert({ user_id: user.id, logo_url: path });

  return { url: signed?.signedUrl ?? path };
}
