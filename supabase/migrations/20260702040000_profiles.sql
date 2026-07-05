-- ════════════════════════════════════════════════════════════
--  ASROZ Educations — Profiles & RBAC
--  Migration: 20260702_004_profiles.sql
-- ════════════════════════════════════════════════════════════

-- ── Profiles table ───────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'teacher'
               check (role in ('admin', 'teacher', 'student')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updated_at trigger
create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ── Row-Level Security ───────────────────────────────────────
alter table profiles enable row level security;

-- Users can read their own profile
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "profiles_select_admin"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Users can update only their own profile
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- Only admins can insert new profiles (teachers/students added by admin)
create policy "profiles_insert_admin"
  on profiles for insert
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── Auto-create profile on sign-up ───────────────────────────
-- Reads role from raw_app_meta_data set at invite time
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_app_meta_data->>'role', 'teacher')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
