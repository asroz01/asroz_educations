-- ════════════════════════════════════════════════════════════
--  ASROZ Educations — Extended Profiles + Approval System
--  Migration: 20260702060000_extended_profiles.sql
-- ════════════════════════════════════════════════════════════

-- ── Add approval + extended fields to profiles ───────────────
alter table profiles
  add column if not exists is_approved   boolean     default false,
  add column if not exists username      text        unique,
  add column if not exists mobile        text,
  add column if not exists address       text,
  add column if not exists date_of_birth date,
  add column if not exists gender        text        check (gender in ('male','female','other')),
  -- Teacher-specific
  add column if not exists education_qualification text,
  add column if not exists current_company         text,
  add column if not exists nic_number              text,
  add column if not exists nic_front_url           text,
  add column if not exists nic_back_url            text,
  add column if not exists experience_years        int,
  -- Student-specific
  add column if not exists school_name             text,
  add column if not exists document_type           text  check (document_type in ('birth_certificate','postal_id','nic')),
  add column if not exists document_number         text,
  add column if not exists document_url            text,
  add column if not exists father_name             text,
  add column if not exists father_mobile           text,
  add column if not exists father_occupation       text,
  add column if not exists father_age              int,
  add column if not exists mother_name             text,
  add column if not exists mother_mobile           text,
  -- Approval tracking
  add column if not exists approved_by             uuid references auth.users(id),
  add column if not exists approved_at             timestamptz,
  add column if not exists rejection_reason        text;

-- Admins are auto-approved
update profiles set is_approved = true where role = 'admin';

-- ── Update handle_new_user to carry approval state ───────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'teacher');
  insert into public.profiles (id, full_name, role, is_approved)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    v_role,
    -- admins are auto-approved; teachers/students wait for approval
    case when v_role = 'admin' then true else false end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ── Storage bucket for registration documents ────────────────
insert into storage.buckets (id, name, public)
values ('registration-docs', 'registration-docs', false)
on conflict (id) do nothing;

-- Authenticated users can upload to their own folder
create policy "reg_docs_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'registration-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own docs; admins can read all
create policy "reg_docs_read_own"
  on storage.objects for select
  using (
    bucket_id = 'registration-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
