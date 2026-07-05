import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  Plus, FileText, Clock, CheckCircle2,
  Archive, BookOpen, Calendar, Hash,
} from "lucide-react";

interface ExamRow {
  id: string;
  title: string;
  subject: string | null;
  total_marks: number | null;
  status: "draft" | "published" | "archived" | null;
  created_at: string;
  questions: unknown[] | null;
  subtitle: string | null;
  duration: string | null;
}

interface DraftRow {
  id: string;
  title: string | null;
  updated_at: string;
  data: { questions?: unknown[] } | null;
}

const STATUS_CONFIG = {
  draft:     { label: "Draft",     icon: Clock,        cls: "bg-amber-500/10 text-amber-700 border-amber-500/20"      },
  published: { label: "Published", icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  archived:  { label: "Archived",  icon: Archive,      cls: "bg-[#BFBFBF]/30 text-[#1D1D1D]/50 border-[#BFBFBF]/30"  },
};

function StatusBadge({ status }: { status: string | null }) {
  const cfg  = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold shrink-0 ${cfg.cls}`}>
      <Icon size={9} />{cfg.label}
    </span>
  );
}

function ExamCard({ exam }: { exam: ExamRow }) {
  const qCount = Array.isArray(exam.questions) ? exam.questions.length : 0;
  const date   = new Date(exam.created_at).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  return (
    <Link
      href={`/exams/${exam.id}`}
      className="
        group flex flex-col gap-3 p-4 sm:p-5
        bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl
        shadow-[4px_4px_10px_rgba(0,0,0,0.09),-2px_-2px_6px_rgba(255,255,255,0.9)]
        dark:shadow-[3px_3px_8px_rgba(0,0,0,0.5)]
        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.95)]
        dark:hover:shadow-[5px_5px_14px_rgba(0,0,0,0.6)]
        hover:-translate-y-0.5 transition-all duration-200
      "
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#CF291D]/10 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-[#CF291D]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#131313] dark:text-white truncate group-hover:text-[#CF291D] transition-colors leading-tight">
              {exam.title || "Untitled Exam"}
            </p>
            {exam.subtitle && (
              <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/30 truncate mt-0.5">
                {exam.subtitle}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={exam.status} />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-[#1D1D1D]/45 dark:text-white/30">
        {exam.subject && (
          <span className="flex items-center gap-1"><BookOpen size={9} />{exam.subject}</span>
        )}
        {exam.total_marks && (
          <span className="flex items-center gap-1"><Hash size={9} />{exam.total_marks} marks</span>
        )}
        {exam.duration && (
          <span className="flex items-center gap-1"><Clock size={9} />{exam.duration} min</span>
        )}
        <span className="flex items-center gap-1"><FileText size={9} />{qCount} Q</span>
        <span className="flex items-center gap-1 ml-auto"><Calendar size={9} />{date}</span>
      </div>
    </Link>
  );
}

function DraftCard({ draft }: { draft: DraftRow }) {
  const qCount = Array.isArray(draft.data?.questions) ? draft.data!.questions.length : 0;
  const date   = new Date(draft.updated_at).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short",
  });
  const time   = new Date(draft.updated_at).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });
  return (
    <Link
      href="/exams/new"
      className="
        group flex flex-col gap-3 p-4 sm:p-5
        bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl
        border-2 border-dashed border-[#BFBFBF]/50 dark:border-white/10
        hover:border-[#CF291D]/40 transition-all duration-200
      "
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Clock size={15} className="text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#131313] dark:text-white truncate group-hover:text-[#CF291D] transition-colors leading-tight">
              {draft.title || "Untitled Draft"}
            </p>
            <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">
              {date} at {time}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold shrink-0 bg-amber-500/10 text-amber-700 border-amber-500/20">
          <Clock size={9} />Auto
        </span>
      </div>
      <p className="text-[10px] sm:text-[11px] text-[#1D1D1D]/40 dark:text-white/30 flex items-center gap-1">
        <FileText size={9} />
        {qCount} question{qCount !== 1 ? "s" : ""} · Tap to continue
      </p>
    </Link>
  );
}

function SectionHeader({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${color}`}>
        {label} ({count})
      </span>
      <div className="flex-1 h-px bg-[#BFBFBF]/40 dark:bg-white/8" />
    </div>
  );
}

export default async function ExamManagementPage() {
  const supabase = await createClient();

  const [{ data: exams }, { data: drafts }] = await Promise.all([
    supabase
      .from("exams")
      .select("id, title, subject, subtitle, duration, total_marks, status, created_at, questions")
      .order("created_at", { ascending: false }),
    supabase
      .from("exam_drafts")
      .select("id, title, updated_at, data")
      .order("updated_at", { ascending: false }),
  ]);

  const allExams    = (exams   ?? []) as ExamRow[];
  const autoDrafts  = (drafts  ?? []) as DraftRow[];
  const savedDrafts = allExams.filter(e => !e.status || e.status === "draft");
  const published   = allExams.filter(e => e.status === "published");
  const archived    = allExams.filter(e => e.status === "archived");
  const total       = allExams.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#131313] dark:text-white">Exam Management</h1>
          <p className="text-sm text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">
            {total} paper{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/exams/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#B50717] shadow-[3px_3px_8px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] hover:shadow-[4px_4px_12px_rgba(207,41,29,0.45)] transition-all shrink-0"
        >
          <Plus size={15} /> New Exam Paper
        </Link>
      </div>

      {/* Auto-drafts */}
      {autoDrafts.length > 0 && (
        <section className="space-y-3">
          <SectionHeader label="Auto-Saved Drafts" count={autoDrafts.length} color="text-amber-600" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {autoDrafts.map(d => <DraftCard key={d.id} draft={d} />)}
          </div>
        </section>
      )}

      {/* Saved drafts */}
      {savedDrafts.length > 0 && (
        <section className="space-y-3">
          <SectionHeader label="Drafts" count={savedDrafts.length} color="text-[#1D1D1D]/50 dark:text-white/30" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {savedDrafts.map(e => <ExamCard key={e.id} exam={e} />)}
          </div>
        </section>
      )}

      {/* Published */}
      {published.length > 0 && (
        <section className="space-y-3">
          <SectionHeader label="Published" count={published.length} color="text-emerald-600" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {published.map(e => <ExamCard key={e.id} exam={e} />)}
          </div>
        </section>
      )}

      {/* Archived */}
      {archived.length > 0 && (
        <section className="space-y-3">
          <SectionHeader label="Archived" count={archived.length} color="text-[#1D1D1D]/35 dark:text-white/20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {archived.map(e => <ExamCard key={e.id} exam={e} />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {total === 0 && autoDrafts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 sm:py-28 bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08),-2px_-2px_7px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_10px_rgba(0,0,0,0.5)]">
          <div className="w-16 h-16 rounded-3xl bg-[#CF291D]/10 flex items-center justify-center mb-4">
            <FileText size={28} className="text-[#CF291D]" />
          </div>
          <p className="text-base font-bold text-[#131313] dark:text-white">No exam papers yet</p>
          <p className="text-sm text-[#1D1D1D]/40 dark:text-white/30 mt-1 mb-5 text-center px-6">
            Create your first paper to get started
          </p>
          <Link
            href="/exams/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#B50717] shadow-[3px_3px_8px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] transition-all"
          >
            <Plus size={15} /> Create Exam Paper
          </Link>
        </div>
      )}
    </div>
  );
}
