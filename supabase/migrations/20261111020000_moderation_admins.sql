-- Swipe to Help: moderator-only review workflow.
-- Run in Supabase SQL Editor as project owner before enabling /admin.
-- Does not grant moderator privileges automatically.
begin;
create table if not exists public.moderation_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);
alter table public.moderation_admins enable row level security;
revoke all on public.moderation_admins from anon, authenticated;
create or replace function public.is_swipe_moderator()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.moderation_admins
    where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_swipe_moderator() from public, anon;
grant execute on function public.is_swipe_moderator() to authenticated;

grant select, update on public.help_requests to authenticated;
grant select, update on public.startup_pitches to authenticated;
alter table public.help_requests enable row level security;
alter table public.startup_pitches enable row level security;

drop policy if exists "swipe_moderator_read_help" on public.help_requests;
create policy "swipe_moderator_read_help" on public.help_requests
for select to authenticated using ((select public.is_swipe_moderator()));
drop policy if exists "swipe_moderator_read_pitches" on public.startup_pitches;
create policy "swipe_moderator_read_pitches" on public.startup_pitches
for select to authenticated using ((select public.is_swipe_moderator()));

-- Prevent authors from bypassing moderation by inserting pre-approved records.
drop policy if exists "swipe_help_insert_pending_only" on public.help_requests;
create policy "swipe_help_insert_pending_only" on public.help_requests
as restrictive for insert to authenticated with check (status = 'pending' and author_id = (select auth.uid()));
drop policy if exists "swipe_pitches_insert_pending_only" on public.startup_pitches;
create policy "swipe_pitches_insert_pending_only" on public.startup_pitches
as restrictive for insert to authenticated with check (status = 'pending' and founder_id = (select auth.uid()));

-- Restrictive policies prevent nonmoderators from updating records,
-- even if another permissive update policy exists.
drop policy if exists "swipe_only_moderators_update_help" on public.help_requests;
create policy "swipe_only_moderators_update_help" on public.help_requests
as restrictive for update to authenticated
using ((select public.is_swipe_moderator()))
with check ((select public.is_swipe_moderator()));
drop policy if exists "swipe_only_moderators_update_pitches" on public.startup_pitches;
create policy "swipe_only_moderators_update_pitches" on public.startup_pitches
as restrictive for update to authenticated
using ((select public.is_swipe_moderator()))
with check ((select public.is_swipe_moderator()));

-- Restrictive policies must be paired with a permissive update policy.
drop policy if exists "swipe_moderator_update_help" on public.help_requests;
create policy "swipe_moderator_update_help" on public.help_requests
for update to authenticated using ((select public.is_swipe_moderator()))
with check ((select public.is_swipe_moderator()));
drop policy if exists "swipe_moderator_update_pitches" on public.startup_pitches;
create policy "swipe_moderator_update_pitches" on public.startup_pitches
for update to authenticated using ((select public.is_swipe_moderator()))
with check ((select public.is_swipe_moderator()));
commit;

-- After applying this migration, grant access to ONE trusted account
-- using the email in auth.users, only in the Supabase SQL Editor:
-- insert into public.moderation_admins(user_id)
-- select id from auth.users where email = 'YOUR_OWN_ACCOUNT_EMAIL'
-- on conflict (user_id) do nothing;
