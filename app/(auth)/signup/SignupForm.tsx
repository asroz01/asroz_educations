"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const [fullName,  setFullName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [done,      setDone]      = useState(false);

  const inputBase = `
    w-full flex items-center gap-2.5 px-4 py-3 rounded-xl
    bg-[#ECECEC] dark:bg-[#111111]
    border border-[#BFBFBF]/60 dark:border-white/10
    shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-1px_-1px_4px_rgba(255,255,255,0.85)]
    dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)]
    focus-within:border-[#CF291D]/40
    focus-within:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),0_0_0_2px_rgba(207,41,29,0.12)]
    transition-all duration-200
  `;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "admin" },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (authError) {
      if (authError.message.toLowerCase().includes("invalid")) {
        setError("Email address is invalid or the domain cannot receive emails. Use a real email (e.g. Gmail) or disable 'Confirm email' in your Supabase Dashboard → Authentication → Providers → Email.");
      } else {
        setError(authError.message);
      }
      return;
    }

    setDone(true);
  }

  // ── Success state ─────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#131313] dark:text-white">Account created!</p>
          <p className="text-xs text-[#1D1D1D]/45 dark:text-white/30 mt-1 leading-relaxed">
            Check your email <span className="font-semibold text-[#131313] dark:text-white">{email}</span> for a confirmation link, then sign in.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 rounded-xl bg-[#B50717] text-white text-sm font-semibold shadow-[4px_4px_12px_rgba(181,7,23,0.4)] hover:bg-[#CF291D] transition-all duration-200"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full name */}
      <div>
        <label className="block text-xs font-semibold text-[#1D1D1D]/50 dark:text-white/35 mb-1.5 uppercase tracking-wider">
          Full Name
        </label>
        <div className={inputBase}>
          <User size={15} className="text-[#1D1D1D]/35 dark:text-white/25 shrink-0" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Admin User"
            required
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 outline-none"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-[#1D1D1D]/50 dark:text-white/35 mb-1.5 uppercase tracking-wider">
          Email
        </label>
        <div className={inputBase}>
          <Mail size={15} className="text-[#1D1D1D]/35 dark:text-white/25 shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@asroz.lk"
            required
            autoComplete="email"
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 outline-none"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-[#1D1D1D]/50 dark:text-white/35 mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <div className={inputBase}>
          <Lock size={15} className="text-[#1D1D1D]/35 dark:text-white/25 shrink-0" />
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            autoComplete="new-password"
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 outline-none"
          />
          <button type="button" onClick={() => setShowPw((p) => !p)} className="text-[#1D1D1D]/30 hover:text-[#CF291D] transition-colors shrink-0">
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-xs font-semibold text-[#1D1D1D]/50 dark:text-white/35 mb-1.5 uppercase tracking-wider">
          Confirm Password
        </label>
        <div className={inputBase}>
          <Lock size={15} className="text-[#1D1D1D]/35 dark:text-white/25 shrink-0" />
          <input
            type={showPw ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter password"
            required
            autoComplete="new-password"
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#CF291D]/10 border border-[#CF291D]/20 text-xs font-medium text-[#CF291D]">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full flex items-center justify-center gap-2
          py-3 rounded-xl mt-1
          bg-[#B50717] text-white text-sm font-semibold
          shadow-[4px_4px_12px_rgba(181,7,23,0.4)]
          hover:bg-[#CF291D] hover:shadow-[5px_5px_16px_rgba(207,41,29,0.45)]
          active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2)]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
