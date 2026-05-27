# Harbor Eval Canvas: Atomic Interaction Spec (Part 2)

> Continuation of `ATOMIC-INTERACTION-SPEC.md` covering Phases 3-9.
> Same atomic level of detail: every CSS property, pixel, animation, keyboard shortcut.

---

## Phase 3: Workspace Plates

### 3.1 Workspace Plate Container

When a domain node is clicked, the workspace plate animates open below the ring.

**Positioning logic:**
The plate appears below the 600x600 ring container, centered horizontally in the canvas area.

```css
.workspace-plate {
  position: absolute;
  top: calc(50% + 320px); /* 300px ring center + 300px half-ring + 20px gap */
  left: 50%;
  transform: translateX(-50%);
  width: 680px;
  max-height: 420px;
  overflow-y: auto;
  z-index: 20;
}
```

**Outer shell:**
```css
.workspace-plate-shell {
  border-radius: var(--radius-xl); /* 22px, matches Cofounder workspace */
  background: var(--bg-l-neg-50); /* #e8e8e4, sunken */
  box-shadow: var(--shadow-inset-200);
  padding: 20px;
  overflow: hidden;
}
```

Matches Cofounder: `departmentWorkspacePlateNode` uses `rounded-[22px] bg-background-l-negative-50 shadow-inset-200`.

**Entrance animation:**
```css
.workspace-plate-enter {
  animation: plateOpen 300ms ease-out both;
}
@keyframes plateOpen {
  from {
    opacity: 0;
    max-height: 0;
    padding: 0 20px;
    transform: translateX(-50%) translateY(-8px);
  }
  to {
    opacity: 1;
    max-height: 420px;
    padding: 20px;
    transform: translateX(-50%) translateY(0);
  }
}
```

**Exit animation:**
```css
.workspace-plate-exit {
  animation: plateClose 200ms ease-in forwards;
}
@keyframes plateClose {
  to {
    opacity: 0;
    max-height: 0;
    padding: 0 20px;
    transform: translateX(-50%) translateY(-8px);
  }
}
```

**Scrollbar (inside plate):**
Same as panel scrollbar: 4px wide, `var(--fg-10)` thumb, `var(--radius-full)`.

### 3.2 Workspace Plate Header

```css
.plate-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
```

**3.2.1 Left side: accent dot + domain name + status badge + progress text**

```css
.plate-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
```

**Accent dot:**
```css
.plate-accent-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--domain-accent);
  flex-shrink: 0;
}
```

Color is the domain's accent from the palette (e.g., `#8A72E5` for Reasoning).

**Domain name:**
```css
.plate-domain-name {
  font: 600 16px/1.2 var(--font-figtree);
  color: var(--fg-80);
}
```

Full name: "Reasoning & Logic", "Safety & Alignment", etc.

**Status badge:**
```css
.plate-status-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  font: 400 11px/1 var(--font-departure);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.plate-status-badge.idle {
  background: var(--fg-5);
  color: var(--fg-30);
  border: none;
}
.plate-status-badge.probing {
  background: #FFFBEB;
  color: #B45309;
  border: 1px solid #FDE68A;
}
.plate-status-badge.building {
  background: #EFF6FF;
  color: #1D4ED8;
  border: 1px solid #BFDBFE;
}
.plate-status-badge.validating {
  background: #FAF5FF;
  color: #7E22CE;
  border: 1px solid #E9D5FF;
}
.plate-status-badge.complete {
  background: #F0FDF4;
  color: #15803D;
  border: 1px solid #BBF7D0;
}
.plate-status-badge.failed {
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
}
```

**Progress text:**
```css
.plate-progress-text {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
  margin-left: 4px;
}
.plate-progress-text::before {
  content: '·';
  color: var(--fg-20);
  margin-right: 8px;
}
```

Text examples: "3/5 variants done", "Building fixtures...", "All gates passed"

**3.2.2 Right side: close button**

```css
.plate-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--fg-30);
  cursor: pointer;
  transition: all 200ms ease;
}
.plate-close:hover {
  color: var(--fg-60);
  background: var(--fg-5);
}
.plate-close:active {
  background: var(--fg-10);
}
```

Icon: Lucide `x`, 16px, stroke-width 1.5

**Click:** Closes workspace plate with exit animation. Deselects domain node. Other nodes return to full opacity.

**Keyboard:** `Escape` closes the workspace plate.

### 3.3 Plate Content Sections

The plate content area holds two sections stacked vertically:
1. Fan-out grid (Phase 4) - variable height
2. Pipeline roadmap strip (Phase 5) - fixed 56px height

Separator between them:
```css
.plate-divider {
  height: 1px;
  background: var(--fg-10);
  margin: 16px 0;
  border: none;
}
```

---

## Phase 4: Fan-Out Visualization

### 4.1 Probe Fan-Out Grid

**Container:**
```css
.fanout-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

**Section label:**
```css
.fanout-label {
  font: 600 12px/1 var(--font-figtree);
  color: var(--fg-40);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

Text: "PROBE VARIANTS" or "SCAFFOLD AGENTS" or "VALIDATION GATE"

**4.1.1 Variant cards row:**

```css
.variant-row {
  display: flex;
  gap: 8px;
}
```

**Individual variant card:**
```css
.variant-card {
  width: 108px;
  height: 88px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  transition: all 200ms ease;
  cursor: default;
}
```

**Card states:**

```css
/* Pending */
.variant-card.pending {
  opacity: 0.6;
}

/* Running */
.variant-card.running {
  border-left: 3px solid var(--domain-accent);
  /* shimmer overlay */
}
.variant-card.running::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 36%,
    rgba(0,0,0,0.02) 48%,
    transparent 60%,
    transparent 100%
  );
  background-size: 260% 100%;
  animation: shimmer 3s linear infinite;
  pointer-events: none;
}

/* Complete with high failure (good) */
.variant-card.high-failure {
  border-left: 3px solid #16A34A; /* green-600 */
}

/* Complete with low failure (bad eval) */
.variant-card.low-failure {
  border-left: 3px solid #DC2626; /* red-600 */
}

/* Error */
.variant-card.error {
  border-left: 3px solid #DC2626;
  background: #FEF2F2;
}
```

**Card internal elements:**

Variant label:
```css
.variant-label {
  font: 600 12px/1 var(--font-figtree);
  color: var(--fg-60);
  white-space: nowrap;
}
```

Labels: "Plain", "Prior Work", "Schema Hint", "Audit Trail", "Speed Run"

Status icon (centered):
```css
.variant-status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

| State | Icon | Color | Animation |
|---|---|---|---|
| Pending | `circle` (outline) | `var(--fg-20)` | none |
| Running | `loader-2` | `var(--domain-accent)` | `rotate 1s linear infinite` |
| Complete ✓ | `check` | `#16A34A` | `sd-fadeIn 150ms` |
| Failed ✗ | `x` | `#DC2626` | `sd-fadeIn 150ms` |
| Error ⚠ | `alert-triangle` | `#DC2626` | none |

All icons: Lucide, 16px, stroke-width 2.

Trial count:
```css
.variant-trials {
  font: 400 12px/1 var(--font-mono);
  color: var(--fg-40);
}
```

Text: "12/15" (completedTrials / totalTrials). Updates in real-time.

Failure rate:
```css
.variant-failure-rate {
  font: 600 14px/1 var(--font-departure);
  letter-spacing: 0.02em;
  transition: color 200ms ease;
}
```

Color logic:
```css
/* ≥80% failure = good eval */
.variant-failure-rate.good { color: #16A34A; }
/* 40-79% failure = mediocre */
.variant-failure-rate.mediocre { color: #D97706; }
/* <40% failure = bad eval */
.variant-failure-rate.bad { color: #DC2626; }
```

Display: "80%" / "53%" / "---" (if pending)

**Number counting animation:**
When the failure rate updates:
```css
.number-exit {
  animation: numberExit 100ms ease forwards;
}
@keyframes numberExit {
  to { opacity: 0; transform: translateY(-2px); }
}
.number-enter {
  animation: numberEnter 150ms ease both;
}
@keyframes numberEnter {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Uses CSS `font-variant-numeric: tabular-nums` on all numeric displays so widths don't shift.

**4.1.2 Stagger entrance:**

Cards appear left-to-right with 80ms delay:
```css
.variant-card-enter {
  animation: cardStagger 200ms ease both;
}
.variant-card-enter:nth-child(1) { animation-delay: 0ms; }
.variant-card-enter:nth-child(2) { animation-delay: 80ms; }
.variant-card-enter:nth-child(3) { animation-delay: 160ms; }
.variant-card-enter:nth-child(4) { animation-delay: 240ms; }
.variant-card-enter:nth-child(5) { animation-delay: 320ms; }

@keyframes cardStagger {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**4.1.3 Summary row (below variant cards):**

```css
.fanout-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
```

**Mean failure text:**
```css
.fanout-mean {
  font: 600 13px/1 var(--font-figtree);
  color: var(--fg-80);
}
```

Text: "Mean failure: 82%"

**Separator dot:**
```css
.fanout-separator {
  width: 3px;
  height: 3px;
  border-radius: var(--radius-full);
  background: var(--fg-20);
}
```

**Verdict badge:**
```css
.fanout-verdict {
  font: 400 11px/1 var(--font-departure);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
}
.fanout-verdict.promote {
  color: #16A34A;
  background: #F0FDF4;
}
.fanout-verdict.redesign {
  color: #D97706;
  background: #FFFBEB;
}
.fanout-verdict.reject {
  color: #DC2626;
  background: #FEF2F2;
}
```

Verdict logic:
- PROMOTE: mean failure ≥ 60%
- REDESIGN: mean failure 30-59%
- REJECT: mean failure < 30% (eval is too easy)

### 4.2 Scaffold Fan-Out Grid

Replaces the probe grid after probing completes and user accepts verdict.

**4.2.1 Scaffold agent cards:**

```css
.scaffold-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

**Individual scaffold card:**
```css
.scaffold-card {
  position: relative;
  width: 140px;
  height: 100px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 200ms ease;
  overflow: hidden;
}
```

**Card header (icon + name):**
```css
.scaffold-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.scaffold-card-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.scaffold-card-name {
  font: 600 13px/1 var(--font-figtree);
  color: var(--fg-80);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**5 scaffold agents:**

| Agent | Icon (Lucide) | Name | Primary artifact |
|---|---|---|---|
| Fixtures | `file-text` | Fixtures | `build_inputs.py` |
| Environment | `box` (container) | Environment | `Dockerfile`, `task.toml` |
| Verifier | `shield-check` | Verifier | `test_outputs.py` |
| Instruction | `pencil-line` | Instruction | `instruction.md` |
| Contamination | `search` | Contamination | contamination report |

Icons: Lucide, 16px, stroke-width 1.5, `color: var(--fg-50)`.

**Status icon (below header, centered):**
Same status icon component as variant cards (pending/running/complete/failed).

**Primary artifact name:**
```css
.scaffold-artifact {
  font: 400 11px/1.2 var(--font-mono);
  color: var(--fg-40);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Detail line:**
```css
.scaffold-detail {
  font: 400 11px/1 var(--font-figtree);
  color: var(--fg-30);
}
```

Text: "847 lines" / "drafting..." / "28 lines" / "0 overlaps"

**Running state shimmer:**
Same shimmer overlay as variant cards, plus:
```css
.scaffold-card.running {
  border-left: 3px solid var(--domain-accent);
}
```

**Completed state:**
```css
.scaffold-card.complete {
  border-color: var(--fg-20);
}
.scaffold-card.complete .scaffold-card-icon {
  color: var(--status-complete);
}
```

**Stagger entrance:** Same 80ms delay pattern as probe cards.

### 4.3 Validation Gate Cards

Replaces scaffold grid after scaffolding completes.

**4.3.1 Gate cards row:**

```css
.gate-row {
  display: flex;
  gap: 10px;
}
```

**Individual gate card:**
```css
.gate-card {
  flex: 1;
  min-width: 0;
  height: 80px;
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 200ms ease;
}
```

**Gate states:**
```css
.gate-card.pending {
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
}
.gate-card.pending::after {
  /* shimmer overlay */
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(105deg, transparent 36%, rgba(0,0,0,0.02) 48%, transparent 60%);
  background-size: 260% 100%;
  animation: shimmer 3s linear infinite;
  pointer-events: none;
}

.gate-card.passed {
  background: rgba(240, 253, 244, 0.5); /* green-50/50 */
  border: 1px solid #BBF7D0; /* green-200 */
}

.gate-card.failed {
  background: rgba(254, 242, 242, 0.5); /* red-50/50 */
  border: 1px solid #FECACA; /* red-200 */
}
```

**Gate title:**
```css
.gate-title {
  font: 600 13px/1 var(--font-figtree);
  color: var(--fg-80);
}
```

Titles: "Oracle Sweep", "Nop Sweep", "Spoiler Lint"

**Gate result (large number):**
```css
.gate-result {
  font: 700 16px/1 var(--font-departure);
  letter-spacing: 0.02em;
}
.gate-card.passed .gate-result { color: #16A34A; }
.gate-card.failed .gate-result { color: #DC2626; }
.gate-card.pending .gate-result { color: var(--fg-30); }
```

Display text:
- Oracle: "Reward: 1.0 ✓" or "Reward: 0.7 ✗"
- Nop: "Reward: 0.0 ✓" or "Reward: 0.4 ✗"
- Lint: "0 findings ✓" or "3 findings ✗"

**Gate expected value:**
```css
.gate-expected {
  font: 400 11px/1 var(--font-figtree);
  color: var(--fg-30);
}
```

Text: "Expected: 1.0" / "Expected: 0.0" / "Expected: 0"

**4.3.2 Gate summary row:**

```css
.gate-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
```

**Summary text (left):**
```css
.gate-summary-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font: 500 13px/1 var(--font-figtree);
}
.gate-summary-text.passed { color: #16A34A; }
.gate-summary-text.failed { color: #DC2626; }
```

Text: "✓ All gates passed" or "✗ 1 gate failed"

Checkmark/X: Lucide icons, 14px, inline.

**CTA button (right, only shown when all gates pass):**
```css
.gate-sweep-cta {
  height: 32px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: var(--radius-md);
  background: var(--bg-inverse);
  color: var(--fg-inverse-80);
  border: 1px solid rgba(0,0,0,0.5);
  font: 500 12px/1 var(--font-figtree);
  cursor: pointer;
  box-shadow: var(--shadow-cta-sm);
  transition: all 200ms ease;
}
.gate-sweep-cta:hover {
  opacity: 0.9;
}
```

Text: "Run Target Sweep →" with Lucide `arrow-right` 12px.

---

## Phase 5: Pipeline Roadmap Strip

### 5.1 Strip Container

```css
.roadmap-strip {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: none;
}
.roadmap-strip::-webkit-scrollbar { display: none; }
```

5 step cards connected by 4 connector segments. Total width: `(5 * 148) + (4 * 32) = 868px`. Fits within 680px plate with slight horizontal scroll or by scaling to fit.

Alternatively, at the plate's 640px content width (680 - 40px padding), we can use `flex-shrink: 0` on cards and let the strip scroll, or reduce card width to 120px: `(5 * 120) + (4 * 24) = 696px` which fits.

**Responsive fit:** Cards are `120px` wide at default plate width, `148px` on wider viewports. We'll use `120px` for the atomic spec.

### 5.2 Step Card Component

```css
.step-card {
  position: relative;
  width: 120px;
  height: 56px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  background: var(--bg-screen);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 200ms ease;
  user-select: none;
}
```

**5.2.1 Step card states:**

```css
/* Locked */
.step-card.locked {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(0.3);
}

/* Available (can be started) */
.step-card.available {
  opacity: 1;
  cursor: pointer;
}
.step-card.available:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-outset-100);
}
.step-card.available:active {
  transform: translateY(0);
}

/* Active (currently running) */
.step-card.active {
  border: 2px solid var(--domain-accent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--domain-accent) 15%, transparent);
}

/* Complete */
.step-card.complete {
  border-left: 3px solid #16A34A;
}
```

**5.2.2 Step icon container:**

```css
.step-icon-container {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-l200);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

**Icon rendering (masked):**
```css
.step-icon {
  width: 18px;
  height: 18px;
  mask-image: url('var(--step-icon-url)');
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url('var(--step-icon-url)');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  background-color: var(--fg-50);
}
.step-card.active .step-icon {
  background-color: var(--domain-accent);
}
.step-card.complete .step-icon {
  background-color: #16A34A;
}
```

Uses SVG mask technique matching Cofounder's icon masking pattern.

| Stage | Icon URL | Lucide fallback |
|---|---|---|
| Intake | `/eval-icons/intake.svg` | `inbox` |
| Probe | `/eval-icons/probe.svg` | `radar` |
| Scaffold | `/eval-icons/scaffold.svg` | `blocks` |
| Validate | `/eval-icons/validate.svg` | `shield-check` |
| Publish | `/eval-icons/publish.svg` | `flag` |

**5.2.3 Step text content:**

```css
.step-name {
  font: 500 13px/1.2 var(--font-figtree);
  color: var(--fg-60);
  white-space: nowrap;
}
.step-card.active .step-name {
  color: var(--fg-80);
  font-weight: 600;
}

.step-subtitle {
  font: 400 11px/1.2 var(--font-figtree);
  color: var(--fg-30);
  white-space: nowrap;
  margin-top: 2px;
}
```

Subtitle text per state:
- Locked: "Waiting"
- Available: "Ready"
- Active: "Running 3/5..." or "Probing..."
- Complete: "Completed"

**5.2.4 Status badge (top-right corner of card):**

```css
.step-badge {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

| State | Icon | Color | Size |
|---|---|---|---|
| Locked | Lucide `lock` | `var(--fg-20)` | 12px, stroke-width 1.5 |
| Available | `circle` (outline) | `var(--fg-30)` | 12px, stroke-width 1.5 |
| Active | `loader-2` | domain accent | 12px, `rotate 1s linear infinite` |
| Complete | `check` | `#16A34A` | 12px, stroke-width 2 |

### 5.3 Connector Segment

Between each step card:

```css
.step-connector {
  width: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
```

**Connector line:**
```css
.connector-line {
  width: 100%;
  height: 1px;
  background: var(--fg-10);
  position: absolute;
  top: 50%;
}
.step-connector.active .connector-line {
  background: var(--fg-30);
}
.step-connector.complete .connector-line {
  background: #16A34A;
}
```

**Connector center icon:**
```css
.connector-icon {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  border-radius: var(--radius-full);
  background: var(--bg-l-neg-50); /* matches plate background */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Icon inside: 10px Lucide icon
- Before active step: `lock`, `var(--fg-15)`
- Between complete steps: `check`, `#16A34A`
- Otherwise: `circle` (outline), `var(--fg-20)`

### 5.4 Step Card Click Behavior

- **Locked step:** No action. Cursor stays `not-allowed`. Brief shake animation (optional):
  ```css
  .step-card.locked:active {
    animation: shake 200ms ease;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
  ```

- **Available step:** Click triggers that pipeline stage. Right panel shows Agent tab with stage-specific context. E.g., clicking "Probe" when available starts the probe fan-out.

- **Active step:** Click navigates to its fan-out view in the workspace plate.

- **Complete step:** Click shows the results/artifacts from that stage in the right panel Files tab.

---

## Phase 6: Right Panel Tab Content (Atomic Detail)

### 6.1 Home Tab

**6.1.1 Greeting:**
```css
.home-greeting {
  font: normal 24px/1.2 var(--font-mondwest);
  color: var(--fg-60);
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}
```

Text determined by time of day:
- 5:00-11:59: "Good morning, {firstName}"
- 12:00-16:59: "Good afternoon, {firstName}"
- 17:00-23:59: "Good evening, {firstName}"
- 0:00-4:59: "Happy late night, {firstName}"

Matches Cofounder's PP Mondwest greeting pattern.

**6.1.2 Progress ring card:**

```css
.progress-card {
  border-radius: var(--radius-xl);
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}
```

**SVG ring (120x120):**
```html
<svg width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="50" fill="none"
          stroke="var(--fg-5)" stroke-width="6" />
  <circle cx="60" cy="60" r="50" fill="none"
          stroke="var(--fg-80)" stroke-width="6"
          stroke-dasharray="314.16"
          stroke-dashoffset="var(--progress-offset)"
          stroke-linecap="round"
          transform="rotate(-90 60 60)"
          style="transition: stroke-dashoffset 600ms var(--ease-smooth)" />
  <text x="60" y="56" text-anchor="middle"
        font-family="var(--font-departure)" font-size="20" fill="var(--fg-80)"
        letter-spacing="0.02em">35%</text>
  <text x="60" y="72" text-anchor="middle"
        font-family="var(--font-figtree)" font-size="10" fill="var(--fg-40)">
    progress
  </text>
</svg>
```

Circumference: `2 * π * 50 = 314.16`. Offset: `314.16 * (1 - progress)`.

**Progress details (right of ring):**
```css
.progress-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.progress-title {
  font: 600 14px/1.2 var(--font-figtree);
  color: var(--fg-80);
}
.progress-stat {
  font: 400 13px/1.4 var(--font-figtree);
  color: var(--fg-50);
  display: flex;
  align-items: center;
  gap: 6px;
}
.progress-stat::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--fg-20);
}
```

Title: "Overall Progress"
Stats:
- "2 of 8 domains probed"
- "1 task pack published"
- "3 sweeps completed"

**Linear progress bar (below text):**
```css
.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--fg-5);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: 4px;
}
.progress-bar-fill {
  height: 100%;
  background: var(--fg-60);
  border-radius: var(--radius-full);
  transition: width 600ms var(--ease-smooth);
}
```

**6.1.3 Suggested next section:**

Section header:
```css
.section-header {
  font: 600 13px/1 var(--font-figtree);
  color: var(--fg-40);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
```

Text: "SUGGESTED NEXT"

**Suggested task card:**
```css
.suggested-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 200ms ease;
}
.suggested-card:hover {
  background: var(--bg-l50);
  transform: translateY(-1px);
  box-shadow: var(--shadow-outset-050);
}
.suggested-card:active {
  transform: translateY(0);
}
```

**Card left side:**
```css
.suggested-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--domain-accent);
  margin-top: 6px;
  flex-shrink: 0;
}
.suggested-title {
  font: 500 13px/1.3 var(--font-figtree);
  color: var(--fg-80);
}
.suggested-desc {
  font: 400 12px/1.4 var(--font-figtree);
  color: var(--fg-40);
  margin-top: 2px;
}
```

**Card action button (right):**
```css
.suggested-action {
  flex-shrink: 0;
  height: 28px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--fg-10);
  background: var(--bg-l0);
  font: 500 12px/1 var(--font-figtree);
  color: var(--fg-60);
  cursor: pointer;
  transition: all 200ms ease;
  white-space: nowrap;
}
.suggested-action:hover {
  background: var(--bg-l50);
  color: var(--fg-80);
}
```

Text: "Start →" / "Review →" / "View →"

Arrow: Lucide `arrow-right`, 10px.

**Click behavior:** Navigates to the appropriate tab and domain. "Start probing for Safety" opens Safety workspace plate and starts probe fan-out. "Review Reasoning results" opens Reasoning workspace with probe results.

**6.1.4 Recent activity section:**

Section header: Same as "SUGGESTED NEXT" but text "RECENT ACTIVITY".

**Activity item:**
```css
.activity-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--fg-5);
}
.activity-item:last-child {
  border-bottom: none;
}
```

**Activity icon:**
```css
.activity-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.activity-icon.success { color: #16A34A; }
.activity-icon.running { color: var(--status-probing); }
.activity-icon.failed { color: #DC2626; }
.activity-icon.info { color: var(--fg-40); }
```

Icons: Lucide `check-circle-2` (success), `loader-2` (running, animated), `x-circle` (failed), `info` (info). 14px, stroke-width 1.5.

**Activity text:**
```css
.activity-text {
  flex: 1;
  font: 400 13px/1.3 var(--font-figtree);
  color: var(--fg-60);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Activity timestamp:**
```css
.activity-time {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-30);
  flex-shrink: 0;
  white-space: nowrap;
}
```

Text: "2m ago", "5m ago", "12m ago". Relative time, updates every minute.

Max 8 items shown. "View all" link at bottom if more:
```css
.activity-view-all {
  display: block;
  text-align: center;
  padding: 8px 0 0;
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
  cursor: pointer;
}
.activity-view-all:hover {
  color: var(--fg-60);
  text-decoration: underline;
}
```

### 6.2 Agent Tab (Chat) - Deep Dive

**6.2.1 Message list container:**

```css
.message-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 8px;
}
```

Uses virtualized scrolling for performance (react-virtuoso or similar). `data-index` and `data-known-size` attributes on each message for accurate scroll positioning.

**6.2.2 Agent message anatomy:**

```html
<article class="chat-msg chat-msg-agent">
  <div class="msg-header">
    <div class="agent-avatar"><!-- hex icon --></div>
    <span class="agent-name">Harbor Eval</span>
    <span class="agent-timestamp">9:53 AM</span>
  </div>
  <div class="msg-body">
    <div class="msg-content">
      <!-- TT Neoris text content -->
      <!-- Optional embedded cards -->
    </div>
  </div>
</article>
```

```css
.chat-msg {
  position: relative;
  padding: 2px 0;
  transition: background-color 500ms ease;
}
.msg-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  margin-bottom: 4px;
}
.msg-body {
  display: flex;
  justify-content: flex-start;
  padding: 4px 0 8px;
}
.msg-content {
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
}
.msg-content p {
  font: 400 15px/1.6 var(--font-neoris);
  color: var(--fg-80);
  margin: 0 0 8px;
}
.msg-content p:last-child {
  margin-bottom: 0;
}
```

Matches Cofounder: `<article class="relative px-2 transition-colors duration-500">`, `text-sm font-normal text-muted-foreground`.

**6.2.3 User message anatomy:**

```css
.chat-msg-user .msg-body {
  justify-content: flex-end;
}
.user-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: var(--radius-lg);
  background: var(--bg-l200);
  border: 1px solid var(--fg-5);
  font: 400 14px/1.6 var(--font-neoris);
  color: var(--fg-80);
}
```

No avatar for user messages. Message is right-aligned.

**6.2.4 Tool call indicator card (inline):**

```css
.tool-call {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  background: var(--fg-5);
  border: 1px solid var(--fg-10);
  margin: 8px 0;
  cursor: default;
}
```

**Tool icon:**
```css
.tool-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}
.tool-call.running .tool-icon {
  color: var(--fg-30);
  animation: spin 1s linear infinite;
}
.tool-call.complete .tool-icon {
  color: #16A34A;
}
```

Running icon: Lucide `loader-2`, 12px
Complete icon: Lucide `check`, 12px

**Tool text:**
```css
.tool-text {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

Running text: "Running: run_probe_variants"
Complete text: "Completed: 82% failure rate"

**Expandable detail (click to toggle):**
```css
.tool-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 200ms ease;
}
.tool-call.expanded .tool-detail {
  max-height: 200px;
}
.tool-detail-content {
  padding: 8px 12px;
  font: 400 12px/1.5 var(--font-mono);
  color: var(--fg-40);
  background: var(--bg-l200);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  border-top: 1px solid var(--fg-5);
}
```

**6.2.5 Probe summary card (embedded in agent message after probing):**

```css
.probe-summary-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  padding: 16px;
  margin: 8px 0;
}
```

**Card header:**
```css
.probe-summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.probe-summary-domain {
  font: 500 14px/1 var(--font-figtree);
  color: var(--fg-80);
}
.probe-summary-taxonomy {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
}
.probe-summary-sep {
  color: var(--fg-20);
}
```

**Variant bars row:**
```css
.variant-bars {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
```

Each variant bar:
```css
.variant-bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.variant-bar-label {
  font: 500 11px/1 var(--font-figtree);
  color: var(--fg-40);
}
.variant-bar-track {
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--fg-5);
  overflow: hidden;
}
.variant-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 400ms var(--ease-smooth);
}
/* Color by failure rate */
.variant-bar-fill.good { background: #16A34A; }
.variant-bar-fill.mediocre { background: #D97706; }
.variant-bar-fill.bad { background: #DC2626; }

.variant-bar-value {
  font: 400 12px/1 var(--font-departure);
  color: var(--fg-50);
  letter-spacing: 0.02em;
}
```

**Mean + verdict row:**
```css
.probe-summary-verdict {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--fg-5);
}
```

Uses same `.fanout-mean` and `.fanout-verdict` styles as Phase 4.

**Action buttons:**
```css
.probe-summary-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
```

"View Details": uses `.btn-decide-all` styling (outlined).
"Accept & Scaffold →": uses `.btn-submit-answer` styling (dark CTA).

**6.2.6 Approval gate card:**

```css
.approval-card {
  border-radius: var(--radius-lg);
  border: 2px solid #FDE68A; /* amber-200 */
  background: rgba(255, 251, 235, 0.3); /* amber-50/30 */
  padding: 16px;
  margin: 8px 0;
}
```

**Warning icon + title:**
```css
.approval-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.approval-icon {
  width: 16px;
  height: 16px;
  color: #D97706; /* amber-600 */
}
.approval-title {
  font: 600 14px/1 var(--font-figtree);
  color: var(--fg-80);
}
```

Icon: Lucide `alert-triangle`, 16px.

**Approval body:**
```css
.approval-body {
  font: 400 13px/1.6 var(--font-figtree);
  color: var(--fg-60);
  margin-bottom: 12px;
}
.approval-body ul {
  margin: 6px 0;
  padding-left: 16px;
}
.approval-body li {
  margin-bottom: 2px;
}
.approval-body li::marker {
  color: var(--fg-30);
}
```

**Approval buttons:**
```css
.approval-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
```

"Reject": outlined button (same as `.btn-decide-all` but with `color: #DC2626; border-color: #FECACA`)
"Approve & Validate →": dark CTA (`.btn-submit-answer`)

**6.2.7 Iteration proposal card (diff format):**

```css
.iteration-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  padding: 16px;
  margin: 8px 0;
  overflow: hidden;
}
```

**File header:**
```css
.iteration-file-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font: 500 13px/1 var(--font-mono);
  color: var(--fg-60);
}
.iteration-line-ref {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-30);
}
```

**Diff lines:**
```css
.diff-block {
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 10px;
}
.diff-line {
  padding: 4px 12px;
  font: 400 12px/1.6 var(--font-mono);
  white-space: pre-wrap;
  word-break: break-all;
}
.diff-line.removed {
  background: rgba(254, 226, 226, 0.5); /* red-100/50 */
  color: #991B1B; /* red-800 */
}
.diff-line.removed::before {
  content: '- ';
  color: #DC2626;
}
.diff-line.added {
  background: rgba(220, 252, 231, 0.5); /* green-100/50 */
  color: #166534; /* green-800 */
}
.diff-line.added::before {
  content: '+ ';
  color: #16A34A;
}
```

**Rationale:**
```css
.iteration-rationale {
  font: 400 12px/1.5 var(--font-figtree);
  font-style: italic;
  color: var(--fg-40);
  padding: 8px 0;
  border-top: 1px solid var(--fg-5);
  margin-top: 8px;
}
```

**Iteration actions:**
"Dismiss": outlined with muted colors
"Apply Edit →": dark CTA

**6.2.8 Sweep result card:**

```css
.sweep-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  padding: 16px;
  margin: 8px 0;
}
```

**pass@k headline:**
```css
.sweep-pass-k {
  font: 700 20px/1 var(--font-departure);
  letter-spacing: 0.02em;
  margin-bottom: 12px;
}
.sweep-pass-k.good { color: #16A34A; } /* 0/k = model fails = good eval */
.sweep-pass-k.bad { color: #DC2626; } /* k/k = model passes = bad eval */
.sweep-pass-k.partial { color: #D97706; }
```

**Trial rows:**
```css
.trial-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--fg-5);
}
.trial-row:last-child {
  border-bottom: none;
}
.trial-badge {
  font: 400 11px/1 var(--font-departure);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  flex-shrink: 0;
}
.trial-badge.failed {
  color: #DC2626;
  background: #FEF2F2;
}
.trial-badge.passed {
  color: #16A34A;
  background: #F0FDF4;
}
.trial-summary {
  font: 400 13px/1.4 var(--font-neoris);
  color: var(--fg-60);
  flex: 1;
}
.trial-link {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
.trial-link:hover {
  color: var(--fg-60);
  text-decoration: underline;
}
```

**Sweep actions:**
"View Trajectories": outlined
"Publish →": dark CTA

### 6.3 Project Tab

**6.3.1 Section cards:**

Each settings section uses a consistent card pattern:
```css
.settings-section {
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  padding: 16px;
  margin-bottom: 12px;
}
.settings-section-title {
  font: 600 13px/1 var(--font-figtree);
  color: var(--fg-60);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}
```

**6.3.2 Setting row (key-value):**

```css
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--fg-5);
}
.setting-row:last-child {
  border-bottom: none;
}
.setting-key {
  font: 400 13px/1 var(--font-figtree);
  color: var(--fg-50);
}
.setting-value {
  font: 500 13px/1 var(--font-figtree);
  color: var(--fg-80);
}
.setting-value.mono {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
}
```

**6.3.3 "Change Model" link button:**
```css
.setting-link {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
  cursor: pointer;
  text-decoration: none;
}
.setting-link:hover {
  color: var(--fg-60);
  text-decoration: underline;
}
```

Click: Opens the model picker dropdown (same as top bar model selector).

**6.3.4 Multi-model chips:**

```css
.model-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
```

Individual chip:
```css
.model-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  font: 400 12px/1 var(--font-mono);
  color: var(--fg-60);
  cursor: default;
  transition: all 200ms ease;
}
.model-chip.primary {
  border: 2px solid var(--fg-60);
}
.model-chip .star-icon {
  width: 12px;
  height: 12px;
  color: var(--fg-40);
}
.model-chip .remove-icon {
  width: 12px;
  height: 12px;
  color: var(--fg-20);
  cursor: pointer;
  transition: color 200ms ease;
}
.model-chip .remove-icon:hover {
  color: var(--fg-60);
}
```

Primary chip: star icon (Lucide `star`, filled). Non-primary: X remove button.

**Add chip:**
```css
.model-chip-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--fg-20);
  background: transparent;
  color: var(--fg-30);
  cursor: pointer;
  transition: all 200ms ease;
}
.model-chip-add:hover {
  border-color: var(--fg-40);
  color: var(--fg-50);
  background: var(--fg-5);
}
```

Icon: Lucide `plus`, 14px. Click: opens model picker.

**6.3.5 Danger zone:**

```css
.danger-zone {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--fg-10);
}
.danger-zone-title {
  font: 600 13px/1 var(--font-figtree);
  color: #DC2626;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}
.danger-link {
  font: 400 13px/1 var(--font-figtree);
  color: #DC2626;
  cursor: pointer;
  margin-right: 16px;
}
.danger-link:hover {
  text-decoration: underline;
}
```

Click: opens confirmation dialog (see 6.3.6).

**6.3.6 Confirmation dialog (reused across app):**

```css
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayIn 200ms ease both;
}
@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confirm-dialog {
  width: 380px;
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--bg-l200);
  box-shadow: var(--shadow-outset-150);
  animation: dialogIn 200ms ease both;
}
@keyframes dialogIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.confirm-title {
  font: 600 16px/1.3 var(--font-figtree);
  color: var(--fg-80);
  margin-bottom: 8px;
}
.confirm-desc {
  font: 400 13px/1.5 var(--font-figtree);
  color: var(--fg-50);
  margin-bottom: 20px;
}
.confirm-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
```

"Cancel": outlined button
"Confirm": uses `.btn-submit-answer` but with `background: #DC2626` for destructive actions

### 6.4 Files Tab

**6.4.1 Header:**
```css
.files-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}
.files-title {
  font: 600 16px/1 var(--font-figtree);
  color: var(--fg-80);
}
.files-meta {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
}
```

**6.4.2 File tree:**

```css
.file-tree {
  font: 400 13px/1.6 var(--font-mono);
  color: var(--fg-60);
}
```

**Tree item:**
```css
.tree-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 150ms ease;
}
.tree-item:hover {
  background: var(--fg-5);
}
.tree-item.selected {
  background: var(--fg-5);
  color: var(--fg-80);
  font-weight: 500;
}
```

Indentation: `padding-left: calc(8px + depth * 16px)` where depth is nesting level.

**File icon (per type):**
| Extension | Icon | Color |
|---|---|---|
| `.md` | Lucide `file-text` | `var(--fg-40)` |
| `.toml` | Lucide `file-cog` | `var(--fg-40)` |
| `.py` | Lucide `file-code` | `#3B82F6` (blue) |
| `.sh` | Lucide `terminal` | `#16A34A` (green) |
| `.xlsx` | Lucide `table` | `#16A34A` |
| `Dockerfile` | Lucide `box` | `#2563EB` |
| directory | Lucide `folder` / `folder-open` | `#D97706` (amber) |

Icons: 14px, stroke-width 1.5.

**Status badge (right side):**
```css
.file-badge {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}
.file-badge.modified { color: #D97706; } /* ● */
.file-badge.clean { color: #16A34A; } /* ✓ */
.file-badge.review { color: #DC2626; } /* ⚠ */
```

**Line count:**
```css
.file-lines {
  font: 400 11px/1 var(--font-figtree);
  color: var(--fg-30);
  flex-shrink: 0;
  margin-left: auto;
  margin-right: 4px;
}
```

**6.4.3 Inline editor (appears below file tree when file is selected):**

```css
.file-editor {
  margin-top: 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  overflow: hidden;
  animation: sd-slideUp 200ms ease both;
}
```

**Editor header:**
```css
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--fg-5);
  background: var(--bg-l100);
}
.editor-filename {
  font: 500 13px/1 var(--font-mono);
  color: var(--fg-60);
}
```

**Spoiler lint badge:**
```css
.lint-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  font: 400 11px/1 var(--font-departure);
  letter-spacing: 0.02em;
}
.lint-badge.clean {
  background: #F0FDF4;
  color: #16A34A;
  border: 1px solid #BBF7D0;
}
.lint-badge.dirty {
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
}
```

Text: "Spoiler Lint: 0 ✓" or "Spoiler Lint: 3 ✗"

**Close button:** Same as plate close.

**Editor body (CodeMirror/Monaco):**
```css
.editor-body {
  padding: 8px 0;
  max-height: 360px;
  overflow-y: auto;
  font: 400 13px/1.6 var(--font-mono);
  color: var(--fg-80);
}
```

Line numbers: `color: var(--fg-20); width: 32px; text-align: right; padding-right: 8px; user-select: none;`

Spoiler lint highlights:
```css
.lint-highlight {
  background: rgba(254, 226, 226, 0.3); /* red-100/30 */
  border-left: 2px solid #DC2626;
  display: block;
}
```

**Markdown preview toggle (top-right of editor header):**
```css
.preview-toggle {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--fg-30);
  cursor: pointer;
  transition: all 200ms ease;
}
.preview-toggle:hover {
  color: var(--fg-50);
  background: var(--fg-5);
}
.preview-toggle.active {
  color: var(--fg-80);
  background: var(--fg-5);
}
```

Icon: Lucide `eye` (preview mode) / `code` (edit mode), 14px.

### 6.5 Sweeps Tab

**6.5.1 Latest sweep card:**

```css
.latest-sweep {
  border-radius: var(--radius-xl);
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
  padding: 20px;
  margin-bottom: 16px;
}
```

Contains pass@k headline, trial rows, and action buttons (all defined in 6.2.8).

**6.5.2 Multi-model comparison table:**

```css
.comparison-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 16px;
}
```

**Table header:**
```css
.comparison-th {
  font: 600 11px/1 var(--font-figtree);
  color: var(--fg-40);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 8px 0;
  text-align: left;
  border-bottom: 1px solid var(--fg-10);
}
```

**Table row:**
```css
.comparison-tr {
  transition: background 150ms ease;
}
.comparison-tr:hover {
  background: var(--fg-5);
}
.comparison-td {
  padding: 10px 0;
  border-bottom: 1px solid var(--fg-5);
  vertical-align: middle;
}
```

**Model name cell:**
```css
.comparison-model {
  font: 400 13px/1 var(--font-mono);
  color: var(--fg-80);
}
```

**Score cell:**
```css
.comparison-score {
  font: 600 13px/1 var(--font-departure);
  letter-spacing: 0.02em;
}
```

**Bar cell:**
```css
.comparison-bar {
  width: 120px;
  height: 8px;
  background: var(--fg-5);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.comparison-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 400ms var(--ease-smooth);
}
/* Green = high failure = good eval */
.comparison-bar-fill.good { background: #16A34A; }
.comparison-bar-fill.mediocre { background: #D97706; }
.comparison-bar-fill.bad { background: #DC2626; }
```

**6.5.3 Trajectory viewer:**

Opens when "View Trajectory" is clicked from a trial row.

```css
.trajectory-viewer {
  border-radius: var(--radius-lg);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  padding: 16px;
  margin-top: 12px;
  animation: sd-slideUp 200ms ease both;
}
```

**Trajectory header:**
```css
.trajectory-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.trajectory-title {
  font: 600 14px/1 var(--font-figtree);
  color: var(--fg-80);
}
.trajectory-meta {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
}
.trajectory-meta .separator {
  color: var(--fg-20);
  margin: 0 4px;
}
```

**Trajectory step:**
```css
.trajectory-step {
  position: relative;
  padding: 8px 0 8px 20px;
  border-left: 2px solid var(--fg-10);
  margin-left: 8px;
}
.trajectory-step.current {
  border-left-color: var(--domain-accent);
}
.trajectory-step.warning {
  border-left-color: #D97706;
}
.trajectory-step.error {
  border-left-color: #DC2626;
}
```

**Step dot (on the border-left line):**
```css
.step-dot {
  position: absolute;
  left: -5px;
  top: 12px;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--bg-l200);
  border: 2px solid var(--fg-20);
}
.trajectory-step.current .step-dot {
  border-color: var(--domain-accent);
  background: var(--domain-accent);
}
.trajectory-step.warning .step-dot {
  border-color: #D97706;
  background: #D97706;
}
.trajectory-step.error .step-dot {
  border-color: #DC2626;
  background: #DC2626;
}
```

**Step content:**
```css
.step-tool-call {
  font: 500 12px/1.3 var(--font-mono);
  color: var(--fg-60);
  margin-bottom: 4px;
}
.step-result {
  font: 400 12px/1.4 var(--font-figtree);
  color: var(--fg-40);
}
```

**Step annotations:**
```css
.step-annotation {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  margin-top: 4px;
  font: 400 11px/1 var(--font-figtree);
}
.step-annotation.warning {
  background: #FFFBEB;
  color: #D97706;
}
.step-annotation.error {
  background: #FEF2F2;
  color: #DC2626;
}
```

Icon inside annotation: Lucide `alert-triangle` (warning) or `x-circle` (error), 10px.

---

## Phase 7: Generated Assets

### 7.1 Icon Generation Prompts

All icons generated at 256x256px source, exported as SVG or WebP, displayed at target sizes.

**Pipeline stage icons (warm monochrome):**

Prompt template:
```
A minimal line-art icon of [concept], single consistent 2px stroke weight,
warm gray (#6B6B66) on transparent background, 256x256px, geometric and
precise, no fill, suitable for display at 18px in a modern web UI.
No gradients, no shadows, no decorative elements. Clean vector style.
```

| Icon | Concept detail |
|---|---|
| intake | "a funnel with an arrow pointing down into it" |
| probe | "three concentric semicircular radar arcs emanating from a central point" |
| scaffold | "two interlocking building blocks or puzzle pieces" |
| validate | "a shield with a checkmark inside" |
| publish | "a flag on a short pole, slightly waving" |

**Domain icons (tinted):**

Prompt template:
```
A minimal line-art icon of [concept], single consistent 2px stroke weight,
[color hex] on transparent background, 256x256px, geometric and precise,
no fill, suitable for display at 18px. No gradients, no shadows.
```

| Domain | Concept | Color |
|---|---|---|
| Instructions | "a checklist with three items, top one checked" | `#4087F2` |
| Reasoning | "a brain composed of geometric lines and angles" | `#8A72E5` |
| Safety | "a shield with an exclamation mark" | `#F46746` |
| Knowledge | "an open book with lines of text" | `#80A740` |
| Calibration | "a gauge or meter dial pointing to center" | `#B16A27` |
| Multilingual | "a globe with text/A symbols around it" | `#3AAFA9` |
| Long Context | "three stacked document pages" | `#E8596C` |
| Tool Use | "a wrench and gear interlocking" | `#6C63FF` |

### 7.2 Center Hub Illustration

```
Prompt: A minimal, warm-toned illustration of an abstract compass-like
measurement instrument with a circular orbital ring, rendered in clean
geometric lines with #6B6B66 warm gray and subtle #8A72E5 purple accent.
Transparent background, 512x512px, suitable for display at 42px height.
Premium, distinctive, slightly playful. Modern data science aesthetic.
```

### 7.3 Domain Background Illustrations (for workspace plates)

256x256px, displayed at 30% opacity as background art in workspace plate headers.

Prompt template:
```
Abstract geometric illustration representing [domain concept], composed of
soft overlapping shapes and subtle gradients. [accent color] tint on white
background. Modern data visualization aesthetic with mathematical precision.
No text, no icons. Suitable as a decorative background at 30% opacity.
256x256px, transparent background.
```

### 7.4 Empty State Illustrations

For tabs with no content yet:

```
Prompt: A minimal warm-toned illustration of [concept], using only geometric
shapes and lines in #6B6B66 warm gray with very subtle #f1f1ee warm white
background. 200x200px, transparent background. Friendly but professional.
```

| State | Concept |
|---|---|
| No sweeps | "an empty laboratory flask or beaker" |
| No files | "an empty folder with a dotted outline" |
| No activity | "a quiet, still pendulum" |

---

## Phase 8: Micro-Interactions & Polish (Atomic)

### 8.1 All Animation Keyframes

```css
/* Blur in (onboarding cards, modals) */
@keyframes sd-blurIn {
  from { opacity: 0; filter: blur(4px); }
  to { opacity: 1; filter: blur(0); }
}

/* Fade in */
@keyframes sd-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up (new list items, messages) */
@keyframes sd-slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Shimmer (loading states) */
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -160% 0; }
}

/* Spin (loading spinners) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Dot pulse (probing status) */
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}

/* Pulse glow (active nodes) */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 4px var(--domain-accent); }
  50% { box-shadow: 0 0 16px var(--domain-accent), 0 0 4px var(--domain-accent); }
}

/* Dash scroll (connection lines) */
@keyframes dashScroll {
  to { stroke-dashoffset: -20; }
}

/* Ring draw (SVG ring entrance) */
@keyframes ringDraw {
  from { stroke-dashoffset: 1614.6; }
  to { stroke-dashoffset: var(--target-offset); }
}

/* Node entrance (domain nodes appearing) */
@keyframes nodeEntrance {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Card stagger (fan-out cards) */
@keyframes cardStagger {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Number exit (counting animation) */
@keyframes numberExit {
  to { opacity: 0; transform: translateY(-2px); }
}

/* Number enter (counting animation) */
@keyframes numberEnter {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Step exit (onboarding transitions) */
@keyframes stepExit {
  to { opacity: 0; transform: translateY(-8px); }
}

/* Step enter (onboarding transitions) */
@keyframes stepEnter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Plate open */
@keyframes plateOpen {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateX(-50%) translateY(-8px);
  }
  to {
    opacity: 1;
    max-height: 420px;
    transform: translateX(-50%) translateY(0);
  }
}

/* Plate close */
@keyframes plateClose {
  to {
    opacity: 0;
    max-height: 0;
    transform: translateX(-50%) translateY(-8px);
  }
}

/* Overlay in (modal backdrop) */
@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Dialog in (modal content) */
@keyframes dialogIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Shake (locked step card) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

/* Toast slide in */
@keyframes toastIn {
  from { opacity: 0; transform: translateY(8px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Toast slide out */
@keyframes toastOut {
  to { opacity: 0; transform: translateY(-4px); }
}
```

### 8.2 Toast Notification System

**Container:**
```css
.toast-container {
  position: fixed;
  bottom: 60px; /* above bottom tab bar */
  right: 16px;
  z-index: 300;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  pointer-events: none;
}
```

**Individual toast:**
```css
.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-lg);
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
  box-shadow: var(--shadow-outset-150);
  max-width: 360px;
  animation: toastIn 400ms ease both;
}
.toast.exiting {
  animation: toastOut 200ms ease forwards;
}
```

**Toast icon:**
```css
.toast-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.toast-icon.success { color: #16A34A; }
.toast-icon.warning { color: #D97706; }
.toast-icon.error { color: #DC2626; }
.toast-icon.info { color: var(--fg-50); }
```

Icons: Lucide `check-circle-2` (success), `alert-triangle` (warning), `x-circle` (error), `info` (info). 16px, stroke-width 1.5.

**Toast text:**
```css
.toast-text {
  font: 400 13px/1.3 var(--font-figtree);
  color: var(--fg-80);
  flex: 1;
  min-width: 0;
}
```

**Toast close button:**
```css
.toast-close {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs);
  color: var(--fg-30);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 150ms ease;
}
.toast-close:hover {
  color: var(--fg-60);
  background: var(--fg-5);
}
```

Icon: Lucide `x`, 12px.

**Auto-dismiss:** 5 seconds. Exit animation plays, then removed from DOM.
**Max visible:** 3 toasts. Oldest dismissed when 4th arrives.

### 8.3 Skeleton Loading States

When content is loading, show placeholder skeletons:

```css
.skeleton {
  background: var(--fg-5);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 36%,
    var(--fg-10) 48%,
    transparent 60%,
    transparent 100%
  );
  background-size: 260% 100%;
  animation: shimmer 2.5s linear infinite;
}
```

**Skeleton variants:**
```css
.skeleton-text { height: 14px; width: 60%; margin-bottom: 8px; }
.skeleton-text.short { width: 30%; }
.skeleton-text.full { width: 100%; }
.skeleton-card { height: 88px; border-radius: var(--radius-lg); margin-bottom: 8px; }
.skeleton-circle { width: 24px; height: 24px; border-radius: var(--radius-full); }
.skeleton-ring { width: 120px; height: 120px; border-radius: var(--radius-full); }
```

### 8.4 Focus Ring (Keyboard Navigation)

```css
*:focus-visible {
  outline: 2px solid var(--fg-30);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

For dark buttons:
```css
.btn-dark:focus-visible {
  outline-color: var(--fg-60);
}
```

### 8.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Phase 9: State Machine (Atomic Detail)

### 9.1 Zustand Store Schema

```typescript
interface EvalCanvasStore {
  // Project
  project: Project | null;
  setProject: (p: Project) => void;

  // Onboarding
  onboardingStep: 0 | 1 | 2 | 3 | 4 | 5;
  setOnboardingStep: (s: number) => void;
  onboardingAnswers: Record<number, string>;
  setOnboardingAnswer: (q: number, a: string) => void;

  // Canvas state
  globalState: 'empty' | 'onboarding' | 'canvas_idle' | 'probing' | 'scaffolding' | 'validating' | 'calibrating' | 'published';
  setGlobalState: (s: string) => void;

  // Domain states (per domain)
  domainStates: Record<DomainId, DomainState>;
  setDomainState: (id: DomainId, state: DomainState) => void;

  // Active domain (which workspace plate is open)
  activeDomain: DomainId | null;
  setActiveDomain: (id: DomainId | null) => void;

  // Active tab
  activeTab: 'home' | 'agent' | 'project' | 'files' | 'sweeps';
  setActiveTab: (t: string) => void;

  // Chat messages
  messages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;

  // Probe results (per domain)
  probeResults: Record<DomainId, ProbeResult>;
  setProbeResult: (id: DomainId, r: ProbeResult) => void;

  // Scaffold artifacts (per domain)
  scaffoldArtifacts: Record<DomainId, ScaffoldArtifact[]>;
  setScaffoldArtifacts: (id: DomainId, a: ScaffoldArtifact[]) => void;

  // Validation gates (per domain)
  validationGates: Record<DomainId, ValidationGate>;
  setValidationGate: (id: DomainId, g: ValidationGate) => void;

  // Sweep results
  sweepResults: SweepResult[];
  addSweepResult: (r: SweepResult) => void;

  // Models
  targetModel: ModelConfig;
  setTargetModel: (m: ModelConfig) => void;
  comparisonModels: ModelConfig[];
  addComparisonModel: (m: ModelConfig) => void;
  removeComparisonModel: (id: string) => void;

  // UI state
  toasts: Toast[];
  addToast: (t: Toast) => void;
  removeToast: (id: string) => void;
}

type DomainId = 'instruction_following' | 'reasoning' | 'safety' | 'knowledge' | 'calibration' | 'multilingual' | 'long_context' | 'tool_use';

type DomainState = 'untested' | 'probe_queued' | 'probing' | 'probe_complete' | 'promoted' | 'redesign' | 'rejected' | 'scaffold_queued' | 'scaffolding' | 'scaffold_complete' | 'validation_gate' | 'gate_passed' | 'gate_failed' | 'target_sweep' | 'sweep_complete' | 'ready_to_publish' | 'iterating' | 'published';
```

### 9.2 State-to-UI Mapping Table

| Global State | Top Bar | Canvas | Workspace Plate | Right Panel Default Tab | Bottom Tabs |
|---|---|---|---|---|---|
| `empty` | Hidden | Hidden | Hidden | — | Hidden |
| `onboarding` | Hidden | Hidden | Hidden | — | Hidden |
| `canvas_idle` | Visible, project name | Ring + 8 idle nodes + center | Hidden | Home | All visible |
| `probing` | Visible, pulsing model pill | Active node pulses, others dim | Open: probe fan-out | Agent | Sweeps badge |
| `scaffolding` | Visible | Active node blue, others dim | Open: scaffold fan-out | Agent | Files badge |
| `validating` | Visible | Active node purple | Open: validation gate | Agent | Sweeps badge |
| `calibrating` | Visible | Active node accent glow | Open: sweep results | Agent | Sweeps active |
| `published` | Visible, checkmark on model pill | Published nodes green, idle nodes normal | Collapsed, green border | Agent | All quiet |

### 9.3 Domain State-to-Node-Visual Mapping

| Domain State | Node border | Status dot | Connection line | Opacity |
|---|---|---|---|---|
| `untested` | `border-fg-10` | `bg-fg-20` (idle) | dashed, `stroke-fg-20` | 1.0 |
| `probe_queued` | `border-fg-10` | `bg-fg-20` | dashed, `stroke-fg-20` | 1.0 |
| `probing` | `2px border-accent` + `pulseGlow` | `bg-accent` + `dotPulse` | animated dashes, `stroke-accent` | 1.0 (others 0.5) |
| `probe_complete` | `2px border-accent` | `bg-accent` solid | solid, `stroke-fg-30` | 1.0 |
| `promoted` | `2px border-green-500` | `bg-green-500` | solid, `stroke-fg-40` | 1.0 |
| `scaffolding` | `2px border-blue-500` + `pulseGlow(blue)` | `bg-blue-500` + `dotPulse` | animated dashes blue | 1.0 (others 0.5) |
| `scaffold_complete` | `2px border-blue-500` | `bg-blue-500` | solid blue | 1.0 |
| `validation_gate` | `2px border-purple-500` | `bg-purple-500` | solid purple | 1.0 |
| `gate_passed` | `2px border-green-500` | `bg-green-500` | solid green | 1.0 |
| `target_sweep` | `2px border-accent` + `pulseGlow` | `bg-accent` + `dotPulse` | animated dashes | 1.0 (others 0.5) |
| `published` | `border-green-600` + left green bar | `bg-green-600` | solid green | 1.0 |

### 9.4 Keyboard Shortcuts

| Key | Context | Action |
|---|---|---|
| `1-5` | Global | Switch to tab 1-5 (Home, Agent, Project, Files, Sweeps) |
| `Escape` | Workspace open | Close workspace plate |
| `Escape` | Modal open | Close modal/dialog |
| `Escape` | Dropdown open | Close dropdown |
| `Enter` | Onboarding input focused | Submit/Continue |
| `Enter` | Chat input focused | Send message |
| `Shift+Enter` | Chat input focused | New line in message |
| `Cmd+K` / `Ctrl+K` | Global | Focus chat input (Agent tab) |
| `ArrowUp/Down` | Onboarding options | Navigate options |
| `ArrowLeft/Right` | File tree | Collapse/expand folders |

### 9.5 Responsive Behavior

| Breakpoint | Canvas | Right Panel | Layout |
|---|---|---|---|
| ≥1440px | Full ring (600x600) | 460px fixed right | Side-by-side |
| 1024-1439px | Smaller ring (480x480) | 400px fixed right | Side-by-side, tighter |
| 768-1023px | Ring hidden | Full width panel | Panel-only mode, tabs navigate |
| <768px | Ring hidden | Full width panel | Mobile: bottom tabs, stacked content |

Ring scales via CSS transform when viewport is tight:
```css
@media (max-width: 1439px) and (min-width: 1024px) {
  .ring-container {
    transform: scale(0.8);
    transform-origin: center center;
  }
}
```

Panel width reduces:
```css
@media (max-width: 1439px) and (min-width: 1024px) {
  .right-panel {
    width: 400px;
  }
  .canvas-area {
    right: 408px;
  }
}
```

### 9.6 Error States

**Network error toast:**
- Icon: `wifi-off`, red
- Text: "Connection lost. Retrying..."
- Does not auto-dismiss. Shows until connection restored.

**Agent error (in chat):**
```css
.msg-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-lg);
  background: #FEF2F2;
  border: 1px solid #FECACA;
  font: 400 13px/1.4 var(--font-figtree);
  color: #991B1B;
  margin: 8px 0;
}
```

**Retry button (inside error):**
```css
.retry-btn {
  height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  border: 1px solid #FECACA;
  background: transparent;
  font: 500 12px/1 var(--font-figtree);
  color: #DC2626;
  cursor: pointer;
  transition: all 200ms ease;
}
.retry-btn:hover {
  background: rgba(220, 38, 38, 0.05);
}
```

**Empty state (per tab):**
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}
.empty-state-illustration {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  opacity: 0.6;
}
.empty-state-title {
  font: normal 18px/1.3 var(--font-mondwest);
  color: var(--fg-50);
  margin-bottom: 8px;
}
.empty-state-desc {
  font: 400 13px/1.5 var(--font-figtree);
  color: var(--fg-40);
  max-width: 280px;
}
```

---

## Appendix: Component Index

Every unique component defined in this spec:

| # | Component | Phase | CSS class | Dimensions |
|---|---|---|---|---|
| 1 | Viewport root | 0.1 | — | 100vw x 100dvh |
| 2 | Top bar | 0.2 | `.top-bar` | 100% x 48px |
| 3 | Avatar | 0.2.1 | — | 28x28px |
| 4 | Project dropdown trigger | 0.2.2 | — | auto |
| 5 | Project dropdown menu | 0.2.2 | `.project-dropdown` | 240px wide |
| 6 | Project dropdown item | 0.2.2 | `.project-dropdown-item` | auto |
| 7 | Model selector pill | 0.2.3 | `.model-pill` | auto x 28px |
| 8 | Model picker dropdown | 0.2.3 | `.model-picker-dropdown` | 320px wide |
| 9 | Model option card | 0.2.3 | `.model-option` | auto |
| 10 | Settings button | 0.2.4 | `.settings-btn` | 32x32px |
| 11 | Bottom tab bar | 0.3 | `.bottom-tabs` | 100% x 48px |
| 12 | Tab item | 0.3.1 | `.tab-item` | auto |
| 13 | Tab sliding indicator | 0.3.2 | `.tab-indicator` | 32px x 3px |
| 14 | Tab badge dot | 0.3.3 | `.tab-badge` | 6x6px |
| 15 | Right panel | 0.4.1 | `.right-panel` | 460px wide |
| 16 | Panel tab bar | 0.4.2 | `.panel-tabs` | auto |
| 17 | Panel tab | 0.4.2 | `.panel-tab` | auto |
| 18 | Panel content area | 0.4.3 | `.panel-content` | flex |
| 19 | Panel context badge | 0.4.4 | `.context-badge` | auto x 28px |
| 20 | Chat composer | 0.5.1 | `.chat-composer` | auto |
| 21 | Composer input wrapper | 0.5.2 | `.composer-input-wrap` | 44-140px h |
| 22 | Composer textarea | 0.5.3 | `.composer-textarea` | auto |
| 23 | Attach button | 0.5.4 | `.attach-btn` | 28x28px |
| 24 | Submit button | 0.5.4 | `.submit-btn` | 32x32px |
| 25 | Onboarding shell | 1.0 | `.onboarding-shell` | 100% |
| 26 | Onboarding glow | 1.0 | `.onboarding-glow` | 500x500px |
| 27 | Onboarding card | 1.1 | `.onboarding-card` | 480-600px max |
| 28 | Harbor wordmark | 1.1.1 | `.harbor-wordmark` | auto |
| 29 | Onboarding question text | 1.1.2 | `.onboarding-question` | auto |
| 30 | Onboarding input field | 1.1.3 | `.onboarding-input` | 100% x 48px |
| 31 | Onboarding CTA button | 1.1.4 | `.onboarding-cta` | 100% x 40px |
| 32 | Model selection card | 1.2.2 | `.model-card` | auto |
| 33 | Model radio indicator | 1.2.2 | `.model-radio` | 18x18px |
| 34 | Custom model fields | 1.2.2 | `.custom-model-fields` | auto |
| 35 | Workflow editor | 1.3.3 | `.workflow-editor` | 140-240px h |
| 36 | Failure mode chip | 1.3.4 | `.failure-chip` | auto x 32px |
| 37 | Chip grid | 1.3.4 | `.chip-grid` | auto |
| 38 | Onboarding chat container | 1.4.0 | `.onboarding-chat` | 600px max |
| 39 | User message bubble | 1.4.1 | `.chat-msg-user-bubble` | 85% max |
| 40 | Agent avatar | 1.4.2 | `.agent-avatar` | 24x24px |
| 41 | Agent name | 1.4.2 | `.agent-name` | auto |
| 42 | Agent timestamp | 1.4.2 | `.agent-timestamp` | auto |
| 43 | Agent body text | 1.4.2 | `.agent-body` | auto |
| 44 | Question progress | 1.4.3 | `.question-progress` | auto |
| 45 | Options wrapper | 1.4.4 | `.options-wrapper` | auto |
| 46 | Option item | 1.4.4 | `.option-item` | auto x 32px min |
| 47 | Option radio | 1.4.4 | `.option-radio` | 16x16px |
| 48 | Decision row | 1.4.5 | `.decision-row` | auto |
| 49 | "Decide all" button | 1.4.5 | `.btn-decide-all` | 112px min x 32px |
| 50 | "Submit answer" button | 1.4.5 | `.btn-submit-answer` | 120px min x 32px |
| 51 | Answered question (collapsed) | 1.4.6 | `.answered-question` | auto |
| 52 | Custom option input | 1.4.7 | `.option-custom-input` | 100% x 32px |
| 53 | Hypothesis loading state | 1.5.1 | `.hypothesis-loading` | auto |
| 54 | Shimmer bar | 1.5.1 | `.shimmer-bar` | 200px x 4px |
| 55 | Hypothesis card | 1.5.2 | `.hypothesis-card` | 560px max |
| 56 | Hypothesis taxonomy badge | 1.5.2 | `.hypothesis-taxonomy` | auto |
| 57 | Hypothesis title | 1.5.2 | `.hypothesis-title` | auto |
| 58 | Hypothesis section | 1.5.2 | `.hypothesis-section` | auto |
| 59 | Hypothesis accept button | 1.5.2 | `.hypothesis-accept` | calc x 40px |
| 60 | Hypothesis edit link | 1.5.2 | `.hypothesis-edit-link` | auto |
| 61 | Canvas area | 2.1 | `.canvas-area` | flex |
| 62 | Ring container | 2.2 | `.ring-container` | 600x600px |
| 63 | SVG ring (base + progress) | 2.3 | `.ring-svg` | 600x600px |
| 64 | Connection lines SVG | 2.4 | `.connections-svg` | 600x600px |
| 65 | Connection line (each) | 2.4 | `.connection` | varies |
| 66 | Domain node | 2.5 | `.domain-node` | ~110x32px |
| 67 | Domain node outer shell | 2.5 | `.domain-node-outer` | auto |
| 68 | Domain node inner | 2.5 | `.domain-node-inner` | auto |
| 69 | Domain status dot | 2.5 | `.domain-status-dot` | 6x6px |
| 70 | Domain label | 2.5 | `.domain-label` | auto |
| 71 | Center hub | 2.6 | `.center-hub` | 98px wide |
| 72 | Center hub outer | 2.6 | `.center-hub-outer` | 98px wide |
| 73 | Center hub inner | 2.6 | `.center-hub-inner` | 98px x 54px |
| 74 | Screen reflectance | 2.6 | `.center-hub-inner::after` | inset |
| 75 | Workspace plate | 3.1 | `.workspace-plate` | 680px max |
| 76 | Workspace plate shell | 3.1 | `.workspace-plate-shell` | auto |
| 77 | Plate header | 3.2 | `.plate-header` | auto |
| 78 | Plate accent dot | 3.2.1 | `.plate-accent-dot` | 8x8px |
| 79 | Plate domain name | 3.2.1 | `.plate-domain-name` | auto |
| 80 | Plate status badge | 3.2.1 | `.plate-status-badge` | auto x 22px |
| 81 | Plate progress text | 3.2.1 | `.plate-progress-text` | auto |
| 82 | Plate close button | 3.2.2 | `.plate-close` | 28x28px |
| 83 | Plate divider | 3.3 | `.plate-divider` | 100% x 1px |
| 84 | Fan-out grid | 4.1 | `.fanout-grid` | auto |
| 85 | Fan-out section label | 4.1 | `.fanout-label` | auto |
| 86 | Variant cards row | 4.1.1 | `.variant-row` | auto |
| 87 | Variant card | 4.1.1 | `.variant-card` | 108x88px |
| 88 | Variant label | 4.1.1 | `.variant-label` | auto |
| 89 | Variant status icon | 4.1.1 | `.variant-status-icon` | 20x20px |
| 90 | Variant trial count | 4.1.1 | `.variant-trials` | auto |
| 91 | Variant failure rate | 4.1.1 | `.variant-failure-rate` | auto |
| 92 | Fan-out summary row | 4.1.3 | `.fanout-summary` | auto |
| 93 | Fan-out mean text | 4.1.3 | `.fanout-mean` | auto |
| 94 | Fan-out separator dot | 4.1.3 | `.fanout-separator` | 3x3px |
| 95 | Fan-out verdict badge | 4.1.3 | `.fanout-verdict` | auto |
| 96 | Scaffold cards row | 4.2.1 | `.scaffold-row` | auto |
| 97 | Scaffold card | 4.2.1 | `.scaffold-card` | 140x100px |
| 98 | Scaffold card header | 4.2.1 | `.scaffold-card-header` | auto |
| 99 | Scaffold card icon | 4.2.1 | `.scaffold-card-icon` | 16x16px |
| 100 | Scaffold card name | 4.2.1 | `.scaffold-card-name` | auto |
| 101 | Scaffold artifact text | 4.2.1 | `.scaffold-artifact` | auto |
| 102 | Scaffold detail text | 4.2.1 | `.scaffold-detail` | auto |
| 103 | Gate cards row | 4.3.1 | `.gate-row` | auto |
| 104 | Gate card | 4.3.1 | `.gate-card` | flex x 80px |
| 105 | Gate title | 4.3.1 | `.gate-title` | auto |
| 106 | Gate result | 4.3.1 | `.gate-result` | auto |
| 107 | Gate expected text | 4.3.1 | `.gate-expected` | auto |
| 108 | Gate summary | 4.3.2 | `.gate-summary` | auto |
| 109 | Gate sweep CTA | 4.3.2 | `.gate-sweep-cta` | auto x 32px |
| 110 | Roadmap strip | 5.1 | `.roadmap-strip` | auto |
| 111 | Step card | 5.2 | `.step-card` | 120x56px |
| 112 | Step icon container | 5.2.2 | `.step-icon-container` | 32x32px |
| 113 | Step icon (masked) | 5.2.2 | `.step-icon` | 18x18px |
| 114 | Step name text | 5.2.3 | `.step-name` | auto |
| 115 | Step subtitle text | 5.2.3 | `.step-subtitle` | auto |
| 116 | Step badge | 5.2.4 | `.step-badge` | 14x14px |
| 117 | Step connector | 5.3 | `.step-connector` | 24px wide |
| 118 | Connector line | 5.3 | `.connector-line` | 100% x 1px |
| 119 | Connector icon | 5.3 | `.connector-icon` | 14x14px |
| 120 | Home greeting | 6.1.1 | `.home-greeting` | auto |
| 121 | Progress ring card | 6.1.2 | `.progress-card` | auto |
| 122 | SVG progress ring | 6.1.2 | — | 120x120px |
| 123 | Progress details | 6.1.2 | `.progress-details` | auto |
| 124 | Progress bar | 6.1.2 | `.progress-bar` | 100% x 4px |
| 125 | Section header | 6.1.3 | `.section-header` | auto |
| 126 | Suggested task card | 6.1.3 | `.suggested-card` | auto |
| 127 | Suggested dot | 6.1.3 | `.suggested-dot` | 6x6px |
| 128 | Suggested action button | 6.1.3 | `.suggested-action` | auto x 28px |
| 129 | Activity item | 6.1.4 | `.activity-item` | auto |
| 130 | Activity icon | 6.1.4 | `.activity-icon` | 16x16px |
| 131 | Activity text | 6.1.4 | `.activity-text` | flex |
| 132 | Activity timestamp | 6.1.4 | `.activity-time` | auto |
| 133 | Message list | 6.2.1 | `.message-list` | auto |
| 134 | Agent message | 6.2.2 | `.chat-msg-agent` | auto |
| 135 | User message | 6.2.3 | `.chat-msg-user` | auto |
| 136 | User bubble | 6.2.3 | `.user-bubble` | 85% max |
| 137 | Tool call indicator | 6.2.4 | `.tool-call` | auto x 32px |
| 138 | Tool icon | 6.2.4 | `.tool-icon` | 12x12px |
| 139 | Tool text | 6.2.4 | `.tool-text` | auto |
| 140 | Tool expandable detail | 6.2.4 | `.tool-detail` | auto |
| 141 | Probe summary card | 6.2.5 | `.probe-summary-card` | auto |
| 142 | Probe summary header | 6.2.5 | `.probe-summary-header` | auto |
| 143 | Variant bar item | 6.2.5 | `.variant-bar-item` | flex |
| 144 | Variant bar track | 6.2.5 | `.variant-bar-track` | 100% x 4px |
| 145 | Variant bar fill | 6.2.5 | `.variant-bar-fill` | auto x 4px |
| 146 | Approval gate card | 6.2.6 | `.approval-card` | auto |
| 147 | Approval icon | 6.2.6 | `.approval-icon` | 16x16px |
| 148 | Approval actions row | 6.2.6 | `.approval-actions` | auto |
| 149 | Iteration proposal card | 6.2.7 | `.iteration-card` | auto |
| 150 | Diff block | 6.2.7 | `.diff-block` | auto |
| 151 | Diff line (added/removed) | 6.2.7 | `.diff-line` | auto |
| 152 | Iteration rationale | 6.2.7 | `.iteration-rationale` | auto |
| 153 | Sweep result card | 6.2.8 | `.sweep-card` | auto |
| 154 | pass@k headline | 6.2.8 | `.sweep-pass-k` | auto |
| 155 | Trial row | 6.2.8 | `.trial-row` | auto |
| 156 | Trial badge | 6.2.8 | `.trial-badge` | auto |
| 157 | Trial summary | 6.2.8 | `.trial-summary` | auto |
| 158 | Trial link | 6.2.8 | `.trial-link` | auto |
| 159 | Settings section | 6.3.1 | `.settings-section` | auto |
| 160 | Setting row | 6.3.2 | `.setting-row` | auto |
| 161 | Setting link | 6.3.3 | `.setting-link` | auto |
| 162 | Model chip | 6.3.4 | `.model-chip` | auto x 32px |
| 163 | Model chip add button | 6.3.4 | `.model-chip-add` | 32x32px |
| 164 | Danger zone | 6.3.5 | `.danger-zone` | auto |
| 165 | Danger link | 6.3.5 | `.danger-link` | auto |
| 166 | Confirmation overlay | 6.3.6 | `.confirm-overlay` | 100% |
| 167 | Confirmation dialog | 6.3.6 | `.confirm-dialog` | 380px wide |
| 168 | Files header | 6.4.1 | `.files-header` | auto |
| 169 | File tree | 6.4.2 | `.file-tree` | auto |
| 170 | Tree item | 6.4.2 | `.tree-item` | auto |
| 171 | File icon | 6.4.2 | — | 14x14px |
| 172 | File badge | 6.4.2 | `.file-badge` | 16x16px |
| 173 | File line count | 6.4.2 | `.file-lines` | auto |
| 174 | Inline file editor | 6.4.3 | `.file-editor` | auto |
| 175 | Editor header | 6.4.3 | `.editor-header` | auto |
| 176 | Lint badge | 6.4.3 | `.lint-badge` | auto x 22px |
| 177 | Editor body | 6.4.3 | — | 360px max h |
| 178 | Lint highlight | 6.4.3 | `.lint-highlight` | auto |
| 179 | Preview toggle | 6.4.3 | `.preview-toggle` | 28x28px |
| 180 | Latest sweep card | 6.5.1 | `.latest-sweep` | auto |
| 181 | Comparison table | 6.5.2 | `.comparison-table` | 100% |
| 182 | Comparison bar | 6.5.2 | `.comparison-bar` | 120px x 8px |
| 183 | Trajectory viewer | 6.5.3 | `.trajectory-viewer` | auto |
| 184 | Trajectory step | 6.5.3 | `.trajectory-step` | auto |
| 185 | Step dot | 6.5.3 | `.step-dot` | 8x8px |
| 186 | Step annotation | 6.5.3 | `.step-annotation` | auto |
| 187 | Toast container | 8.2 | `.toast-container` | auto |
| 188 | Toast | 8.2 | `.toast` | 360px max |
| 189 | Toast icon | 8.2 | `.toast-icon` | 16x16px |
| 190 | Toast close | 8.2 | `.toast-close` | 20x20px |
| 191 | Skeleton | 8.3 | `.skeleton` | varies |
| 192 | Error message | 9.6 | `.msg-error` | auto |
| 193 | Retry button | 9.6 | `.retry-btn` | auto x 28px |
| 194 | Empty state | 9.6 | `.empty-state` | auto |

**Total unique components: 194**

---

## Appendix B: Interaction Flow Sequences

### B.1 Complete Happy Path (end-to-end)

1. User visits app → onboarding shell renders (Phase 1.0)
2. User enters project name → Continue → Step 2 (1.1)
3. User selects target model → Continue → Step 3 (1.2)
4. User types workflow description → Submit (1.3)
5. Agent asks 5 questions → User answers each → hypothesis generated (1.4)
6. User reviews hypothesis → Accept (1.5)
7. Canvas renders with ring + 8 domain nodes (Phase 2)
8. Orchestrator assigns primary domain based on hypothesis → that domain's node pulses
9. User clicks pulsing domain node → workspace plate opens (Phase 3)
10. Probe fan-out shows 5 variant cards → cards fill in as probing runs (Phase 4.1)
11. Probe completes → verdict shown → probe summary card in Agent chat (6.2.5)
12. User clicks "Accept & Scaffold" → scaffold fan-out replaces probe (Phase 4.2)
13. 5 scaffold agents generate artifacts in parallel → cards update
14. Scaffold complete → validation gate cards appear (Phase 4.3)
15. Oracle/Nop/Lint run ��� all 3 pass
16. User clicks "Run Target Sweep" → sweep executes
17. Sweep completes → sweep card in Agent chat (6.2.8)
18. pass@3 = 0/3 → good eval → "Publish" CTA available
19. User clicks "Publish" → domain node turns green → published state
20. User can repeat for other domains by clicking them

### B.2 Iteration Path

After step 17, if pass@3 > 0 (model sometimes succeeds):
1. Agent proposes iteration (iteration card with diff, 6.2.7)
2. User reviews diff → "Apply Edit"
3. File updated in Files tab, lint re-runs
4. Agent re-runs target sweep
5. Repeat until pass@3 = 0 or user is satisfied

### B.3 Multi-Domain Path

After publishing one domain:
1. User returns to canvas (Home tab or clicks canvas area)
2. Other domain nodes are still idle (untested)
3. Suggested actions on Home tab recommend next domain
4. User clicks a new domain → same probe→scaffold→validate→sweep cycle
5. Ring progress updates as domains complete

### B.4 Multi-Model Comparison Path

1. User opens Project tab → Multi-Model section
2. Clicks "+" to add comparison models
3. Each added model gets queued for sweeps
4. Sweeps tab shows comparison table (6.5.2) with all models' results
5. Trajectory viewer can inspect any model's behavior
