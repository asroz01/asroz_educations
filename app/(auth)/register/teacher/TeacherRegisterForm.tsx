"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Upload, CheckCircle2 } from "lucide-react";
import { registerTeacher } from "@/app/actions/register";
import { FormField, FileInput, SectionHeading, inputCls, textInputCls } from "@/components/register/FormField";

export default function TeacherRegisterForm() {
  const router   = useRouter();
  const formRef  = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [showPw,  setShowPw]  = useState(false);
  const [agreed,  setAgreed]  = useState(false);

  // Live file label display
  const [nicFrontName, setNicFrontName] = useState("");
  const [nicBackName,  setNicBackName]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms & Conditions."); return; }
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result   = await registerTeacher(formData);

    setLoading(false);
    if (result.error) { setError(result.error); return; }
    router.push("/pending");
  }

  const inp = `${inputCls}`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

      {/* ── Personal Info ── */}
      <SectionHeading>Personal Information</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" required>
          <div className={inp}><input name="full_name" required placeholder="Mr. Perera" className={textInputCls} /></div>
        </FormField>
        <FormField label="Username" required>
          <div className={inp}><input name="username" required placeholder="mr_perera" className={textInputCls} /></div>
        </FormField>
        <FormField label="Mobile" required>
          <div className={inp}><input name="mobile" required type="tel" placeholder="07X XXX XXXX" className={textInputCls} /></div>
        </FormField>
        <FormField label="NIC Number" required>
          <div className={inp}><input name="nic_number" required placeholder="XXXXXXXXXV / XXXXXXXXXXXX" className={textInputCls} /></div>
        </FormField>
        <FormField label="Address" required>
          <div className={inp}><input name="address" required placeholder="No. 1, Main St, Colombo" className={textInputCls} /></div>
        </FormField>
        <FormField label="Experience (years)" required>
          <div className={inp}><input name="experience_years" required type="number" min="0" placeholder="5" className={textInputCls} /></div>
        </FormField>
      </div>

      {/* ── Professional Info ── */}
      <SectionHeading>Professional Details</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Education Qualification" required>
          <div className={inp}><input name="education_qualification" required placeholder="B.Sc. in Mathematics" className={textInputCls} /></div>
        </FormField>
        <FormField label="Current Company / School">
          <div className={inp}><input name="current_company" placeholder="ABC School" className={textInputCls} /></div>
        </FormField>
      </div>

      {/* ── NIC Images ── */}
      <SectionHeading>NIC / Identity Documents</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="NIC Front Image" required>
          <label className={`${inp} cursor-pointer`}>
            <input type="file" name="nic_front" accept="image/*" required className="sr-only"
              onChange={(e) => setNicFrontName(e.target.files?.[0]?.name ?? "")} />
            <Upload size={14} className="text-[#CF291D] shrink-0" />
            <span className="text-sm text-[#1D1D1D]/50 dark:text-white/30 flex-1 truncate">
              {nicFrontName || "Upload front of NIC…"}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#CF291D]/10 text-[#CF291D] shrink-0">Browse</span>
          </label>
        </FormField>
        <FormField label="NIC Back Image" required>
          <label className={`${inp} cursor-pointer`}>
            <input type="file" name="nic_back" accept="image/*" required className="sr-only"
              onChange={(e) => setNicBackName(e.target.files?.[0]?.name ?? "")} />
            <Upload size={14} className="text-[#CF291D] shrink-0" />
            <span className="text-sm text-[#1D1D1D]/50 dark:text-white/30 flex-1 truncate">
              {nicBackName || "Upload back of NIC…"}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#CF291D]/10 text-[#CF291D] shrink-0">Browse</span>
          </label>
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
          I agree to the <span className="text-[#CF291D] font-semibold">Terms & Conditions</span> of ASROZ Educations. I confirm all information provided is accurate.
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
