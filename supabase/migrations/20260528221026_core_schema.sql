-- ============================================================================
-- Harbor Eval Canvas V2 — Core Schema
-- Orgs, memberships, projects, domains, datasets, runs.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- orgs
-- ---------------------------------------------------------------------------
create table if not exists public.orgs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- org_members
-- ---------------------------------------------------------------------------
create table if not exists public.org_members (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.orgs (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        text not null default 'member'
                check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at  timestamptz not null default now(),
  unique (org_id, user_id)
);

create index if not exists org_members_org_id_idx  on public.org_members (org_id);
create index if not exists org_members_user_id_idx on public.org_members (user_id);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.orgs (id) on delete cascade,
  name        text not null,
  description text,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_org_id_idx on public.projects (org_id);

-- ---------------------------------------------------------------------------
-- domains — mirrors the Zustand per-domain state
-- ---------------------------------------------------------------------------
create table if not exists public.domains (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references public.projects (id) on delete cascade,
  domain_key       text not null,
  status           text,
  probe_summary    jsonb,
  scaffold_agents  jsonb,
  validation_gates jsonb,
  sweep_summary    jsonb,
  updated_at       timestamptz not null default now(),
  unique (project_id, domain_key)
);

create index if not exists domains_project_id_idx on public.domains (project_id);

-- ---------------------------------------------------------------------------
-- datasets
-- ---------------------------------------------------------------------------
create table if not exists public.datasets (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists datasets_project_id_idx on public.datasets (project_id);

-- ---------------------------------------------------------------------------
-- dataset_cases
-- ---------------------------------------------------------------------------
create table if not exists public.dataset_cases (
  id          uuid primary key default gen_random_uuid(),
  dataset_id  uuid not null references public.datasets (id) on delete cascade,
  input       text,
  expected    text,
  metadata    jsonb
);

create index if not exists dataset_cases_dataset_id_idx on public.dataset_cases (dataset_id);

-- ---------------------------------------------------------------------------
-- runs
-- ---------------------------------------------------------------------------
create table if not exists public.runs (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  domain_id     uuid references public.domains (id) on delete set null,
  dataset_id    uuid references public.datasets (id) on delete set null,
  model         text,
  status        text,
  is_baseline   boolean not null default false,
  summary       jsonb,
  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create index if not exists runs_project_id_idx on public.runs (project_id);
create index if not exists runs_domain_id_idx  on public.runs (domain_id);
create index if not exists runs_dataset_id_idx on public.runs (dataset_id);

-- ---------------------------------------------------------------------------
-- run_cases
-- ---------------------------------------------------------------------------
create table if not exists public.run_cases (
  id                uuid primary key default gen_random_uuid(),
  run_id            uuid not null references public.runs (id) on delete cascade,
  dataset_case_id   uuid references public.dataset_cases (id) on delete set null,
  input             text,
  response          text,
  score             numeric,
  passed            boolean,
  latency_ms        integer,
  cost_usd          numeric,
  scorer_rationale  text
);

create index if not exists run_cases_run_id_idx          on public.run_cases (run_id);
create index if not exists run_cases_dataset_case_id_idx on public.run_cases (dataset_case_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger domains_set_updated_at
  before update on public.domains
  for each row execute function public.set_updated_at();
