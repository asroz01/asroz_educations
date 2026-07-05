"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export type Role = "admin" | "teacher" | "student";

export interface SessionProfile {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  initials: string;
}

interface RoleContextValue {
  profile: SessionProfile | null;
  role: Role;
  loading: boolean;
}

const RoleContext = createContext<RoleContextValue>({
  profile: null,
  role: "admin",
  loading: true,
});

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Fetch profile with a hard 5 s timeout — never hang forever
        const profilePromise = supabase
          .from("profiles")
          .select("id, full_name, role, avatar_url")
          .eq("id", user.id)
          .single();

        const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 5000)
        );

        const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

        if (data && !error) {
          setProfile({
            id:         data.id,
            full_name:  data.full_name ?? user.email ?? "User",
            email:      user.email ?? "",
            role:       (data.role as Role) ?? "admin",
            avatar_url: data.avatar_url ?? null,
            initials:   getInitials(data.full_name ?? user.email ?? "U"),
          });
        } else {
          // Profile row missing — upsert it now so the trigger backfill works
          await supabase.from("profiles").upsert({
            id:        user.id,
            full_name: user.user_metadata?.full_name ?? user.email ?? "User",
            role:      (user.user_metadata?.role as Role) ?? "admin",
          });

          setProfile({
            id:         user.id,
            full_name:  user.user_metadata?.full_name ?? user.email ?? "User",
            email:      user.email ?? "",
            role:       (user.user_metadata?.role as Role) ?? "admin",
            avatar_url: null,
            initials:   getInitials(user.user_metadata?.full_name ?? user.email ?? "U"),
          });
        }
      } catch {
        // Timeout or network error — still stop the spinner
      } finally {
        setLoading(false);
      }
    }

    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) load();
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <RoleContext.Provider value={{ profile, role: profile?.role ?? "admin", loading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
