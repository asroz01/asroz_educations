import {
  Upload,
  UserPlus,
  FileText,
  CreditCard,
  BookOpen,
} from "lucide-react";

const activities = [
  {
    id: 1,
    icon: Upload,
    user: "Mr. Perera",
    action: "uploaded A/L Physics Paper 2",
    time: "2 min ago",
    color: "text-[#CF291D]",
    bg: "bg-[#CF291D]/10",
  },
  {
    id: 2,
    icon: UserPlus,
    user: "Admin",
    action: "enrolled 3 new Montessori students",
    time: "18 min ago",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
  },
  {
    id: 3,
    icon: FileText,
    user: "Ms. Fernando",
    action: "published O/L Maths mid-term exam",
    time: "1 hr ago",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    id: 4,
    icon: CreditCard,
    user: "Finance",
    action: "processed 12 fee payments — LKR 84,000",
    time: "2 hr ago",
    color: "text-violet-600",
    bg: "bg-violet-600/10",
  },
  {
    id: 5,
    icon: BookOpen,
    user: "Mr. Silva",
    action: "added ICT Grade 10 tute to Digital Library",
    time: "3 hr ago",
    color: "text-amber-600",
    bg: "bg-amber-600/10",
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-[#ECECEC] rounded-2xl p-5 shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#131313]">Recent Activity</h3>
        <button className="text-xs font-medium text-[#CF291D] hover:underline transition-all">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {activities.map(({ id, icon: Icon, user, action, time, color, bg }) => (
          <div key={id} className="flex items-start gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${bg}`}>
              <Icon size={14} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#131313] leading-snug">
                <span className="font-semibold">{user}</span>{" "}
                <span className="text-[#1D1D1D]/60">{action}</span>
              </p>
              <p className="text-xs text-[#1D1D1D]/35 mt-0.5">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
