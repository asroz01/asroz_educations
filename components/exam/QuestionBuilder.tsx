"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, AlignLeft, AlignJustify } from "lucide-react";
import type { ExamQuestion, MCQOption } from "@/types/exam";
import { newQuestion } from "@/types/exam";
import { inputCls, textInputCls } from "@/components/register/FormField";

interface QuestionBuilderProps {
  questions: ExamQuestion[];
  onChange: (questions: ExamQuestion[]) => void;
}

export default function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const [draft, setDraft] = useState<ExamQuestion>(newQuestion());

  function updateDraftOption(label: MCQOption["label"], text: string) {
    setDraft(d => ({
      ...d,
      options: d.options.map(o => o.label === label ? { ...o, text } : o),
    }));
  }

  function addQuestion() {
    if (!draft.text.trim()) return;
    onChange([...questions, draft]);
    setDraft(newQuestion());
  }

  function removeQuestion(id: string) {
    onChange(questions.filter(q => q.id !== id));
  }

  function updateQ<K extends keyof ExamQuestion>(id: string, key: K, value: ExamQuestion[K]) {
    onChange(questions.map(q => q.id === id ? { ...q, [key]: value } : q));
  }

  function updateOption(qId: string, label: MCQOption["label"], text: string) {
    onChange(questions.map(q =>
      q.id === qId
        ? { ...q, options: q.options.map(o => o.label === label ? { ...o, text } : o) }
        : q
    ));
  }

  const inp  = inputCls;
  const tinp = textInputCls;

  // Shared option row count selector + layout toggle
  function QuestionControls({
    q, isDraft, onCountChange, onLayoutChange,
  }: {
    q: ExamQuestion;
    isDraft?: boolean;
    onCountChange: (n: 3 | 4) => void;
    onLayoutChange: (l: "vertical" | "horizontal") => void;
  }) {
    return (
      <div className="flex items-center gap-2 pl-8 flex-wrap">
        {/* Option count */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#1D1D1D]/35 dark:text-white/20 font-semibold uppercase tracking-wide">Options:</span>
          {([3, 4] as (3 | 4)[]).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onCountChange(n)}
              className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                q.optionCount === n
                  ? "bg-[#CF291D] text-white"
                  : "text-[#1D1D1D]/40 dark:text-white/25 bg-[#BFBFBF]/25 dark:bg-white/8 hover:text-[#CF291D]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Layout toggle */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#1D1D1D]/35 dark:text-white/20 font-semibold uppercase tracking-wide">Layout:</span>
          <button
            type="button"
            onClick={() => onLayoutChange("vertical")}
            title="Vertical"
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
              q.layout === "vertical"
                ? "bg-[#CF291D] text-white"
                : "text-[#1D1D1D]/40 dark:text-white/25 bg-[#BFBFBF]/25 dark:bg-white/8 hover:text-[#CF291D]"
            }`}
          >
            <AlignLeft size={11} />
          </button>
          <button
            type="button"
            onClick={() => onLayoutChange("horizontal")}
            title="Horizontal"
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
              q.layout === "horizontal"
                ? "bg-[#CF291D] text-white"
                : "text-[#1D1D1D]/40 dark:text-white/25 bg-[#BFBFBF]/25 dark:bg-white/8 hover:text-[#CF291D]"
            }`}
          >
            <AlignJustify size={11} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Existing questions ── */}
      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-[#ECECEC] dark:bg-[#111111] rounded-2xl p-4 shadow-[3px_3px_8px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_6px_rgba(0,0,0,0.4)] space-y-2.5">
              {/* Question text row */}
              <div className="flex items-start gap-2">
                <GripVertical size={14} className="text-[#1D1D1D]/25 dark:text-white/20 mt-2 shrink-0" />
                <span className="text-xs font-bold text-[#CF291D] mt-2 shrink-0 w-6">{i + 1}.</span>
                <div className={`${inp} flex-1 items-start`}>
                  <textarea
                    value={q.text}
                    onChange={e => updateQ(q.id, "text", e.target.value)}
                    placeholder="Question text…"
                    rows={2}
                    className={`${tinp} resize-none w-full`}
                  />
                </div>
                <button onClick={() => removeQuestion(q.id)} className="mt-1.5 w-7 h-7 flex items-center justify-center rounded-lg text-[#1D1D1D]/30 dark:text-white/20 hover:text-[#CF291D] hover:bg-[#CF291D]/10 transition-all shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Controls */}
              <QuestionControls
                q={q}
                onCountChange={n => updateQ(q.id, "optionCount", n)}
                onLayoutChange={l => updateQ(q.id, "layout", l)}
              />

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                {q.options.slice(0, q.optionCount).map(opt => (
                  <div key={opt.label} className={`${inp} gap-2`}>
                    <span className="text-[10px] font-bold text-[#CF291D] shrink-0 w-5">{opt.label}.</span>
                    <input
                      value={opt.text}
                      onChange={e => updateOption(q.id, opt.label, e.target.value)}
                      placeholder={`Option ${opt.label}…`}
                      className={tinp}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Draft input ── */}
      <div className="bg-[#ECECEC] dark:bg-[#111111] rounded-2xl p-4 border-2 border-dashed border-[#CF291D]/25 dark:border-[#CF291D]/20 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#CF291D]/70">
          New Question {questions.length + 1}
        </p>

        <div className={`${inp} items-start`}>
          <textarea
            value={draft.text}
            onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
            placeholder="Type the question here…"
            rows={2}
            className={`${tinp} resize-none w-full`}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addQuestion(); } }}
          />
        </div>

        {/* Controls for draft */}
        <QuestionControls
          q={draft}
          onCountChange={n => setDraft(d => ({ ...d, optionCount: n }))}
          onLayoutChange={l => setDraft(d => ({ ...d, layout: l }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {draft.options.slice(0, draft.optionCount).map(opt => (
            <div key={opt.label} className={`${inp} gap-2`}>
              <span className="text-[10px] font-bold text-[#1D1D1D]/40 dark:text-white/30 shrink-0 w-5">{opt.label}.</span>
              <input
                value={opt.text}
                onChange={e => updateDraftOption(opt.label, e.target.value)}
                placeholder={`Option ${opt.label}`}
                className={tinp}
              />
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          disabled={!draft.text.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#B50717] shadow-[2px_2px_6px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={13} /> Add Question
        </button>
      </div>
    </div>
  );
}
