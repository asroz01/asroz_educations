-- Add outstanding_balance to students and rebuild enrollment_list view

alter table students
  add column if not exists outstanding_balance numeric(10,2) default 0.00;

-- Must drop and recreate — PostgreSQL tracks view column positions
drop view if exists enrollment_list;

create view enrollment_list as
select
  s.id,
  s.full_name,
  s.gender,
  s.date_of_birth,
  s.enrolled_at,
  s.is_active,
  s.payment_status,
  s.outstanding_balance,
  s.guardian_name,
  s.guardian_phone,
  s.created_at,
  c.id   as class_id,
  c.name as class_name,
  c.stream
from students s
left join classes c on c.id = s.class_id
where s.is_active = true;
