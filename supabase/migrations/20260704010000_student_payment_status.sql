-- ════════════════════════════════════════════════════════════
--  ASROZ Educations — Student payment_status + enrollment view
--  Migration: 20260704010000_student_payment_status.sql
-- ════════════════════════════════════════════════════════════

-- Add payment_status to students
alter table students
  add column if not exists payment_status text
    default 'pending'
    check (payment_status in ('paid', 'pending', 'overdue'));

-- Enrollment list view — joins students + classes for fast queries
create or replace view enrollment_list as
select
  s.id,
  s.full_name,
  s.gender,
  s.date_of_birth,
  s.enrolled_at,
  s.is_active,
  s.payment_status,
  s.guardian_name,
  s.guardian_phone,
  s.created_at,
  c.id   as class_id,
  c.name as class_name,
  c.stream
from students s
left join classes c on c.id = s.class_id
where s.is_active = true;
