import { createClient } from "@/utils/supabase/server";
import { getProfile } from "@/utils/getRole";
import { redirect } from "next/navigation";
import ApprovalsClient from "./ApprovalsClient";

export default async function ApprovalsPage() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data: pending, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, mobile, username, education_qualification, current_company, nic_number, nic_front_url, nic_back_url, experience_years, school_name, document_type, document_number, document_url, father_name, father_mobile, mother_name, mother_mobile, created_at, rejection_reason")
    .eq("is_approved", false)
    .in("role", ["teacher", "student"])
    .order("created_at", { ascending: true });

  if (error) console.error("[approvals] query error:", error.message);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#131313] dark:text-white">Pending Approvals</h1>
        <p className="text-sm text-[#1D1D1D]/40 dark:text-white/30 mt-0.5">
          {pending?.length ?? 0} registration{pending?.length !== 1 ? "s" : ""} awaiting review
        </p>
      </div>
      <ApprovalsClient pending={pending ?? []} />
    </div>
  );
}
