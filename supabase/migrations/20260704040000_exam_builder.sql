-- ════════════════════════════════════════════════════════════
--  Exam Builder — extend exams table + premium settings
-- ════════════════════════════════════════════════════════════

-- Extend exams with full paper data
alter table exams
  add column if not exists subtitle      text,
  add column if not exists instructions  text,
  add column if not exists duration      text,
  add column if not exists total_marks   int  default 100,
  add column if not exists questions     jsonb default '[]'::jsonb,
  add column if not exists logo_url      text,
  add column if not exists status        text default 'draft'
    check (status in ('draft','published','archived'));

-- Teacher / admin premium settings
create table if not exists teacher_settings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean default false,
  logo_url   text,
  updated_at timestamptz default now()
);

alter table teacher_settings enable row level security;

create policy "settings_own"
  on teacher_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Exams RLS — admins and teachers can insert/update
create policy "exams_insert"
  on exams for insert
  with check ( is_admin() or auth.uid() is not null );

create policy "exams_update"
  on exams for update
  using ( is_admin() or auth.uid() is not null );
