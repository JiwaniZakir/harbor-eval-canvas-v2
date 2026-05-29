-- ============================================================================
-- D1-D8: Eval engine schema.
--   - rubrics + rubric_scorers (D2/D3): pluggable weighted scorer composition
--   - extend runs with rubric_id, run state machine + progress (D4/D8)
--   - extend run_cases with rubric/scorer breakdown + token counts (D7)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- rubrics — a named, weighted composition of scorers, optionally attached to
-- a project domain (D3).
-- ---------------------------------------------------------------------------
create table if not exists public.rubrics (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  domain_id   uuid references public.domains (id) on delete set null,
  name        text not null,
  description text,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists rubrics_project_id_idx on public.rubrics (project_id);
create index if not exists rubrics_domain_id_idx  on public.rubrics (domain_id);

-- ---------------------------------------------------------------------------
-- rubric_scorers — one row per scorer in a rubric, with a weight and the
-- scorer-specific config (regex pattern, json schema, llm-judge rubric, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.rubric_scorers (
  id          uuid primary key default gen_random_uuid(),
  rubric_id   uuid not null references public.rubrics (id) on delete cascade,
  scorer_type text not null
                check (scorer_type in ('exact_match','contains','regex','json_schema','llm_judge')),
  weight      numeric not null default 1,
  config      jsonb not null default '{}'::jsonb,
  position    integer not null default 0
);

create index if not exists rubric_scorers_rubric_id_idx on public.rubric_scorers (rubric_id);

-- ---------------------------------------------------------------------------
-- runs — extend with rubric, state machine, progress, prompt template,
-- baseline-diff linkage, and error capture (D4/D6/D8).
-- ---------------------------------------------------------------------------
alter table public.runs
  add column if not exists rubric_id        uuid references public.rubrics (id) on delete set null,
  add column if not exists prompt_template  text,
  add column if not exists total_cases      integer not null default 0,
  add column if not exists completed_cases  integer not null default 0,
  add column if not exists baseline_run_id  uuid references public.runs (id) on delete set null,
  add column if not exists error            text,
  add column if not exists updated_at       timestamptz not null default now();

-- Normalize legacy null statuses to the new state machine default.
update public.runs set status = 'queued' where status is null;

create index if not exists runs_rubric_id_idx   on public.runs (rubric_id);
create index if not exists runs_baseline_run_idx on public.runs (baseline_run_id);

-- ---------------------------------------------------------------------------
-- run_cases — extend with the prompt sent, scorer breakdown, token counts (D7).
-- ---------------------------------------------------------------------------
alter table public.run_cases
  add column if not exists prompt           text,
  add column if not exists scorer_breakdown jsonb,
  add column if not exists prompt_tokens    integer,
  add column if not exists completion_tokens integer,
  add column if not exists status           text not null default 'completed',
  add column if not exists error            text;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists rubrics_set_updated_at on public.rubrics;
create trigger rubrics_set_updated_at
  before update on public.rubrics
  for each row execute function public.set_updated_at();

drop trigger if exists runs_set_updated_at on public.runs;
create trigger runs_set_updated_at
  before update on public.runs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — rubrics + rubric_scorers gated through the parent project (reuse the
-- existing can_access_project / SECURITY DEFINER helpers).
-- ---------------------------------------------------------------------------
alter table public.rubrics        enable row level security;
alter table public.rubric_scorers enable row level security;

create policy rubrics_select on public.rubrics
  for select to authenticated using (public.can_access_project(project_id));
create policy rubrics_insert on public.rubrics
  for insert to authenticated with check (public.can_access_project(project_id));
create policy rubrics_update on public.rubrics
  for update to authenticated
  using (public.can_access_project(project_id))
  with check (public.can_access_project(project_id));
create policy rubrics_delete on public.rubrics
  for delete to authenticated using (public.can_access_project(project_id));

create or replace function public.can_access_rubric(rubric_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.rubrics ru
    join public.projects p    on p.id = ru.project_id
    join public.org_members m on m.org_id = p.org_id
    where ru.id = rubric_uuid
      and m.user_id = auth.uid()
  );
$$;

grant execute on function public.can_access_rubric(uuid) to authenticated;

create policy rubric_scorers_select on public.rubric_scorers
  for select to authenticated using (public.can_access_rubric(rubric_id));
create policy rubric_scorers_insert on public.rubric_scorers
  for insert to authenticated with check (public.can_access_rubric(rubric_id));
create policy rubric_scorers_update on public.rubric_scorers
  for update to authenticated
  using (public.can_access_rubric(rubric_id))
  with check (public.can_access_rubric(rubric_id));
create policy rubric_scorers_delete on public.rubric_scorers
  for delete to authenticated using (public.can_access_rubric(rubric_id));
