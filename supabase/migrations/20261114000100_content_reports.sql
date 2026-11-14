-- Apply in Supabase SQL Editor before enabling public report controls.
-- Authenticated users can submit reports; only moderators can read and resolve them.
begin;
create table if not exists public.content_reports (
 id uuid primary key default gen_random_uuid(),
 reporter_id uuid not null references auth.users(id) on delete cascade,
 target_kind text not null check (target_kind in ('help','startup')),
 target_id uuid not null,
 reason text not null check (reason in ('fraud','privacy','abuse','other')),
 details text not null default '' check (char_length(details) <= 1000),
 status text not null default 'open' check (status in ('open','resolved')),
 created_at timestamptz not null default now(),
 unique (reporter_id,target_kind,target_id)
);
create index if not exists content_reports_queue on public.content_reports(created_at desc) where status='open';
alter table public.content_reports enable row level security;
grant insert,select,update on public.content_reports to authenticated;
drop policy if exists "report_own_content" on public.content_reports;
create policy "report_own_content" on public.content_reports for insert to authenticated
with check (reporter_id=(select auth.uid()) and status='open');
drop policy if exists "moderators_read_reports" on public.content_reports;
create policy "moderators_read_reports" on public.content_reports for select to authenticated
using ((select public.is_swipe_moderator()));
drop policy if exists "moderators_update_reports" on public.content_reports;
create policy "moderators_update_reports" on public.content_reports for update to authenticated
using ((select public.is_swipe_moderator())) with check ((select public.is_swipe_moderator()));
commit;
