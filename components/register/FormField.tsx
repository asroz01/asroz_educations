"use client";

import { type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#1D1D1D]/50 dark:text-white/35 uppercase tracking-wider">
        {label}{required && <span className="text-[#CF291D] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls = `
  w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl
  bg-[#ECECEC] dark:bg-[#111111]
  border border-[#BFBFBF]/60 dark:border-white/10
  shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]
  dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)]
  focus-within:border-[#CF291D]/40
  focus-within:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07),0_0_0_2px_rgba(207,41,29,0.1)]
  transition-all duration-200
`;

export const textInputCls =
  "flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 dark:placeholder:text-white/20 outline-none";

interface FileInputProps {
  name: string;
  accept?: string;
  required?: boolean;
}

export function FileInput({ name, accept = "image/*,.pdf", required }: FileInputProps) {
  return (
    <label className={`${inputCls} cursor-pointer`}>
      <input
        type="file"
        name={name}
        accept={accept}
        required={required}
        className="sr-only"
      />
      <span className="text-sm text-[#1D1D1D]/40 dark:text-white/25 flex-1">
        Click to upload file…
      </span>
      <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-[#CF291D]/10 text-[#CF291D]">
        Browse
      </span>
    </label>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#CF291D]">{children}</span>
      <div className="flex-1 h-px bg-[#CF291D]/20" />
    </div>
  );
}
