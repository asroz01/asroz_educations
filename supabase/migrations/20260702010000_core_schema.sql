-- ════════════════════════════════════════════════════════════
--  ASROZ Educations — Core Schema
--  Migration: 20260702_001_core_schema.sql
--  Run in: Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Classes / Streams ────────────────────────────────────────
create table if not exists classes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                    -- e.g. "Grade 10", "A/L Physics"
  stream      text,                             -- e.g. "Science", "Montessori"
  teacher_id  uuid,                             -- FK set after staff table
  created_at  timestamptz default now()
);

-- ── Students ─────────────────────────────────────────────────
create table if not exists students (
  id             uuid primary key default gen_random_uuid(),
  full_name      text        not null,
  date_of_birth  date,
  gender         text        check (gender in ('male','female','other')),
  class_id       uuid        references classes(id) on delete set null,
  guardian_name  text,
  guardian_phone text,
  address        text,
  enrolled_at    date        default current_date,
  is_active      boolean     default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── Staff / Teachers ─────────────────────────────────────────
create table if not exists staff (
  id          uuid primary key default gen_random_uuid(),
  full_name   text   not null,
  role        text   check (role in ('teacher','admin','finance','support')),
  email       text   unique,
  phone       text,
  subject     text,
  class_id    uuid   references classes(id) on delete set null,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Back-fill FK on classes
alter table classes
  add constraint fk_classes_teacher
  foreign key (teacher_id) references staff(id) on delete set null
  not valid;

-- ── Attendance ───────────────────────────────────────────────
create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid  not null references students(id) on delete cascade,
  class_id    uuid  references classes(id) on delete set null,
  date        date  not null,
  status      text  not null check (status in ('present','absent','late','excused')),
  recorded_by uuid  references staff(id) on delete set null,
  created_at  timestamptz default now(),
  unique (student_id, date, class_id)
);

-- ── Exams ────────────────────────────────────────────────────
create table if not exists exams (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  subject      text not null,
  class_id     uuid references classes(id) on delete set null,
  term         int  check (term between 1 and 3),
  exam_date    date,
  total_marks  int  default 100,
  created_by   uuid references staff(id) on delete set null,
  created_at   timestamptz default now()
);

-- ── Grades ───────────────────────────────────────────────────
create table if not exists grades (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students(id) on delete cascade,
  exam_id     uuid not null references exams(id)    on delete cascade,
  marks       numeric(5,2) check (marks >= 0),
  grade       text,
  remarks     text,
  recorded_by uuid references staff(id) on delete set null,
  created_at  timestamptz default now(),
  unique (student_id, exam_id)
);

-- ── Payments / Fees ──────────────────────────────────────────
create table if not exists payments (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid   not null references students(id) on delete cascade,
  amount         numeric(10,2) not null,
  payment_date   date   default current_date,
  method         text   check (method in ('cash','bank_transfer','online')),
  reference      text,
  recorded_by    uuid   references staff(id) on delete set null,
  notes          text,
  created_at     timestamptz default now()
);

-- ── Audit Log ────────────────────────────────────────────────
create table if not exists audit_logs (
  id         uuid primary key default gen_random_uuid(),
  actor      text not null,
  action     text not null,
  target     text,
  module     text,
  ip_address text,
  severity   text check (severity in ('low','medium','high')),
  created_at timestamptz default now()
);

-- ── Updated-at trigger ───────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger students_updated_at
  before update on students
  for each row execute function set_updated_at();

-- ── Row-Level Security ───────────────────────────────────────
alter table students   enable row level security;
alter table attendance enable row level security;
alter table grades     enable row level security;
alter table exams      enable row level security;
alter table payments   enable row level security;
alter table staff      enable row level security;
alter table audit_logs enable row level security;

-- Anon read access (tighten per-role once auth is wired)
create policy "anon_read_students"   on students   for select using (true);
create policy "anon_read_attendance" on attendance for select using (true);
create policy "anon_read_grades"     on grades     for select using (true);
create policy "anon_read_exams"      on exams      for select using (true);
create policy "anon_read_payments"   on payments   for select using (true);
create policy "anon_read_staff"      on staff      for select using (true);
create policy "anon_read_audit"      on audit_logs for select using (true);
