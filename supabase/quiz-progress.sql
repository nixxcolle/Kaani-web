begin;
create table if not exists public.quiz_scores (
  id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),user_name text not null,
  score integer not null,total_questions integer not null,correct_answers integer not null,created_at timestamptz not null default now()
);
alter table public.quiz_scores add column if not exists module_id text;
alter table public.quiz_scores add column if not exists module_title text;
alter table public.quiz_scores add column if not exists question_ids text[];
alter table public.quiz_scores enable row level security;
revoke all on public.quiz_scores from anon,authenticated;
grant select,insert on public.quiz_scores to authenticated;
drop policy if exists personal_quiz_read on public.quiz_scores;
create policy personal_quiz_read on public.quiz_scores for select to authenticated using(user_id::text=auth.uid()::text);
drop policy if exists personal_quiz_insert on public.quiz_scores;
create policy personal_quiz_insert on public.quiz_scores for insert to authenticated with check(user_id::text=auth.uid()::text);
drop policy if exists personal_quiz_boundary on public.quiz_scores;
create policy personal_quiz_boundary on public.quiz_scores as restrictive for all to public using(user_id::text=auth.uid()::text) with check(user_id::text=auth.uid()::text);
do $$ begin
 if not exists(select 1 from pg_constraint where conname='quiz_scores_consistent_result' and conrelid='public.quiz_scores'::regclass) then
  alter table public.quiz_scores add constraint quiz_scores_consistent_result check(total_questions::numeric>0 and correct_answers::numeric between 0 and total_questions::numeric and score::numeric=round(correct_answers::numeric*100/total_questions::numeric)) not valid;
 end if;
end $$;
commit;
