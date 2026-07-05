"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface LoginFormProps {
  next?: string;
}

export default function LoginForm({ next }: LoginFormProps) {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(next ?? "/dashboard");
    router.refresh();
  }

  const inputBase = `
    w-full flex items-center gap-2.5 px-4 py-3 rounded-xl
    bg-[#ECECEC] dark:bg-[#111111]
    border border-[#BFBFBF]/60 dark:border-white/10
    shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-1px_-1px_4px_rgba(255,255,255,0.85)]
    dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-1px_-1px_3px_rgba(255,255,255,0.02)]
    focus-within:border-[#CF291D]/40
    focus-within:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-1px_-1px_4px_rgba(255,255,255,0.9),0_0_0_2px_rgba(207,41,29,0.12)]
    transition-all duration-200
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="you@asroz.lk"
            required
            autoComplete="email"
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 dark:placeholder:text-white/20 outline-none"
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 dark:placeholder:text-white/20 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="text-[#1D1D1D]/30 dark:text-white/20 hover:text-[#CF291D] transition-colors shrink-0"
          >
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
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
          py-3 rounded-xl mt-2
          bg-[#B50717] text-white text-sm font-semibold
          shadow-[4px_4px_12px_rgba(181,7,23,0.4),-2px_-2px_6px_rgba(255,100,100,0.1)]
          hover:bg-[#CF291D] hover:shadow-[5px_5px_16px_rgba(207,41,29,0.45)]
          active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2)]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
