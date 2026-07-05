"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Home,
  ChevronRight,
  UserPlus,
  FileText,
  Upload,
  Download,
  Plus,
  Calendar,
} from "lucide-react";

// ─── Breadcrumb label map ────────────────────────────────────────────────────
const LABELS: Record<string, string> = {
  dashboard:  "Dashboard",
  students:   "Enrollment",
  directory:  "Student Directory",
  enroll:     "Enrollment",
  records:    "Academic Records",
  exams:      "Exam Management",
  analytics:  "Exam Analytics",
  library:    "Digital Library",
  payments:   "Fee & Payments",
  staff:      "Staff Portal",
  reports:    "Government Reports",
  settings:   "System Settings",
  roles:      "Role Management",
  new:        "New",
  upload:     "Upload",
};

// ─── Contextual action config ────────────────────────────────────────────────
type BtnAction = { kind: "button"; label: string; href: string; icon: React.ElementType };
type DateAction = { kind: "daterange" };
type Action = BtnAction | DateAction | null;

const ACTION_MAP: Record<string, Action> = {
  "/":                    { kind: "daterange" },
  "/dashboard":           { kind: "daterange" },
  "/students":            null,
  "/students/enroll":     null,
  "/students/records":    { kind: "button", label: "Export Records",    href: "#",                  icon: Download },
  "/exams":               null,
  "/exams/new":           null,
  "/exams/analytics":     { kind: "button", label: "Export Report",     href: "#",                  icon: Download },
  "/library":             { kind: "button", label: "Upload Tute",       href: "/library/upload",    icon: Upload },
  "/library/upload":      null,
  "/payments":            { kind: "button", label: "Export Payments",   href: "#",                  icon: Download },
  "/staff":               { kind: "button", label: "Add Staff",         href: "/staff/new",         icon: UserPlus },
  "/staff/new":           null,
  "/reports":             { kind: "button", label: "Generate Report",   href: "#",                  icon: FileText },
  "/settings":            null,
  "/settings/roles":      null,
};

// ─── Date range picker (inline segmented control) ────────────────────────────
const RANGES = ["7D", "30D", "90D", "This Year"] as const;

function DateRangePicker() {
  const [active, setActive] = useState<string>("30D");

  return (
    <div className="flex items-center gap-1.5">
      <Calendar size={14} className="text-[#1D1D1D]/40 shrink-0 hidden sm:block" />
      <div className="flex items-center rounded-xl overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] border border-[#BFBFBF]/60">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setActive(r)}
            className={`
              px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold transition-all duration-150
              ${active === r
                ? "bg-[#CF291D] text-white shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]"
                : "bg-[#ECECEC] text-[#1D1D1D]/50 hover:text-[#CF291D]"
              }
            `}
          >
            {r}
          </button>
        ))}
      </div>
      <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold text-[#1D1D1D]/60 bg-[#ECECEC] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_4px_rgba(255,255,255,0.9)] hover:text-[#CF291D] transition-colors duration-150 border border-[#BFBFBF]/40">
        <Download size={11} />
        <span className="hidden sm:inline">Export</span>
      </button>
    </div>
  );
}

// ─── Contextual action button ────────────────────────────────────────────────
function ActionButton({ action }: { action: BtnAction }) {
  const Icon = action.icon;
  return (
    <Link
      href={action.href}
      className="
        flex items-center gap-2 px-4 py-1.5 rounded-xl
        bg-[#B50717] text-white text-xs font-semibold
        shadow-[3px_3px_8px_rgba(181,7,23,0.35),-1px_-1px_4px_rgba(255,255,255,0.2)]
        hover:bg-[#CF291D] hover:shadow-[4px_4px_12px_rgba(207,41,29,0.45)]
        transition-all duration-200
      "
    >
      <Icon size={13} className="shrink-0" />
      {action.label}
    </Link>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function SubHeader() {
  const pathname = usePathname();

  // Build breadcrumb segments
  const isRoot = pathname === "/";
  const segments = isRoot
    ? [{ label: "Dashboard", href: "/dashboard" }]
    : pathname.split("/").filter(Boolean).map((seg, i, arr) => ({
        label: LABELS[seg] ?? seg,
        href: "/" + arr.slice(0, i + 1).join("/"),
      }));

  const action = ACTION_MAP[pathname] ?? null;

  return (
    <div className="
      flex items-center justify-between gap-2
      px-3 md:px-8 py-2
      bg-[#ECECEC] dark:bg-[#1D1D1D]
      border-b border-[#BFBFBF]/35 dark:border-white/8
      shadow-[0_1px_4px_rgba(0,0,0,0.04)]
      overflow-hidden
    ">
      {/* Breadcrumbs — on mobile show only last segment */}
      <nav className="flex items-center gap-1 min-w-0 flex-1" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center justify-center w-5 h-5 rounded-md text-[#1D1D1D]/40 hover:text-[#CF291D] transition-colors shrink-0">
          <Home size={12} />
        </Link>
        {segments.map(({ label, href }, i) => {
          const isLast = i === segments.length - 1;
          // On mobile hide intermediate segments, show only last
          return (
            <span key={href} className={`flex items-center gap-1 min-w-0 ${!isLast ? "hidden sm:flex" : ""}`}>
              <ChevronRight size={11} className="text-[#1D1D1D]/25 shrink-0" />
              {isLast ? (
                <span className="text-xs font-semibold text-[#131313] dark:text-white truncate max-w-35 sm:max-w-none">
                  {label}
                </span>
              ) : (
                <Link href={href} className="text-xs font-medium text-[#1D1D1D]/45 dark:text-white/30 hover:text-[#CF291D] truncate transition-colors">
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      {/* Contextual actions */}
      {action && (
        <div className="shrink-0">
          {action.kind === "daterange" ? (
            <DateRangePicker />
          ) : (
            <ActionButton action={action} />
          )}
        </div>
      )}
    </div>
  );
}
