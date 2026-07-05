"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { ExamData } from "@/types/exam";

// A4 at 96 dpi: 210mm ≈ 794px, 297mm ≈ 1123px
// We render at true A4 size — mobile wraps in a horizontal-scroll container
const A4_W    = 794;
const A4_H    = 1123;
const A4_PAD  = 60; // ≈16mm

// Estimated px height of header + meta rows (constant per page)
const HEADER_H = 180;
// Usable body height per page
const BODY_H   = A4_H - HEADER_H - A4_PAD * 2;

interface ExamPreviewProps {
  exam: ExamData;
}

// ── Sub-components ────────────────────────────────────────────

function PaperHeader({ exam }: { exam: ExamData }) {
  const { header } = exam;
  return (
    <div style={{ borderBottom: "2px solid black", paddingBottom: 14, marginBottom: 10, textAlign: "center" }}>
      {/* Logo box */}
      <div style={{
        border: "2px solid black",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 36px",
        marginBottom: 8,
        minWidth: "55%",
      }}>
        {header.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={header.logoUrl} alt="Logo" style={{ maxHeight: 40, maxWidth: 180, objectFit: "contain" }} />
        ) : (
          <Image
            src="/logo.png"
            alt="ASROZ Educations"
            width={180}
            height={40}
            style={{ maxHeight: 40, objectFit: "contain" }}
            priority
          />
        )}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, margin: "4px 0 0" }}>
        {header.title || "Examination Paper"}
      </p>
      {header.subtitle && (
        <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>{header.subtitle}</p>
      )}
    </div>
  );
}

function MetaRow({ exam, pageIdx, totalPages }: { exam: ExamData; pageIdx: number; totalPages: number }) {
  const { header } = exam;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingBottom: 8, marginBottom: 4, borderBottom: "1px solid #d1d5db" }}>
        <span>
          නම -{" "}
          <span style={{ borderBottom: "1px solid black", display: "inline-block", width: 110 }}>&nbsp;</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {totalPages > 1 && (
            <span style={{ fontSize: 10, color: "#9ca3af" }}>Page {pageIdx + 1}/{totalPages}</span>
          )}
          <span>මිණිත්තු <strong>{header.duration || "___"}</strong></span>
        </span>
      </div>
      {header.grade && (
        <div style={{ fontSize: 10, textAlign: "center", color: "#9ca3af", paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
          {header.grade}{header.subject ? ` · ${header.subject}` : ""} &nbsp;·&nbsp; Total Marks: {header.totalMarks}
        </div>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────

const ExamPreview = forwardRef<HTMLDivElement, ExamPreviewProps>(
  function ExamPreview({ exam }, ref) {
    const { questions, typography } = exam;
    const qSize   = typography?.questionSize ?? 13;
    const optSize = typography?.optionSize   ?? 11;

    // Estimate each question's rendered height
    const qHeight = (q: (typeof questions)[0]) =>
      qSize * 2.2 + q.optionCount * (optSize * 1.6 + 4) + 20;

    // Distribute questions across pages
    const pages: (typeof questions)[] = [];
    let page:  typeof questions  = [];
    let usedH = 0;

    for (const q of questions) {
      const h = qHeight(q);
      if (page.length > 0 && usedH + h > BODY_H) {
        pages.push(page);
        page  = [q];
        usedH = h;
      } else {
        page.push(q);
        usedH += h;
      }
    }
    pages.push(page); // always push last (may be empty for page 1 with no questions)

    let globalIdx = 0;

    const pageStyle: React.CSSProperties = {
      width:      A4_W,
      minHeight:  A4_H,
      padding:    A4_PAD,
      background: "white",
      color:      "black",
      fontFamily: "'Times New Roman', Times, serif",
      fontSize:   qSize,
      lineHeight: 1.65,
      boxSizing:  "border-box",
    };

    return (
      <>
        {/* ── Screen: horizontal-scroll wrapper so it never breaks mobile layout ── */}
        <div
          className="exam-screen-wrapper overflow-x-auto pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* The ref div — react-to-print targets this */}
          <div ref={ref} className="exam-print-root" style={{ display: "inline-block", verticalAlign: "top" }}>
            {pages.map((pageQs, pageIdx) => {
              const isLast = pageIdx === pages.length - 1;
              return (
                <div
                  key={pageIdx}
                  className="exam-page"
                  style={{
                    ...pageStyle,
                    boxShadow:    "0 4px 24px rgba(0,0,0,0.12)",
                    border:       "1px solid #e5e7eb",
                    marginBottom: isLast ? 0 : 24,
                  }}
                >
                  {/* Header on first page only */}
                  {pageIdx === 0 ? (
                    <>
                      <PaperHeader exam={exam} />
                      <MetaRow exam={exam} pageIdx={pageIdx} totalPages={pages.length} />
                    </>
                  ) : (
                    /* Continuation line on subsequent pages */
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #d1d5db", paddingBottom: 6, marginBottom: 12, fontSize: 10, color: "#9ca3af" }}>
                      <span style={{ fontStyle: "italic" }}>{exam.header.title || "Examination Paper"} — continued</span>
                      <span>Page {pageIdx + 1}/{pages.length}</span>
                    </div>
                  )}

                  {/* Questions */}
                  <div style={{ marginTop: 12 }}>
                    {pageQs.length === 0 ? (
                      <p style={{ textAlign: "center", color: "#d1d5db", fontSize: 13, fontStyle: "italic", padding: "48px 0" }}>
                        Questions will appear here as you add them →
                      </p>
                    ) : (
                      pageQs.map((q) => {
                        const qi = globalIdx++;
                        const visibleOpts = q.options.slice(0, q.optionCount);
                        return (
                          <div
                            key={q.id}
                            style={{ marginBottom: 20, pageBreakInside: "avoid", breakInside: "avoid" }}
                          >
                            <p style={{ fontSize: qSize, fontWeight: 500, lineHeight: 1.5, margin: "0 0 4px" }}>
                              <span style={{ fontWeight: 700, marginRight: 6 }}>
                                {String(qi + 1).padStart(2, "0")}.
                              </span>
                              {q.text || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>Question text…</span>}
                            </p>
                            <div
                              style={{
                                paddingLeft: 22,
                                display:   q.layout === "horizontal" ? "flex"  : "block",
                                flexWrap:  q.layout === "horizontal" ? "wrap"  : undefined,
                                gap:       q.layout === "horizontal" ? "2px 32px" : undefined,
                              }}
                            >
                              {visibleOpts.map(opt => (
                                <p key={opt.label} style={{ fontSize: optSize, margin: "2px 0" }}>
                                  <span style={{ marginRight: 8 }}>{opt.label}.</span>
                                  {opt.text || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>Option…</span>}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer — last page only */}
                  {isLast && (
                    <div style={{ marginTop: 32, paddingTop: 10, borderTop: "1px solid #f3f4f6", fontSize: 9, color: "#9ca3af", textAlign: "center" }}>
                      ASROZ Educations · {new Date().getFullYear()} · Do not reproduce without permission
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Print CSS ── */}
        <style>{`
          @media print {
            /* A4 page setup */
            @page {
              size: A4 portrait;
              margin: 10mm;
            }

            /* Hide everything on the page except our print root */
            body > * { display: none !important; }
            .exam-screen-wrapper { display: block !important; overflow: visible !important; }
            .exam-print-root { display: block !important; }

            /* Each .exam-page = one A4 sheet */
            .exam-page {
              width:            190mm !important; /* A4 - 2×10mm margin */
              min-height:       0 !important;
              padding:          0 !important;
              margin:           0 !important;
              box-shadow:       none !important;
              border:           none !important;
              page-break-after: always;
              break-after:      page;
              display:          block !important;
            }

            .exam-page:last-child {
              page-break-after: auto;
              break-after:      auto;
            }

            /* Prevent questions splitting across pages */
            .exam-page > div > div {
              page-break-inside: avoid;
              break-inside:      avoid;
            }
          }
        `}</style>
      </>
    );
  }
);

export default ExamPreview;
