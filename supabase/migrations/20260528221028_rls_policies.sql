-- ============================================================================
-- Row-Level Security + RBAC helpers.
--
-- Helper functions are SECURITY DEFINER so that policies on org_members do not
-- recurse infinitely (a policy on org_members that queries org_members would
-- otherwise re-trigger itself). Definer functions bypass RLS internally while
-- still being scoped to auth.uid().
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper: is the current user a member of the given org?
-- ---------------------------------------------------------------------------
create or replace function public.is_org_member(org_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_members m
    where m.org_id = org_uuid
      and m.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Helper: does the current user hold AT LEAST `min_role` in the given org?
-- Role hierarchy: owner(4) > admin(3) > member(2) > viewer(1).
-- ---------------------------------------------------------------------------
create or replace function public.role_rank(role_name text)
returns int
language sql
immutable
as $$
  select case role_name
    when 'owner'  then 4
    when 'admin'  then 3
    when 'member' then 2
    when 'viewer' then 1
    else 0
  end;
$$;

create or replace function public.has_org_role(org_uuid uuid, min_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_members m
    where m.org_id = org_uuid
      and m.user_id = auth.uid()
      and public.role_rank(m.role) >= public.role_rank(min_role)
  );
$$;

-- Allow authenticated users to call the helpers.
grant execute on function public.is_org_member(uuid)            to authenticated;
grant execute on function public.has_org_role(uuid, text)       to authenticated;
grant execute on function public.role_rank(text)                to authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS on every app table.
-- ---------------------------------------------------------------------------
alter table public.orgs          enable row level security;
alter table public.org_members   enable row level security;
alter table public.projects      enable row level security;
alter table public.domains       enable row level security;
alter table public.datasets      enable row level security;
alter table public.dataset_cases enable row level security;
alter table public.runs          enable row level security;
alter table public.run_cases     enable row level security;

-- ===========================================================================
-- orgs
--   read: any member; write: admin+ ; create: any authed user (bootstrap)
-- ===========================================================================
create policy orgs_select on public.orgs
  for select to authenticated
  using (public.is_org_member(id));

create policy orgs_insert on public.orgs
  for insert to authenticated
  with check (true);

create policy orgs_update on public.orgs
  for update to authenticated
  using (public.has_org_role(id, 'admin'))
  with check (public.has_org_role(id, 'admin'));

create policy orgs_delete on public.orgs
  for delete to authenticated
  using (public.has_org_role(id, 'owner'));

-- ===========================================================================
-- org_members
--   read: members of the org
--   insert/update/delete: owner or admin of the org
-- ===========================================================================
create policy org_members_select on public.org_members
  for select to authenticated
  using (public.is_org_member(org_id));

create policy org_members_insert on public.org_members
  for insert to authenticated
  with check (public.has_org_role(org_id, 'admin'));

create policy org_members_update on public.org_members
  for update to authenticated
  using (public.has_org_role(org_id, 'admin'))
  with check (public.has_org_role(org_id, 'admin'));

create policy org_members_delete on public.org_members
  for delete to authenticated
  using (public.has_org_role(org_id, 'admin'));

-- ===========================================================================
-- projects — full CRUD for any member of the owning org.
-- ===========================================================================
create policy projects_select on public.projects
  for select to authenticated
  using (public.is_org_member(org_id));

create policy projects_insert on public.projects
  for insert to authenticated
  with check (public.is_org_member(org_id));

create policy projects_update on public.projects
  for update to authenticated
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy projects_delete on public.projects
  for delete to authenticated
  using (public.is_org_member(org_id));

-- ===========================================================================
-- Helper for child tables: is the current user a member of the org that
-- owns the given project?
-- ===========================================================================
create or replace function public.can_access_project(project_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects p
    join public.org_members m on m.org_id = p.org_id
    where p.id = project_uuid
      and m.user_id = auth.uid()
  );
$$;

grant execute on function public.can_access_project(uuid) to authenticated;

-- ===========================================================================
-- domains
-- ===========================================================================
create policy domains_select on public.domains
  for select to authenticated
  using (public.can_access_project(project_id));

create policy domains_insert on public.domains
  for insert to authenticated
  with check (public.can_access_project(project_id));

create policy domains_update on public.domains
  for update to authenticated
  using (public.can_access_project(project_id))
  with check (public.can_access_project(project_id));

create policy domains_delete on public.domains
  for delete to authenticated
  using (public.can_access_project(project_id));

-- ===========================================================================
-- datasets
-- ===========================================================================
create policy datasets_select on public.datasets
  for select to authenticated
  using (public.can_access_project(project_id));

create policy datasets_insert on public.datasets
  for insert to authenticated
  with check (public.can_access_project(project_id));

create policy datasets_update on public.datasets
  for update to authenticated
  using (public.can_access_project(project_id))
  with check (public.can_access_project(project_id));

create policy datasets_delete on public.datasets
  for delete to authenticated
  using (public.can_access_project(project_id));

-- ===========================================================================
-- dataset_cases — gated through the parent dataset's project.
-- ===========================================================================
create or replace function public.can_access_dataset(dataset_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.datasets d
    join public.projects p   on p.id = d.project_id
    join public.org_members m on m.org_id = p.org_id
    where d.id = dataset_uuid
      and m.user_id = auth.uid()
  );
$$;

grant execute on function public.can_access_dataset(uuid) to authenticated;

create policy dataset_cases_select on public.dataset_cases
  for select to authenticated
  using (public.can_access_dataset(dataset_id));

create policy dataset_cases_insert on public.dataset_cases
  for insert to authenticated
  with check (public.can_access_dataset(dataset_id));

create policy dataset_cases_update on public.dataset_cases
  for update to authenticated
  using (public.can_access_dataset(dataset_id))
  with check (public.can_access_dataset(dataset_id));

create policy dataset_cases_delete on public.dataset_cases
  for delete to authenticated
  using (public.can_access_dataset(dataset_id));

-- ===========================================================================
-- runs — gated through the parent project.
-- ===========================================================================
create policy runs_select on public.runs
  for select to authenticated
  using (public.can_access_project(project_id));

create policy runs_insert on public.runs
  for insert to authenticated
  with check (public.can_access_project(project_id));

create policy runs_update on public.runs
  for update to authenticated
  using (public.can_access_project(project_id))
  with check (public.can_access_project(project_id));

create policy runs_delete on public.runs
  for delete to authenticated
  using (public.can_access_project(project_id));

-- ===========================================================================
-- run_cases — gated through the parent run's project.
-- ===========================================================================
create or replace function public.can_access_run(run_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.runs r
    join public.projects p   on p.id = r.project_id
    join public.org_members m on m.org_id = p.org_id
    where r.id = run_uuid
      and m.user_id = auth.uid()
  );
$$;

grant execute on function public.can_access_run(uuid) to authenticated;

create policy run_cases_select on public.run_cases
  for select to authenticated
  using (public.can_access_run(run_id));

create policy run_cases_insert on public.run_cases
  for insert to authenticated
  with check (public.can_access_run(run_id));

create policy run_cases_update on public.run_cases
  for update to authenticated
  using (public.can_access_run(run_id))
  with check (public.can_access_run(run_id));

create policy run_cases_delete on public.run_cases
  for delete to authenticated
  using (public.can_access_run(run_id));
