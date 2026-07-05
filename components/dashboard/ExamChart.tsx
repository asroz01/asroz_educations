"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { subject: "Maths", term1: 68, term2: 74, term3: 79 },
  { subject: "Science", term1: 72, term2: 70, term3: 76 },
  { subject: "English", term1: 65, term2: 69, term3: 73 },
  { subject: "History", term1: 78, term2: 81, term3: 83 },
  { subject: "ICT", term1: 80, term2: 84, term3: 88 },
];

export default function ExamChart() {
  return (
    <div className="bg-[#ECECEC] rounded-2xl p-5 shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[#131313]">Exam Performance</h3>
          <p className="text-xs text-[#1D1D1D]/40 mt-0.5">Term comparison · avg. score %</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#BFBFBF" strokeOpacity={0.4} vertical={false} />
          <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#1D1D1D", opacity: 0.5 }} axisLine={false} tickLine={false} />
          <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#1D1D1D", opacity: 0.5 }} axisLine={false} tickLine={false} />
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
          <Bar dataKey="term1" name="Term 1" fill="#BFBFBF" radius={[4, 4, 0, 0]} />
          <Bar dataKey="term2" name="Term 2" fill="#B50717" radius={[4, 4, 0, 0]} />
          <Bar dataKey="term3" name="Term 3" fill="#CF291D" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
