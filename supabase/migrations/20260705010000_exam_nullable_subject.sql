-- Make subject nullable so partial drafts can be saved
alter table exams alter column subject drop not null;
alter table exams alter column subject set default '';

-- Auto-drafts table for debounced local saves
create table if not exists exam_drafts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table exam_drafts enable row level security;

create policy "draft_own"
  on exam_drafts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
