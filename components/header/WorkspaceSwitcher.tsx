"use client";

import { useState, useRef } from "react";
import { ChevronDown, ShieldCheck, GraduationCap, BookOpen } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

const WORKSPACES = [
  { id: "admin",   label: "Admin",   sub: "Full access",        icon: ShieldCheck,    color: "text-[#CF291D]" },
  { id: "teacher", label: "Teacher", sub: "Academic portal",    icon: GraduationCap,  color: "text-blue-600"  },
  { id: "student", label: "Student", sub: "Student view",       icon: BookOpen,       color: "text-emerald-600" },
];

export default function WorkspaceSwitcher() {
  const [active, setActive] = useState(WORKSPACES[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const Icon = active.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="
          flex items-center gap-2 px-3 py-1.5 rounded-xl
          bg-[#ECECEC] border border-[#BFBFBF]/50
          shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]
          hover:shadow-[4px_4px_10px_rgba(0,0,0,0.12),-3px_-3px_8px_rgba(255,255,255,0.95)]
          active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.09),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]
          transition-shadow duration-150
        "
      >
        <Icon size={14} className={`shrink-0 ${active.color}`} />
        <span className="hidden sm:block text-xs font-semibold text-[#131313]">{active.label}</span>
        <ChevronDown size={12} className={`text-[#1D1D1D]/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="
            absolute top-full left-0 mt-2 w-52 z-50
            bg-[#ECECEC] rounded-2xl overflow-hidden
            border border-[#BFBFBF]/40
            shadow-[6px_6px_18px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]
          "
        >
          <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1D1D1D]/35">
            Switch Workspace
          </p>
          {WORKSPACES.map((ws) => {
            const WIcon = ws.icon;
            const isActive = ws.id === active.id;
            return (
              <button
                key={ws.id}
                onClick={() => { setActive(ws); setOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left
                  transition-colors duration-150
                  ${isActive ? "bg-[#CF291D]/8" : "hover:bg-[#BFBFBF]/25"}
                `}
              >
                <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-[#ECECEC] shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.9)]`}>
                  <WIcon size={13} className={ws.color} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${isActive ? "text-[#CF291D]" : "text-[#131313]"}`}>{ws.label}</p>
                  <p className="text-[10px] text-[#1D1D1D]/40">{ws.sub}</p>
                </div>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#CF291D] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
