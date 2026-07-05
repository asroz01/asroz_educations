"use client";

import { useState, useEffect } from "react";
import {
  X, UserPlus, User, Phone, MapPin, School, FileText,
  Upload, Users, CheckCircle2, Loader2,
} from "lucide-react";
import { addStudent, fetchClasses } from "@/app/actions/students";
import { FormField, SectionHeading, inputCls, textInputCls } from "@/components/register/FormField";

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ClassOption { id: string; name: string; stream: string | null; }

function validateMobile(v: string) {
  return /^0\d{9}$/.test(v.replace(/\s/g, ""));
}

// All form values as controlled state — survives step transitions
interface Fields {
  full_name: string; date_of_birth: string; gender: string;
  mobile: string; school_name: string; class_id: string; address: string;
  document_type: string; document_number: string;
  father_name: string; father_mobile: string;
  father_occupation: string; father_age: string;
  mother_name: string; mother_mobile: string;
}

const EMPTY: Fields = {
  full_name: "", date_of_birth: "", gender: "",
  mobile: "", school_name: "", class_id: "", address: "",
  document_type: "", document_number: "",
  father_name: "", father_mobile: "",
  father_occupation: "", father_age: "",
  mother_name: "", mother_mobile: "",
};

export default function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const [step,    setStep]    = useState<1 | 2 | 3>(1);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [agreed,  setAgreed]  = useState(false);
  const [done,    setDone]    = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [fields,  setFields]  = useState<Fields>(EMPTY);

  useEffect(() => {
    fetchClasses().then(setClasses);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function set(key: keyof Fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields(f => ({ ...f, [key]: e.target.value }));
  }

  // ── Validation ────────────────────────────────────────────────
  function validateStep(n: 1 | 2 | 3): Record<string, string> {
    const errs: Record<string, string> = {};
    if (n === 1) {
      if (!fields.full_name)                              errs.full_name     = "Full name is required";
      if (!fields.date_of_birth)                          errs.date_of_birth = "Date of birth is required";
      if (!fields.gender)                                 errs.gender        = "Gender is required";
      if (!fields.mobile)                                 errs.mobile        = "Mobile is required";
      else if (!validateMobile(fields.mobile))            errs.mobile        = "Enter a valid mobile (07XXXXXXXX)";
      if (!fields.school_name)                            errs.school_name   = "School name is required";
    }
    if (n === 2) {
      if (!fields.document_type)                          errs.document_type   = "Select a document type";
      if (!fields.document_number)                        errs.document_number = "Document number is required";
      if (!fields.father_name)                            errs.father_name     = "Father's name is required";
      if (!fields.father_mobile)                          errs.father_mobile   = "Father's mobile is required";
      else if (!validateMobile(fields.father_mobile))     errs.father_mobile   = "Enter a valid mobile";
      if (!fields.mother_name)                            errs.mother_name     = "Mother's name is required";
      if (!fields.mother_mobile)                          errs.mother_mobile   = "Mother's mobile is required";
      else if (!validateMobile(fields.mother_mobile))     errs.mother_mobile   = "Enter a valid mobile";
    }
    if (n === 3) {
      if (!agreed) errs.agreed = "You must confirm the details are correct";
    }
    return errs;
  }

  function nextStep() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => (s < 3 ? s + 1 : s) as 1 | 2 | 3);
  }

  // ── Submit — build FormData from state, not DOM ───────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const fd = new FormData();
    (Object.entries(fields) as [keyof Fields, string][]).forEach(([k, v]) => fd.set(k, v));
    if (docFile) fd.set("document_image", docFile);

    const result = await addStudent(fd);
    setLoading(false);

    if (result.error) { setErrors({ submit: result.error }); return; }
    setDone(true);
  }

  function reset() {
    setFields(EMPTY); setStep(1); setAgreed(false);
    setDocFile(null); setErrors({}); setDone(false);
  }

  const inp  = inputCls;
  const tinp = textInputCls;
  const err  = (k: string) => errors[k]
    ? <p className="text-[10px] text-[#CF291D] mt-1 font-medium">{errors[k]}</p>
    : null;

  const steps = [
    { n: 1, label: "Personal" },
    { n: 2, label: "Documents & Parents" },
    { n: 3, label: "Confirm" },
  ];

  // ── Success screen ────────────────────────────────────────────
  if (done) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center gap-4 py-10 text-center px-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center shadow-[4px_4px_12px_rgba(5,150,105,0.15)]">
            <CheckCircle2 size={30} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#131313] dark:text-white">Student Enrolled!</p>
            <p className="text-sm text-[#1D1D1D]/45 dark:text-white/30 mt-1">
              {fields.full_name} has been added and is now active.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={reset}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#131313] dark:text-white bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)] hover:text-[#CF291D] transition-all">
              Add Another
            </button>
            <button onClick={() => { onSuccess(); onClose(); }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#B50717] shadow-[3px_3px_8px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] transition-all">
              Done
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#BFBFBF]/30 dark:border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#CF291D] flex items-center justify-center shrink-0">
            <UserPlus size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#131313] dark:text-white">Add New Student</h2>
            <p className="text-[11px] text-[#1D1D1D]/40 dark:text-white/30">Admin enrollment — auto-approved</p>
          </div>
        </div>
        <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-xl text-[#1D1D1D]/40 dark:text-white/30 hover:text-[#CF291D] hover:bg-[#BFBFBF]/20 transition-all">
          <X size={16} />
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-[#BFBFBF]/20 dark:border-white/6">
        {steps.map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
              step === n ? "bg-[#CF291D] text-white shadow-[2px_2px_6px_rgba(207,41,29,0.35)]"
              : step > n  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              : "text-[#1D1D1D]/40 dark:text-white/25"
            }`}>
              {step > n ? <CheckCircle2 size={11} /> : <span>{n}</span>}
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-6 h-px bg-[#BFBFBF]/50 dark:bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit}>
        <div className="overflow-y-auto max-h-[55vh] px-6 py-5 space-y-4">

          {/* ── Step 1 ── */}
          <div className={step === 1 ? "" : "hidden"}>
            <SectionHeading>Student Details</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <FormField label="Full Name" required>
                <div className={inp}><User size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input placeholder="Full name" value={fields.full_name} onChange={set("full_name")} className={tinp} />
                </div>{err("full_name")}
              </FormField>
              <FormField label="Date of Birth" required>
                <div className={inp}>
                  <input type="date" value={fields.date_of_birth} onChange={set("date_of_birth")} className={tinp} />
                </div>{err("date_of_birth")}
              </FormField>
              <FormField label="Gender" required>
                <div className={inp}>
                  <select value={fields.gender} onChange={set("gender")} className={`${tinp} w-full`}>
                    <option value="">Select…</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>{err("gender")}
              </FormField>
              <FormField label="Mobile" required>
                <div className={inp}><Phone size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input type="tel" placeholder="07X XXX XXXX" value={fields.mobile} onChange={set("mobile")} className={tinp} />
                </div>{err("mobile")}
              </FormField>
              <FormField label="School Name" required>
                <div className={inp}><School size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input placeholder="ABC National School" value={fields.school_name} onChange={set("school_name")} className={tinp} />
                </div>{err("school_name")}
              </FormField>
              <FormField label="Class / Grade">
                <div className={inp}>
                  <select value={fields.class_id} onChange={set("class_id")} className={`${tinp} w-full`}>
                    <option value="">Assign later…</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}{c.stream ? ` — ${c.stream}` : ""}</option>)}
                  </select>
                </div>
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Address">
                  <div className={inp}><MapPin size={14} className="text-[#1D1D1D]/35 shrink-0" />
                    <input placeholder="No. 1, Main St, Colombo" value={fields.address} onChange={set("address")} className={tinp} />
                  </div>
                </FormField>
              </div>
            </div>
          </div>

          {/* ── Step 2 ── */}
          <div className={step === 2 ? "" : "hidden"}>
            <SectionHeading>Identity Document</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <FormField label="Document Type" required>
                <div className={inp}>
                  <select value={fields.document_type} onChange={set("document_type")} className={`${tinp} w-full`}>
                    <option value="">Select…</option>
                    <option value="birth_certificate">Birth Certificate</option>
                    <option value="postal_id">Postal ID</option>
                    <option value="nic">NIC</option>
                  </select>
                </div>{err("document_type")}
              </FormField>
              <FormField label="Document Number" required>
                <div className={inp}><FileText size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input placeholder="Certificate / NIC number" value={fields.document_number} onChange={set("document_number")} className={tinp} />
                </div>{err("document_number")}
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Document Image">
                  <label className={`${inp} cursor-pointer`}>
                    <input type="file" accept="image/*,.pdf" className="sr-only"
                      onChange={e => setDocFile(e.target.files?.[0] ?? null)} />
                    <Upload size={14} className="text-[#CF291D] shrink-0" />
                    <span className="text-sm text-[#1D1D1D]/45 flex-1 truncate">
                      {docFile?.name || "Upload image or PDF…"}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#CF291D]/10 text-[#CF291D] shrink-0">Browse</span>
                  </label>
                </FormField>
              </div>
            </div>

            <SectionHeading>Parent / Guardian Details</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <FormField label="Father's Name" required>
                <div className={inp}><User size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input placeholder="Father's full name" value={fields.father_name} onChange={set("father_name")} className={tinp} />
                </div>{err("father_name")}
              </FormField>
              <FormField label="Father's Mobile" required>
                <div className={inp}><Phone size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input type="tel" placeholder="07X XXX XXXX" value={fields.father_mobile} onChange={set("father_mobile")} className={tinp} />
                </div>{err("father_mobile")}
              </FormField>
              <FormField label="Father's Occupation">
                <div className={inp}>
                  <input placeholder="Engineer" value={fields.father_occupation} onChange={set("father_occupation")} className={tinp} />
                </div>
              </FormField>
              <FormField label="Father's Age">
                <div className={inp}>
                  <input type="number" min="18" max="99" placeholder="45" value={fields.father_age} onChange={set("father_age")} className={tinp} />
                </div>
              </FormField>
              <FormField label="Mother's Name" required>
                <div className={inp}><Users size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input placeholder="Mother's full name" value={fields.mother_name} onChange={set("mother_name")} className={tinp} />
                </div>{err("mother_name")}
              </FormField>
              <FormField label="Mother's Mobile" required>
                <div className={inp}><Phone size={14} className="text-[#1D1D1D]/35 shrink-0" />
                  <input type="tel" placeholder="07X XXX XXXX" value={fields.mother_mobile} onChange={set("mother_mobile")} className={tinp} />
                </div>{err("mother_mobile")}
              </FormField>
            </div>
          </div>

          {/* ── Step 3 ── */}
          <div className={step === 3 ? "" : "hidden"}>
            <SectionHeading>Review & Confirm</SectionHeading>
            <div className="space-y-3 mt-3">
              <div className="p-4 rounded-2xl bg-[#ECECEC] dark:bg-[#111111] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]">
                <p className="text-xs font-semibold text-[#1D1D1D]/50 dark:text-white/30 uppercase tracking-wider mb-3">Summary</p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                  {[
                    ["Name",      fields.full_name],
                    ["School",    fields.school_name],
                    ["DOB",       fields.date_of_birth],
                    ["Mobile",    fields.mobile],
                    ["Doc Type",  fields.document_type.replace(/_/g, " ")],
                    ["Doc No.",   fields.document_number],
                    ["Father",    fields.father_name],
                    ["Mother",    fields.mother_name],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[#1D1D1D]/40 dark:text-white/25">{label}</dt>
                      <dd className="font-semibold text-[#131313] dark:text-white capitalize">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreed(p => !p)}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                    agreed ? "bg-[#CF291D] border-[#CF291D]" : "border-[#BFBFBF] bg-[#ECECEC] dark:bg-[#111111]"
                  }`}
                >
                  {agreed && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className="text-xs text-[#1D1D1D]/60 dark:text-white/40 leading-relaxed">
                  I confirm all details are accurate and this student is being enrolled with admin authority.
                </span>
              </label>
              {err("agreed")}
              {errors.submit && (
                <div className="px-4 py-3 rounded-xl bg-[#CF291D]/10 border border-[#CF291D]/20 text-xs font-medium text-[#CF291D]">
                  {errors.submit}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BFBFBF]/30 dark:border-white/8">
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep(s => (s - 1) as 1 | 2 | 3)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D] transition-all"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#1D1D1D]/30 dark:text-white/20">Step {step} of 3</span>
            {step < 3 ? (
              <button type="button" onClick={nextStep}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#B50717] shadow-[2px_2px_6px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] transition-all">
                Next →
              </button>
            ) : (
              <button type="submit" disabled={loading || !agreed}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#B50717] shadow-[2px_2px_6px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
                {loading ? "Enrolling…" : "Enroll Student"}
              </button>
            )}
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        className="relative w-full max-w-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[12px_12px_32px_rgba(0,0,0,0.18),-6px_-6px_20px_rgba(255,255,255,0.7)] dark:shadow-[12px_12px_32px_rgba(0,0,0,0.7)]"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
