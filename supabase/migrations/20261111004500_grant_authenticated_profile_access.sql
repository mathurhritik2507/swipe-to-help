-- Restore table-level permissions for signed-in users.
-- PostgreSQL GRANT is required in addition to row-level security policies.
-- RLS must remain enabled; this migration does not create permissive policies.
begin;
grant usage on schema public to authenticated;
grant select, insert, update on table public.profiles to authenticated;
alter table public.profiles enable row level security;
commit;
