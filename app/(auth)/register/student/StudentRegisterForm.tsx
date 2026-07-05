"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Upload, CheckCircle2 } from "lucide-react";
import { registerStudent } from "@/app/actions/register";
import { FormField, SectionHeading, inputCls, textInputCls } from "@/components/register/FormField";

export default function StudentRegisterForm() {
  const router   = useRouter();
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [showPw,   setShowPw]   = useState(false);
  const [agreed,   setAgreed]   = useState(false);
  const [docName,  setDocName]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms & Conditions."); return; }
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result   = await registerStudent(formData);

    setLoading(false);
    if (result.error) { setError(result.error); return; }
    router.push("/pending");
  }

  const inp = inputCls;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Personal Info ── */}
      <SectionHeading>Student Information</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" required>
          <div className={inp}><input name="full_name" required placeholder="Full name" className={textInputCls} /></div>
        </FormField>
        <FormField label="Username" required>
          <div className={inp}><input name="username" required placeholder="username" className={textInputCls} /></div>
        </FormField>
        <FormField label="Date of Birth" required>
          <div className={inp}><input name="date_of_birth" required type="date" className={textInputCls} /></div>
        </FormField>
        <FormField label="Gender" required>
          <div className={inp}>
            <select name="gender" required className={`${textInputCls} w-full`}>
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </FormField>
        <FormField label="Mobile" required>
          <div className={inp}><input name="mobile" required type="tel" placeholder="07X XXX XXXX" className={textInputCls} /></div>
        </FormField>
        <FormField label="School Name" required>
          <div className={inp}><input name="school_name" required placeholder="ABC National School" className={textInputCls} /></div>
        </FormField>
      </div>

      {/* ── Identity Document ── */}
      <SectionHeading>Identity Document</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Document Type" required>
          <div className={inp}>
            <select name="document_type" required className={`${textInputCls} w-full`}>
              <option value="">Select…</option>
              <option value="birth_certificate">Birth Certificate</option>
              <option value="postal_id">Postal ID</option>
              <option value="nic">NIC</option>
            </select>
          </div>
        </FormField>
        <FormField label="Document Number" required>
          <div className={inp}><input name="document_number" required placeholder="Document / NIC number" className={textInputCls} /></div>
        </FormField>
        <FormField label="Document Image" required>
          <label className={`${inp} cursor-pointer`}>
            <input type="file" name="document_image" accept="image/*,.pdf" required className="sr-only"
              onChange={(e) => setDocName(e.target.files?.[0]?.name ?? "")} />
            <Upload size={14} className="text-[#CF291D] shrink-0" />
            <span className="text-sm text-[#1D1D1D]/50 dark:text-white/30 flex-1 truncate">
              {docName || "Upload document image…"}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#CF291D]/10 text-[#CF291D] shrink-0">Browse</span>
          </label>
        </FormField>
      </div>

      {/* ── Parent / Guardian ── */}
      <SectionHeading>Parent / Guardian Details</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Father's Name" required>
          <div className={inp}><input name="father_name" required placeholder="Father's full name" className={textInputCls} /></div>
        </FormField>
        <FormField label="Father's Mobile" required>
          <div className={inp}><input name="father_mobile" required type="tel" placeholder="07X XXX XXXX" className={textInputCls} /></div>
        </FormField>
        <FormField label="Father's Occupation">
          <div className={inp}><input name="father_occupation" placeholder="e.g. Engineer" className={textInputCls} /></div>
        </FormField>
        <FormField label="Father's Age">
          <div className={inp}><input name="father_age" type="number" min="18" placeholder="45" className={textInputCls} /></div>
        </FormField>
        <FormField label="Mother's Name" required>
          <div className={inp}><input name="mother_name" required placeholder="Mother's full name" className={textInputCls} /></div>
        </FormField>
        <FormField label="Mother's Mobile" required>
          <div className={inp}><input name="mother_mobile" required type="tel" placeholder="07X XXX XXXX" className={textInputCls} /></div>
        </FormField>
      </div>

      {/* ── Account ── */}
      <SectionHeading>Account Credentials</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Email" required>
          <div className={inp}><input name="email" required type="email" placeholder="you@email.com" autoComplete="email" className={textInputCls} /></div>
        </FormField>
        <FormField label="Password" required>
          <div className={inp}>
            <input name="password" required type={showPw ? "text" : "password"} minLength={6} placeholder="Min. 6 characters" autoComplete="new-password" className={textInputCls} />
            <button type="button" onClick={() => setShowPw(p => !p)} className="text-[#1D1D1D]/30 hover:text-[#CF291D] transition-colors shrink-0">
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </FormField>
      </div>

      {/* ── Terms ── */}
      <label className="flex items-start gap-3 cursor-pointer pt-1">
        <div
          onClick={() => setAgreed(p => !p)}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
            agreed ? "bg-[#CF291D] border-[#CF291D]" : "border-[#BFBFBF] bg-[#ECECEC] dark:bg-[#111111]"
          }`}
        >
          {agreed && <CheckCircle2 size={12} className="text-white" />}
        </div>
        <span className="text-xs text-[#1D1D1D]/60 dark:text-white/40 leading-relaxed">
          I agree to the <span className="text-[#CF291D] font-semibold">Terms & Conditions</span> of ASROZ Educations. I confirm all information provided is accurate and truthful.
        </span>
      </label>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#CF291D]/10 border border-[#CF291D]/20 text-xs font-medium text-[#CF291D]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !agreed}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B50717] text-white text-sm font-semibold shadow-[4px_4px_12px_rgba(181,7,23,0.4)] hover:bg-[#CF291D] hover:shadow-[5px_5px_16px_rgba(207,41,29,0.45)] active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Submitting…" : "Submit Registration"}
      </button>
    </form>
  );
}
