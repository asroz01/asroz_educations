"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  UserPlus,
  Users,
  BookOpenCheck,
  FileText,
  Library,
  BarChart2,
  CreditCard,
  GraduationCap,
  ClipboardList,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

const nav = [
  {
    section: "Platform Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Student Management",
    items: [
      { label: "Enrollment", href: "/students", icon: UserPlus, exact: true },
      { label: "Student Directory", href: "/students/directory", icon: Users },
      { label: "Academic Records", href: "/students/records", icon: BookOpenCheck },
    ],
  },
  {
    section: "Academic Operations",
    items: [
      { label: "Exam Management", href: "/exams", icon: FileText },
      { label: "Digital Library", href: "/library", icon: Library },
      { label: "Exam Analytics", href: "/exams/analytics", icon: BarChart2 },
    ],
  },
  {
    section: "Administrative",
    items: [
      { label: "Fee & Payments", href: "/payments", icon: CreditCard },
      { label: "Staff Portal", href: "/staff", icon: GraduationCap },
      { label: "Government Reports", href: "/reports", icon: ClipboardList },
    ],
  },
  {
    section: "Configuration",
    items: [
      { label: "System Settings", href: "/settings", icon: Settings },
      { label: "Role Management", href: "/settings/roles", icon: ShieldCheck },
    ],
  },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

function NavSection({
  section,
  items,
  pathname,
  onClose,
}: {
  section: string;
  items: { label: string; href: string; icon: React.ElementType; exact?: boolean }[];
  pathname: string;
  onClose: () => void;
}) {
  const isActive = (item: typeof items[0]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
  const hasActive = items.some(isActive);
  const [open, setOpen] = useState<boolean>(hasActive || true);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center justify-between
          px-3 py-1.5 mb-0.5
          text-[10px] font-semibold uppercase tracking-widest
          text-[#1D1D1D]/40 hover:text-[#CF291D]/70
          transition-colors duration-150
        "
      >
        {section}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="space-y-0.5">
          {items.map((item) => {
            const { label, href, icon: Icon } = item;
            const active = isActive(item);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-4 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[#CF291D] text-white shadow-[3px_3px_8px_rgba(207,41,29,0.35),-1px_-1px_4px_rgba(255,255,255,0.6)]"
                      : "text-[#1D1D1D]/75 hover:bg-[#BFBFBF]/30 hover:text-[#CF291D]"
                  }
                `}
              >
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-[#1D1D1D]/40 group-hover:text-[#CF291D]"
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="
          fixed top-0 left-0 z-50 h-screen w-64
          flex flex-col
          bg-[#ECECEC]
          border-r border-[#BFBFBF]/50
          shadow-[4px_0_20px_rgba(0,0,0,0.1)]
          md:hidden animate-slide-in
        "
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#BFBFBF]/50">
          <Image
            src="/logo.png"
            alt="ASROZ Educations"
            width={120}
            height={36}
            className="object-contain"
            priority
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[#1D1D1D]/50 hover:text-[#CF291D] hover:bg-[#BFBFBF]/30 transition-all duration-150"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {nav.map(({ section, items }) => (
            <NavSection
              key={section}
              section={section}
              items={items}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#BFBFBF]/50">
          <button className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1D]/75 hover:bg-[#BFBFBF]/30 hover:text-[#CF291D] transition-all duration-200">
            <LogOut size={16} className="shrink-0 text-[#1D1D1D]/40" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
