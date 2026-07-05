"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, Users, UserPlus, FileText, Library,
  BarChart2, CreditCard, GraduationCap, ClipboardList, Settings,
  ShieldCheck, BookOpenCheck, X,
} from "lucide-react";

const COMMANDS = [
  { label: "Dashboard",           href: "/dashboard",          icon: LayoutDashboard, group: "Navigate"  },
  { label: "Enrollment",          href: "/students",            icon: UserPlus,        group: "Navigate"  },
  { label: "Student Directory",   href: "/students/directory",  icon: Users,           group: "Navigate"  },
  { label: "Academic Records",    href: "/students/records",   icon: BookOpenCheck,   group: "Navigate"  },
  { label: "Exam Management",     href: "/exams",              icon: FileText,        group: "Navigate"  },
  { label: "Exam Analytics",      href: "/exams/analytics",    icon: BarChart2,       group: "Navigate"  },
  { label: "Digital Library",     href: "/library",            icon: Library,         group: "Navigate"  },
  { label: "Fee & Payments",      href: "/payments",           icon: CreditCard,      group: "Navigate"  },
  { label: "Staff Portal",        href: "/staff",              icon: GraduationCap,   group: "Navigate"  },
  { label: "Government Reports",  href: "/reports",            icon: ClipboardList,   group: "Navigate"  },
  { label: "System Settings",     href: "/settings",           icon: Settings,        group: "Settings"  },
  { label: "Role Management",     href: "/settings/roles",     icon: ShieldCheck,     group: "Settings"  },
  { label: "Create New Exam",     href: "/exams/new",          icon: FileText,        group: "Quick Create" },
  { label: "New Enrollment",      href: "/students/enroll",    icon: UserPlus,        group: "Quick Create" },
  { label: "Upload Tute",         href: "/library/upload",     icon: Library,         group: "Quick Create" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.group.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  // Group results
  const groups = filtered.reduce<Record<string, typeof COMMANDS>>((acc, cmd) => {
    (acc[cmd.group] ??= []).push(cmd);
    return acc;
  }, {});

  const flat = Object.values(groups).flat();

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 30); setQuery(""); setCursor(0); } }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((p) => Math.min(p + 1, flat.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setCursor((p) => Math.max(p - 1, 0)); }
      if (e.key === "Enter")     { const cmd = flat[cursor]; if (cmd) { router.push(cmd.href); onClose(); } }
      if (e.key === "Escape")    { onClose(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, cursor, router, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#BFBFBF]/40 dark:border-white/10 shadow-[8px_8px_24px_rgba(0,0,0,0.15),-4px_-4px_14px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_24px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#BFBFBF]/30 dark:border-white/8">
          <Search size={16} className="text-[#1D1D1D]/40 dark:text-white/30 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/35 dark:placeholder:text-white/25 outline-none"
          />
          <button onClick={onClose} className="flex items-center gap-1 text-[10px] text-[#1D1D1D]/30 dark:text-white/20 hover:text-[#CF291D] transition-colors">
            <X size={13} /> ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {flat.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[#1D1D1D]/40 dark:text-white/30">No results for "{query}"</p>
          ) : (
            Object.entries(groups).map(([group, cmds]) => (
              <div key={group}>
                <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#1D1D1D]/35 dark:text-white/25">{group}</p>
                {cmds.map((cmd) => {
                  const Icon = cmd.icon;
                  const idx = flat.indexOf(cmd);
                  const active = idx === cursor;
                  return (
                    <button
                      key={cmd.href + cmd.label}
                      onMouseEnter={() => setCursor(idx)}
                      onClick={() => { router.push(cmd.href); onClose(); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${active ? "bg-[#CF291D]/10 dark:bg-[#CF291D]/20" : "hover:bg-[#BFBFBF]/25 dark:hover:bg-white/6"}`}
                    >
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${active ? "bg-[#CF291D]/15 dark:bg-[#CF291D]/25" : "bg-[#BFBFBF]/40 dark:bg-white/8"}`}>
                        <Icon size={13} className={active ? "text-[#CF291D]" : "text-[#1D1D1D]/50 dark:text-white/40"} />
                      </div>
                      <span className={`text-sm font-medium ${active ? "text-[#CF291D]" : "text-[#131313] dark:text-white/80"}`}>{cmd.label}</span>
                      {active && <span className="ml-auto text-[10px] text-[#CF291D]/60 font-mono">↵</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-[#BFBFBF]/30 dark:border-white/8 flex gap-4 text-[10px] text-[#1D1D1D]/30 dark:text-white/20">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  );
}
