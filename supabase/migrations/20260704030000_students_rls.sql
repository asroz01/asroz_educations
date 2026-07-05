-- ── Students RLS: allow admins to insert, update, delete ─────
-- SELECT already exists as "anon_read_students" (open read).
-- Admins need INSERT/UPDATE/DELETE via the is_admin() helper
-- created in migration 20260702070000.

create policy "students_insert_admin"
  on students for insert
  with check ( is_admin() );

create policy "students_update_admin"
  on students for update
  using ( is_admin() );

create policy "students_delete_admin"
  on students for delete
  using ( is_admin() );
