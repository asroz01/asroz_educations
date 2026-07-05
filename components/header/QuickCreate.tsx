"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Plus, X, UserPlus, FileText, Upload, BookOpen, CreditCard } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface QuickCreateProps {
  onAddStudent?: () => void;
}

export default function QuickCreate({ onAddStudent }: QuickCreateProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  function handleAddStudent() {
    setOpen(false);
    onAddStudent?.();
  }

  const linkActions = [
    { label: "Create Exam", href: "/exams/new",      icon: FileText,   color: "bg-blue-600/10 text-blue-600"           },
    { label: "Upload Tute", href: "/library/upload", icon: Upload,     color: "bg-amber-600/10 text-amber-600"         },
    { label: "New Course",  href: "/courses/new",    icon: BookOpen,   color: "bg-emerald-600/10 text-emerald-600"     },
    { label: "Log Payment", href: "/payments/new",   icon: CreditCard, color: "bg-violet-600/10 text-violet-600"      },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="
          flex items-center gap-1.5 px-3 py-1.5 rounded-xl
          bg-[#B50717] text-white text-xs font-semibold
          shadow-[3px_3px_8px_rgba(181,7,23,0.35),-1px_-1px_4px_rgba(255,100,100,0.1)]
          hover:bg-[#CF291D] hover:shadow-[4px_4px_12px_rgba(207,41,29,0.45)]
          active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)]
          transition-all duration-200
        "
        aria-label="Quick create"
      >
        {open ? <X size={14} className="shrink-0" /> : <Plus size={14} className="shrink-0" />}
        <span className="hidden sm:block">Create</span>
      </button>

      {open && (
        <div className="
          absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 z-50
          bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl overflow-hidden
          border border-[#BFBFBF]/40 dark:border-white/8
          shadow-[6px_6px_18px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]
          dark:shadow-[6px_6px_18px_rgba(0,0,0,0.5)]
        ">
          <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1D1D1D]/35 dark:text-white/25">
            Quick Create
          </p>

          {/* New Student — opens modal */}
          <button
            onClick={handleAddStudent}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#BFBFBF]/25 dark:hover:bg-white/6 transition-colors duration-150"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#CF291D]/10">
              <UserPlus size={13} className="text-[#CF291D]" />
            </div>
            <span className="text-sm font-medium text-[#131313] dark:text-white">New Student</span>
          </button>

          {/* Link-based actions */}
          {linkActions.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#BFBFBF]/25 dark:hover:bg-white/6 transition-colors duration-150"
            >
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${color.split(" ")[0]}`}>
                <Icon size={13} className={color.split(" ")[1]} />
              </div>
              <span className="text-sm font-medium text-[#131313] dark:text-white">{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
