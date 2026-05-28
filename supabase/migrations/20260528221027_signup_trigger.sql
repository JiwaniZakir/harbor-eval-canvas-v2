-- ============================================================================
-- Auto-provision a personal org + owner membership on user signup.
-- Runs with SECURITY DEFINER so it can write to public tables before RLS
-- policies / memberships exist for the new user.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  base_slug  text;
  final_slug text;
  display    text;
  suffix     int := 0;
begin
  -- Derive a friendly display name from metadata or email local-part.
  display := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    split_part(new.email, '@', 1),
    'My'
  );

  -- Build a unique slug from the email local-part.
  base_slug := regexp_replace(
    lower(coalesce(split_part(new.email, '@', 1), 'org')),
    '[^a-z0-9]+', '-', 'g'
  );
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'org';
  end if;

  final_slug := base_slug;
  while exists (select 1 from public.orgs o where o.slug = final_slug) loop
    suffix := suffix + 1;
    final_slug := base_slug || '-' || suffix::text;
  end loop;

  insert into public.orgs (name, slug)
  values (display || '''s Workspace', final_slug)
  returning id into new_org_id;

  insert into public.org_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
