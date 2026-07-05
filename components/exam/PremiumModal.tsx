"use client";

import { X, Crown, Sparkles } from "lucide-react";

interface PremiumModalProps {
  onClose: () => void;
  onPay: () => void;
}

export default function PremiumModal({ onClose, onPay }: PremiumModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        className="relative w-full max-w-sm bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[12px_12px_32px_rgba(0,0,0,0.18),-6px_-6px_20px_rgba(255,255,255,0.7)] dark:shadow-[12px_12px_32px_rgba(0,0,0,0.7)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#B50717] via-[#CF291D] to-amber-500" />

        <div className="p-7 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-[#1D1D1D]/40 hover:text-[#CF291D] hover:bg-[#BFBFBF]/20 transition-all">
            <X size={15} />
          </button>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[4px_4px_14px_rgba(245,158,11,0.4)]">
              <Crown size={28} className="text-white" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#131313] dark:text-white mb-1">Premium Feature</h2>
          <p className="text-sm text-[#1D1D1D]/50 dark:text-white/35 mb-5 leading-relaxed">
            Upload your own school logo and branding to exam papers.
          </p>

          <div className="space-y-2 mb-6 text-left">
            {[
              "Custom school logo on all exam papers",
              "Branded header design",
              "Unlimited logo changes",
              "High-resolution print quality",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-[#1D1D1D]/60 dark:text-white/40">
                <Sparkles size={12} className="text-amber-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <div className="bg-[#ECECEC] dark:bg-[#111111] rounded-2xl p-4 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08),inset_-1px_-1px_4px_rgba(255,255,255,0.85)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4)] mb-5">
            <p className="text-2xl font-bold text-[#131313] dark:text-white">LKR 500</p>
            <p className="text-xs text-[#1D1D1D]/40 dark:text-white/25 mt-0.5">One-time unlock · Lifetime access</p>
          </div>

          <button
            onClick={onPay}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#B50717] shadow-[4px_4px_12px_rgba(181,7,23,0.4)] hover:bg-[#CF291D] hover:shadow-[5px_5px_16px_rgba(207,41,29,0.45)] transition-all duration-200"
          >
            Unlock for LKR 500 →
          </button>
          <p className="text-[10px] text-[#1D1D1D]/30 dark:text-white/20 mt-2">
            Secured via PayHere · LKR only
          </p>
        </div>
      </div>
    </div>
  );
}
