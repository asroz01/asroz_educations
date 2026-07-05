"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, ExternalLink, GraduationCap, BookOpen, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { approveUser } from "@/app/actions/register";
import { createClient } from "@/utils/supabase/client";

type PendingUser = {
  id: string;
  full_name: string;
  role: string;
  mobile: string | null;
  username: string | null;
  education_qualification: string | null;
  current_company: string | null;
  nic_number: string | null;
  nic_front_url: string | null;
  nic_back_url: string | null;
  experience_years: number | null;
  school_name: string | null;
  document_type: string | null;
  document_number: string | null;
  document_url: string | null;
  father_name: string | null;
  father_mobile: string | null;
  mother_name: string | null;
  mother_mobile: string | null;
  created_at: string;
  rejection_reason: string | null;
};

function DocLink({ path, label }: { path: string | null; label: string }) {
  const supabase = createClient();
  if (!path) return <span className="text-xs text-[#1D1D1D]/30 dark:text-white/20">—</span>;

  async function openDoc() {
    const { data } = await supabase.storage.from("registration-docs").createSignedUrl(path!, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  return (
    <button onClick={openDoc} className="flex items-center gap-1 text-xs font-semibold text-[#CF291D] hover:underline">
      <ExternalLink size={11} /> {label}
    </button>
  );
}

function UserCard({ user }: { user: PendingUser }) {
  const router        = useRouter();
  const [expanded,    setExpanded]    = useState(false);
  const [loading,     setLoading]     = useState<"approve" | "reject" | null>(null);
  const [rejectNote,  setRejectNote]  = useState("");
  const [showReject,  setShowReject]  = useState(false);

  const isTeacher = user.role === "teacher";

  async function handleApprove() {
    setLoading("approve");
    await approveUser(user.id, true);
    router.refresh();
  }

  async function handleReject() {
    setLoading("reject");
    await approveUser(user.id, false, rejectNote || "Not approved by admin");
    router.refresh();
  }

  return (
    <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.09),-2px_-2px_7px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_10px_rgba(0,0,0,0.5)]">
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${isTeacher ? "bg-[#CF291D]" : "bg-blue-600"}`}>
          {isTeacher ? <GraduationCap size={18} className="text-white" /> : <BookOpen size={18} className="text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#131313] dark:text-white truncate">{user.full_name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${isTeacher ? "bg-[#CF291D]/10 text-[#CF291D]" : "bg-blue-500/10 text-blue-600"}`}>
              {user.role}
            </span>
            {user.username && <span className="text-[10px] text-[#1D1D1D]/40 dark:text-white/25">@{user.username}</span>}
            <span className="text-[10px] text-[#1D1D1D]/30 dark:text-white/20">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded(p => !p)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D] transition-all"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? "Less" : "View"}
          </button>
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 shadow-[2px_2px_6px_rgba(5,150,105,0.35)] hover:bg-emerald-500 disabled:opacity-50 transition-all"
          >
            {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
            Approve
          </button>
          <button
            onClick={() => setShowReject(p => !p)}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#CF291D] shadow-[2px_2px_6px_rgba(207,41,29,0.35)] hover:bg-[#B50717] disabled:opacity-50 transition-all"
          >
            <XCircle size={12} /> Reject
          </button>
        </div>
      </div>

      {/* Rejection note */}
      {showReject && (
        <div className="px-5 pb-4 flex items-center gap-2 border-t border-[#BFBFBF]/20 dark:border-white/6 pt-3">
          <input
            value={rejectNote}
            onChange={e => setRejectNote(e.target.value)}
            placeholder="Reason for rejection (optional)"
            className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/60 dark:border-white/10 text-[#131313] dark:text-white outline-none focus:border-[#CF291D]/40"
          />
          <button
            onClick={handleReject}
            disabled={loading !== null}
            className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#CF291D] hover:bg-[#B50717] disabled:opacity-50 transition-all"
          >
            {loading === "reject" ? <Loader2 size={12} className="animate-spin" /> : "Confirm Reject"}
          </button>
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-[#BFBFBF]/20 dark:border-white/6 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
          {isTeacher ? (
            <>
              <Detail label="Mobile"         value={user.mobile} />
              <Detail label="NIC Number"     value={user.nic_number} />
              <Detail label="Qualification"  value={user.education_qualification} />
              <Detail label="Company/School" value={user.current_company} />
              <Detail label="Experience"     value={user.experience_years != null ? `${user.experience_years} yrs` : null} />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25">NIC Documents</span>
                <div className="flex gap-3">
                  <DocLink path={user.nic_front_url} label="Front" />
                  <DocLink path={user.nic_back_url}  label="Back"  />
                </div>
              </div>
            </>
          ) : (
            <>
              <Detail label="Mobile"         value={user.mobile} />
              <Detail label="School"         value={user.school_name} />
              <Detail label="Document Type"  value={user.document_type?.replace("_", " ")} />
              <Detail label="Document No."   value={user.document_number} />
              <Detail label="Father"         value={user.father_name} />
              <Detail label="Father Mobile"  value={user.father_mobile} />
              <Detail label="Mother"         value={user.mother_name} />
              <Detail label="Mother Mobile"  value={user.mother_mobile} />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/40 dark:text-white/25">Document</span>
                <DocLink path={user.document_url} label="View Document" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1D1D1D]/35 dark:text-white/25">{label}</p>
      <p className="text-xs font-medium text-[#131313] dark:text-white mt-0.5">{value || "—"}</p>
    </div>
  );
}

export default function ApprovalsClient({ pending }: { pending: PendingUser[] }) {
  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08),-2px_-2px_7px_rgba(255,255,255,0.9)]">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3">
          <CheckCircle2 size={26} className="text-emerald-600" />
        </div>
        <p className="text-sm font-bold text-[#131313] dark:text-white">All caught up!</p>
        <p className="text-xs text-[#1D1D1D]/40 dark:text-white/30 mt-1">No pending approvals at this time.</p>
      </div>
    );
  }

  const teachers = pending.filter(u => u.role === "teacher");
  const students = pending.filter(u => u.role === "student");

  return (
    <div className="space-y-6">
      {teachers.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#CF291D]">Teachers ({teachers.length})</p>
          {teachers.map(u => <UserCard key={u.id} user={u} />)}
        </div>
      )}
      {students.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Students ({students.length})</p>
          {students.map(u => <UserCard key={u.id} user={u} />)}
        </div>
      )}
    </div>
  );
}
