# Eval Creation: Challenges and Workflows

> Research document synthesized from 10 academic papers, industry reports, and practitioner interviews on the state of AI evaluation creation. Compiled 2026-05-26.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Why Eval Creation Is Hard](#why-eval-creation-is-hard)
3. [The Ten Core Challenges](#the-ten-core-challenges)
4. [Current Workflows and Their Limitations](#current-workflows-and-their-limitations)
5. [What Good Looks Like: Emerging Best Practices](#what-good-looks-like-emerging-best-practices)
6. [Implications for Harbor](#implications-for-harbor)
7. [Manual vs. Automatable: Honest Assessment](#manual-vs-automatable-honest-assessment)
8. [What Harbor Eval Canvas Should Actually Build](#what-harbor-eval-canvas-should-actually-build)
9. [Sources](#sources)

---

## Executive Summary

Creating high-quality AI evaluations is widely recognized as one of the hardest unsolved problems in the AI ecosystem. Across a survey of leading research (Anthropic, Google DeepMind, EU JRC, UK AISI, EleutherAI, Oxford, UC Berkeley, and others), a consistent picture emerges:

- **Robust evaluations are extremely difficult to develop and implement.** (Anthropic, 2023)
- **The current evaluation ecosystem is insufficient** -- static benchmarks face validity challenges, and ad hoc approaches rarely scale. (Weidinger et al., 2025)
- **AI evaluation requires specialized infrastructure, statistical rigor, and community coordination** beyond traditional software development practices. (UK AISI / inspect_evals, 2025)
- **No established scientific methodology for AI evaluation yet exists.** The field needs to mature into a proper "evaluation science." (Weidinger et al., 2025; EvalEval Coalition, 2026)

The gap between what evaluations *should* measure and what they *actually* measure represents both a risk and an opportunity. Tools that lower the barrier to creating valid, reproducible, and interpretable evaluations can have outsized impact.

---

## Why Eval Creation Is Hard

Eval creation sits at the intersection of multiple hard problems:

| Dimension | Why it's hard |
|---|---|
| **Measurement science** | Translating abstract concepts (safety, reasoning, helpfulness) into concrete, measurable tasks requires deep psychometric and domain expertise |
| **Software engineering** | Evaluation infrastructure demands specialized tooling -- harnesses, sandboxes, scoring pipelines, reproducibility guarantees |
| **Domain expertise** | High-quality eval items require subject-matter experts who understand both the domain *and* how LLMs behave |
| **Statistics** | Proper uncertainty quantification, resampling, and cross-model comparison require statistical sophistication |
| **Incentive alignment** | Commercial pressure to optimize for leaderboards actively undermines evaluation validity |

> "The question is no longer 'How good is the model?' but 'Can we trust the system to behave as intended, under change, at scale?'" -- El Filali & Bedar, 2026

---

## The Ten Core Challenges

### 1. Construct Validity

**The problem:** Benchmarks often don't measure what they claim to measure. A benchmark labeled "reasoning" may actually measure pattern matching or memorization.

**Evidence:**
- A systematic review of 445 LLM benchmarks found widespread patterns that undermine validity of resulting claims (Bean et al., 2024 -- Oxford/UK AISI)
- EvalEval Coalition interviews identified validity as "the central challenge" in GenAI evaluation, spanning construct validity, content validity, and criterion validity (EvalEval, 2026)
- Operationalizing abstract phenomena (e.g., "intelligence," "safety") into concrete tasks and metrics is inherently lossy -- "the value of a benchmark depends on whether it is a good proxy for the real-world phenomenon it intends to measure" (Bean et al., 2024)

**Implication for tooling:** Eval creation tools should prompt authors to explicitly define the construct being measured and justify why their tasks are valid proxies.

### 2. Data Contamination

**The problem:** Training data overlap with evaluation datasets undermines results. As training corpora grow to encompass most of the internet, it becomes increasingly difficult to create "clean" evaluation data.

**Evidence:**
- The EU JRC meta-review flags data contamination as a systemic issue across benchmarks (Eriksson et al., 2025)
- Failures to distinguish signal from noise compound this problem

**Implication for tooling:** Eval creation workflows should include contamination checks (e.g., n-gram overlap detection, provenance tracking) and encourage novel item generation.

### 3. Benchmark Gaming and Misaligned Incentives

**The problem:** Commercial incentives lead to optimizing for benchmarks rather than real capabilities. Goodhart's Law ("when a measure becomes a target, it ceases to be a good measure") is rampant.

**Evidence:**
- "Benchmark practices are fundamentally shaped by cultural, commercial and competitive dynamics that often prioritise state-of-the-art performance at the expense of broader societal concerns" (EU JRC, 2025)
- There is an "incentive mismatch between conducting high-quality evaluations and publishing new models or modeling techniques" (Gehrmann et al., 2022)

**Implication for tooling:** Design evals that resist gaming -- e.g., through item banks with controlled disclosure, procedurally generated variants, or private held-out sets.

### 4. Static vs. Dynamic Evaluation

**The problem:** One-time static benchmarks fail to capture real-world deployment behavior. Models are increasingly multimodal and interact with humans and other systems over time.

**Evidence:**
- "Most evaluation practices remain anchored in assumptions inherited from the model-centric era: static benchmarks, aggregate scores, and one-off success criteria" (El Filali & Bedar, 2026)
- "The historical focus on benchmarks and leaderboards has been effective at encouraging shared directions; however, as AI products become widely integrated into everyday lives, it is increasingly clear that static benchmarks are insufficient" (Weidinger et al., 2025)

**Implication for tooling:** Support iterative, living evaluations that can be updated as models and deployment contexts evolve.

### 5. Reproducibility

**The problem:** Evaluation results are hard to replicate across different setups. Minor implementation details -- tokenization, prompt formatting, sampling parameters -- can dramatically change scores.

**Evidence:**
- EleutherAI's lm-eval team reports "frequently struggling to reproduce the results reported in various papers" across three years of experience (Biderman et al., 2024)
- "Transparent and reproducible evaluation of large language models is very challenging"
- The inspect_evals project found that reproducibility requires "systematic quality control processes" beyond standard software QA (Abbas et al., 2025)

**Implication for tooling:** Eval creation tools must capture the full specification -- prompt templates, formatting, scoring rubrics, sampling config -- as versioned, executable artifacts.

### 6. Engineering Complexity

**The problem:** Implementing and maintaining evaluation infrastructure requires specialized effort that most teams underestimate.

**Evidence:**
- Anthropic reports "significant engineering effort" just to install BIG-bench, and found it "sufficiently unwieldy" that they dropped it entirely (Anthropic, 2023)
- HELM "requires coordination and communication with external parties" and "iteration time is slow -- it can take months to evaluate new models"
- The inspect_evals maintainers found that "AI evaluation requires specialized infrastructure... beyond traditional software development practices"

**Implication for tooling:** Reduce engineering overhead. Eval creation should be accessible to domain experts who are not infrastructure engineers.

### 7. Lack of Evaluation Science

**The problem:** No established scientific methodology for AI evaluation yet exists. The field lacks the equivalent of clinical trial methodology, aerospace safety testing, or pharmaceutical evaluation frameworks.

**Evidence:**
- Weidinger et al. (2025) explicitly call for "maturing an evaluation science for generative AI systems," drawing lessons from transportation, aerospace, and pharmaceutical safety
- "Evaluation metrics must be applicable to real-world performance, metrics must be iteratively refined, and evaluation institutions and norms must be established"
- Burden (2024) argues evaluation should "look towards cognitive sciences for inspiration"

**Implication for tooling:** Build structured workflows that encode emerging best practices (construct definition, validity checks, statistical rigor) as guardrails in the creation process.

### 8. Domain Expert Scarcity

**The problem:** High-quality evaluations require hard-to-find domain expertise. Crowdworkers often lack the depth needed, while domain experts are expensive and have limited bandwidth.

**Evidence:**
- Anthropic notes that "domain expert red-teaming is expensive and hard to scale" and "crowdworker evaluations face quality and consistency challenges"
- The inspect_evals project developed a "structured cohort management framework" specifically to address the challenge of coordinating domain expert contributors

**Implication for tooling:** Design workflows that maximize the value of limited expert time -- e.g., experts define constructs and review items, while AI assists with item generation and formatting.

### 9. Prompt Sensitivity

**The problem:** Small changes in prompting can dramatically alter evaluation outcomes, making results fragile and hard to interpret.

**Evidence:**
- Anthropic's experience with HELM: "Methods that work well for evaluating other providers' models do not necessarily work well for our models... HELM gives a misleading impression of Claude's performance" due to prompt format differences
- EleutherAI identifies "sensitivity of models to evaluation setup" as a core methodological challenge
- Multiple studies show that answer ordering, few-shot example selection, and instruction phrasing can swing benchmark scores by 10-20+ percentage points

**Implication for tooling:** Eval creation tools should support prompt robustness testing -- running the same eval with multiple prompt variants and reporting sensitivity.

### 10. Interpretability of Results

**The problem:** Even when evaluations produce numbers, it's often unclear what those numbers mean for real-world decisions.

**Evidence:**
- EvalEval Coalition identifies interpretability as one of three key themes alongside validity and practicality (2026)
- "Evaluation pipelines themselves introduce silent failure modes" and "high benchmark scores routinely mislead teams" (El Filali & Bedar, 2026)
- "A single correct output, more than ever, proves nothing" for agentic systems

**Implication for tooling:** Provide richer output than aggregate scores -- error taxonomies, failure case analysis, confidence intervals, and actionable insights.

---

## Current Workflows and Their Limitations

### The Typical Eval Creation Workflow Today

```
1. Researcher identifies a capability to test
2. Manually writes 50-500 test items (questions + expected answers)
3. Formats items into a benchmark-specific schema (e.g., JSONL)
4. Writes evaluation harness code or adapts existing framework
5. Runs on a few models, checks results look reasonable
6. Publishes dataset + paper
7. Benchmark is used as-is for years, rarely updated
```

### Known Failure Modes

| Workflow step | Failure mode |
|---|---|
| Construct definition | Skipped or implicit; no validity argument |
| Item authoring | Written by ML researchers, not domain experts; low diversity |
| Quality control | Limited piloting; no item-level statistics |
| Scoring | Brittle exact-match or simple regex; model-as-judge without calibration |
| Maintenance | Benchmark becomes stale; contamination grows over time |
| Documentation | Insufficient for reproduction; prompt templates missing |

### Frameworks in Use

| Framework | Approach | Strengths | Weaknesses |
|---|---|---|---|
| **lm-eval (EleutherAI)** | Open-source harness, community tasks | Reproducible, extensible | Steep learning curve, YAML config complexity |
| **inspect (UK AISI)** | Python-native eval framework | Clean API, sandbox support | Early-stage, smaller community |
| **HELM (Stanford)** | Curated top-down benchmark suite | Expert-selected, standardized | Slow iteration, prompt format issues |
| **BIG-bench** | Bottom-up community submissions | Broad coverage | Unwieldy, poor scalability |
| **Custom internal** | Lab-specific tooling | Tailored to needs | Not reusable, hard to compare |

---

## What Good Looks Like: Emerging Best Practices

Drawing from the literature, high-quality eval creation workflows should include:

### 1. Explicit Construct Definition
- Define what you're measuring *before* writing items
- Justify why your tasks are valid proxies for the construct
- Reference prior art or theoretical frameworks

### 2. Structured Item Development
- Use item specification templates (stimulus, prompt, expected response, scoring rubric)
- Include metadata: difficulty level, topic tags, construct alignment
- Pilot items with target models before finalizing

### 3. Domain Expert Involvement
- Experts define constructs and create/review items
- AI can assist with item generation, but experts must validate
- Use structured cohort management for scaling expert contributions

### 4. Statistical Rigor
- Report confidence intervals, not just point estimates
- Use proper resampling methods for cross-model comparison
- Conduct item-level analysis (difficulty, discrimination, bias)

### 5. Contamination Mitigation
- Track item provenance
- Use novel/synthetic items where possible
- Maintain private held-out sets

### 6. Reproducibility by Default
- Version all artifacts: prompts, scoring code, model configs
- Pin dependencies and document the full evaluation stack
- Use deterministic sampling where possible

### 7. Iterative Refinement
- Treat evals as living documents, not one-time publications
- Update items as models evolve and contamination is detected
- Track eval validity over time

### 8. Rich Reporting
- Go beyond aggregate scores
- Provide error taxonomies and failure case examples
- Report prompt sensitivity and confidence intervals
- Include actionable recommendations, not just numbers

---

## Implications for Harbor

Based on this research, a tool that helps people create high-quality evals should:

1. **Guide construct definition** -- Walk eval creators through defining what they're measuring and why, before they write a single item
2. **Provide structured item templates** -- Make it easy to create well-specified items with metadata, scoring rubrics, and expected responses
3. **Lower the engineering barrier** -- Domain experts shouldn't need to write harness code; the tool should handle formatting, execution, and scoring
4. **Build in validity checks** -- Prompt sensitivity testing, contamination detection, item-level statistics
5. **Support collaboration** -- Enable domain experts and ML engineers to work together efficiently on eval creation
6. **Ensure reproducibility** -- Automatically version all artifacts and capture the full evaluation specification
7. **Enable iteration** -- Make it easy to update, extend, and refine evals over time rather than treating them as static artifacts
8. **Produce interpretable outputs** -- Rich reporting with error analysis, confidence intervals, and actionable insights

The research is clear: the bottleneck is not running evals (frameworks exist for that), but *creating good ones*. The creation workflow -- from construct definition through item authoring, validation, and maintenance -- is where the most value can be added.

---

## Manual vs. Automatable: Honest Assessment

This section maps every step of eval creation to a brutally honest automation readiness assessment. The judgments are grounded in the research above and in Harbor's own experience building 25+ eval tasks against `google/gemini-3-flash-preview` (documented in `harbor-eval-learnings.md`).

**Legend:**
- **Must Be Human** -- Automation produces unacceptable failure rates or validity risks; human judgment is irreplaceable.
- **Can Automate Now** -- Reliable automation exists today; human review is optional or lightweight.
- **Risky to Automate** -- Automation is tempting and partially feasible, but produces subtle, hard-to-catch failures that undermine eval quality.

| Step | Must Be Human | Can Automate Now | Risky to Automate | Notes |
|---|---|---|---|---|
| **Construct definition** | **Yes** | | | What capability or failure mode are you measuring, and why does it matter? This is a research question, not a generation task. LLMs can brainstorm candidate constructs, but the decision of what's worth measuring requires domain understanding, knowledge of the model landscape, and judgment about what gaps exist. Harbor's own experience: the 8-category failure-mode taxonomy (authority ambiguity, false recency, phantom joins, etc.) emerged from weeks of iterative probing and literature review, not from a single prompt. |
| **Item / task authoring** | | | **Yes** | LLM-authored eval items have a fundamental bootstrapping problem: items that an LLM can write are items that the same (or similar) LLMs can trivially solve. Harbor's de-spoil pass proved this -- 6 of 8 legacy tasks collapsed to easy once surface-level prompt tricks were removed. The items that survived (ds-11, ds-15) required multi-step reasoning that the author deeply understood. LLMs can draft item skeletons, but the adversarial substance -- the part that makes an eval hard -- must come from human insight into what models actually fail at. Using an LLM to author items and then testing those items against the same LLM family is circular. |
| **Fixture / data generation** | | **Yes** | | The most automatable step. Given a fixture specification (categories, row counts, trap families, column schemas, file formats), code generation for `build_inputs.py` is mechanical. Harbor's restaurant-style tasks use 700-900 LOC fixture generators that emit CSV/XLSX/PDF/JSON/JSONL/EML/notebook -- all deterministic, all seedable. The spec is human; the generation is machine. Multimodal artifact generation (PDFs via fpdf2, XLSX via openpyxl, notebooks) is template-driven and well-suited to automation. |
| **Ground truth creation** | | | **Yes** | The oracle (`solve.sh`) is the auditable ground truth. Writing it requires implementing the policy correctly from the input artifacts -- it's essentially writing a correct solution to your own eval. If the oracle is wrong, every downstream judgment is wrong. LLMs can draft oracles, but subtle policy misinterpretations (e.g., off-by-one in date ranges, wrong join semantics, misreading a PDF policy clause) are common and hard to catch without domain expertise. Harbor's experience: oracle bugs were caught only by careful manual review, not by automated checks. The oracle/nop sanity gate (oracle=1, nop=0) catches gross errors but not subtle ones. |
| **Verifier writing** | | | **Yes** | Deterministic pytest verifiers are partially automatable from an output contract (sheet names, headers, expected row sets, numeric tolerances). However, the hard part is deciding *what to verify* -- which dimensions distinguish genuine model failure from formatting noise. Harbor's restaurant-style verifiers check structural requirements, row-set coverage, per-trap-family routing, source attribution, and summary counts. The structural checks are mechanical; the trap-family routing logic encodes the eval's adversarial substance and requires understanding the failure mode. Risky because an auto-generated verifier that checks the wrong things gives false confidence. |
| **Dockerfile / environment setup** | | **Yes** | | Nearly fully automatable. Harbor tasks use a standard `python:3.12` base with pinned dependencies (openpyxl, pandas, pdfplumber, fpdf2, pytest). The Dockerfile pattern is templated. The only wrinkle is when tasks require unusual dependencies or system-level tools, which is rare for data-science evals. |
| **Calibration / difficulty tuning** | | | **Yes** | This is the iteration loop: run target model, check pass@3, diagnose failures via trajectory audit, adjust bait/fixtures/policy artifacts, re-run. The execution is automatable (Harbor's sweep service handles this). The diagnosis is partially automatable (trajectory auditors can classify failure modes). But the creative response -- *how* to make a task harder when the model passes -- requires human judgment. Harbor's experience: ds-21 went from 1/3 to 0/3 by removing an explicit "no normalization" sentence and re-anchoring on positive bridge rules. That insight is not something a current LLM reliably produces. An LLM will suggest adding more rows or making prompts longer, not restructuring the policy artifact. |
| **Contamination checks** | | **Yes** | | N-gram overlap detection, provenance tracking, and training-data membership inference are all automatable. The harder question -- whether a task's *structure* (not just its text) overlaps with training data -- is an open research problem, but basic contamination checks are well-understood tooling. Harbor's synthetic fixture approach (all data generated by `build_inputs.py` with random seeds) inherently mitigates text-level contamination. |
| **Prompt sensitivity testing** | | **Yes** | | Running the same eval with multiple prompt variants (instruction reordering, few-shot vs. zero-shot, format variations) and reporting score variance is straightforward automation. This is already implemented in frameworks like lm-eval and inspect. The analysis of *why* a prompt variant changes scores requires human interpretation, but the testing itself is mechanical. |
| **Oracle solution writing** | | | **Yes** | Same risks as ground truth creation (above). The oracle must be correct, complete, and must not contain shortcuts that wouldn't generalize. LLMs can draft oracle solutions, but they tend to take the same shortcuts the eval is designed to catch (e.g., using recency heuristics, imputing nulls, normalizing IDs without policy authorization). This is the deepest irony of LLM-assisted eval creation: the oracle author must be *better* than the model being tested at the specific skill being evaluated. |
| **Pilot runs** | | **Yes** | | Running oracle, nop, and target-model trials is pure infrastructure. Harbor's sweep service automates this entirely: queue trials, parse rewards, compute pass@k, store trajectories. No human judgment needed for execution; human judgment needed for interpreting results. |
| **Iteration** | **Yes** | | | The creative core of eval development. When a task is too easy, *why* is it too easy? When it's too hard (nop-like failures from format issues), *what* is confusing? Harbor's learnings doc catalogs iteration patterns: self-labelled bait (ds-19, ds-23), explicit negation instructions that models obey (ds-21 v1), answer-shaped authority fields (ds-08, ds-13), data dictionaries doubling as verifier pseudocode (ds-09, ds-10, ds-14). Each fix was a qualitative judgment. An iteration agent can propose edits, but the human must judge whether those edits preserve the eval's construct validity while changing its difficulty. |

### The Fundamental Bootstrapping Problem

The elephant in the room: **using LLMs to generate evals that test LLMs is inherently circular.** If GPT-5 writes an eval item, GPT-5 (and similar models) can likely solve it -- because the item exists within the model's competence boundary. The items that matter most for evaluation are precisely those that probe the *edges* of model capability, which by definition require understanding that the model lacks.

Harbor's experience makes this concrete. The tasks that remained hard (pass@3 = 0/3) after de-spoiling all shared a property: their difficulty came from multi-step reasoning about realistic operational environments, not from surface-level tricks. An LLM could generate the surface tricks (and did, in the trap-prompt era), but those tricks failed the moment another LLM encountered them. The structural difficulty of restaurant-style tasks -- where the bad heuristic produces a complete-looking deliverable -- required human understanding of how models actually behave in practice.

This doesn't mean LLMs are useless in eval creation. It means they're useful as *amplifiers of human judgment*, not as *replacements for it*. The right division of labor:
- **Humans**: define constructs, identify failure modes, design adversarial structure, review ground truth, judge iteration decisions
- **LLMs**: generate fixture data, draft boilerplate code, format artifacts, run contamination checks, propose (but not decide) difficulty adjustments

---

## What Harbor Eval Canvas Should Actually Build

### Target User Persona

**Primary: The eval author who has domain expertise and a hypothesis about model failure, but not the infrastructure skills to turn that into a Harbor task pack.**

This person can articulate "I think models fail at X because they do Y instead of Z" but cannot write a Dockerfile, a pytest verifier, or a `build_inputs.py` that generates multimodal fixtures. They may be:
- An AI safety researcher who has identified a failure mode through red-teaming
- A domain expert (supply chain analyst, financial auditor, compliance officer) who sees models making mistakes in their field
- An ML engineer who wants to create regression tests for specific model weaknesses

**Secondary: The eval team lead who manages a portfolio of eval tasks and needs visibility into difficulty calibration, contamination status, and cross-model generalization.**

### MVP Feature Set (What to Build First)

Build the tool in the order that matches the eval creation workflow, prioritizing the steps where the most value is left on the table.

**Phase 1: Scaffold and Format (highest leverage, lowest risk)**

The single biggest barrier to eval creation is the engineering overhead of producing a valid Harbor task pack. Build:

1. **Task pack scaffolder.** Given a construct description and output contract (sheet names, headers, expected file format), generate the full file tree: `instruction.md`, `task.toml`, `environment/Dockerfile`, `environment/data/build_inputs.py` skeleton, `solution/solve.sh` skeleton, `tests/test.sh`, `tests/test_outputs.py` skeleton. The Dockerfile and `test.sh` are nearly identical across tasks -- template them. The `task.toml` has a standard shape with `[metadata]`, `[environment]`, `[agent]`, `[verifier]` blocks.

2. **Output contract editor.** A structured form for defining the deliverable: output path, file format (XLSX/JSON/CSV), sheet roster, column headers per sheet, data types, exact label strings. This contract drives both the verifier skeleton and the instruction prose. Show a live preview of what the verifier will check.

3. **Fixture spec editor.** Define entity categories (clean families, trap families), row counts per category, column schemas, file formats, bait artifact types. Generate the `build_inputs.py` from this spec. Support multimodal output: CSV, XLSX, PDF (via fpdf2), JSON, JSONL, EML, ipynb.

4. **Oracle/nop sanity runner.** One-click: build the Docker image, run the oracle, assert reward=1. Run nop, assert reward=0. This is the minimum viability check before any model sweep. Surface the error clearly when it fails (which verifier assertion? which file missing?).

**Phase 2: Calibration Loop (the core feedback loop)**

5. **Sweep runner.** Queue target-model trials (3 for pass@3), parse `reward.txt` and `ctrf.json`, compute pass@k. Show per-trial results with links to trajectories and verifier output.

6. **Trajectory viewer.** Display the model's trajectory (tool calls, file reads, code execution) alongside the verifier results. Highlight where the model diverged from the oracle's approach. This is the primary diagnostic tool for understanding *why* a task is easy or hard.

7. **Spoiler linter.** Automated lint of `instruction.md`, fixture data dictionaries, notebook cells, authority artifacts for: trap names, answer-shaped fields, recipe sentences, self-labelled bait, `Do not ...` instructions, expected-answer files in agent-visible paths. Run on every save. This catches the most common iteration failure (Harbor's learnings: ds-19, ds-23 both needed two rounds because of self-labelled bait).

**Phase 3: Intelligence Layer (augmentation, not replacement)**

8. **Weakness library.** A browsable catalog of known model failure modes (seeded with Harbor's 8-category taxonomy), with probe history showing which models fail at what. Let users tag their tasks with failure modes and see cross-task statistics.

9. **Probe runner.** Before building a full task, run lightweight JSON-only API probes (5 pressure variants, 15 trials each) to estimate whether a failure-mode hypothesis holds for the target model. This is the highest-ROI pre-investment check: don't build a 900-LOC `build_inputs.py` for a failure mode the model handles easily.

10. **Iteration assistant.** Given a pass@3 >= 1/3 result and trajectory audit, *propose* (not auto-apply) edits: make bait more realistic, expand fixture surface, restructure policy artifact, tighten output contract. The human reviews and applies. This is an LLM-augmented step, not an LLM-automated one.

### What NOT to Automate

Based on the research and Harbor's experience, these should remain firmly human-driven:

1. **Construct definition and failure-mode selection.** The tool should provide a weakness library and brainstorming prompts, but the human decides what to measure. An LLM picking failure modes produces evals that test what LLMs find interesting, not what matters.

2. **Final ground truth approval.** The oracle is the source of truth. The tool can draft it, but a human must verify it against the policy artifacts. Oracle bugs are silent killers -- they make the eval measure the wrong thing without any signal that something is wrong.

3. **Difficulty iteration decisions.** When a task is too easy, the response requires creativity and adversarial thinking. The tool surfaces diagnostics (trajectory viewer, spoiler linter, failure-mode classification), but the human decides how to restructure.

4. **Cross-model generalization claims.** A task that's hard for Gemini may be trivial for Claude. The tool should make cross-model sweeps easy to run, but a human must interpret whether the task measures a general capability gap or a model-specific quirk.

5. **Publication decisions.** The stop conditions (oracle=1, nop=0, spoiler lint clean, pass@3=0/3, trajectory audit shows genuine model failure) are checkable, but the final "this eval is valid and worth publishing" judgment requires human accountability.

### The Actual Value Proposition

Harbor Eval Canvas is not "AI writes your evals." That pitch is both technically dishonest and strategically wrong -- the research is clear that fully automated eval creation produces evals that are trivially solvable by the same models.

The value prop is: **Harbor Eval Canvas turns a failure-mode hypothesis into a validated, containerized eval task in hours instead of weeks, by automating the engineering and calibration drudgework while keeping humans in control of the adversarial design.**

Concretely:
- **Without the tool:** Author has an idea ("models confuse recency with authority"), then spends days writing fixture generators, Dockerfiles, verifiers, and running manual sweep iterations. Most of that time is engineering, not eval design.
- **With the tool:** Author describes the failure mode, defines the output contract in a structured editor, reviews a generated fixture spec, clicks "build and sweep," then spends their time on the part that matters: reading trajectories, adjusting bait realism, and iterating on difficulty.

The time savings come from eliminating boilerplate, not from replacing judgment.

### How Harbor's Containerized Format Shapes the Tool

Harbor's task format (`instruction.md`, `task.toml`, `Dockerfile`, `solve.sh`, verifier) is not incidental -- it defines what the tool can and should do.

| Format artifact | What it enables in the tool |
|---|---|
| **`instruction.md`** | The tool provides a structured editor with live spoiler-lint warnings. Template sections: business context, input file inventory, output contract, constraints. The editor enforces that the instruction never names the failure mode, never includes verifier pseudocode, and never uses "do not" framing that models trivially obey. |
| **`task.toml`** | Fully templatable. The tool generates this from structured form inputs: difficulty, timeout, environment resources, verifier timeout. No reason for a human to hand-edit TOML. |
| **`Dockerfile`** | Nearly identical across restaurant-style tasks (python:3.12 + standard deps). The tool templates this with an optional dependency picker. Custom Dockerfiles are an escape hatch, not the default. |
| **`build_inputs.py`** | Generated from the fixture spec editor. This is the largest artifact (700-900 LOC) and the most automatable. The tool's fixture spec editor captures categories, schemas, trap families, and file formats; code generation handles the rest. The human reviews the generated fixtures for realism but doesn't write the generation code. |
| **`solve.sh` (oracle)** | The tool can draft this from the output contract and policy artifacts, but the human must verify correctness. The oracle is the ground truth -- if it's wrong, the eval is wrong. The tool provides an oracle debugger: run the oracle, diff its output against the verifier expectations, highlight failures. |
| **`test_outputs.py` (verifier)** | Partially generated from the output contract (structural checks: file exists, sheets exist, headers match, types correct). The adversarial checks (trap-family routing, source attribution) require human input because they encode the eval's substance. The tool provides a verifier dimension editor: add named check dimensions, specify expected values per entity category, generate the pytest code. |
| **Containerized execution** | The entire oracle/nop/sweep loop runs in Docker. The tool provides one-click build-and-run with live log streaming. No local environment setup. No "works on my machine" issues. This is the single biggest engineering barrier the tool removes. |

### Summary: Build Order and Prioritization

| Priority | Feature | Why first |
|---|---|---|
| **P0** | Task pack scaffolder + output contract editor | Removes the #1 barrier (engineering overhead). Every user needs this on day one. |
| **P0** | Oracle/nop sanity runner | Minimum viability gate. Without this, users ship broken evals. |
| **P1** | Fixture spec editor + build_inputs.py generation | The largest single artifact, most automatable, most tedious to write by hand. |
| **P1** | Spoiler linter | Catches the most common eval failure (spoiler leakage). Runs on every save. |
| **P1** | Sweep runner + trajectory viewer | The core calibration loop. Users need to see *why* models pass or fail. |
| **P2** | Weakness library + probe runner | Pre-investment ROI check. Saves users from building tasks for non-failures. |
| **P2** | Iteration assistant | Augments (doesn't replace) human judgment in the difficulty tuning loop. |
| **P3** | Cross-model sweep dashboard | Important for publication but not for initial task creation. |
| **P3** | Regression watcher | Important for maintenance but not for initial creation. |

---

## Sources

1. **Burden, J.** (2024). "Evaluating AI Evaluation: Perils and Prospects." Leverhulme Centre for the Future of Intelligence, University of Cambridge. [arxiv.org/html/2407.09221](https://arxiv.org/html/2407.09221)

2. **Eriksson, M. et al.** (2025). "Can We Trust AI Benchmarks? An Interdisciplinary Review of Current Issues in AI Evaluation." European Commission, Joint Research Centre. [arxiv.org/html/2502.06559v2](https://arxiv.org/html/2502.06559v2)

3. **Weidinger, L. et al.** (2025). "Toward an Evaluation Science for Generative AI Systems." Google DeepMind, UC Berkeley, Microsoft Research, Hugging Face, Stanford, MIT, Anthropic. [arxiv.org/html/2503.05336v3](https://arxiv.org/html/2503.05336v3)

4. **Abbas, A., Waggoner, C., Olive, J.** (2025). "Developing and Maintaining an Open-Source Repository of AI Evaluations: Challenges and Insights." UK AI Security Institute (inspect_evals). [arxiv.org/pdf/2507.06893](https://arxiv.org/pdf/2507.06893)

5. **Anthropic.** (2023). "Challenges in Evaluating AI Systems." [anthropic.com/research/evaluating-ai-systems](https://www.anthropic.com/research/evaluating-ai-systems)

6. **EvalEval Coalition.** (2026). "Field Notes: Challenges in GenAI Evaluation Science." [evalevalai.com/research/2026/03/25/interview-field-insights](https://evalevalai.com/research/2026/03/25/interview-field-insights/)

7. **Biderman, S. et al.** (2024). "Lessons from the Trenches on Reproducible Evaluation of Language Models." EleutherAI. [arxiv.org/pdf/2405.14782v2](https://arxiv.org/pdf/2405.14782v2)

8. **Bean, A.M. et al.** (2024). "Measuring What Matters: Construct Validity in Large Language Model Benchmarks." University of Oxford, UK AI Security Institute, et al. [arxiv.org/pdf/2511.04703](https://arxiv.org/pdf/2511.04703)

9. **Gehrmann, S., Clark, E., Sellam, T.** (2022). "Repairing the Cracked Foundation: A Survey of Obstacles in Evaluation Practices for Generated Text." Google Research. [ar5iv.labs.arxiv.org/html/2202.06935](https://ar5iv.labs.arxiv.org/html/2202.06935)

10. **El Filali, A., Bedar, I.** (2026). "Towards More Standardized AI Evaluation: From Models to Agents." G42. [arxiv.org/pdf/2602.18029](https://arxiv.org/pdf/2602.18029)
