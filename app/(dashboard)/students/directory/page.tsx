import { createClient } from "@/utils/supabase/server";
import { Users, Phone, GraduationCap, Search } from "lucide-react";

export default async function StudentDirectoryPage() {
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("enrollment_list")
    .select("id, full_name, gender, date_of_birth, class_name, stream, enrolled_at, guardian_name, guardian_phone, payment_status")
    .order("full_name");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#131313] dark:text-white">Student Directory</h1>
        <p className="text-sm text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">
          {students?.length ?? 0} students across all classes
        </p>
      </div>

      {!students?.length ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08),-2px_-2px_7px_rgba(255,255,255,0.9)]">
          <div className="w-14 h-14 rounded-2xl bg-[#BFBFBF]/20 flex items-center justify-center mb-3">
            <Search size={22} className="text-[#1D1D1D]/25" />
          </div>
          <p className="text-sm font-semibold text-[#131313] dark:text-white">No students yet</p>
          <p className="text-xs text-[#1D1D1D]/40 dark:text-white/30 mt-1">Add students via the Enrollment page</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {students.map((s) => {
            const initials = s.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
            const age = s.date_of_birth
              ? Math.floor((Date.now() - new Date(s.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
              : null;
            const statusColor = s.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-700" : s.payment_status === "overdue" ? "bg-[#CF291D]/10 text-[#CF291D]" : "bg-amber-500/10 text-amber-700";

            return (
              <div key={s.id} className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.09),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.5)] hover:shadow-[5px_5px_14px_rgba(0,0,0,0.12),-3px_-3px_8px_rgba(255,255,255,0.95)] transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#CF291D] shrink-0 shadow-[3px_3px_8px_rgba(207,41,29,0.35)]">
                    <span className="text-xs font-bold text-white">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#131313] dark:text-white truncate">{s.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {s.class_name && (
                        <span className="flex items-center gap-1 text-[11px] text-[#1D1D1D]/50 dark:text-white/35">
                          <GraduationCap size={11} />{s.class_name}
                        </span>
                      )}
                      {age && (
                        <span className="text-[11px] text-[#1D1D1D]/40 dark:text-white/25">Age {age}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize shrink-0 ${statusColor}`}>
                    {s.payment_status}
                  </span>
                </div>

                {(s.guardian_name || s.guardian_phone) && (
                  <div className="mt-3 pt-3 border-t border-[#BFBFBF]/25 dark:border-white/6 flex items-center gap-2">
                    <Users size={12} className="text-[#1D1D1D]/30 dark:text-white/20 shrink-0" />
                    <span className="text-[11px] text-[#1D1D1D]/50 dark:text-white/30 truncate">
                      {s.guardian_name}
                    </span>
                    {s.guardian_phone && (
                      <a href={`tel:${s.guardian_phone}`} className="flex items-center gap-1 text-[11px] text-[#CF291D] hover:underline ml-auto shrink-0">
                        <Phone size={11} />{s.guardian_phone}
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#1D1D1D]/30 dark:text-white/20">
                    Enrolled {new Date(s.enrolled_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  {s.stream && (
                    <span className="text-[10px] font-medium text-[#1D1D1D]/40 dark:text-white/25">{s.stream}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
