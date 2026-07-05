// Server-side role utility — always reads from DB, never trusts client state.
// Call from Server Components or Server Actions only.

import { createClient } from "@/utils/supabase/server";
import type { Role } from "@/context/RoleContext";

export interface UserProfile {
  id: string;
  full_name: string;
  role: Role;
  avatar_url: string | null;
  email: string;
}

export async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id:         profile.id,
    full_name:  profile.full_name ?? user.email ?? "User",
    role:       profile.role as Role,
    avatar_url: profile.avatar_url ?? null,
    email:      user.email ?? "",
  };
}

export async function getRole(): Promise<Role | null> {
  const profile = await getProfile();
  return profile?.role ?? null;
}

// Permission helpers — import and use in layouts / Server Components
export const PERMISSIONS: Record<Role, string[]> = {
  admin:   ["*"],                          // everything
  teacher: [
    "/dashboard", "/exams", "/library", "/students/records",
    "/students", "/help", "/settings/preferences",
  ],
  student: [
    "/dashboard", "/library", "/students/records", "/help",
  ],
};

export function canAccess(role: Role, path: string): boolean {
  const allowed = PERMISSIONS[role];
  if (allowed.includes("*")) return true;
  return allowed.some((p) => path === p || path.startsWith(p + "/"));
}
