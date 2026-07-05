"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", montessori: 42, primary: 88, juniorSec: 54, senior: 31, al: 19 },
  { month: "Feb", montessori: 45, primary: 91, juniorSec: 57, senior: 33, al: 22 },
  { month: "Mar", montessori: 48, primary: 96, juniorSec: 60, senior: 35, al: 24 },
  { month: "Apr", montessori: 44, primary: 99, juniorSec: 63, senior: 38, al: 26 },
  { month: "May", montessori: 50, primary: 104, juniorSec: 67, senior: 40, al: 28 },
  { month: "Jun", montessori: 53, primary: 109, juniorSec: 70, senior: 42, al: 30 },
  { month: "Jul", montessori: 55, primary: 113, juniorSec: 72, senior: 44, al: 32 },
];

const series = [
  { key: "montessori", label: "Montessori", color: "#CF291D" },
  { key: "primary", label: "Primary", color: "#1D1D1D" },
  { key: "juniorSec", label: "Junior Secondary", color: "#B50717" },
  { key: "senior", label: "Senior", color: "#6B7280" },
  { key: "al", label: "A/L", color: "#BFBFBF" },
];

export default function EnrollmentChart() {
  return (
    <div className="bg-[#ECECEC] rounded-2xl p-5 shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[#131313]">Enrollment Trends</h3>
          <p className="text-xs text-[#1D1D1D]/40 mt-0.5">All classes · Jan – Jul 2026</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#CF291D]/10 text-[#CF291D]">
          Live
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {series.map(({ key, color }) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#BFBFBF" strokeOpacity={0.4} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#1D1D1D", opacity: 0.5 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#1D1D1D", opacity: 0.5 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#ECECEC",
              border: "1px solid #BFBFBF",
              borderRadius: "12px",
              fontSize: 12,
              boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
          {series.map(({ key, color }) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={series.find((s) => s.key === key)!.label}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
