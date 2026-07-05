"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, UserPlus, Users, BookOpenCheck,
  FileText, Library, BarChart2, CreditCard,
  GraduationCap, ClipboardList, Settings, ShieldCheck,
  LogOut, ChevronDown, UserCheck,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRole, type Role } from "@/context/RoleContext";

// roles listed = who can see that item. Empty = everyone.
const nav = [
  {
    section: "Platform Overview",
    items: [
      { label: "Dashboard",   href: "/dashboard",       icon: LayoutDashboard, roles: [] as Role[] },
    ],
  },
  {
    section: "Student Management",
    items: [
      { label: "Enrollment",         href: "/students",            icon: UserPlus,     roles: ["admin"] as Role[], exact: true },
      { label: "Student Directory",  href: "/students/directory",  icon: Users,        roles: [] as Role[] },
      { label: "Academic Records",   href: "/students/records",    icon: BookOpenCheck,roles: [] as Role[] },
    ],
  },
  {
    section: "Academic Operations",
    items: [
      { label: "Exam Management",  href: "/exams",            icon: FileText, roles: ["admin", "teacher"] as Role[] },
      { label: "Digital Library",  href: "/library",          icon: Library,  roles: [] as Role[] },
      { label: "Exam Analytics",   href: "/exams/analytics",  icon: BarChart2,roles: ["admin", "teacher"] as Role[] },
    ],
  },
  {
    section: "Administrative",
    items: [
      { label: "Pending Approvals",    href: "/approvals", icon: UserCheck,    roles: ["admin"] as Role[] },
      { label: "Fee & Payments",      href: "/payments",  icon: CreditCard,   roles: ["admin"] as Role[] },
      { label: "Staff Portal",        href: "/staff",     icon: GraduationCap,roles: ["admin"] as Role[] },
      { label: "Government Reports",  href: "/reports",   icon: ClipboardList,roles: ["admin"] as Role[] },
    ],
  },
  {
    section: "Configuration",
    items: [
      { label: "System Settings",  href: "/settings",       icon: Settings,    roles: ["admin"] as Role[] },
      { label: "Role Management",  href: "/settings/roles", icon: ShieldCheck, roles: ["admin"] as Role[] },
    ],
  },
];

function canSee(itemRoles: Role[], userRole: Role): boolean {
  return itemRoles.length === 0 || itemRoles.includes(userRole);
}

function NavSection({
  section,
  items,
  pathname,
  role,
}: {
  section: string;
  items: { label: string; href: string; icon: React.ElementType; roles: Role[]; exact?: boolean }[];
  pathname: string;
  role: Role;
}) {
  const visible = items.filter((i) => canSee(i.roles, role));
  const isActive = (item: typeof visible[0]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
  const hasActive = visible.some(isActive);
  const [open, setOpen] = useState<boolean>(hasActive || true);

  if (visible.length === 0) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#1D1D1D]/40 dark:text-white/25 hover:text-[#CF291D]/70 transition-colors duration-150"
      >
        {section}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
      </button>

      {open && (
        <div className="space-y-0.5">
          {visible.map((item) => {
            const { label, href, icon: Icon } = item;
            const active = isActive(item);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#CF291D] text-white shadow-[3px_3px_8px_rgba(207,41,29,0.35),-1px_-1px_4px_rgba(255,255,255,0.6)]"
                    : "text-[#1D1D1D]/75 dark:text-white/50 hover:bg-[#BFBFBF]/30 dark:hover:bg-white/6 hover:text-[#CF291D]"
                }`}
              >
                <Icon size={16} className={`shrink-0 transition-colors duration-200 ${active ? "text-white" : "text-[#1D1D1D]/40 dark:text-white/30 group-hover:text-[#CF291D]"}`} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { role } = useRole();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 flex-col bg-[#ECECEC] dark:bg-[#1a1a1a] border-r border-[#BFBFBF]/50 dark:border-white/8 shadow-[4px_0_20px_rgba(0,0,0,0.07)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.4)] hidden md:flex transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-[#BFBFBF]/50 dark:border-white/8">
        <Image
          src="/logo.png"
          alt="ASROZ Educations"
          width={1143}
          height={219}
          style={{ width: "100%", height: "auto" }}
          className="object-contain"
          priority
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        {nav.map(({ section, items }) => (
          <NavSection
            key={section}
            section={section}
            items={items}
            pathname={pathname}
            role={role}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#BFBFBF]/50 dark:border-white/8">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1D]/75 dark:text-white/50 hover:bg-[#BFBFBF]/30 dark:hover:bg-white/6 hover:text-[#CF291D] transition-all duration-200"
        >
          <LogOut size={16} className="shrink-0 text-[#1D1D1D]/40 dark:text-white/30" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
