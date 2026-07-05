const CONFIG = {
  paid:    { label: "Paid",    cls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25" },
  pending: { label: "Pending", cls: "bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25"         },
  overdue: { label: "Overdue", cls: "bg-[#CF291D]/12 text-[#CF291D] border-[#CF291D]/25"                             },
};

export default function PaymentBadge({ status }: { status: "paid" | "pending" | "overdue" }) {
  const { label, cls } = CONFIG[status] ?? CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "paid" ? "bg-emerald-500" : status === "overdue" ? "bg-[#CF291D]" : "bg-amber-500"}`} />
      {label}
    </span>
  );
}
