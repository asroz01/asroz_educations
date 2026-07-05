"use client";

import {
  useReactTable, getCoreRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  Download, Trash2, CheckSquare, MoreHorizontal,
  ChevronLeft, ChevronRight, UserPlus, Filter, X,
} from "lucide-react";
import PaymentBadge from "./PaymentBadge";
import type { EnrollmentRow, EnrollmentFilters } from "@/supabase/queries/enrollmentQueries";
import { updatePaymentStatus, deleteStudent, bulkUpdatePaymentStatus } from "@/app/actions/students";
import { exportToCsv } from "@/utils/exportCsv";
import AddStudentModal from "@/components/dashboard/AddStudentModal";

interface Props {
  initialRows: EnrollmentRow[];
  total:       number;
  filters:     EnrollmentFilters;
  classes:     { id: string; name: string; stream: string | null }[];
}

type PaymentStatus = "paid" | "pending" | "overdue";

// ── Debounce hook ─────────────────────────────────────────────
function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function EnrollmentTable({ initialRows, total, filters, classes }: Props) {
  const router          = useRouter();
  const pathname        = usePathname();
  const searchParams    = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local UI state
  const [searchInput,    setSearchInput]    = useState(filters.search);
  const [rowSelection,   setRowSelection]   = useState<Record<string, boolean>>({});
  const [actionMenu,     setActionMenu]     = useState<string | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  // ── URL param helpers ─────────────────────────────────────────
  const pushParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    // Reset to page 1 on filter change (unless changing page)
    if (!("page" in updates)) params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }, [pathname, router, searchParams]);

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      pushParams({ search: debouncedSearch });
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close action menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setActionMenu(null);
      }
    }
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  // ── Sorting ───────────────────────────────────────────────────
  const sorting: SortingState = filters.sortField
    ? [{ id: filters.sortField, desc: filters.sortDir === "desc" }]
    : [];

  function handleSort(field: string) {
    const isActive = filters.sortField === field;
    pushParams({
      sort: field,
      dir:  isActive && filters.sortDir === "desc" ? "asc" : "desc",
    });
  }

  function SortIcon({ field }: { field: string }) {
    if (filters.sortField !== field) return <ChevronsUpDown size={12} className="opacity-30" />;
    return filters.sortDir === "asc"
      ? <ChevronUp size={12} className="text-[#CF291D]" />
      : <ChevronDown size={12} className="text-[#CF291D]" />;
  }

  // ── Row actions ───────────────────────────────────────────────
  async function handlePaymentChange(id: string, status: PaymentStatus) {
    await updatePaymentStatus(id, status);
    setActionMenu(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this student? They will no longer appear in the enrollment list.")) return;
    await deleteStudent(id);
    setActionMenu(null);
    router.refresh();
  }

  // ── Bulk actions ──────────────────────────────────────────────
  const selectedIds = Object.entries(rowSelection)
    .filter(([, v]) => v)
    .map(([id]) => id);

  async function handleBulkStatus(status: PaymentStatus) {
    if (!selectedIds.length) return;
    await bulkUpdatePaymentStatus(selectedIds, status);
    setRowSelection({});
    router.refresh();
  }

  function handleExport() {
    exportToCsv(initialRows, `enrollment-${new Date().toISOString().split("T")[0]}.csv`);
  }

  // ── TanStack Table ────────────────────────────────────────────
  const columns: ColumnDef<EnrollmentRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input type="checkbox" className="accent-[#CF291D] w-3.5 h-3.5"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()} />
      ),
      cell: ({ row }) => (
        <input type="checkbox" className="accent-[#CF291D] w-3.5 h-3.5"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()} />
      ),
      size: 36,
    },
    {
      accessorKey: "full_name",
      header: () => (
        <button onClick={() => handleSort("full_name")} className="flex items-center gap-1 font-semibold hover:text-[#CF291D] transition-colors">
          Student <SortIcon field="full_name" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-[#131313] dark:text-white text-sm">{row.original.full_name}</p>
          {row.original.guardian_name && (
            <p className="text-[11px] text-[#1D1D1D]/40 dark:text-white/25 mt-0.5">
              Guardian: {row.original.guardian_name}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "class_name",
      header: () => (
        <button onClick={() => handleSort("class_name")} className="flex items-center gap-1 font-semibold hover:text-[#CF291D] transition-colors">
          Class <SortIcon field="class_name" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-[#131313] dark:text-white">{row.original.class_name ?? "—"}</p>
          {row.original.stream && (
            <p className="text-[11px] text-[#1D1D1D]/35 dark:text-white/25">{row.original.stream}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "enrolled_at",
      header: () => (
        <button onClick={() => handleSort("enrolled_at")} className="flex items-center gap-1 font-semibold hover:text-[#CF291D] transition-colors">
          Enrolled <SortIcon field="enrolled_at" />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-[#1D1D1D]/70 dark:text-white/50 tabular-nums">
          {new Date(getValue() as string).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      accessorKey: "payment_status",
      header: () => (
        <button onClick={() => handleSort("payment_status")} className="flex items-center gap-1 font-semibold hover:text-[#CF291D] transition-colors">
          Payment <SortIcon field="payment_status" />
        </button>
      ),
      cell: ({ getValue }) => (
        <PaymentBadge status={getValue() as PaymentStatus} />
      ),
    },
    {
      accessorKey: "outstanding_balance",
      header: () => <span className="font-semibold">Balance</span>,
      cell: ({ getValue }) => {
        const val = getValue() as number;
        return (
          <span className={`text-sm font-semibold tabular-nums ${val > 0 ? "text-[#CF291D]" : "text-emerald-600"}`}>
            {val > 0 ? `LKR ${val.toLocaleString()}` : "—"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="font-semibold">Actions</span>,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="relative" ref={actionMenu === id ? actionRef : null}>
            <button
              onClick={() => setActionMenu(prev => prev === id ? null : id)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-[#1D1D1D]/40 dark:text-white/30 hover:bg-[#BFBFBF]/30 dark:hover:bg-white/8 hover:text-[#CF291D] transition-all"
            >
              <MoreHorizontal size={15} />
            </button>
            {actionMenu === id && (
              <div className="absolute right-0 top-full mt-1 w-44 z-50 bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-xl border border-[#BFBFBF]/40 dark:border-white/10 shadow-[6px_6px_18px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_18px_rgba(0,0,0,0.5)] overflow-hidden">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#1D1D1D]/30 dark:text-white/20">Set Payment</p>
                {(["paid", "pending", "overdue"] as PaymentStatus[]).map(s => (
                  <button key={s} onClick={() => handlePaymentChange(id, s)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#131313] dark:text-white hover:bg-[#BFBFBF]/25 dark:hover:bg-white/6 capitalize transition-colors">
                    Mark as {s}
                  </button>
                ))}
                <div className="border-t border-[#BFBFBF]/30 dark:border-white/8">
                  <button onClick={() => handleDelete(id)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#CF291D] hover:bg-[#CF291D]/8 transition-colors flex items-center gap-2">
                    <Trash2 size={12} /> Archive Student
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
      size: 60,
    },
  ];

  const table = useReactTable({
    data:             initialRows,
    columns,
    state:            { rowSelection, sorting },
    getRowId:         (row) => row.id,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel:  getCoreRowModel(),
    manualPagination: true,
    manualSorting:    true,
    manualFiltering:  true,
  });

  // ── Pagination ────────────────────────────────────────────────
  const totalPages = Math.ceil(total / filters.pageSize);

  // ── Active filter count ────────────────────────────────────────
  const activeFilters = [filters.classId, filters.paymentStatus, filters.month].filter(Boolean).length;

  return (
    <>
      <div className="space-y-4">
        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#131313] dark:text-white">Enrollment</h1>
            <p className="text-sm text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">
              {total.toLocaleString()} active student{total !== 1 ? "s" : ""}
              {isPending && <span className="ml-2 text-[#CF291D]">Loading…</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#CF291D]/10 border border-[#CF291D]/20 text-xs font-semibold text-[#CF291D]">
                <CheckSquare size={13} />
                {selectedIds.length} selected
                <select
                  onChange={e => handleBulkStatus(e.target.value as PaymentStatus)}
                  defaultValue=""
                  className="ml-1 bg-transparent outline-none text-xs text-[#CF291D] cursor-pointer"
                >
                  <option value="" disabled>Bulk status…</option>
                  <option value="paid">Mark Paid</option>
                  <option value="pending">Mark Pending</option>
                  <option value="overdue">Mark Overdue</option>
                </select>
              </div>
            )}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1D1D1D]/60 dark:text-white/40 bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.4)] hover:text-[#CF291D] transition-all"
            >
              <Download size={13} /> Export CSV
            </button>
            <button
              onClick={() => setShowAddStudent(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#B50717] shadow-[2px_2px_6px_rgba(181,7,23,0.35)] hover:bg-[#CF291D] transition-all"
            >
              <UserPlus size={13} /> Add Student
            </button>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#ECECEC] dark:bg-[#1a1a1a] shadow-[3px_3px_8px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.4)]">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/60 dark:border-white/10 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] focus-within:border-[#CF291D]/40 transition-all">
            <Search size={14} className="text-[#1D1D1D]/35 dark:text-white/25 shrink-0" />
            <input
              type="text"
              placeholder="Search by name…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#131313] dark:text-white placeholder:text-[#1D1D1D]/30 dark:placeholder:text-white/20 outline-none"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); pushParams({ search: null }); }}>
                <X size={13} className="text-[#1D1D1D]/30 hover:text-[#CF291D]" />
              </button>
            )}
          </div>

          {/* Class filter */}
          <select
            value={filters.classId}
            onChange={e => pushParams({ class_id: e.target.value || null })}
            className="px-3 py-2 rounded-xl text-sm bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/60 dark:border-white/10 text-[#131313] dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] focus:border-[#CF291D]/40 outline-none transition-all"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Payment status filter */}
          <select
            value={filters.paymentStatus}
            onChange={e => pushParams({ status: e.target.value || null })}
            className="px-3 py-2 rounded-xl text-sm bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/60 dark:border-white/10 text-[#131313] dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] focus:border-[#CF291D]/40 outline-none transition-all"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Month filter */}
          <input
            type="month"
            value={filters.month}
            onChange={e => pushParams({ month: e.target.value || null })}
            className="px-3 py-2 rounded-xl text-sm bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/60 dark:border-white/10 text-[#131313] dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)] focus:border-[#CF291D]/40 outline-none transition-all"
          />

          {/* Clear filters */}
          {activeFilters > 0 && (
            <button
              onClick={() => pushParams({ class_id: null, status: null, month: null, search: null })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#CF291D] bg-[#CF291D]/10 border border-[#CF291D]/20 hover:bg-[#CF291D]/15 transition-all"
            >
              <Filter size={12} />
              Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-[5px_5px_14px_rgba(0,0,0,0.09),-3px_-3px_8px_rgba(255,255,255,0.95)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id} className="border-b border-[#BFBFBF]/30 dark:border-white/8">
                    {hg.headers.map(header => (
                      <th
                        key={header.id}
                        style={{ width: header.column.getSize() !== 150 ? header.column.getSize() : undefined }}
                        className="px-4 py-3 text-left text-[11px] text-[#1D1D1D]/45 dark:text-white/30 whitespace-nowrap"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-[#BFBFBF]/15 dark:divide-white/6">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#BFBFBF]/20 dark:bg-white/6 flex items-center justify-center">
                          <Search size={22} className="text-[#1D1D1D]/25 dark:text-white/20" />
                        </div>
                        <p className="text-sm font-semibold text-[#131313] dark:text-white">No students found</p>
                        <p className="text-xs text-[#1D1D1D]/40 dark:text-white/25">
                          {activeFilters > 0 || filters.search
                            ? "Try adjusting your filters or search term"
                            : "Add your first student using the button above"}
                        </p>
                        {(activeFilters > 0 || filters.search) && (
                          <button
                            onClick={() => pushParams({ class_id: null, status: null, month: null, search: null })}
                            className="mt-1 text-xs font-semibold text-[#CF291D] hover:underline"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#BFBFBF]/15 dark:hover:bg-white/4 transition-colors ${row.getIsSelected() ? "bg-[#CF291D]/5 dark:bg-[#CF291D]/10" : ""}`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#BFBFBF]/25 dark:border-white/8">
            <p className="text-xs text-[#1D1D1D]/40 dark:text-white/25">
              Showing {Math.min((filters.page - 1) * filters.pageSize + 1, total)}–{Math.min(filters.page * filters.pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => pushParams({ page: String(filters.page - 1) })}
                disabled={filters.page <= 1}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-[#1D1D1D]/50 dark:text-white/35 bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] disabled:opacity-35 hover:text-[#CF291D] transition-all"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = totalPages <= 7 ? i + 1
                  : filters.page <= 4 ? i + 1
                  : filters.page >= totalPages - 3 ? totalPages - 6 + i
                  : filters.page - 3 + i;
                return (
                  <button
                    key={p}
                    onClick={() => pushParams({ page: String(p) })}
                    className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      p === filters.page
                        ? "bg-[#CF291D] text-white shadow-[2px_2px_6px_rgba(207,41,29,0.4)]"
                        : "text-[#1D1D1D]/50 dark:text-white/35 bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] hover:text-[#CF291D]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => pushParams({ page: String(filters.page + 1) })}
                disabled={filters.page >= totalPages}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-[#1D1D1D]/50 dark:text-white/35 bg-[#ECECEC] dark:bg-[#111111] shadow-[2px_2px_5px_rgba(0,0,0,0.08),-1px_-1px_3px_rgba(255,255,255,0.85)] disabled:opacity-35 hover:text-[#CF291D] transition-all"
              >
                <ChevronRight size={14} />
              </button>

              <select
                value={filters.pageSize}
                onChange={e => pushParams({ per_page: e.target.value, page: "1" })}
                className="ml-2 px-2 py-1 rounded-lg text-xs bg-[#ECECEC] dark:bg-[#111111] border border-[#BFBFBF]/50 dark:border-white/10 text-[#131313] dark:text-white outline-none"
              >
                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
