-- ════════════════════════════════════════════════════════════
--  ASROZ Educations — At-Risk Students View
--  Migration: 20260702_002_at_risk_view.sql
--
--  A student is "at-risk" when ANY of these are true:
--    1. Attendance rate this month < 70%
--    2. Latest exam avg dropped ≥ 15pts vs previous term avg
--    3. ≥ 3 absences in the last 14 days
-- ════════════════════════════════════════════════════════════

create or replace view at_risk_students as
select *
from (
  with

  attendance_rate as (
    select
      student_id,
      round(
        100.0 * count(*) filter (where status = 'present')
        / nullif(count(*), 0),
      1) as attendance_pct,
      count(*) filter (where status = 'absent') as total_absences
    from attendance
    where date >= date_trunc('month', current_date)
    group by student_id
  ),

  term_avgs as (
    select
      g.student_id,
      e.term,
      round(avg(g.marks), 1) as avg_marks
    from grades g
    join exams e on e.id = g.exam_id
    group by g.student_id, e.term
  ),

  score_drop as (
    select
      a.student_id,
      a.avg_marks                         as current_avg,
      b.avg_marks                         as previous_avg,
      round(b.avg_marks - a.avg_marks, 1) as drop_pts
    from term_avgs a
    join term_avgs b
      on  b.student_id = a.student_id
      and b.term       = a.term - 1
    where a.term = (
      select max(term) from term_avgs t2 where t2.student_id = a.student_id
    )
  ),

  recent_absences as (
    select
      student_id,
      count(*) as streak
    from attendance
    where status = 'absent'
      and date >= current_date - interval '14 days'
    group by student_id
    having count(*) >= 3
  )

  select
    s.id                                   as student_id,
    s.full_name,
    c.name                                 as class_name,
    coalesce(ar.attendance_pct, 100)       as attendance_pct,
    coalesce(sd.drop_pts, 0)               as score_drop_pts,
    coalesce(ra.streak, 0)                 as consecutive_absences,
    case
      when coalesce(ar.attendance_pct, 100) < 60
        or coalesce(sd.drop_pts, 0) >= 25
      then 'high'
      when coalesce(ar.attendance_pct, 100) < 70
        or coalesce(sd.drop_pts, 0) >= 15
        or coalesce(ra.streak, 0) >= 5
      then 'medium'
      else 'low'
    end as severity,
    case
      when coalesce(ar.attendance_pct, 100) < 60
        then 'Attendance ' || coalesce(ar.attendance_pct, 100)::text || '%'
      when coalesce(sd.drop_pts, 0) >= 20
        then 'Marks dropped ' || coalesce(sd.drop_pts, 0)::text || 'pts'
      when coalesce(ra.streak, 0) >= 3
        then coalesce(ra.streak, 0)::text || ' consecutive absences'
      when coalesce(ar.attendance_pct, 100) < 70
        then 'Attendance ' || coalesce(ar.attendance_pct, 100)::text || '%'
      else 'Monitor required'
    end as reason
  from students s
  left join classes         c  on c.id          = s.class_id
  left join attendance_rate ar on ar.student_id = s.id
  left join score_drop      sd on sd.student_id = s.id
  left join recent_absences ra on ra.student_id = s.id
  where s.is_active = true
    and (
      coalesce(ar.attendance_pct, 100) < 70
      or coalesce(sd.drop_pts, 0)      >= 15
      or coalesce(ra.streak, 0)        >= 3
    )
) subq
order by
  case severity when 'high' then 1 when 'medium' then 2 else 3 end,
  full_name;


-- ── Student detail view (for the Review modal) ───────────────
create or replace view student_review_detail as
select
  s.id                                                          as student_id,
  s.full_name,
  s.date_of_birth,
  s.gender,
  s.enrolled_at,
  c.name                                                        as class_name,
  count(a.id)                                                   as total_sessions,
  count(a.id) filter (where a.status = 'present')              as present_count,
  count(a.id) filter (where a.status = 'absent')               as absent_count,
  count(a.id) filter (where a.status = 'late')                 as late_count,
  round(
    100.0 * count(a.id) filter (where a.status = 'present')
    / nullif(count(a.id), 0),
  1)                                                            as attendance_pct
from students   s
left join classes    c on c.id          = s.class_id
left join attendance a on a.student_id  = s.id
group by s.id, s.full_name, s.date_of_birth, s.gender, s.enrolled_at, c.name;
