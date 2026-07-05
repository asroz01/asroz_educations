import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, CheckCircle2 } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#CF291D]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm text-center">
        <div className="flex justify-center mb-8">
          <div className="w-44 p-4 rounded-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[6px_6px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.9)]">
            <Image src="/logo.png" alt="ASROZ Educations" width={1143} height={219} style={{ width: "100%", height: "auto" }} priority />
          </div>
        </div>

        <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.12),-5px_-5px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_24px_rgba(0,0,0,0.6)]">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shadow-[4px_4px_12px_rgba(245,158,11,0.2),-2px_-2px_8px_rgba(255,255,255,0.8)]">
              <Clock size={30} className="text-amber-500" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-[#131313] dark:text-white mb-2">
            Registration Submitted!
          </h1>
          <p className="text-sm text-[#1D1D1D]/50 dark:text-white/35 leading-relaxed mb-6">
            Your registration is successful. Please wait for Admin approval to access the ASROZ Educations portal.
          </p>

          {/* Steps */}
          <div className="space-y-3 text-left mb-6">
            {[
              { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-500/10", text: "Registration form submitted" },
              { icon: Mail,         color: "text-blue-600 bg-blue-500/10",      text: "Check your email to confirm your address" },
              { icon: Clock,        color: "text-amber-500 bg-amber-500/10",    text: "Waiting for admin review & approval" },
            ].map(({ icon: Icon, color, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color.split(" ")[1]}`}>
                  <Icon size={15} className={color.split(" ")[0]} />
                </div>
                <p className="text-xs text-[#1D1D1D]/60 dark:text-white/40">{text}</p>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            You will receive an email once your account is approved. This typically takes 1–2 business days.
          </div>
        </div>

        <Link href="/login" className="inline-block mt-5 text-xs text-[#CF291D] font-semibold hover:underline">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
