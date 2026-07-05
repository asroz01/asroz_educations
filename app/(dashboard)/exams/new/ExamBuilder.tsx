"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Save, Printer, Crown, Upload, Eye, EyeOff,
  Loader2, CheckCircle2, FileText, Type, RefreshCcw,
} from "lucide-react";
import ExamPreview from "@/components/exam/ExamPreview";
import QuestionBuilder from "@/components/exam/QuestionBuilder";
import PremiumModal from "@/components/exam/PremiumModal";
import { saveExam, saveDraft, uploadCustomLogo } from "@/app/actions/exams";
import { DEFAULT_EXAM, type ExamData } from "@/types/exam";
import { inputCls, textInputCls } from "@/components/register/FormField";

interface ExamBuilderProps {
  isPremium:    boolean;
  initialDraft: ExamData | null;
  existingId?:  string;
}

const AUTOSAVE_DELAY = 5000; // 5 seconds

export default function ExamBuilder({ isPremium: initialPremium, initialDraft, existingId }: ExamBuilderProps) {
  const [exam,         setExam]        = useState<ExamData>(initialDraft ?? DEFAULT_EXAM);
  const [showPreview,  setShowPreview] = useState(false);
  const [showPremium,  setShowPremium] = useState(false);
  const [isPremium,    setIsPremium]   = useState(initialPremium);
  const [saving,       setSaving]      = useState(false);
  const [saved,        setSaved]       = useState(false);
  const [autoSaved,    setAutoSaved]   = useState(false);
  const [savedId,      setSavedId]     = useState<string | null>(existingId ?? null);
  const [saveError,    setSaveError]   = useState<string | null>(null);
  const [showTypo,     setShowTypo]    = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const printRef     = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── react-to-print ──────────────────────────────────────────
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: exam.header.title || "Exam Paper",
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      body { margin: 0; }
    `,
  });

  // ── Debounced auto-save ──────────────────────────────────────
  const triggerAutoSave = useCallback((data: ExamData) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      await saveDraft(data);
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, AUTOSAVE_DELAY);
  }, []);

  useEffect(() => {
    triggerAutoSave(exam);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [exam, triggerAutoSave]);

  // ── Helpers ──────────────────────────────────────────────────
  function setHeader<K extends keyof ExamData["header"]>(key: K, value: ExamData["header"][K]) {
    setExam(e => ({ ...e, header: { ...e.header, [key]: value } }));
  }

  function setTypo(key: keyof ExamData["typography"], value: number) {
    setExam(e => ({ ...e, typography: { ...e.typography, [key]: value } }));
  }

  // ── Manual save ──────────────────────────────────────────────
  async function handleSave() {
    setSaving(true); setSaveError(null); setSaved(false);
    const result = await saveExam(exam, savedId ?? undefined);
    setSaving(false);
    if ("error" in result) { setSaveError(result.error); return; }
    setSaved(true);
    if ("examId" in result) setSavedId(result.examId);
    setTimeout(() => setSaved(false), 3000);
  }

  // ── Logo ─────────────────────────────────────────────────────
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("logo", file);
    const result = await uploadCustomLogo(fd);
    if ("url" in result) { setHeader("logoUrl", result.url); setIsPremium(true); }
  }

  function handleChangeLogo() {
    isPremium ? logoInputRef.current?.click() : setShowPremium(true);
  }

  const inp  = inputCls;
  const tinp = textInputCls;

  return (
    <>
      <div className="space-y-4">
        {/* ── Page title bar ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-[#131313] dark:text-white">Create Exam Paper</h1>
            <p className="text-sm text-[#1D1D1D]/40 dark:text-white/30 mt-0.5 flex items-center gap-2">
              Build, preview and save your exam
              {autoSaved && (
                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Auto-saved
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowPreview(p => !p)}
              className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D] transition-all">
              {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
              {showPreview ? "Edit" : "Preview"}
            </button>

            <button onClick={() => setShowTypo(p => !p)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D] transition-all">
              <Type size={13} /> Typography
            </button>

            <button onClick={() => handlePrint()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D] transition-all">
              <Printer size={13} /> Print / PDF
            </button>

            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#B50717] shadow-[2px_2px_6px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] disabled:opacity-60 transition-all">
              {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle2 size={13} /> : <Save size={13} />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save Draft"}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="px-4 py-3 rounded-xl bg-[#CF291D]/10 border border-[#CF291D]/20 text-xs font-medium text-[#CF291D]">
            {saveError}
          </div>
        )}

        {/* ── Typography panel ── */}
        {showTypo && (
          <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-[4px_4px_12px_rgba(0,0,0,0.08),-2px_-2px_7px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_10px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Type size={14} className="text-[#CF291D]" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/50 dark:text-white/30">Typography</h2>
              </div>
              <button onClick={() => setExam(e => ({ ...e, typography: { questionSize: 13, optionSize: 11 } }))}
                className="flex items-center gap-1 text-[10px] text-[#1D1D1D]/40 dark:text-white/25 hover:text-[#CF291D] transition-colors">
                <RefreshCcw size={11} /> Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {([
                { key: "questionSize" as const, label: "Question Font Size", min: 10, max: 18 },
                { key: "optionSize"   as const, label: "Option Font Size",   min: 8,  max: 16 },
              ]).map(({ key, label, min, max }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/45 dark:text-white/30">{label}</label>
                    <span className="text-xs font-bold text-[#CF291D]">{exam.typography[key]}px</span>
                  </div>
                  <input
                    type="range"
                    min={min} max={max} step={1}
                    value={exam.typography[key]}
                    onChange={e => setTypo(key, Number(e.target.value))}
                    className="w-full h-1.5 rounded-full accent-[#CF291D] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#1D1D1D]/25 dark:text-white/15">
                    <span>{min}px</span><span>{max}px</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Split layout — stacked on mobile, side-by-side on xl ── */}
        <div className="flex flex-col xl:flex-row gap-5">

          {/* LEFT: form */}
          <div className={`flex-1 space-y-4 min-w-0 ${showPreview ? "hidden xl:block" : "block"}`}>

            {/* Header card */}
            <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-[4px_4px_12px_rgba(0,0,0,0.08),-2px_-2px_7px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_10px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#BFBFBF]/30 dark:border-white/8 pb-3">
                <FileText size={14} className="text-[#CF291D]" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/50 dark:text-white/30">Paper Header</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25 block mb-1">Exam Title</label>
                  <div className={inp}><input value={exam.header.title} onChange={e => setHeader("title", e.target.value)} placeholder="3rd Grade Supplementary Exam" className={tinp} /></div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25 block mb-1">Subtitle / Term</label>
                  <div className={inp}><input value={exam.header.subtitle} onChange={e => setHeader("subtitle", e.target.value)} placeholder="1st Term — Environment" className={tinp} /></div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25 block mb-1">Grade</label>
                  <div className={inp}><input value={exam.header.grade} onChange={e => setHeader("grade", e.target.value)} placeholder="Grade 3" className={tinp} /></div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25 block mb-1">Subject</label>
                  <div className={inp}><input value={exam.header.subject} onChange={e => setHeader("subject", e.target.value)} placeholder="Mathematics" className={tinp} /></div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25 block mb-1">Duration (minutes)</label>
                  <div className={inp}><input type="number" value={exam.header.duration} onChange={e => setHeader("duration", e.target.value)} placeholder="45" className={tinp} /></div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25 block mb-1">Total Marks</label>
                  <div className={inp}><input type="number" value={exam.header.totalMarks} onChange={e => setHeader("totalMarks", Number(e.target.value))} placeholder="45" className={tinp} /></div>
                </div>
              </div>

              {/* Logo */}
              <div className="pt-2 border-t border-[#BFBFBF]/25 dark:border-white/6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#131313] dark:text-white">Header Logo</p>
                  <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/25 mt-0.5">
                    {isPremium ? "Custom logo active" : "Using ASROZ default logo"}
                  </p>
                </div>
                <button onClick={handleChangeLogo}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isPremium
                      ? "text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D]"
                      : "text-amber-700 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15"
                  }`}>
                  {isPremium ? <Upload size={12} /> : <Crown size={12} />}
                  {isPremium ? "Change Logo" : "Unlock Custom Logo"}
                </button>
                <input ref={logoInputRef} type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
              </div>
            </div>

            {/* Questions card */}
            <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-[4px_4px_12px_rgba(0,0,0,0.08),-2px_-2px_7px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_10px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#BFBFBF]/30 dark:border-white/8 pb-3">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-[#CF291D]" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/50 dark:text-white/30">Questions</h2>
                </div>
                <span className="text-[11px] font-bold text-[#CF291D] bg-[#CF291D]/10 px-2 py-0.5 rounded-lg">
                  {exam.questions.length} added
                </span>
              </div>
              <QuestionBuilder
                questions={exam.questions}
                onChange={qs => setExam(e => ({ ...e, questions: qs }))}
              />
            </div>
          </div>

          {/* RIGHT: live preview */}
          <div className={`w-full xl:w-[52%] xl:shrink-0 ${showPreview ? "block" : "hidden xl:block"}`}>
            {/* sticky only on desktop; on mobile just flows in document */}
            <div className="xl:sticky xl:top-20 xl:overflow-y-auto xl:max-h-[calc(100vh-5rem)]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1D1D1D]/35 dark:text-white/20 mb-3 text-center">
                Live Preview
              </p>
              {/* Horizontal scroll so A4 paper never squishes on mobile */}
              <div className="overflow-x-auto pb-2 -mx-3 px-3">
                <ExamPreview ref={printRef} exam={exam} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onPay={() => {
            alert("PayHere checkout would open here for LKR 500.\nAfter payment, is_premium will be set to true.");
            setShowPremium(false);
          }}
        />
      )}
    </>
  );
}
