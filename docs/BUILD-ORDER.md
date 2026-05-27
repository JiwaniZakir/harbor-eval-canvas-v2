# Harbor Eval Canvas - Build Order

## Overview
84 issues across 7 milestones. Every component from the 5,264-line atomic interaction spec is accounted for.

---

## Phase 0: Pre-requisites (do first, in parallel)
| Issue | Title | Est |
|-------|-------|-----|
| #59 | Audit fix: reconcile CSS variable naming | 1h |
| #84 | Audit fix: resolve spec contradictions (dims, colors, timings) | 1h |
| #78 | Dynamic CSS variable patterns (--domain-accent, --glow-color) | 1h |
| #63 | Provider icon SVGs (Google, Anthropic, OpenAI, Custom) | 1h |
| #83 | Add intermediate fg opacity values | 0.5h |

## Phase 1: Foundation (M1) - all other work depends on this
**Sequential:**
| Order | Issue | Title | Depends on | Est |
|-------|-------|-------|-----------|-----|
| 1 | #1 | Design system tokens (CSS custom properties) | #59, #78, #83, #84 | 3h |
| 2 | #2 | Load Figtree, PP Mondwest, EB Garamond fonts | #1 | 1h |

**Then parallel tracks:**

| Track A (Shell) | Track B (Panel) | Track C (Polish) |
|----------------|----------------|-------------------|
| #3 Top bar | #4 Bottom tabs | #52 Animation keyframes |
| | #5 Right panel shell | #28 Shimmer component |
| | #6 Chat composer | #53 Toast system |
| | | #65 Global scrollbar styling |

## Phase 2: Onboarding (M2)
**Sequential chain:**
| Order | Issue | Title | Est |
|-------|-------|-------|-----|
| 1 | #7 | Onboarding shell + glow background | 2h |
| 2a | #8 | Step 1: Project name | 1.5h |
| 2b | #9 | Step 2: Model selection | 2h |
| 2c | #10 | Step 3: Workflow description | 1.5h |
| 2c+ | #71 | Workflow editor ProseMirror clarification | 1h |
| 2d | #11 | Step 4: Clarifying questions | 2h |
| 2e | #12 | Step 5: Hypothesis review | 2h |
| 2e+ | #70 | Edit hypothesis inline editing | 1h |
| 3 | #13 | Canvas transition animation | 1.5h |
| 4 | #14 | LLM integration for onboarding | 3h |

## Phase 3: Canvas (M3)
**Sequential chain:**
| Order | Issue | Title | Est |
|-------|-------|-------|-----|
| 1 | #15 | Canvas container + camera | 2h |
| 2 | #16 | SVG ring (stroke-dasharray animation) | 2h |
| 3 | #17 | Connection lines (domain-hub) | 1.5h |
| 4a | #18 | 8 domain nodes | 3h |
| 4b | #19 | Center hub node | 1.5h |
| 5 | #20 | Zustand canvas store | 2h |
| 6 | #21 | Multi-domain selection states | 1.5h |

## Phase 4: Workspace + Fan-Out (M4)
| Order | Issue | Title | Est |
|-------|-------|-------|-----|
| 1 | #22 | Workspace plate overlay | 3h |
| 2 | #23 | Probe fan-out cards | 3h |
| 2p | #26 | Pipeline roadmap strip | 2h |
| 3 | #24 | Scaffold fan-out cards | 2.5h |
| 4 | #25 | Validation gate | 2h |
| 5 | #27 | State management for pipeline | 2h |
| 6 | #29 | Cancel mechanism | 1h |

## Phase 5: Chat + Tabs (M5) - can start after Phase 1 completes
**Parallel with Phases 2-4!**

| Order | Issue | Title | Est |
|-------|-------|-------|-----|
| 1p | #30 | Home tab (greeting + stats) | 2h |
| 1p | #31 | Agent tab (message list) | 3h |
| 1p | #38 | Project tab | 2h |
| 1p | #39 | Files tab | 2h |
| 1p | #40 | Sweeps tab + trajectory viewer | 3h |
| 2 | #32-36 | 5 chat card types | 5h |
| 3 | #37 | Markdown rendering | 2h |
| 4 | #60 | Streaming text display | 2h |

## Phase 6: Integration (M6)
| Order | Issue | Title | Est |
|-------|-------|-------|-----|
| 1p | #42 | Domain state machine | 3h |
| 1p | #43 | Chat message store | 2h |
| 1p | #72 | Global progress calculation | 1h |
| 2 | #41 | Agent orchestrator pipeline | 4h |
| 3 | #68 | Probe REDESIGN/REJECT flows | 2h |
| 3p | #67 | Iteration flow (edit, re-sweep) | 2.5h |
| 3p | #69 | Validation gate failure + retry | 2h |
| 4 | #74 | Partial pipeline failure handling | 2h |
| 4p | #73 | Background operation indicators | 1.5h |
| 5 | #44 | Model change flow | 1.5h |
| 5p | #75 | Multi-model sweep execution | 2h |
| 6 | #45 | Persistence (localStorage) | 2h |
| 7 | #46 | New project flow | 1.5h |
| 8 | #47 | Keyboard shortcuts | 1.5h |
| 9 | #62 | E2E happy path test | 3h |

## Phase 7: Polish (M7) - assets can start Day 1
**Assets (no code deps):**
| Issue | Title | Est |
|-------|-------|-----|
| #48 | Pipeline stage icons (5 SVGs) | 1h |
| #49 | Domain icons (8 tinted SVGs) | 1.5h |
| #50 | Center hub illustration | 1h |
| #51 | Empty state illustrations (3) | 1h |
| #64 | Domain background illustrations (8) | 1.5h |

**Components (after M1):**
| Issue | Title | Est |
|-------|-------|-----|
| #54 | Skeleton loading states | 2h |
| #55 | Focus ring + keyboard accessibility | 1.5h |
| #56 | Confirmation dialog | 1.5h |
| #58 | Error states | 2h |
| #61 | File upload flow | 2h |
| #66 | Fan-out transition animations | 1.5h |
| #79 | Domain CSS variable system (accent-soft) | 1h |
| #80 | Untested domain glow effect | 0.5h |
| #81 | Top bar breadcrumb | 1h |
| #82 | Section header badge counts | 0.5h |
| #76 | URL routing | 2h |
| #77 | iOS safe area + keyboard | 1.5h |
| #57 | Responsive mobile layout | 4h |

---

## Parallelization Summary

```
Week 1:
  Track A: #59,#84,#78,#83 → #1 → #2 → #3 → #7 → #8-#12
  Track B: #63 → #4 → #5 → #6 → #30,#31,#38,#39,#40 (parallel tabs)
  Track C: #48,#49,#50,#51,#64 (all assets)

Week 2:
  Track A: #70,#71 → #13 → #15 → #16 → #17 → #18 → #20 → #21
  Track B: #32-#36 → #37 → #60 (chat cards, markdown, streaming)
  Track C: #52,#53,#28,#65 (animations, toast, shimmer, scrollbar)

Week 3:
  Track A: #22 → #23 → #24 → #25 → #27 → #29
  Track B: #42,#43,#72 → #41 → #68,#67,#69
  Track C: #54,#55,#56,#58,#66 (polish components)

Week 4:
  Track A: #14,#74,#73 (LLM integration, error handling, background ops)
  Track B: #44,#75 → #45 → #46 → #47 → #62 (integration + E2E)
  Track C: #79,#80,#81,#82,#76,#77,#57,#61 (all remaining polish)
```

## Critical Path
```
#59/#84/#78 → #1 → #2 → #7 → #8→...→#12 → #13 → #15 → #16 → #17 → #18 → #20 → #22 → #23 → #24 → #25 → #27 → #42 → #41 → #62
```
**~23 issues on critical path, ~50h estimated.**

With 3 parallel tracks, total calendar time: ~3 weeks.

---

## Coverage Verification

### Spec Component Index (194 components) → All mapped to issues
- Phase 0 (24 components): #1-#6
- Phase 1 (36 components): #7-#14, #70, #71
- Phase 2 (15 components): #15-#21
- Phase 3 (10 components): #22
- Phase 4 (26 components): #23-#29, #66
- Phase 5 (12 components): #26
- Phase 6 (76 components): #30-#40, #60
- Phase 7 (assets): #48-#51, #63, #64
- Phase 8 (polish): #52-#58, #65, #66, #79-#82
- Phase 9 (state/integration): #20, #42-#47, #62, #67-#78

### Audit Report Coverage
- §A CSS variable fixes: #59, #78, #83, #84
- §B Missing specs: #67-#71, #75, #78
- §C Contradictions: #84
- §D Missing interactions: #60, #66, #72-#74, #29
- §E Missing components: #37, #61
- §F Cofounder deviations: #79-#82

### Appendix B Flows
- B.1 Happy path: #62
- B.2 Iteration path: #67
- B.3 Multi-domain: #21, #41, #73
- B.4 Multi-model comparison: #40, #75
