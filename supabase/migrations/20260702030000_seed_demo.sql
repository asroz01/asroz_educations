-- ════════════════════════════════════════════════════════════
--  ASROZ Educations — Demo Seed Data
--  Migration: 20260702_003_seed_demo.sql
--  Run AFTER 001 and 002. Safe to re-run (uses ON CONFLICT DO NOTHING).
-- ════════════════════════════════════════════════════════════

-- Classes
insert into classes (id, name, stream) values
  ('11111111-0001-0001-0001-000000000001', 'Montessori A',     'Montessori'),
  ('11111111-0001-0001-0001-000000000002', 'Grade 5',          'Primary'),
  ('11111111-0001-0001-0001-000000000003', 'Grade 8',          'Junior Secondary'),
  ('11111111-0001-0001-0001-000000000004', 'Grade 10',         'Senior'),
  ('11111111-0001-0001-0001-000000000005', 'A/L Physics',      'Advanced Level')
on conflict (id) do nothing;

-- Staff
insert into staff (id, full_name, role, email, subject) values
  ('22222222-0001-0001-0001-000000000001', 'Mr. Perera',    'teacher', 'perera@asroz.lk',   'Physics'),
  ('22222222-0001-0001-0001-000000000002', 'Ms. Fernando',  'teacher', 'fernando@asroz.lk', 'Mathematics'),
  ('22222222-0001-0001-0001-000000000003', 'Mr. Silva',     'teacher', 'silva@asroz.lk',    'ICT'),
  ('22222222-0001-0001-0001-000000000004', 'Admin User',    'admin',   'admin@asroz.lk',    null)
on conflict (id) do nothing;

-- Students
insert into students (id, full_name, date_of_birth, gender, class_id, guardian_name, enrolled_at) values
  ('33333333-0001-0001-0001-000000000001', 'Kamal Silva',    '2012-03-15', 'male',   '11111111-0001-0001-0001-000000000004', 'Nimal Silva',    '2024-01-10'),
  ('33333333-0001-0001-0001-000000000002', 'Priya Fernando', '2013-07-22', 'female', '11111111-0001-0001-0001-000000000003', 'Sunil Fernando', '2024-01-10'),
  ('33333333-0001-0001-0001-000000000003', 'Ashan Perera',   '2006-11-08', 'male',   '11111111-0001-0001-0001-000000000005', 'Kamala Perera',  '2023-09-01'),
  ('33333333-0001-0001-0001-000000000004', 'Nimal Bandara',  '2015-05-30', 'male',   '11111111-0001-0001-0001-000000000002', 'Siri Bandara',   '2024-01-10'),
  ('33333333-0001-0001-0001-000000000005', 'Saman Kumara',   '2011-01-19', 'male',   '11111111-0001-0001-0001-000000000004', 'Chandra Kumara', '2023-09-01')
on conflict (id) do nothing;

-- Attendance (last 30 days — Kamal has low attendance, Nimal has consecutive absences)
insert into attendance (student_id, date, status, class_id) values
  -- Kamal Silva: 8 absences out of 20 days → 60% attendance
  ('33333333-0001-0001-0001-000000000001', current_date - 1,  'absent',  '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 2,  'absent',  '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 3,  'absent',  '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 4,  'present', '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 5,  'absent',  '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 6,  'present', '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 7,  'absent',  '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 8,  'absent',  '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 9,  'present', '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 10, 'present', '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 11, 'absent',  '11111111-0001-0001-0001-000000000004'),
  ('33333333-0001-0001-0001-000000000001', current_date - 12, 'present', '11111111-0001-0001-0001-000000000004'),
  -- Nimal Bandara: 4 consecutive absences (last 4 days)
  ('33333333-0001-0001-0001-000000000004', current_date - 1,  'absent',  '11111111-0001-0001-0001-000000000002'),
  ('33333333-0001-0001-0001-000000000004', current_date - 2,  'absent',  '11111111-0001-0001-0001-000000000002'),
  ('33333333-0001-0001-0001-000000000004', current_date - 3,  'absent',  '11111111-0001-0001-0001-000000000002'),
  ('33333333-0001-0001-0001-000000000004', current_date - 4,  'absent',  '11111111-0001-0001-0001-000000000002'),
  ('33333333-0001-0001-0001-000000000004', current_date - 5,  'present', '11111111-0001-0001-0001-000000000002'),
  ('33333333-0001-0001-0001-000000000004', current_date - 6,  'present', '11111111-0001-0001-0001-000000000002'),
  -- Priya Fernando: ok attendance
  ('33333333-0001-0001-0001-000000000002', current_date - 1,  'present', '11111111-0001-0001-0001-000000000003'),
  ('33333333-0001-0001-0001-000000000002', current_date - 2,  'present', '11111111-0001-0001-0001-000000000003'),
  ('33333333-0001-0001-0001-000000000002', current_date - 3,  'late',    '11111111-0001-0001-0001-000000000003'),
  ('33333333-0001-0001-0001-000000000002', current_date - 4,  'present', '11111111-0001-0001-0001-000000000003')
on conflict (student_id, date, class_id) do nothing;

-- Exams
insert into exams (id, title, subject, class_id, term, exam_date, total_marks) values
  ('44444444-0001-0001-0001-000000000001', 'Maths Term 2',   'Mathematics', '11111111-0001-0001-0001-000000000004', 2, current_date - 60, 100),
  ('44444444-0001-0001-0001-000000000002', 'Maths Term 3',   'Mathematics', '11111111-0001-0001-0001-000000000004', 3, current_date - 7,  100),
  ('44444444-0001-0001-0001-000000000003', 'Science Term 2', 'Science',     '11111111-0001-0001-0001-000000000003', 2, current_date - 55, 100),
  ('44444444-0001-0001-0001-000000000004', 'Science Term 3', 'Science',     '11111111-0001-0001-0001-000000000003', 3, current_date - 5,  100),
  ('44444444-0001-0001-0001-000000000005', 'Physics Term 2', 'Physics',     '11111111-0001-0001-0001-000000000005', 2, current_date - 50, 100),
  ('44444444-0001-0001-0001-000000000006', 'Physics Term 3', 'Physics',     '11111111-0001-0001-0001-000000000005', 3, current_date - 3,  100)
on conflict (id) do nothing;

-- Grades (Priya: -22pts drop; Ashan: -18pts drop; Kamal: ok)
insert into grades (student_id, exam_id, marks, grade) values
  -- Kamal Silva: stable
  ('33333333-0001-0001-0001-000000000001', '44444444-0001-0001-0001-000000000001', 72, 'B'),
  ('33333333-0001-0001-0001-000000000001', '44444444-0001-0001-0001-000000000002', 70, 'B'),
  -- Priya Fernando: 78 → 56 drop
  ('33333333-0001-0001-0001-000000000002', '44444444-0001-0001-0001-000000000003', 78, 'A'),
  ('33333333-0001-0001-0001-000000000002', '44444444-0001-0001-0001-000000000004', 56, 'C'),
  -- Ashan Perera: 75 → 57 drop
  ('33333333-0001-0001-0001-000000000003', '44444444-0001-0001-0001-000000000005', 75, 'B'),
  ('33333333-0001-0001-0001-000000000003', '44444444-0001-0001-0001-000000000006', 57, 'C')
on conflict (student_id, exam_id) do nothing;

-- Audit log seed
insert into audit_logs (actor, action, target, module, ip_address, severity) values
  ('Admin User',   'Modified student record',  'Kamal Silva (ID: 1042)',      'Students', '192.168.1.10', 'medium'),
  ('Mr. Perera',   'Uploaded exam paper',       'A/L Physics Paper 2',         'Library',  '192.168.1.14', 'low'),
  ('Admin User',   'Deleted student record',    'Saman Kumara (ID: 0987)',     'Students', '192.168.1.10', 'high'),
  ('Finance Team', 'Processed batch payment',   '12 records · LKR 84,000',    'Payments', '192.168.1.22', 'medium'),
  ('Ms. Fernando', 'Published exam results',    'O/L Maths Term 3',            'Exams',    '192.168.1.15', 'low'),
  ('System',       'Auto-generated PDF report', 'Government Term 2 Summary',   'Reports',  'system',       'low');
