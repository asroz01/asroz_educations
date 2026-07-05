"use client";

import Link from "next/link";
import { UserPlus, FileText, Upload, BookOpen } from "lucide-react";

interface QuickActionsProps {
  onAddStudent?: () => void;
}

export default function QuickActions({ onAddStudent }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {/* Add Student — opens modal */}
      <button
        onClick={onAddStudent}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#B50717] text-white shadow-[3px_3px_8px_rgba(181,7,23,0.35),-1px_-1px_4px_rgba(255,255,255,0.3)] hover:bg-[#CF291D] hover:shadow-[4px_4px_12px_rgba(207,41,29,0.45)]"
      >
        <UserPlus size={15} className="shrink-0" />
        Add Student
      </button>

      {[
        { label: "Create Exam", href: "/exams/new",      icon: FileText },
        { label: "Upload Tute", href: "/library/upload", icon: Upload   },
        { label: "New Course",  href: "/courses/new",    icon: BookOpen },
      ].map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#ECECEC] text-[#1D1D1D] shadow-[3px_3px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.95)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.12),-3px_-3px_8px_rgba(255,255,255,1)] hover:text-[#CF291D]"
        >
          <Icon size={15} className="shrink-0" />
          {label}
        </Link>
      ))}
    </div>
  );
}
