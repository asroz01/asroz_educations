-- ════════════════════════════════════════════════════════════
--  ASROZ Educations — Non-recursive admin RLS
--  Migration: 20260702070000_admin_rls_fix.sql
--
--  Problem: checking profiles.role inside a policy ON profiles
--  causes infinite recursion. Fix: use a SECURITY DEFINER
--  function that runs as the DB owner (bypasses RLS) to check
--  the caller's role once, then use it in all policies.
-- ════════════════════════════════════════════════════════════

-- ── Helper: is the current session user an admin? ────────────
-- SECURITY DEFINER = runs as function owner (postgres), not the
-- calling user → reads profiles without triggering RLS → no loop
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Drop stale policies ───────────────────────────────────────
drop policy if exists "profiles_select_own"   on profiles;
drop policy if exists "profiles_select_admin" on profiles;
drop policy if exists "profiles_insert_own"   on profiles;
drop policy if exists "profiles_insert_admin" on profiles;
drop policy if exists "profiles_update_own"   on profiles;
drop policy if exists "profiles_update_admin" on profiles;
drop policy if exists "profiles_delete_admin" on profiles;

-- ── SELECT: own row OR admin sees all ────────────────────────
create policy "profiles_select"
  on profiles for select
  using ( auth.uid() = id or is_admin() );

-- ── INSERT: own row (trigger) OR admin ───────────────────────
create policy "profiles_insert"
  on profiles for insert
  with check ( auth.uid() = id or is_admin() );

-- ── UPDATE: own row OR admin (needed for approval) ───────────
create policy "profiles_update"
  on profiles for update
  using ( auth.uid() = id or is_admin() );

-- ── DELETE: admin only ────────────────────────────────────────
create policy "profiles_delete"
  on profiles for delete
  using ( is_admin() );
