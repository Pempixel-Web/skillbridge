-- Run this once in Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.

-- 1. Create a profile row for every account that doesn't have one yet
insert into public.profiles (id, full_name)
select id, left(coalesce(raw_user_meta_data ->> 'full_name', ''), 80)
from auth.users
on conflict (id) do nothing;

-- 2. Allow a student to create their own profile row if it's ever missing
drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
