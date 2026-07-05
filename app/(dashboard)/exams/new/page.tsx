import ExamBuilder from "./ExamBuilder";
import { checkPremium, loadDraft } from "@/app/actions/exams";

export default async function CreateExamPage() {
  const [isPremium, draft] = await Promise.all([checkPremium(), loadDraft()]);
  return <ExamBuilder isPremium={isPremium} initialDraft={draft} />;
}
