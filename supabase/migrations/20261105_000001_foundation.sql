-- Swipe to Help foundation: run through reviewed Supabase migrations.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '',
 account_type text not null default 'individual' check (account_type in ('individual','organization','founder')),
 bio text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.help_requests (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references public.profiles(id) on delete cascade,
 title text not null check (char_length(title) between 8 and 140),
 description text not null check (char_length(description) between 30 and 5000),
 category text not null,
 country text not null,
 status text not null default 'pending' check (status in ('pending','approved','rejected','closed')),
 created_at timestamptz not null default now()
);
create table if not exists public.startup_pitches (
 id uuid primary key default gen_random_uuid(),
 founder_id uuid not null references public.profiles(id) on delete cascade,
 name text not null check (char_length(name) between 2 and 120),
 summary text not null check (char_length(summary) between 30 and 5000),
 industry text not null,
 status text not null default 'pending' check (status in ('pending','approved','rejected','closed')),
 created_at timestamptz not null default now()
);
create table if not exists public.saved_items (
 user_id uuid not null references public.profiles(id) on delete cascade,
 help_request_id uuid references public.help_requests(id) on delete cascade,
 startup_pitch_id uuid references public.startup_pitches(id) on delete cascade,
 created_at timestamptz not null default now(),
 check ((help_request_id is not null)::int + (startup_pitch_id is not null)::int = 1),
 primary key (user_id, created_at)
);
create unique index if not exists saved_help_unique on public.saved_items(user_id,help_request_id) where help_request_id is not null;
create unique index if not exists saved_pitch_unique on public.saved_items(user_id,startup_pitch_id) where startup_pitch_id is not null;
create index if not exists help_requests_public_feed on public.help_requests(created_at desc) where status='approved';
create index if not exists startup_pitches_public_feed on public.startup_pitches(created_at desc) where status='approved';
alter table public.profiles enable row level security;
alter table public.help_requests enable row level security;
alter table public.startup_pitches enable row level security;
alter table public.saved_items enable row level security;
create policy "Read own private profile" on public.profiles for select to authenticated using (id=auth.uid());
create policy "Own profile insert" on public.profiles for insert to authenticated with check (id=auth.uid());
create policy "Own profile update" on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy "Approved requests or own drafts" on public.help_requests for select to anon,authenticated using (status='approved' or author_id=auth.uid());
create policy "Create own pending requests" on public.help_requests for insert to authenticated with check (author_id=auth.uid() and status='pending');
create policy "Approved pitches or own drafts" on public.startup_pitches for select to anon,authenticated using (status='approved' or founder_id=auth.uid());
create policy "Create own pending pitches" on public.startup_pitches for insert to authenticated with check (founder_id=auth.uid() and status='pending');
create policy "Own saved items" on public.saved_items for select to authenticated using (user_id=auth.uid());
create policy "Save own items" on public.saved_items for insert to authenticated with check (user_id=auth.uid());
create policy "Unsave own items" on public.saved_items for delete to authenticated using (user_id=auth.uid());
-- Deliberately no client-side approval/update policies. Moderation requires trusted server-side implementation.
