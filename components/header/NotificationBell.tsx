"use client";

import { useState, useRef } from "react";
import { Bell, UserPlus, FileText, CreditCard, AlertCircle } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

const NOTIFICATIONS = [
  {
    id: 1,
    icon: AlertCircle,
    color: "bg-[#CF291D]/10 text-[#CF291D]",
    title: "Exam result overdue",
    body: "O/L Maths Term 3 results not yet uploaded",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: UserPlus,
    color: "bg-emerald-600/10 text-emerald-600",
    title: "3 new enrollments",
    body: "Montessori intake — pending approval",
    time: "22 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: CreditCard,
    color: "bg-violet-600/10 text-violet-600",
    title: "Fee payment received",
    body: "LKR 14,500 from Parent — Kamal Silva",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 4,
    icon: FileText,
    color: "bg-blue-600/10 text-blue-600",
    title: "New tute uploaded",
    body: "A/L Physics Paper 2 by Mr. Perera",
    time: "3 hr ago",
    unread: false,
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="
          relative flex items-center justify-center w-9 h-9 rounded-xl
          bg-[#ECECEC] text-[#131313]
          shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]
          hover:shadow-[4px_4px_10px_rgba(0,0,0,0.12),-3px_-3px_8px_rgba(255,255,255,0.95)]
          active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.09),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]
          transition-shadow duration-150
        "
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#CF291D] text-white text-[9px] font-bold ring-2 ring-[#ECECEC]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] z-50
            bg-[#ECECEC] rounded-2xl overflow-hidden
            border border-[#BFBFBF]/40
            shadow-[6px_6px_18px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]
          "
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#BFBFBF]/30">
            <p className="text-xs font-bold text-[#131313]">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-medium text-[#CF291D] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-[#BFBFBF]/20 max-h-80 overflow-y-auto">
            {notifications.map(({ id, icon: Icon, color, title, body, time, unread }) => (
              <div
                key={id}
                className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer
                  ${unread ? "bg-[#CF291D]/[0.03] hover:bg-[#CF291D]/[0.06]" : "hover:bg-[#BFBFBF]/20"}`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${color.split(" ")[0]}`}>
                  <Icon size={14} className={color.split(" ")[1]} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[#131313] truncate">{title}</p>
                    {unread && <span className="w-1.5 h-1.5 rounded-full bg-[#CF291D] shrink-0" />}
                  </div>
                  <p className="text-[11px] text-[#1D1D1D]/50 mt-0.5 leading-snug">{body}</p>
                  <p className="text-[10px] text-[#1D1D1D]/35 mt-1">{time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2.5 border-t border-[#BFBFBF]/30 text-center">
            <button className="text-xs font-medium text-[#CF291D] hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
