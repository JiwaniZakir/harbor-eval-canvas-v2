-- Fix dataset_cases: correct self-referential FK + add missing case columns.
-- The original core_schema created dataset_cases with dataset_id -> dataset_cases
-- (self) and without the input/expected/metadata columns. This corrects it.

-- Drop the broken self-referential FK if present.
do $$
declare
  conname text;
begin
  select c.conname into conname
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  where t.relname = 'dataset_cases'
    and c.contype = 'f'
    and pg_get_constraintdef(c.oid) ilike '%references public.dataset_cases%';
  if conname is not null then
    execute format('alter table public.dataset_cases drop constraint %I', conname);
  end if;
end $$;

-- Add the correct FK to datasets (only if a datasets-referencing FK is absent).
do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'dataset_cases'
      and c.contype = 'f'
      and pg_get_constraintdef(c.oid) ilike '%references public.datasets%'
  ) then
    alter table public.dataset_cases
      add constraint dataset_cases_dataset_id_fkey
      foreign key (dataset_id) references public.datasets(id) on delete cascade;
  end if;
end $$;

-- Add missing case columns.
alter table public.dataset_cases
  add column if not exists input text not null default '',
  add column if not exists expected text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

-- Drop the now-unneeded default on input (keep not-null).
alter table public.dataset_cases alter column input drop default;

create index if not exists idx_dataset_cases_dataset_id on public.dataset_cases(dataset_id);

-- Rubrics: a rubric is a set of weighted scorers attached to a domain.
create table if not exists public.rubrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  domain_id uuid references public.domains(id) on delete set null,
  name text not null,
  -- [{ scorerId, weight, threshold, config }]
  scorers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_rubrics_project_id on public.rubrics(project_id);

-- Link a run to the rubric it used.
alter table public.runs add column if not exists rubric_id uuid references public.rubrics(id) on delete set null;
-- Progress + cancel support for the run queue.
alter table public.runs add column if not exists total_cases integer not null default 0;
alter table public.runs add column if not exists completed_cases integer not null default 0;
alter table public.runs add column if not exists error text;

-- RLS for rubrics (mirror the org-scoped pattern used elsewhere).
alter table public.rubrics enable row level security;

drop policy if exists "rubrics_select" on public.rubrics;
create policy "rubrics_select" on public.rubrics for select
  using (public.is_org_member((select org_id from public.projects where id = rubrics.project_id)));

drop policy if exists "rubrics_insert" on public.rubrics;
create policy "rubrics_insert" on public.rubrics for insert
  with check (public.is_org_member((select org_id from public.projects where id = rubrics.project_id)));

drop policy if exists "rubrics_update" on public.rubrics;
create policy "rubrics_update" on public.rubrics for update
  using (public.is_org_member((select org_id from public.projects where id = rubrics.project_id)));

drop policy if exists "rubrics_delete" on public.rubrics;
create policy "rubrics_delete" on public.rubrics for delete
  using (public.is_org_member((select org_id from public.projects where id = rubrics.project_id)));
