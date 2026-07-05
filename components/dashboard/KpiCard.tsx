import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  accent?: boolean;
}

export default function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend = "neutral",
  trendLabel,
  accent = false,
}: KpiCardProps) {
  const trendColor =
    trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-[#1D1D1D]/40";
  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "—";

  return (
    <div
      className={`
        relative flex flex-col gap-3 p-5 rounded-2xl
        ${
          accent
            ? "bg-[#CF291D] shadow-[5px_5px_14px_rgba(207,41,29,0.4),-2px_-2px_8px_rgba(255,255,255,0.5)]"
            : "bg-[#ECECEC] shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)]"
        }
      `}
    >
      <div className="flex items-start justify-between">
        <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-white/70" : "text-[#1D1D1D]/50"}`}>
          {label}
        </p>
        <div
          className={`
            flex items-center justify-center w-9 h-9 rounded-xl
            ${
              accent
                ? "bg-white/20"
                : "bg-[#ECECEC] shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]"
            }
          `}
        >
          <Icon size={18} className={accent ? "text-white" : "text-[#CF291D]"} />
        </div>
      </div>

      <div>
        <p className={`text-2xl font-bold tracking-tight ${accent ? "text-white" : "text-[#131313]"}`}>
          {value}
        </p>
        <p className={`text-xs mt-0.5 ${accent ? "text-white/60" : "text-[#1D1D1D]/40"}`}>
          {sub}
        </p>
      </div>

      {trendLabel && (
        <p className={`text-xs font-medium ${accent ? "text-white/70" : trendColor}`}>
          {trendArrow} {trendLabel}
        </p>
      )}
    </div>
  );
}
