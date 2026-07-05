import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SignupForm from "./SignupForm";
import Image from "next/image";
import Link from "next/link";

export default async function SignupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#CF291D]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#CF291D]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-48 p-4 rounded-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[6px_6px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5)]">
            <Image
              src="/logo.png"
              alt="ASROZ Educations"
              width={1143}
              height={219}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-[8px_8px_24px_rgba(0,0,0,0.12),-5px_-5px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_24px_rgba(0,0,0,0.6)]">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#131313] dark:text-white">Create account</h1>
            <p className="text-sm text-[#1D1D1D]/45 dark:text-white/30 mt-1">
              Set up your ASROZ Educations account
            </p>
          </div>
          <SignupForm />
        </div>

        {/* Back to login */}
        <p className="text-center text-xs text-[#1D1D1D]/40 dark:text-white/25 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#CF291D] font-semibold hover:underline">
            Sign In
          </Link>
        </p>

        <p className="text-center text-xs text-[#1D1D1D]/25 dark:text-white/15 mt-2">
          ASROZ Educations · Secure Portal · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
