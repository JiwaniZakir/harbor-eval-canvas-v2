# Harbor Eval Canvas V2 — Production-Grade Ticket Plan

Goal: take the platform from "high-fidelity front-end prototype" to "production-grade, end-to-end".
Explicitly OUT OF SCOPE: billing, Stripe, paywalls (not charging yet).

Legend: [P0]=blocks production, [P1]=premium UX required, [P2]=polish.

---

## EPIC A — Bug fixes (do first)

- **A1 [P0]** Fix broken fonts. `public/fonts/Mondwest-Regular.woff2` is 0 bytes; `DepartureMono-Regular.woff2` is an HTML error page. Cofounder uses Inter (`font-sans`) + TT Neoris (`font-tt-neoris`, proprietary). Remove broken @font-face (globals.css 181-195), remove dead preload links in layout.tsx, standardize body+headings on Inter via next/font/google, use a clean geometric sans (e.g. Space Grotesk / Geist via next/font) as the display/brand font to evoke TT Neoris. Verify computed font-family in browser is no longer falling back to Figtree/serif by accident.
- **A2 [P0]** Make domain graphics visible without a click. Graphics currently only render inside WorkspacePlate after selecting a node. Add the WebP graphic as a thumbnail on each canvas domain node card and in the empty-canvas state. Lazy-load, object-fit cover, rounded corners, subtle gradient.
- **A3 [P1]** Replace remaining placeholder/lorem content with real copy; ensure all 8 domain graphics map to the correct domain (current mapping reuses code_generation.webp for long_context, robustness.webp for tool_use, etc. — generate or remap correct art).

## EPIC B — Identity & multi-tenancy [P0]

- **B1** Choose + install auth (Supabase Auth recommended: bundles Postgres + RLS).
- **B2** Sign-in / sign-up / magic-link UI screens (light theme, on-brand).
- **B3** Session middleware + protected routes; redirect unauth to /login.
- **B4** Org/Team/Project data model (schema + migrations).
- **B5** Membership + roles (owner/admin/member/viewer) with RBAC checks.
- **B6** Org switcher + project switcher UI.
- **B7** Invite teammates (email invite + accept flow).

## EPIC C — Persistence (replace localStorage) [P0]

- **C1** Postgres schema for projects, domains, runs, results, artifacts.
- **C2** Server actions / API for CRUD on projects + domains.
- **C3** Migrate Zustand stores to hydrate from server + write-through to DB.
- **C4** Optimistic updates with rollback on error.
- **C5** Row-level security policies per org.
- **C6** Data export (JSON) + import for a project.

## EPIC D — Real eval engine [P0]

- **D1** Dataset model: upload/define test cases (input, expected, metadata).
- **D2** Scorer abstraction: exact-match, contains, LLM-judge, regex, JSON-schema.
- **D3** Rubric builder UI.
- **D4** Run executor: batch over dataset x model, persist per-case results.
- **D5** Multi-model compare (run same dataset across N models, side-by-side).
- **D6** Regression tracking: compare run vs baseline, flag deltas.
- **D7** Trace viewer: per-case prompt/response/score/latency/cost.
- **D8** Queue + progress for long runs (server-side, resumable).

## EPIC E — Premium UX [P1]

- **E1** Undo/redo + command history (zundo or custom temporal store).
- **E2** Global command palette upgrades (search across projects/runs/domains).
- **E3** Global fuzzy search surface.
- **E4** Motion design pass (Framer Motion / View Transitions; shared-element canvas↔panel).
- **E5** Real-time collab: presence + cursors (Supabase Realtime) — at least presence.
- **E6** Comments/annotations on domains and runs.
- **E7** Notifications: in-app toast center + email on run completion/regression + webhook.
- **E8** Dark mode + theme tokens + density toggle.
- **E9** Onboarding: guided tour, sample project, empty-state CTAs, checklist.

## EPIC F — Data viz [P1]

- **F1** Score distribution charts (histograms).
- **F2** Trend lines across runs over time.
- **F3** Results table with sort/filter/pagination.
- **F4** Confusion matrix / pass-fail heatmap.
- **F5** Export charts + tables to CSV / PDF.

## EPIC G — Settings & ops surfaces [P1]

- **G1** Profile settings.
- **G2** Team/org settings + member management.
- **G3** API keys management (BYO model provider keys, stored encrypted).
- **G4** Integrations (Slack/webhook).
- **G5** Usage dashboard (runs, cases, tokens — no billing).

## EPIC H — Quality, a11y, responsive [P1]

- **H1** WCAG 2.1 AA: ARIA roles/labels everywhere, focus traps, skip links.
- **H2** Keyboard-first nav + discoverable shortcut sheet (?).
- **H3** Screen-reader pass; reduced-motion support.
- **H4** Contrast audit + fixes.
- **H5** Responsive/mobile layouts; touch gestures on canvas.
- **H6** Error/loading/empty depth on every surface; retry flows; offline handling.

## EPIC I — Engineering hardening [P0/P1]

- **I1** Unit tests (Vitest) for stores, scorers, eval engine.
- **I2** E2E tests (Playwright) for auth, create project, run eval flows.
- **I3** CI: GitHub Actions (typecheck, lint, test, build) on PR.
- **I4** Error monitoring (Sentry) + structured logging.
- **I5** Rate limiting + input validation (zod) on all API routes.
- **I6** Env var validation at boot; secrets documented.
- **I7** Performance: code-split, image optimization, lighthouse > 90.
