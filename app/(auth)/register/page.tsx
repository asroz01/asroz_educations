import Image from "next/image";
import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#CF291D]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#CF291D]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="w-44 p-4 rounded-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[6px_6px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.9)]">
            <Image src="/logo.png" alt="ASROZ Educations" width={1143} height={219} style={{ width: "100%", height: "auto" }} priority />
          </div>
        </div>

        <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.12),-5px_-5px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_24px_rgba(0,0,0,0.6)]">
          <h1 className="text-xl font-bold text-[#131313] dark:text-white mb-1">Create Account</h1>
          <p className="text-sm text-[#1D1D1D]/45 dark:text-white/30 mb-7">Select your role to continue</p>

          <div className="space-y-3">
            <Link
              href="/register/teacher"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/40 dark:border-white/8 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.5)] hover:border-[#CF291D]/40 hover:shadow-[5px_5px_14px_rgba(207,41,29,0.12),-3px_-3px_8px_rgba(255,255,255,0.95)] transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-[#CF291D] flex items-center justify-center shrink-0 shadow-[3px_3px_8px_rgba(207,41,29,0.4)]">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#131313] dark:text-white">Teacher</p>
                <p className="text-xs text-[#1D1D1D]/45 dark:text-white/30 mt-0.5">Join as an educator</p>
              </div>
              <ArrowRight size={16} className="text-[#1D1D1D]/30 dark:text-white/20 group-hover:text-[#CF291D] group-hover:translate-x-0.5 transition-all duration-200" />
            </Link>

            <Link
              href="/register/student"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/40 dark:border-white/8 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.5)] hover:border-blue-500/40 hover:shadow-[5px_5px_14px_rgba(37,99,235,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)] transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-[3px_3px_8px_rgba(37,99,235,0.4)]">
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#131313] dark:text-white">Student</p>
                <p className="text-xs text-[#1D1D1D]/45 dark:text-white/30 mt-0.5">Enroll in ASROZ Educations</p>
              </div>
              <ArrowRight size={16} className="text-[#1D1D1D]/30 dark:text-white/20 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200" />
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#1D1D1D]/40 dark:text-white/25 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#CF291D] font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
