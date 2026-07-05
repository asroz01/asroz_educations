"use client";

import { Menu, Search, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";
import WorkspaceSwitcher from "@/components/header/WorkspaceSwitcher";
import QuickCreate from "@/components/header/QuickCreate";
import NotificationBell from "@/components/header/NotificationBell";
import ProfileMenu from "@/components/header/ProfileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onMenuToggle?: () => void;
  onCommandOpen?: () => void;
  onAddStudent?: () => void;
}

export default function Header({ onMenuToggle, onCommandOpen, onAddStudent }: HeaderProps) {
  return (
    <header className="
      sticky top-0 z-30
      flex items-center gap-2
      h-14 px-3 md:px-6
      bg-[#ECECEC] dark:bg-[#1D1D1D]
      border-b border-[#BFBFBF]/40 dark:border-white/8
      shadow-[0_2px_10px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)]
      transition-colors duration-300
    ">

      {/* ── Hamburger (mobile only) ── */}
      <button
        onClick={onMenuToggle}
        className="
          md:hidden flex items-center justify-center w-8 h-8 rounded-xl shrink-0
          bg-[#ECECEC] dark:bg-[#1a1a1a] text-[#131313] dark:text-white/70
          shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]
          dark:shadow-[3px_3px_7px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.04)]
          active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.09)] transition-shadow duration-150
        "
        aria-label="Toggle menu"
      >
        <Menu size={16} />
      </button>

      {/* ── Workspace switcher (hidden on mobile) ── */}
      <div className="hidden md:block shrink-0">
        <WorkspaceSwitcher />
      </div>

      {/* ── Search bar — full on md+, icon-button on mobile ── */}
      {/* Mobile: icon button */}
      <button
        onClick={onCommandOpen}
        className="
          md:hidden flex items-center justify-center w-8 h-8 rounded-xl shrink-0
          bg-[#ECECEC] dark:bg-[#1a1a1a] text-[#1D1D1D]/50 dark:text-white/35
          shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]
          dark:shadow-[3px_3px_7px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.04)]
          hover:text-[#CF291D] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.09)]
          transition-all duration-150
        "
        aria-label="Search"
      >
        <Search size={16} />
      </button>

      {/* Desktop: full search bar */}
      <button
        onClick={onCommandOpen}
        className="
          hidden md:flex flex-1 items-center gap-2 px-3 py-1.5 rounded-xl text-left mx-2
          bg-[#ECECEC] dark:bg-[#111111]
          border border-[#BFBFBF]/60 dark:border-white/10
          shadow-[inset_2px_2px_6px_rgba(0,0,0,0.07),inset_-1px_-1px_4px_rgba(255,255,255,0.85)]
          dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-1px_-1px_3px_rgba(255,255,255,0.02)]
          hover:border-[#CF291D]/40 transition-all duration-200
        "
        aria-label="Open command palette"
      >
        <Search size={14} className="text-[#1D1D1D]/40 dark:text-white/25 shrink-0" />
        <span className="flex-1 text-sm text-[#1D1D1D]/35 dark:text-white/25">
          Search students, exams, staff…
        </span>
        <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-[#BFBFBF]/60 dark:border-white/10 text-[10px] text-[#1D1D1D]/30 dark:text-white/20 font-mono shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* ── Spacer on mobile so icons push right ── */}
      <div className="flex-1 md:hidden" />

      {/* ── Quick Create (+ button) ── */}
      <QuickCreate onAddStudent={onAddStudent} />

      {/* ── Utility icons — hidden on mobile ── */}
      <Link
        href="/help"
        className="
          hidden sm:flex items-center justify-center w-8 h-8 rounded-xl shrink-0
          text-[#1D1D1D]/50 dark:text-white/35 bg-[#ECECEC] dark:bg-[#1a1a1a]
          shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]
          dark:shadow-[3px_3px_7px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.04)]
          hover:text-[#CF291D] transition-all duration-150
        "
        aria-label="Help"
      >
        <HelpCircle size={16} />
      </Link>

      <Link
        href="/settings"
        className="
          hidden sm:flex items-center justify-center w-8 h-8 rounded-xl shrink-0
          text-[#1D1D1D]/50 dark:text-white/35 bg-[#ECECEC] dark:bg-[#1a1a1a]
          shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]
          dark:shadow-[3px_3px_7px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.04)]
          hover:text-[#CF291D] transition-all duration-150
        "
        aria-label="Settings"
      >
        <Settings size={16} />
      </Link>

      {/* ── Theme toggle — hidden on mobile ── */}
      <div className="hidden sm:block">
        <ThemeToggle />
      </div>

      {/* ── Notifications ── */}
      <NotificationBell />

      {/* ── Divider (desktop only) ── */}
      <div className="hidden sm:block w-px h-5 bg-[#BFBFBF]/50 dark:bg-white/10" />

      {/* ── Profile ── */}
      <ProfileMenu />
    </header>
  );
}
