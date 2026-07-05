-- ════════════════════════════════════════════════════════════
--  Fix profiles RLS — remove recursive admin policy
--  The original "profiles_select_admin" policy queried the
--  profiles table from within a policy on profiles, causing
--  infinite recursion. Replace with auth.uid() check only.
-- ════════════════════════════════════════════════════════════

-- Drop all existing policies on profiles
drop policy if exists "profiles_select_own"    on profiles;
drop policy if exists "profiles_select_admin"  on profiles;
drop policy if exists "profiles_update_own"    on profiles;
drop policy if exists "profiles_insert_admin"  on profiles;

-- ── Simple, non-recursive replacements ───────────────────────

-- Any authenticated user can read their own row
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

-- Any authenticated user can insert their own row (needed for
-- the handle_new_user trigger + manual bootstrap)
create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

-- Any authenticated user can update their own row
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- Service role (used by Supabase functions / admin SDK) bypasses RLS
-- so no special admin SELECT policy is needed here.
