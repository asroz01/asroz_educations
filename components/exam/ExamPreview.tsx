"use client";

import Image from "next/image";
import type { ExamData } from "@/types/exam";

const A4_W   = 794;
const A4_H   = 1123;
const A4_PAD = 60;
const HEADER_H = 185;
const BODY_H   = A4_H - HEADER_H - A4_PAD * 2;

interface ExamPreviewProps {
  exam: ExamData;
}

export function paginateQuestions(
  questions: ExamData["questions"],
  qSize: number,
  optSize: number
): ExamData["questions"][] {
  const qH = (q: (typeof questions)[0]) =>
    qSize * 2.4 + q.optionCount * (optSize * 1.7 + 4) + 22;
  const pages: (typeof questions)[] = [];
  let page: typeof questions = [];
  let used = 0;
  for (const q of questions) {
    const h = qH(q);
    if (page.length > 0 && used + h > BODY_H) {
      pages.push(page); page = [q]; used = h;
    } else { page.push(q); used += h; }
  }
  pages.push(page);
  return pages;
}

function PaperHeader({ exam }: { exam: ExamData }) {
  const { header } = exam;
  return (
    <div style={{ borderBottom: "2px solid black", paddingBottom: 14, marginBottom: 10, textAlign: "center" }}>
      <div style={{ border: "2px solid black", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 36px", marginBottom: 8, minWidth: "55%" }}>
        {header.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={header.logoUrl} alt="Logo" style={{ maxHeight: 40, maxWidth: 180, objectFit: "contain" }} />
        ) : (
          <Image src="/logo.png" alt="ASROZ Educations" width={180} height={40} style={{ maxHeight: 40, objectFit: "contain" }} priority />
        )}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, margin: "4px 0 0" }}>{header.title || "Examination Paper"}</p>
      {header.subtitle && <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>{header.subtitle}</p>}
    </div>
  );
}

function MetaRow({ exam }: { exam: ExamData }) {
  const { header } = exam;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingBottom: 8, marginBottom: 4, borderBottom: "1px solid #d1d5db" }}>
        <span>නම - <span style={{ borderBottom: "1px solid black", display: "inline-block", width: 110 }}>&nbsp;</span></span>
        <span>මිණිත්තු <strong>{header.duration || "___"}</strong></span>
      </div>
      {header.grade && (
        <div style={{ fontSize: 10, textAlign: "center", color: "#9ca3af", paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
          {header.grade}{header.subject ? ` · ${header.subject}` : ""} &nbsp;·&nbsp; Total Marks: {header.totalMarks}
        </div>
      )}
    </>
  );
}

function PageContent({
  exam, pageQs, pageIdx, totalPages, globalIdx, qSize, optSize,
}: {
  exam: ExamData; pageQs: ExamData["questions"];
  pageIdx: number; totalPages: number;
  globalIdx: number; qSize: number; optSize: number;
}) {
  return (
    <>
      {pageIdx === 0 ? (
        <><PaperHeader exam={exam} /><MetaRow exam={exam} /></>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #d1d5db", paddingBottom: 6, marginBottom: 12, fontSize: 10, color: "#9ca3af" }}>
          <span style={{ fontStyle: "italic" }}>{exam.header.title || "Examination Paper"} — continued</span>
          <span>Page {pageIdx + 1}/{totalPages}</span>
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        {pageQs.length === 0 && pageIdx === 0 ? (
          <p style={{ textAlign: "center", color: "#d1d5db", fontSize: 13, fontStyle: "italic", padding: "48px 0" }}>
            Questions will appear here as you add them →
          </p>
        ) : pageQs.map((q, i) => {
          const qi = globalIdx + i;
          return (
            <div key={q.id} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: qSize, fontWeight: 500, lineHeight: 1.5, margin: "0 0 4px" }}>
                <span style={{ fontWeight: 700, marginRight: 6 }}>{String(qi + 1).padStart(2, "0")}.</span>
                {q.text || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>Question text…</span>}
              </p>
              <div style={{ paddingLeft: 22, display: q.layout === "horizontal" ? "flex" : "block", flexWrap: "wrap", gap: q.layout === "horizontal" ? "2px 32px" : undefined }}>
                {q.options.slice(0, q.optionCount).map(opt => (
                  <p key={opt.label} style={{ fontSize: optSize, margin: "2px 0" }}>
                    <span style={{ marginRight: 8 }}>{opt.label}.</span>
                    {opt.text || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>Option…</span>}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {pageIdx === totalPages - 1 && (
        <div style={{ marginTop: 32, paddingTop: 10, borderTop: "1px solid #f3f4f6", fontSize: 9, color: "#9ca3af", textAlign: "center" }}>
          ASROZ Educations · {new Date().getFullYear()} · Do not reproduce without permission
        </div>
      )}
    </>
  );
}

// Screen-only preview — no print logic here, PDF handled by PrintButton
export default function ExamPreview({ exam }: ExamPreviewProps) {
  const qSize   = exam.typography?.questionSize ?? 13;
  const optSize = exam.typography?.optionSize   ?? 11;
  const pages   = paginateQuestions(exam.questions, qSize, optSize);
  const pageStartIdx = pages.map((_, i) => pages.slice(0, i).reduce((a, p) => a + p.length, 0));

  const baseStyle: React.CSSProperties = {
    width: A4_W, padding: A4_PAD, background: "white", color: "black",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: qSize, lineHeight: 1.65, boxSizing: "border-box",
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div style={{ display: "inline-block", verticalAlign: "top" }}>
        {pages.map((pageQs, pageIdx) => (
          <div
            key={pageIdx}
            style={{
              ...baseStyle,
              minHeight: A4_H,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              border: "1px solid #e5e7eb",
              marginBottom: pageIdx < pages.length - 1 ? 24 : 0,
            }}
          >
            <PageContent
              exam={exam} pageQs={pageQs} pageIdx={pageIdx}
              totalPages={pages.length} globalIdx={pageStartIdx[pageIdx]}
              qSize={qSize} optSize={optSize}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
