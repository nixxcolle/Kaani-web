-- Read-only checks for the project owner in Supabase SQL Editor.
-- No passwords, email addresses, tokens, or user records are returned.
select count(*) as total_auth_accounts,
       count(*) filter (where email_confirmed_at is not null) as confirmed_accounts,
       count(*) filter (where email_confirmed_at is null) as unconfirmed_accounts
from auth.users;

select t.tgname as trigger_name,
       pg_get_triggerdef(t.oid) as trigger_definition,
       p.proname as function_name,
       pg_get_functiondef(p.oid) as function_definition
from pg_trigger t
join pg_proc p on p.oid = t.tgfoid
where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal;

select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name in ('users', 'quiz_scores')
order by table_name, ordinal_position;

select c.conname, c.conrelid::regclass as table_name,
       pg_get_constraintdef(c.oid) as constraint_definition
from pg_constraint c
where c.conrelid in (to_regclass('public.users'), to_regclass('public.quiz_scores'));
