-- ============================================================
-- AbiturTrainer – initial schema
-- Run this in your Supabase project: SQL Editor → Run
-- ============================================================

create table if not exists users_progress (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  question_id  text        not null,
  score        integer     not null,
  max_score    integer     not null,
  ai_feedback  text,
  attempted_at timestamptz not null default now(),

  -- one row per user per question; upsert on this pair
  unique (user_id, question_id)
);

-- Row Level Security: users can only see and write their own rows
alter table users_progress enable row level security;

create policy "select own progress"
  on users_progress for select
  using (auth.uid() = user_id);

create policy "insert own progress"
  on users_progress for insert
  with check (auth.uid() = user_id);

create policy "update own progress"
  on users_progress for update
  using (auth.uid() = user_id);
