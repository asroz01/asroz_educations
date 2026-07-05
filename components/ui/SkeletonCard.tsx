export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] overflow-hidden shadow-[5px_5px_14px_rgba(0,0,0,0.08),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.04)] ${className}`}>
      <div className="animate-pulse p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-3 w-24 rounded-lg bg-[#BFBFBF]/60 dark:bg-white/10" />
          <div className="h-8 w-8 rounded-xl bg-[#BFBFBF]/60 dark:bg-white/10" />
        </div>
        <div className="h-7 w-32 rounded-lg bg-[#BFBFBF]/60 dark:bg-white/10" />
        <div className="h-2.5 w-20 rounded-lg bg-[#BFBFBF]/40 dark:bg-white/8" />
        <div className="h-2.5 w-28 rounded-lg bg-[#BFBFBF]/40 dark:bg-white/8" />
      </div>
    </div>
  );
}

export function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] overflow-hidden shadow-[5px_5px_14px_rgba(0,0,0,0.08),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.04)] ${className}`}>
      <div className="animate-pulse p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <div className="h-3.5 w-36 rounded-lg bg-[#BFBFBF]/60 dark:bg-white/10" />
            <div className="h-2.5 w-24 rounded-lg bg-[#BFBFBF]/40 dark:bg-white/8" />
          </div>
          <div className="h-6 w-12 rounded-lg bg-[#BFBFBF]/40 dark:bg-white/8" />
        </div>
        {/* Fake bar chart */}
        <div className="flex items-end gap-2 h-40 pt-4">
          {[65, 80, 45, 90, 55, 75, 60].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-[#BFBFBF]/40 dark:bg-white/8"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#BFBFBF]/60 dark:bg-white/10" />
              <div className="h-2.5 w-12 rounded-lg bg-[#BFBFBF]/40 dark:bg-white/8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-[#BFBFBF]/50 dark:bg-white/10 shrink-0 animate-pulse" />
      <div className="flex-1 space-y-1.5 animate-pulse">
        <div className="h-3 w-3/4 rounded-lg bg-[#BFBFBF]/50 dark:bg-white/10" />
        <div className="h-2.5 w-1/2 rounded-lg bg-[#BFBFBF]/35 dark:bg-white/8" />
      </div>
    </div>
  );
}
