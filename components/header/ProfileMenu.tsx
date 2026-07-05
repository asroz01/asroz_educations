"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Settings, HelpCircle, LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { createClient } from "@/utils/supabase/client";
import { useRole } from "@/context/RoleContext";

// Menu items filtered by role
const MENU_ITEMS = [
  { label: "Account Settings", href: "/settings",             icon: User,        roles: ["admin", "teacher", "student"] },
  { label: "Preferences",      href: "/settings/preferences", icon: Settings,    roles: ["admin", "teacher", "student"] },
  { label: "Role Management",  href: "/settings/roles",       icon: ShieldCheck, roles: ["admin"]                       },
  { label: "Invite Staff",     href: "/auth/invite",          icon: User,        roles: ["admin"]                       },
  { label: "Help & Docs",      href: "/help",                 icon: HelpCircle,  roles: ["admin", "teacher", "student"] },
];

const ROLE_LABELS: Record<string, string> = {
  admin:   "Super Admin",
  teacher: "Teacher",
  student: "Student",
};

export default function ProfileMenu() {
  const [open,         setOpen]         = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);
  const ref    = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { profile, loading } = useRole();

  useClickOutside(ref, () => setOpen(false));

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  // Unauthenticated state
  if (!loading && !profile) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#131313] dark:text-white bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.4)] hover:text-[#CF291D] transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const visibleItems = MENU_ITEMS.filter((i) => i.roles.includes(profile?.role ?? ""));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-[#ECECEC] dark:bg-[#1a1a1a] border border-[#BFBFBF]/40 dark:border-white/8 shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.4)] hover:shadow-[4px_4px_10px_rgba(0,0,0,0.12),-3px_-3px_8px_rgba(255,255,255,0.95)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.09)] transition-shadow duration-150"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#CF291D] shrink-0">
          <span className="text-[11px] font-bold text-white leading-none select-none">
            {loading ? "…" : (profile?.initials ?? "?")}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-[#131313] dark:text-white leading-tight whitespace-nowrap">
            {loading ? "Loading…" : (profile?.full_name ?? "User")}
          </p>
          <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/30 leading-tight">
            {ROLE_LABELS[profile?.role ?? ""] ?? ""}
          </p>
        </div>
        <ChevronDown size={12} className={`text-[#1D1D1D]/40 dark:text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && profile && (
        <div className="absolute top-full right-0 mt-2 w-56 z-50 bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#BFBFBF]/40 dark:border-white/8 shadow-[6px_6px_18px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_18px_rgba(0,0,0,0.5)]">
          {/* Identity */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#BFBFBF]/30 dark:border-white/8">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#CF291D] shrink-0">
              <span className="text-sm font-bold text-white leading-none select-none">{profile.initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#131313] dark:text-white truncate">{profile.full_name}</p>
              <p className="text-[10px] text-[#1D1D1D]/40 dark:text-white/30 truncate">{profile.email}</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="px-4 py-2 border-b border-[#BFBFBF]/20 dark:border-white/6">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#CF291D]/10 dark:bg-[#CF291D]/20 text-[10px] font-bold text-[#CF291D] uppercase tracking-wider">
              <ShieldCheck size={9} />
              {ROLE_LABELS[profile.role]}
            </span>
          </div>

          {/* Nav items */}
          <div className="py-1.5">
            {visibleItems.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#BFBFBF]/25 dark:hover:bg-white/6 transition-colors duration-150">
                <Icon size={14} className="text-[#1D1D1D]/40 dark:text-white/30 shrink-0" />
                <span className="text-xs font-medium text-[#131313] dark:text-white">{label}</span>
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-[#BFBFBF]/30 dark:border-white/8 py-1.5">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-[#CF291D]/8 dark:hover:bg-[#CF291D]/15 transition-colors duration-150 group disabled:opacity-50"
            >
              {signingOut
                ? <Loader2 size={14} className="animate-spin text-[#CF291D] shrink-0" />
                : <LogOut size={14} className="text-[#1D1D1D]/40 dark:text-white/30 group-hover:text-[#CF291D] shrink-0 transition-colors" />
              }
              <span className="text-xs font-medium text-[#131313] dark:text-white group-hover:text-[#CF291D] transition-colors">
                {signingOut ? "Signing out…" : "Sign Out"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
