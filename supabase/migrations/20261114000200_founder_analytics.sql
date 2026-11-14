-- Founder analytics. Apply to Supabase before deploying the analytics UI.
-- Privacy: no IP addresses, emails, user agents, or account identifiers in page events.
begin;
create table if not exists public.site_page_views (
  id bigint generated always as identity primary key,
  visit_day date not null default (now() at time zone 'utc')::date,
  session_key uuid not null,
  page_path text not null check (page_path in ('/','/auth','/dashboard','/privacy','/terms','/report')),
  created_at timestamptz not null default now(),
  unique (visit_day,session_key,page_path)
);
create index if not exists site_page_views_date_idx on public.site_page_views (visit_day desc);
alter table public.site_page_views enable row level security;
revoke all on public.site_page_views from anon,authenticated;
grant insert on public.site_page_views to anon,authenticated;
drop policy if exists "public_insert_anonymous_page_views" on public.site_page_views;
create policy "public_insert_anonymous_page_views" on public.site_page_views for insert to anon,authenticated
with check (visit_day=(now() at time zone 'utc')::date and created_at >= now()-interval '2 minutes' and created_at <= now()+interval '2 minutes');
-- SECURITY DEFINER only exposes aggregate numbers after moderator authorization.
create or replace function public.founder_analytics_summary()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
 if auth.uid() is null or not public.is_swipe_moderator() then
   raise exception 'Moderator access required' using errcode='42501';
 end if;
 select jsonb_build_object(
   'accounts_total',(select count(*) from auth.users),
   'accounts_7d',(select count(*) from auth.users where created_at >= now()-interval '7 days'),
   'accounts_30d',(select count(*) from auth.users where created_at >= now()-interval '30 days'),
   'visitors_today',(select count(distinct session_key) from public.site_page_views where visit_day=(now() at time zone 'utc')::date),
   'visitors_7d',(select count(distinct (visit_day,session_key)) from public.site_page_views where visit_day >= (now() at time zone 'utc')::date-6),
   'page_views_7d',(select count(*) from public.site_page_views where visit_day >= (now() at time zone 'utc')::date-6),
   'daily',(select coalesce(jsonb_agg(jsonb_build_object('date',visit_day,'visitors',visitors,'views',views) order by visit_day), '[]'::jsonb) from (select visit_day,count(distinct session_key) visitors,count(*) views from public.site_page_views where visit_day >= (now() at time zone 'utc')::date-13 group by visit_day) d)
 ) into result;
 return result;
end $$;
revoke all on function public.founder_analytics_summary() from public,anon;
grant execute on function public.founder_analytics_summary() to authenticated;
commit;
-- Page-view counts are approximate and may include bots, repeated sessions, and test traffic.
