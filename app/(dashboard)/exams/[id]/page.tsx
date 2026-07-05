import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ExamBuilder from "../new/ExamBuilder";
import { checkPremium } from "@/app/actions/exams";
import type { ExamData } from "@/types/exam";
import { DEFAULT_EXAM } from "@/types/exam";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: exam }, isPremium] = await Promise.all([
    supabase
      .from("exams")
      .select("id, title, subject, subtitle, duration, total_marks, questions, logo_url, status")
      .eq("id", id)
      .single(),
    checkPremium(),
  ]);

  if (!exam) notFound();

  // Reconstruct ExamData from the saved exam row
  const examData: ExamData = {
    header: {
      title:      exam.title      ?? "",
      subtitle:   exam.subtitle   ?? "",
      subject:    exam.subject    ?? "",
      duration:   exam.duration   ?? "45",
      totalMarks: exam.total_marks ?? 100,
      grade:      DEFAULT_EXAM.header.grade,
      logoUrl:    exam.logo_url   ?? null,
    },
    questions:  Array.isArray(exam.questions) ? exam.questions as ExamData["questions"] : [],
    typography: DEFAULT_EXAM.typography,
  };

  return (
    <ExamBuilder
      isPremium={isPremium}
      initialDraft={examData}
      existingId={id}
    />
  );
}
