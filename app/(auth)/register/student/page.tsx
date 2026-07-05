import Image from "next/image";
import Link from "next/link";
import StudentRegisterForm from "./StudentRegisterForm";

export default function StudentRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#CF291D]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#CF291D]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-40 p-3 rounded-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[6px_6px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.9)]">
            <Image src="/logo.png" alt="ASROZ Educations" width={1143} height={219} style={{ width: "100%", height: "auto" }} priority />
          </div>
        </div>

        <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.12),-5px_-5px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_24px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-lg">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#131313] dark:text-white">Student Registration</h1>
              <p className="text-xs text-[#1D1D1D]/45 dark:text-white/30 mt-0.5">
                Fill in your details — your parent / guardian can assist
              </p>
            </div>
          </div>
          <StudentRegisterForm />
        </div>

        <p className="text-center text-xs text-[#1D1D1D]/40 dark:text-white/25 mt-5">
          Already registered?{" "}
          <Link href="/login" className="text-[#CF291D] font-semibold hover:underline">Sign In</Link>
          {" · "}
          <Link href="/register/teacher" className="text-[#CF291D] font-semibold hover:underline">Register as Teacher</Link>
        </p>
      </div>
    </div>
  );
}
