import { Shield, User, FileText, CreditCard, BookOpen, Settings, Download } from "lucide-react";

const LOGS = [
  { id: 1, actor: "Admin User",     action: "Modified student record",  target: "Kamal Silva (ID: 1042)",  module: "Students",  ip: "192.168.1.10", time: "2026-07-02 14:32:05", severity: "medium" },
  { id: 2, actor: "Mr. Perera",     action: "Uploaded exam paper",      target: "A/L Physics Paper 2",     module: "Library",   ip: "192.168.1.14", time: "2026-07-02 14:18:41", severity: "low"    },
  { id: 3, actor: "Admin User",     action: "Deleted student record",   target: "Saman Kumara (ID: 0987)", module: "Students",  ip: "192.168.1.10", time: "2026-07-02 13:55:20", severity: "high"   },
  { id: 4, actor: "Finance Team",   action: "Processed batch payment",  target: "12 records · LKR 84,000", module: "Payments",  ip: "192.168.1.22", time: "2026-07-02 11:30:00", severity: "medium" },
  { id: 5, actor: "Ms. Fernando",   action: "Published exam results",   target: "O/L Maths Term 3",        module: "Exams",     ip: "192.168.1.15", time: "2026-07-02 10:02:17", severity: "low"    },
  { id: 6, actor: "Admin User",     action: "Changed role permissions", target: "Teacher role — added Reports access", module: "Settings", ip: "192.168.1.10", time: "2026-07-01 17:44:09", severity: "high" },
  { id: 7, actor: "Admin User",     action: "Enrolled new student",     target: "Priya Mendis (ID: 1291)",  module: "Students",  ip: "192.168.1.10", time: "2026-07-01 16:20:55", severity: "low"    },
  { id: 8, actor: "System",         action: "Auto-generated PDF report","target": "Government Term 2 Summary", module: "Reports", ip: "system",      time: "2026-07-01 00:00:01", severity: "low"    },
];

const MODULE_ICONS: Record<string, React.ElementType> = {
  Students: User,
  Library: BookOpen,
  Payments: CreditCard,
  Exams: FileText,
  Settings: Settings,
  Reports: Shield,
};

const SEVERITY_BADGE: Record<string, string> = {
  high:   "bg-[#CF291D]/10 text-[#CF291D] border border-[#CF291D]/20",
  medium: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  low:    "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
};

export default function AuditPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#131313] dark:text-white">Audit Log</h1>
          <p className="text-sm text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">
            Full system activity trail · Government compliance record
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B50717] text-white text-xs font-semibold shadow-[3px_3px_8px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] transition-all">
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Students", "Exams", "Payments", "Library", "Settings", "Reports"].map((f) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150
              ${f === "All"
                ? "bg-[#CF291D] text-white shadow-[2px_2px_6px_rgba(207,41,29,0.3)]"
                : "bg-[#ECECEC] dark:bg-[#1a1a1a] text-[#1D1D1D]/60 dark:text-white/40 shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.4),-1px_-1px_3px_rgba(255,255,255,0.04)] hover:text-[#CF291D]"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Log table */}
      <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#BFBFBF]/30 dark:border-white/8">
                {["Timestamp", "Actor", "Action", "Target", "Module", "IP Address", "Severity"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BFBFBF]/20 dark:divide-white/6">
              {LOGS.map((log) => {
                const ModIcon = MODULE_ICONS[log.module] ?? Shield;
                return (
                  <tr key={log.id} className="hover:bg-[#BFBFBF]/15 dark:hover:bg-white/4 transition-colors">
                    <td className="px-4 py-3 text-xs text-[#1D1D1D]/50 dark:text-white/35 whitespace-nowrap font-mono">{log.time}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#131313] dark:text-white whitespace-nowrap">{log.actor}</td>
                    <td className="px-4 py-3 text-xs text-[#1D1D1D]/70 dark:text-white/60">{log.action}</td>
                    <td className="px-4 py-3 text-xs text-[#1D1D1D]/50 dark:text-white/35 max-w-[180px] truncate">{log.target}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-[#1D1D1D]/50 dark:text-white/35 whitespace-nowrap">
                        <ModIcon size={12} />
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#1D1D1D]/40 dark:text-white/25 font-mono whitespace-nowrap">{log.ip}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize ${SEVERITY_BADGE[log.severity]}`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
