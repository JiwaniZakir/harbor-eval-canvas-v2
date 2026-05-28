-- ============================================================================
-- C2/C3: Extend projects + domains to fully mirror the Zustand client state so
-- the canvas can hydrate/write-through without lossy mapping.
-- ============================================================================

-- --- projects: target model, workflow description, global progress ----------
alter table public.projects
  add column if not exists target_model         jsonb,
  add column if not exists workflow_description  text,
  add column if not exists global_progress       integer not null default 0;

-- --- domains: progress + artifacts (mirror DomainState) ----------------------
alter table public.domains
  add column if not exists progress  integer not null default 0,
  add column if not exists artifacts jsonb   not null default '[]'::jsonb;
