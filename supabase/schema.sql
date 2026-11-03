-- =====================================================================
--  SkillBridge — Supabase database setup
--  HOW TO RUN: Supabase Dashboard → SQL Editor → New query →
--  paste this WHOLE file → click "Run". It is safe to run more than once.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFILES  (one row per student; created automatically at signup)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  full_name           text        not null default '' check (char_length(full_name) <= 80),
  role                text        not null default '' check (char_length(role) <= 80),
  department          text        not null default '' check (char_length(department) <= 100),
  level               text        not null default '' check (char_length(level) <= 40),
  bio                 text        not null default '' check (char_length(bio) <= 500),
  avatar_url          text,
  skills              text[]      not null default '{}',
  -- public  = anyone (even guests) can see the card in the directory
  -- members = only logged-in students can see it
  -- hidden  = nobody but the owner
  visibility          text        not null default 'public'
                      check (visibility in ('public', 'members', 'hidden')),
  onboarding_complete boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists profiles_skills_idx on public.profiles using gin (skills);
create index if not exists profiles_created_idx on public.profiles (created_at desc);

-- ---------------------------------------------------------------------
-- 2. PROFILE CONTACTS (optional link a student CHOOSES to share.
--    Kept in its own table so guests can never read it.)
-- ---------------------------------------------------------------------
create table if not exists public.profile_contacts (
  profile_id   uuid primary key references public.profiles (id) on delete cascade,
  contact_link text not null default ''
               check (char_length(contact_link) <= 200)
);

-- ---------------------------------------------------------------------
-- 3. SAVED PROFILES (bookmarks)
-- ---------------------------------------------------------------------
create table if not exists public.saved_profiles (
  user_id    uuid not null references auth.users (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, profile_id),
  check (user_id <> profile_id)
);

-- ---------------------------------------------------------------------
-- 4. REPORTS (students flag abusive / fake profiles for moderation)
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  reason      text not null check (reason in
              ('fake_or_impersonation','harassment','spam_or_scam','inappropriate','other')),
  details     text not null default '' check (char_length(details) <= 500),
  status      text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. AUTO-CREATE A PROFILE WHEN SOMEONE SIGNS UP
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 6. KEEP updated_at FRESH
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY  (this is what keeps student data safe)
-- ---------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.profile_contacts enable row level security;
alter table public.saved_profiles   enable row level security;
alter table public.reports          enable row level security;

-- PROFILES
drop policy if exists "profiles: read" on public.profiles;
create policy "profiles: read" on public.profiles
  for select using (
    auth.uid() = id
    or (onboarding_complete and visibility = 'public')
    or (onboarding_complete and visibility = 'members' and auth.uid() is not null)
  );

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- (no insert policy needed: the trigger above creates the row;
--  no delete policy: students delete via delete_my_account() below)

-- PROFILE CONTACTS — only logged-in students, only for visible profiles
drop policy if exists "contacts: read" on public.profile_contacts;
create policy "contacts: read" on public.profile_contacts
  for select using (
    auth.uid() is not null
    and exists (select 1 from public.profiles p where p.id = profile_id)
  );

drop policy if exists "contacts: insert own" on public.profile_contacts;
create policy "contacts: insert own" on public.profile_contacts
  for insert with check (auth.uid() = profile_id);

drop policy if exists "contacts: update own" on public.profile_contacts;
create policy "contacts: update own" on public.profile_contacts
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "contacts: delete own" on public.profile_contacts;
create policy "contacts: delete own" on public.profile_contacts
  for delete using (auth.uid() = profile_id);

-- SAVED PROFILES — each student only ever sees / edits their own bookmarks
drop policy if exists "saved: read own" on public.saved_profiles;
create policy "saved: read own" on public.saved_profiles
  for select using (auth.uid() = user_id);

drop policy if exists "saved: insert own" on public.saved_profiles;
create policy "saved: insert own" on public.saved_profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "saved: delete own" on public.saved_profiles;
create policy "saved: delete own" on public.saved_profiles
  for delete using (auth.uid() = user_id);

-- REPORTS — students can file a report; only you (in the dashboard) read them
drop policy if exists "reports: insert own" on public.reports;
create policy "reports: insert own" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- ---------------------------------------------------------------------
-- 8. DELETE MY ACCOUNT  (called from the Profile page "Danger zone")
-- ---------------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();   -- cascades to everything
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------
-- 9. AVATAR STORAGE  (profile pictures)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars: upload own folder" on storage.objects;
create policy "avatars: upload own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: update own folder" on storage.objects;
create policy "avatars: update own folder" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars: delete own folder" on storage.objects;
create policy "avatars: delete own folder" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------
-- 10. OPTIONAL — ONLY ALLOW YOUR UNIVERSITY'S EMAIL DOMAIN
--     Un-comment the block below, change the domain, then run it.
--     (Also set ALLOWED_EMAIL_DOMAINS in src/config.js so students get
--     a friendly message before the database refuses them.)
-- ---------------------------------------------------------------------
-- create or replace function public.enforce_university_email()
-- returns trigger
-- language plpgsql
-- as $$
-- begin
--   if new.email !~* '@([a-z0-9-]+\.)*unilag\.edu\.ng$' then
--     raise exception 'Please sign up with your university email address.';
--   end if;
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists enforce_university_email_trigger on auth.users;
-- create trigger enforce_university_email_trigger
--   before insert on auth.users
--   for each row execute function public.enforce_university_email();
