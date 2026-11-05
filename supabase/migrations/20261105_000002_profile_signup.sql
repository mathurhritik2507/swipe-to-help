-- Populate the profile when Supabase Auth creates a user.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
 insert into public.profiles(id,display_name)
 values(new.id,left(coalesce(new.raw_user_meta_data->>'display_name',''),80))
 on conflict (id) do nothing;
 return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
-- Prevent changing review status through any client profile update; review remains server-managed.
