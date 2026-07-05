"use client";

import { useState } from "react";
import { Mail, User, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Role = "teacher" | "student";

export default function InviteForm() {
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [role,     setRole]     = useState<Role>("teacher");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

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
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Use signUp with email confirmation — no service role key needed on client.
    // Admin assigns role via app_metadata; for production use a Server Action
    // with the service role key to call supabase.auth.admin.createUser().
    const { error: authError } = await supabase.auth.signUp({
      email,
      password: crypto.randomUUID(), // random; user resets via email link
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
    setFullName("");
    setEmail("");
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 size={24} className="text-emerald-600" />
        </div>
        <p className="text-sm font-semibold text-[#131313] dark:text-white">Invitation sent!</p>
        <p className="text-xs text-[#1D1D1D]/45 dark:text-white/30">
          {email} will receive a setup link shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs font-semibold text-[#CF291D] hover:underline"
        >
          Invite another
        </button>
      </div>
    );
  }

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
            placeholder="Mr. Perera"
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
            placeholder="teacher@asroz.lk"
            required
            className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 outline-none"
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-xs font-semibold text-[#1D1D1D]/50 dark:text-white/35 mb-1.5 uppercase tracking-wider">
          Role
        </label>
        <div className="flex gap-2">
          {(["teacher", "student"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150 ${
                role === r
                  ? "bg-[#CF291D] text-white shadow-[3px_3px_8px_rgba(207,41,29,0.35)]"
                  : "bg-[#ECECEC] dark:bg-[#111111] text-[#1D1D1D]/60 dark:text-white/40 shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D]"
              }`}
            >
              <ShieldCheck size={13} />
              {r}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#CF291D]/10 border border-[#CF291D]/20 text-xs font-medium text-[#CF291D]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full flex items-center justify-center gap-2
          py-3 rounded-xl
          bg-[#B50717] text-white text-sm font-semibold
          shadow-[4px_4px_12px_rgba(181,7,23,0.4)]
          hover:bg-[#CF291D] hover:shadow-[5px_5px_16px_rgba(207,41,29,0.45)]
          active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2)]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Sending invite…" : "Send Invitation"}
      </button>
    </form>
  );
}
