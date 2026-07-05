"use client";

import { useState, useRef } from "react";
import { Printer, Loader2 } from "lucide-react";
import type { ExamData } from "@/types/exam";

// A4 dimensions at 96 dpi
const A4_W_PX = 794;
const A4_H_PX = 1123;
const A4_PAD  = 60;
const HEADER_H = 185;
const BODY_H   = A4_H_PX - HEADER_H - A4_PAD * 2;

interface PrintButtonProps {
  exam: ExamData;
  className?: string;
}

// ── Build the complete HTML for one A4 page ───────────────────
function buildPageHtml(
  exam: ExamData,
  pageQs: ExamData["questions"],
  pageIdx: number,
  totalPages: number,
  startQIdx: number,
  qSize: number,
  optSize: number,
  logoDataUrl: string
): string {
  const { header } = exam;

  const headerHtml = pageIdx === 0 ? `
    <div style="border-bottom:2px solid black;padding-bottom:14px;margin-bottom:10px;text-align:center;">
      <div style="border:2px solid black;display:inline-flex;align-items:center;justify-content:center;padding:10px 36px;margin-bottom:8px;min-width:55%;">
        ${logoDataUrl
          ? `<img src="${logoDataUrl}" style="max-height:40px;max-width:180px;object-fit:contain;" />`
          : `<span style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;"><span style="color:#CF291D;">A</span>sroz Education</span>`
        }
      </div>
      <p style="font-size:${qSize + 1}px;line-height:1.5;margin:4px 0 0;">${header.title || "Examination Paper"}</p>
      ${header.subtitle ? `<p style="font-size:${qSize - 1}px;color:#6b7280;margin:2px 0 0;">${header.subtitle}</p>` : ""}
    </div>
    <div style="display:flex;justify-content:space-between;font-size:12px;padding-bottom:8px;margin-bottom:4px;border-bottom:1px solid #d1d5db;">
      <span>නම - <span style="border-bottom:1px solid black;display:inline-block;width:110px;">&nbsp;</span></span>
      <span>මිණිත්තු <strong>${header.duration || "___"}</strong></span>
    </div>
    ${header.grade ? `<div style="font-size:10px;text-align:center;color:#9ca3af;padding-bottom:8px;margin-bottom:8px;border-bottom:1px solid #f3f4f6;">${header.grade}${header.subject ? ` · ${header.subject}` : ""} &nbsp;·&nbsp; Total Marks: ${header.totalMarks}</div>` : ""}
  ` : `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d1d5db;padding-bottom:6px;margin-bottom:12px;font-size:10px;color:#9ca3af;">
      <span style="font-style:italic;">${header.title || "Examination Paper"} — continued</span>
      <span>Page ${pageIdx + 1}/${totalPages}</span>
    </div>
  `;

  const questionsHtml = pageQs.map((q, i) => {
    const qi = startQIdx + i + 1;
    const opts = q.options.slice(0, q.optionCount).map(opt =>
      `<p style="font-size:${optSize}px;margin:2px 0;"><span style="margin-right:8px;">${opt.label}.</span>${opt.text || ""}</p>`
    ).join("");
    return `
      <div style="margin-bottom:20px;page-break-inside:avoid;">
        <p style="font-size:${qSize}px;font-weight:500;line-height:1.5;margin:0 0 4px;">
          <span style="font-weight:700;margin-right:6px;">${String(qi).padStart(2,"0")}.</span>${q.text || ""}
        </p>
        <div style="padding-left:22px;${q.layout === "horizontal" ? "display:flex;flex-wrap:wrap;gap:2px 32px;" : ""}">${opts}</div>
      </div>
    `;
  }).join("");

  const footerHtml = pageIdx === totalPages - 1 ? `
    <div style="margin-top:32px;padding-top:10px;border-top:1px solid #f3f4f6;font-size:9px;color:#9ca3af;text-align:center;">
      ASROZ Educations · ${new Date().getFullYear()} · Do not reproduce without permission
    </div>
  ` : "";

  return `
    <div style="width:${A4_W_PX}px;min-height:${A4_H_PX}px;padding:${A4_PAD}px;background:white;color:black;font-family:'Times New Roman',Times,serif;font-size:${qSize}px;line-height:1.65;box-sizing:border-box;">
      ${headerHtml}
      <div style="margin-top:12px;">${questionsHtml}</div>
      ${footerHtml}
    </div>
  `;
}

// ── Paginate questions ────────────────────────────────────────
function paginate(questions: ExamData["questions"], qSize: number, optSize: number) {
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

// ── Fetch logo as base64 data URL ─────────────────────────────
async function fetchLogoDataUrl(logoUrl: string | null): Promise<string> {
  if (!logoUrl) {
    // Fetch /logo.png from the server
    try {
      const res  = await fetch("/logo.png");
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch { return ""; }
  }
  try {
    const res  = await fetch(logoUrl);
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch { return ""; }
}

// ── Main component ────────────────────────────────────────────
export default function PrintButton({ exam, className }: PrintButtonProps) {
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  async function handleExport() {
    setLoading(true);
    try {
      // Dynamic imports — keep bundle size small
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const qSize   = exam.typography?.questionSize ?? 13;
      const optSize = exam.typography?.optionSize   ?? 11;
      const pages   = paginate(exam.questions, qSize, optSize);
      const logoDataUrl = await fetchLogoDataUrl(exam.header.logoUrl);

      // A4 in jsPDF points (1pt = 1/72 inch; A4 = 210×297mm)
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const A4_MM_W = 210;
      const A4_MM_H = 297;

      let startQIdx = 0;

      for (let i = 0; i < pages.length; i++) {
        // Build off-screen div for this page
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
          position:fixed; left:-9999px; top:0;
          width:${A4_W_PX}px; background:white;
          font-family:'Times New Roman',Times,serif;
        `;
        wrapper.innerHTML = buildPageHtml(
          exam, pages[i], i, pages.length, startQIdx, qSize, optSize, logoDataUrl
        );
        document.body.appendChild(wrapper);

        // Give browser one frame to render fonts/images
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        const canvas = await html2canvas(wrapper.firstElementChild as HTMLElement, {
          scale:           2,        // 2× = crisp on retina
          useCORS:         true,
          allowTaint:      true,
          backgroundColor: "#ffffff",
          logging:         false,
          width:           A4_W_PX,
        });

        document.body.removeChild(wrapper);

        // Scale canvas to fill A4 page
        const imgData  = canvas.toDataURL("image/jpeg", 0.92);
        const imgW     = A4_MM_W;
        const imgH     = (canvas.height / canvas.width) * imgW;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgW, Math.min(imgH, A4_MM_H));

        startQIdx += pages[i].length;
      }

      const filename = `${exam.header.title || "exam-paper"}.pdf`
        .replace(/[^a-zA-Z0-9\-_.() ]/g, "_");
      pdf.save(filename);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div ref={containerRef} />
      <button
        onClick={handleExport}
        disabled={loading}
        className={className ?? "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D] disabled:opacity-50 transition-all"}
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
        {loading ? "Generating…" : "Print / PDF"}
      </button>
    </>
  );
}
