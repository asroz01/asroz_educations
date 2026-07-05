import { redirect } from "next/navigation";
import { getProfile } from "@/utils/getRole";
import InviteForm from "./InviteForm";

export default async function InvitePage() {
  const profile = await getProfile();

  // Only admins can access this page
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#131313] dark:text-white">Invite Staff Member</h1>
        <p className="text-sm text-[#1D1D1D]/45 dark:text-white/30 mt-1">
          Send an invitation email. The staff member sets their own password on first login.
        </p>
      </div>

      <div className="bg-[#ECECEC] dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-[5px_5px_14px_rgba(0,0,0,0.1),-3px_-3px_8px_rgba(255,255,255,0.95)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.04)]">
        <InviteForm />
      </div>
    </div>
  );
}
