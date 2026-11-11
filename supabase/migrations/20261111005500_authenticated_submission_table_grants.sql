-- Apply only after confirming public.help_requests and public.startup_pitches exist.
-- Table grants do not bypass row-level security. Existing RLS policies remain authoritative.
begin;
grant usage on schema public to authenticated;
grant select, insert on table public.help_requests to authenticated;
grant select, insert on table public.startup_pitches to authenticated;
alter table public.help_requests enable row level security;
alter table public.startup_pitches enable row level security;
commit;
