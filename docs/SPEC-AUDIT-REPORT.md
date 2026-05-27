# Harbor Eval Canvas: Spec Audit Report

> **Auditor**: Automated spec analysis
> **Date**: 2026-05-26
> **Documents reviewed**:
> 1. `MASTER-UI-PLAN.md` (Master Plan)
> 2. `ATOMIC-INTERACTION-SPEC.md` (Atomic Spec Pt1)
> 3. `ATOMIC-INTERACTION-SPEC-PT2.md` (Atomic Spec Pt2)
> 4. `COFOUNDER-MAIN-APP-AUDIT.md` (Cofounder Main Audit)
> 5. `docs/research/cofounder-interaction-audit.md` (Cofounder Interaction Audit)

---

## A. Cross-Phase Consistency Check

### A.1 CSS Variable Name Mismatches

| Variable | Master Plan | Atomic Spec | Issue |
|:---------|:------------|:------------|:------|
| Sunken cards bg | `--bg-l-negative-50` | `--bg-l-neg-50` | **Name mismatch**: Master uses `negative`, Atomic uses `neg`. Must pick one. |
| Foreground 40 | Not defined | `--fg-40: rgba(26,26,26,0.4)` | **Missing from Master Plan**: The Master Plan color system defines `--fg-50`, `--fg-30` but skips `--fg-40`. The Atomic Spec adds `--fg-40` (used extensively for placeholders, labels). Add to Master. |
| Foreground inverse | Not defined in Master | `--fg-inverse-80`, `--fg-inverse-100` defined in Atomic | **Missing from Master Plan**: Inverse foreground variables are only declared in the Atomic Spec. |
| Shadow CTA | `--shadow-cta: 0 2px 3px ... 0 6px 6px ... 0 14px 8px ...` (3 layers) | `--shadow-cta: 0 25px 10px ... 0 14px 8px ... 0 6px 6px ... 0 2px 3px ...` (4 layers) | **Value mismatch**: Master has 3 shadow layers; Atomic has 4 layers (adds `0 25px 10px rgba(0,0,0,0.03)`). The Atomic version matches Cofounder's accept button shadow exactly. **Use Atomic version.** |
| Shadow CTA small | Not defined in Master | `--shadow-cta-sm` in Atomic | **Missing from Master**: Atomic introduces `--shadow-cta-sm` for smaller CTA buttons. |
| Shadow option | Not defined in Master | `--shadow-option` in Atomic | **Missing from Master**: Atomic introduces `--shadow-option` for "Decide all" style buttons. |
| Shadow outset 025 | Not defined in Master | `--shadow-outset-025` in Atomic | **Missing from Master**: Lighter shadow variants (`025`, `050`) exist only in Atomic. |
| Shadow outset 050 | Not defined in Master | `--shadow-outset-050` in Atomic | **Missing from Master**. |
| Shadow inset 025 | Not defined in Master | `--shadow-inset-025` in Atomic | **Missing from Master**. |

### A.2 Font Consistency

| Element | Master Plan | Atomic Spec | Match? |
|:--------|:------------|:------------|:-------|
| Chat content | TT Neoris, Variable weight, 15px | `var(--font-neoris)`, 400 weight, 15px | **Weight ambiguity**: Master says "Variable", Atomic uses `400`. Clarify that Variable is the font technology, and `400` is the default weight used. |
| Display/Hero | PP Mondwest OTF, Regular, 28-36px | `var(--font-mondwest)`, normal, 24px (wordmark), 24px (greeting) | **Size inconsistency**: Master says 28-36px for Display/Hero. Atomic uses 24px for both the Harbor wordmark and the Home greeting. Neither reaches 28px. Either the 24px usage is correct (and Master's range should be updated), or the greeting should be larger. |
| Code/Data | IBM Plex Mono, 400-600, 13px | `var(--font-mono)`, weights vary, 11-13px | **Size variance**: Atomic uses 11px and 12px for some mono contexts (scaffold detail, file lines) which is below Master's stated 13px. This is acceptable as a deliberate hierarchy but should be documented in Master. |
| Serif accent | EB Garamond, 400-800, 14-18px | `var(--font-garamond)`, 400, 22px | **Size inconsistency**: Onboarding question uses EB Garamond at 22px, exceeding Master's range of 14-18px. Update Master Plan range to 14-22px. |
| Font variable names | Informal names | `--font-figtree`, `--font-mondwest`, `--font-neoris`, `--font-mono`, `--font-departure`, `--font-garamond` | Atomic provides formal CSS variable names. Master Plan should reference these. |

### A.3 Shadow Name-to-Value Consistency

| Shadow Name | Master Plan Value | Atomic Spec Value | Match? |
|:------------|:-----------------|:-----------------|:-------|
| `--shadow-outset-100` | `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` | Same | ✓ |
| `--shadow-outset-150` | `0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)` | Same | ✓ |
| `--shadow-inset-200` | `inset 0 1px 4px rgba(0,0,0,0.06), inset 0 0 1px rgba(0,0,0,0.08)` | Same | ✓ |
| `--shadow-screen` | `inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.05)` | Same | ✓ |
| `--shadow-cta` | 3 layers (see A.1) | 4 layers (see A.1) | **MISMATCH** |
| `--shadow-input-focus` | `0 0 0 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)` | Same | ✓ |

### A.4 Color Hex Code Consistency

| Color reference | Master Plan | Atomic Spec | Match? |
|:----------------|:------------|:------------|:-------|
| green-600 | `#16A34A` (implied, not explicit) | `#16A34A` (explicit in `.variant-card.high-failure`, `.gate-card.passed .gate-result`, `.activity-icon.success`) | ✓ (Atomic is explicit) |
| Status confirmed | `#4CAF50` (Master) | `#16A34A` (Atomic uses Tailwind green-600 instead) | **MISMATCH**: Master's `--status-confirmed` is `#4CAF50` (Material green), but Atomic never uses this value. Atomic consistently uses `#16A34A` (Tailwind green-600). Atomic also uses `#15803D` for the `.plate-status-badge.complete` text. **Reconcile: adopt `#16A34A` as the canonical "success green".** |
| Status complete | `#66BB6A` (Master) | `#16A34A` (Atomic) | **MISMATCH**: Same issue. Master defines a different green for "complete" vs "confirmed". Atomic uses one green. |
| Status probing | `#F5A623` (Master) | Not explicitly redefined in Atomic; Atomic uses `var(--status-probing)` | ✓ (defers to variable) |
| Status building | `#42A5F5` (Master) | Not redefined; badge uses `#1D4ED8` (blue-700 text) | **Difference**: The badge text color (`#1D4ED8`) is a much darker blue than the status dot color (`#42A5F5`). This is intentional (text on light bg needs more contrast), but should be documented. |
| Status rejected | `#EF5350` (Master) | Atomic uses `#DC2626` (Tailwind red-600) consistently | **MISMATCH**: Master's `--status-rejected: #EF5350` (Material red) vs Atomic's `#DC2626` (Tailwind red-600). |
| Amber/warning | No standard defined | Atomic uses `#D97706` (amber-600), `#B45309` (amber-700) | Consistent within Atomic, but Master defines no amber scale. |

### A.5 Animation Duration Consistency

| Pattern | Master Plan | Atomic Spec | Match? |
|:--------|:------------|:------------|:-------|
| Hover lift | 150ms ease-out | 150ms ease-out (`.card-interactive`) | ✓ |
| Color change | 200ms ease-in-out | 200ms ease (various) | **Minor**: Master says `ease-in-out`, Atomic sometimes uses `ease`. |
| Panel slide | 300ms cubic-bezier(0.16,1,0.3,1) | 300ms `var(--ease-spring)` | ✓ (same bezier) |
| Fade in | 150ms ease | `sd-fadeIn` no explicit duration in keyframe (used as `200ms ease both` in badge) | **Minor variance**: Badge fade is 200ms, not 150ms. |
| Shimmer | 5.5s linear infinite | `5.5s linear infinite` (Phase 8), but `2s linear infinite` (hypothesis loading shimmer bar), `3s linear infinite` (running card shimmer), `2.5s linear infinite` (skeleton) | **Multiple shimmer speeds**: Master defines one (5.5s). Atomic uses 4 different durations. Document that 5.5s is for full-card shimmer, shorter durations are for smaller elements. |
| Blur in | 200ms ease (Master) | `sd-blurIn 300ms ease both` (Atomic 1.1) | **MISMATCH**: Master says 200ms, Atomic says 300ms for onboarding card blur-in. |
| Slide up | 200ms ease (Master) | `sd-slideUp 200ms ease both` | ✓ |
| Node entrance | 400ms spring(1,80,10) (Master) | `400ms cubic-bezier(0.34,1.56,0.64,1)` (Atomic) | **Different easing**: Master uses a spring() notation (not widely supported in CSS). Atomic converts to a cubic-bezier approximation. This is a pragmatic adaptation, not a conflict. |
| Fan-out stagger | 80ms per item (Master) | 80ms per item (Atomic) | ✓ |
| Ring progress | 600ms cubic-bezier(0.4,0,0.2,1) (Master) | `600ms var(--ease-smooth)` (Atomic, same bezier) | ✓ |

---

## B. Missing Specifications

### B.1 Components Referenced but Not Fully Defined

| Component | Referenced In | What's Missing |
|:----------|:-------------|:---------------|
| **Model picker dropdown (from top bar)** | Master 0.2.3, Atomic 0.2.3 | The dropdown is described, but behavior when changing model mid-project is not specified. Does it re-run probes? Show a warning? Reset domains? |
| **Rich text editor toolbar** | Master Phase 1 Step 3 mentions "Rich text editor (ProseMirror/TipTap)" | No toolbar buttons specified. Does it have bold/italic/lists? Or is it plaintext-only with ProseMirror for auto-grow? |
| **"Edit hypothesis" expanded view** | Master Phase 1 Step 5, Atomic 1.5.2 | Atomic says "scrolls back up to show editable sections" but doesn't specify the editable textarea styling, save/cancel buttons, or validation. |
| **Project dropdown "New Project" flow** | Master 0.2.2 | Click opens "New Project" but no specification of what happens. Full onboarding restart? Quick name input? Modal? |
| **Multi-model sweep execution UI** | Master Phase 6 Sweeps Tab | How are multi-model sweeps initiated? Simultaneously or sequentially? What does the workspace plate show during multi-model sweeps? |
| **"Decide all" remaining questions behavior** | Atomic 1.4.5 | If user is on question 3/5 and clicks "Decide all", the spec says it auto-advances through remaining questions. But what if the user hasn't selected an answer for Q3 yet? Does it also select Q3's answer? |
| **Background glow color for Step 2** | Atomic 1.0 | Glow "varies by selected model's provider color" but provider colors for the glow aren't specified (only provider dot colors are: Google #4285F4, Anthropic #D4A574, etc.) |

### B.2 CSS Classes Used but Never Defined

| Class/Pattern | Used In | Issue |
|:--------------|:--------|:------|
| `sd-slideUp` | Atomic Spec (multiple references as animation name) | The animation is defined as `@keyframes sd-slideUp` in Phase 8.1, but early references in Phase 1 use it before it's defined. Not a technical issue (CSS is global), but organizationally confusing. |
| `.bg-background` | Atomic 0.1 (`class="... bg-background"`) | This Tailwind utility maps to `--bg` but the mapping isn't explicit in the CSS variable block. |
| `--fg-15` | Atomic 1.5.2 (`.hypothesis-meta .separator { color: var(--fg-15); }`) | **Not defined anywhere.** The foreground scale goes `--fg-10`, `--fg-20`. There is no `--fg-15`. Either define it or use `--fg-10` or `--fg-20`. |
| `--glow-color` | Atomic 1.0 (`.onboarding-glow`) | Used as a CSS custom property with transition, but not declared in `:root`. It's set inline per step, which is fine, but document this pattern. |
| `--domain-accent` | Atomic 2.5, 3.2.1, 4.1.1, 5.2 (used throughout) | Used extensively as a contextual CSS variable but never declared in `:root`. Presumably set dynamically per component. Document this pattern explicitly. |
| `--step-icon-url` | Atomic 5.2.2 | Used in `mask-image: url('var(--step-icon-url)')`. This syntax is incorrect: `url()` cannot contain `var()`. Should be `mask-image: var(--step-icon-url)` where the variable contains `url(...)`. |
| `color-mix()` | Atomic 2.5 (`.domain-node.active`) | Uses `color-mix(in srgb, var(--domain-accent) 20%, transparent)`. Browser support note needed (Safari 16.4+, Chrome 111+). |

### B.3 State Transitions Without Corresponding UI Changes

| Transition | From | To | What's Missing |
|:-----------|:-----|:---|:---------------|
| `PROBE_COMPLETE` → `REDESIGN` | Probe verdict = REDESIGN | ? | No UI specified. What does the user see? A card suggesting redesign? Auto-redirect to edit the hypothesis? What changes on the workspace plate? |
| `PROBE_COMPLETE` → `REJECTED` | Probe verdict = REJECT | ? | Same issue. Is there a card? Does the domain node get a visual state? Can the user retry? |
| `VALIDATION_GATE` → `FAIL` | Gate fails | "fix → retry" | The retry flow is vague. Does the Agent propose fixes? Does the user manually edit files? How does re-validation trigger? |
| `SWEEP_COMPLETE` → `ERROR` | Sweep errors | ? | Error state in per-domain machine is defined but no UI specified. What does an errored sweep look like? |
| `ITERATING` → back to `TARGET_SWEEP` | After applying iteration edits | Re-run sweep | How does re-running trigger? Automatic after edit applied? Button? Does the old sweep result persist or get replaced? |
| `canvas_idle` → `probing` (global) | User initiates probe | ? | The orchestrator "assigns primary domain based on hypothesis" (flow step 8 in Appendix B.1). But what if the user clicks a different domain than the one the orchestrator chose? |

### B.4 User Interactions Without Response Specifications

| Interaction | Context | What's Missing |
|:------------|:--------|:---------------|
| **Right-click** on domain node | Canvas | No context menu specified. Should there be one? (e.g., "View details", "Start probe", "Reset") |
| **Double-click** on domain node | Canvas | Not specified. Same as single click? |
| **Keyboard navigation** on canvas | Tab/Arrow keys between domain nodes | Not specified. Can users Tab between domain nodes? |
| **Swipe gestures** | Mobile bottom tab bar | Not specified. Can users swipe between tabs? |
| **Long press** | Mobile domain nodes | Not specified. Touch equivalent of hover? |
| **Browser back/forward** | After tab switch or workspace open | No routing/history specified. Does switching tabs push to browser history? |
| **Cmd+Z / Ctrl+Z** | After applying an iteration edit | No undo specification. Can users undo applied edits? |
| **Copy** from trajectory viewer | Sweep trajectories | No copy/select behavior specified for code blocks in trajectory viewer. |
| **Paste** into chat composer | Agent tab | No paste handling specified. What about pasting images, rich text, code? |

---

## C. Contradictions

### C.1 Dimension Conflicts

| Element | Master Plan | Atomic Spec | Resolution |
|:--------|:------------|:------------|:-----------|
| **Step card width** | 148px wide (Phase 5) | 120px wide (Atomic 5.2, see responsive note) | Atomic explains: 148px won't fit in 640px content area. Uses 120px default, 148px on wider viewports. **Master should note responsive sizing.** |
| **Step card height** | 56px (Phase 5) | 56px (Atomic 5.2) | ✓ |
| **Connector width** | 32px (Master) | 24px (Atomic) | **Conflict.** Master says 32px between step cards, Atomic uses 24px. Atomic's 24px is needed to fit in the plate width. **Use 24px.** |
| **Toast entrance duration** | 400ms ease (Master Phase 8) | `toastIn 400ms ease both` (Atomic) | ✓ |
| **Onboarding glow radius** | 400px radius, 120px blur (Master) | 500x500px, blur(80px) (Atomic) | **Conflict.** Master: 400px radius with 120px blur. Atomic: 250px radius (500px diameter) with 80px blur. Different sizes and blur amounts. |
| **Plate gap from ring** | 24px margin-top (Master) | `top: calc(50% + 320px)` = 20px gap (Atomic) | **Minor conflict.** Master says 24px, Atomic calculates 20px (300 center + 300 half-ring + 20 gap). |
| **Right panel padding** | `px-5 pt-4` (Master) | `padding: 16px 20px` on content area, `12px 20px 0` on panel tabs (Atomic) | **Consistent**: `px-5` = 20px, `pt-4` = 16px. ✓ |
| **Comparison bar height** | `h-2` = 8px (Master Phase 6 Sweeps) | `height: 8px` (Atomic 6.5.2) | ✓ |

### C.2 Color/Font Conflicts for Same Element

| Element | Master Plan | Atomic Spec | Resolution |
|:--------|:------------|:------------|:-----------|
| **Status "confirmed" green** | `#4CAF50` | `#16A34A` (used everywhere) | **Conflict.** Atomic never uses `#4CAF50`. Use `#16A34A` throughout. |
| **Status "complete" green** | `#66BB6A` | `#16A34A` | **Conflict.** Same issue. Simplify to one green. |
| **Status "rejected" red** | `#EF5350` | `#DC2626` | **Conflict.** Use `#DC2626` (Tailwind standard). |
| **Inactive tab text** | `text-fg-40` (Master) | `var(--fg-30)` (Atomic `.tab-item.inactive`) | **Conflict.** Master says fg-40, Atomic says fg-30. Atomic's fg-30 is lighter/more muted. |
| **Probing status badge text** | `text-amber-700` (Master) | `#B45309` (Atomic) | ✓ (`amber-700` = `#B45309`) |
| **Probing badge bg** | `bg-amber-50` (Master) | `#FFFBEB` (Atomic) | ✓ (`amber-50` = `#FFFBEB`) |
| **Top bar border** | `shadow-outset-100` (Master layout diagram) | `border-bottom: 1px solid var(--fg-5)` (Atomic) | **Both or one?** Master implies shadow, Atomic uses border. Atomic also adds `backdrop-filter: blur(12px)` not in Master. **Use Atomic.** |
| **Bottom tab bar border** | `border-t border-fg-10` (Master) | `border-top: 1px solid var(--fg-5)` (Atomic) | **Conflict.** Master uses `fg-10`, Atomic uses `fg-5`. |
| **Settings icon size** | 20x20px (Master) | 18px (Atomic, Lucide `settings` icon) | **Minor conflict.** Icon is 18px in a 32x32px button container. |

### C.3 Animation Timing Conflicts

| Animation | Master Plan | Atomic Spec | Resolution |
|:----------|:------------|:------------|:-----------|
| **Blur in** | 200ms | 300ms (`sd-blurIn`) | **Use 300ms** (Atomic version, feels more premium). |
| **Project dropdown animation** | "slide-down 200ms" | `sd-slideUp 150ms ease both` (uses slideUp, not slideDown) | **Direction conflict**: Master says "slide-down", Atomic defines a "slideUp" animation. A dropdown should slide down. Need a `sd-slideDown` keyframe or use `sd-slideUp` with reverse (entering from above). |
| **Tab content crossfade** | "outgoing fades out (100ms), incoming fades in (150ms) with 2px slide-up" | Not explicitly defined as CSS keyframes | **Missing implementation**: Tab crossfade described in Master but no corresponding CSS in Atomic. |

---

## D. Missing Micro-Interactions

### D.1 Streaming Text from Agent

**Status: NOT SPECIFIED**

Neither document specifies how streaming text appears in the Agent chat. Critical questions:

- **Typewriter vs word-by-word vs chunk**: How does streamed text render? Character by character? Word by word? In chunks as received from the API?
- **Cursor indicator**: Is there a blinking cursor at the end of streaming text? What style?
- **Scroll behavior during streaming**: Does the chat auto-scroll to keep the latest text visible? What if the user has scrolled up to read previous messages?
- **Partial message styling**: Is the message styled differently while still streaming (e.g., slightly faded, no timestamp yet)?
- **Interruption**: Can the user click "Stop" to halt streaming? Where is the stop button?
- **Tool calls during streaming**: If the agent calls a tool mid-stream, does the tool call card appear inline while text is still flowing?

**Recommendation**: Add a streaming text specification:
```
Streaming behavior:
- Text appears word-by-word (whitespace-delimited chunks)
- Blinking cursor: 2px wide, var(--fg-80), blink animation 1s step-end infinite
- Auto-scroll: enabled unless user has scrolled up >100px from bottom
- Submit button transforms to a "Stop" button (square icon) during streaming
- Tool calls appear as inline cards, text continues below after tool completes
```

### D.2 Loading States Between Pipeline Stages

**Status: PARTIALLY SPECIFIED**

The shimmer effect is defined for cards, but transitions between major stages lack specification:

- **Probe → Scaffold transition**: When probe completes and user clicks "Accept & Scaffold", what happens to the probe fan-out cards? Do they fade out? Slide left? Instantly replace? Specified: "Replaces the probe grid" but no transition animation.
- **Scaffold → Validate transition**: Same issue. The grid replacement animation is unspecified.
- **Validate → Sweep transition**: After gates pass and user clicks "Run Target Sweep", the sweep execution period has no loading state for the workspace plate.
- **Stage-to-stage in pipeline strip**: When a step card transitions from "Available" to "Active", is there a micro-animation on the card itself beyond the border change?

**Recommendation**: Define a `fanout-transition` animation:
```css
.fanout-exit { animation: fadeSlideLeft 200ms ease forwards; }
.fanout-enter { animation: fadeSlideRight 200ms ease 100ms both; }
```

### D.3 Multiple Domains in Different States Simultaneously

**Status: NOT SPECIFIED**

The spec assumes one domain is active at a time ("Only one plate is open at a time"). But the state machine allows multiple domains to be in different states (e.g., Reasoning is "published", Safety is "probing", Knowledge is "untested"). Questions:

- **Canvas visual**: When Reasoning has a green checkmark and Safety is pulsing, what do the other 6 nodes look like? All at opacity 0.5 (because Safety is active)? Or only non-active nodes dim?
- **Switching between active domains**: If Safety is "probing" and the user clicks the Reasoning node, does the Safety workspace plate close? Does probing continue in the background?
- **Background operations**: If a probe is running for Safety and the user navigates to the Files tab, is there any indicator that a background operation is in progress? (The Sweeps badge is mentioned, but behavior for concurrent domain operations isn't.)
- **Progress ring accounting**: The global progress ring counts "domains probed" but the formula for mapping 18 domain states to a 0-100% progress value isn't specified.

### D.4 Drag/Scroll Behavior on Mobile

**Status: BARELY SPECIFIED**

Responsive breakpoints are defined in Atomic 9.5, but touch interactions are absent:

- **Ring hidden on mobile (<1024px)**: Users lose the primary spatial interface. How do they navigate between domains? A dropdown? A horizontal scroll of domain cards?
- **Workspace plates on mobile**: Do they render full-width? Below what? The ring is hidden, so what context provides spatial orientation?
- **Pull-to-refresh**: Any custom behavior?
- **Pinch-to-zoom**: Explicitly disabled on the canvas, but what about the file editor?
- **Bottom tab bar**: On mobile with `position: fixed`, does it account for iOS safe area (`env(safe-area-inset-bottom)`)?
- **Chat composer on mobile**: Keyboard handling (virtual keyboard pushes content up, composer stays above keyboard).

### D.5 Pipeline Stage Failure Mid-Way

**Status: PARTIALLY SPECIFIED**

Error states in the Agent chat (`msg-error` with retry button) and domain state machine (`ERROR` state) exist, but:

- **Probe failure**: If 2 of 5 variant cards error out, what happens to the other 3? Do they continue? Is the overall probe considered failed?
- **Scaffold agent failure**: If the Verifier agent fails but Fixtures succeeds, can scaffolding continue? Is there a partial-success state?
- **Validation gate partial failure**: If Oracle Sweep passes but Nop Sweep fails, the spec shows "✗ 1 gate failed" but no CTA. What does the user do? "Fix" isn't specified.
- **Network timeout during sweep**: A sweep can take 300s. What happens at timeout? Does the workspace plate show a timeout indicator?
- **API key invalid**: If the target model's API key is invalid, where does the error surface? In the Agent chat? As a toast? On the Project tab?

### D.6 Cancelling an In-Progress Operation

**Status: NOT SPECIFIED**

There is no cancel/abort mechanism defined anywhere in the spec:

- **Cancel a running probe**: 5 variants with 15 trials each could take minutes. How does the user cancel?
- **Cancel a scaffold**: Multiple agents are generating artifacts. Can the user stop mid-generation?
- **Cancel a sweep**: Target sweep is running. Stop button?
- **Cancel during "Decide all"**: The auto-advance through questions has no abort.
- **Cancel onboarding**: Can the user exit onboarding to the empty state?

**Recommendation**: Add a cancel pattern:
```
Cancel behavior:
- Active operations show a "Cancel" button in the workspace plate header (next to close)
- Cancel button: outlined, text-red-500, h-28px, "Cancel [Stage]"
- Cancelling a probe: marks remaining variants as "Cancelled" (gray), shows partial results
- Cancelling a scaffold: saves completed artifacts, marks incomplete ones as draft
- Cancelling a sweep: discards partial results, returns to previous state
- Agent chat shows: "⊘ [Stage] cancelled by user"
```

---

## E. Missing Component Specifications

### E.1 Markdown Rendering in Chat Messages

**Status: NOT SPECIFIED**

Agent messages use TT Neoris 15px but no markdown rendering styles are defined:

| Markdown Element | Expected Styling | Currently Defined? |
|:-----------------|:-----------------|:-------------------|
| `# Heading 1` | Size, weight, margin | No |
| `## Heading 2` | Size, weight, margin | No |
| `**Bold**` | Font weight | No |
| `*Italic*` | Font style | No |
| `- List item` | Bullet style, indent, spacing | No (only in approval card `.approval-body ul`) |
| `1. Numbered list` | Number style, indent | No |
| `` `inline code` `` | Font, background, padding, border-radius | No |
| ```` ```code block``` ```` | Font, background, padding, border, syntax highlighting | No |
| `> Blockquote` | Border-left, padding, color | No |
| `[Link](url)` | Color, underline, hover | No |
| `| Table |` | Border, padding, header styling | No |
| `---` (horizontal rule) | Height, color, margin | No |
| `![Image](url)` | Max-width, border-radius, loading state | No |

**Recommendation**: Add a `.msg-markdown` styling block covering all standard markdown elements, using the spec's font stack (TT Neoris for prose, IBM Plex Mono for code).

### E.2 Code Syntax Highlighting Theme

**Status: NOT SPECIFIED**

The Files tab mentions a Monaco/CodeMirror editor and IBM Plex Mono 13px, but:

- No syntax highlighting color theme defined
- No language support list (Python, TOML, Markdown, Bash, Dockerfile are all used in artifacts)
- No specification for theme consistency with the warm parchment background
- Should the theme be custom to match the `#f1f1ee` aesthetic or a standard theme (e.g., GitHub Light)?

**Recommendation**: Define a custom syntax theme using the spec's color palette:
```
keyword:    var(--accent-reasoning) #8A72E5
string:     var(--accent-knowledge) #80A740
number:     var(--accent-calibration) #B16A27
comment:    var(--fg-30)
function:   var(--accent-instructions) #4087F2
type:       var(--accent-multilingual) #3AAFA9
operator:   var(--fg-60)
```

### E.3 File Upload / Attachment Flow

**Status: NOT SPECIFIED**

The attach button (paperclip icon, 16px) is fully styled, but:

- What file types are accepted?
- Maximum file size?
- Upload progress indicator?
- File preview in chat after upload?
- Drag-and-drop onto the chat area?
- Where are files stored? (Only mentioned: "attach button" with no further detail)

### E.4 Search/Filter Functionality

**Status: NOT SPECIFIED**

- No search in chat history
- No search/filter in file tree
- No search in sweep history
- No global search (`Cmd+K` opens chat input, not a search)
- No filter on activity feed items

### E.5 Notification Preferences

**Status: NOT SPECIFIED**

Toast notifications are fully styled, but:

- No user control over which notifications appear
- No sound/vibration specification
- No "Do not disturb" mode
- No notification history/log

### E.6 Session Persistence

**Status: NOT SPECIFIED**

Critical missing specification:

- **What survives a page refresh?** Is the Zustand store persisted to localStorage/sessionStorage?
- **Chat message history**: Loaded from server or cached locally?
- **Active tab**: Preserved across refresh?
- **Workspace plate state**: If a plate was open, is it re-opened on refresh?
- **Onboarding progress**: If the user refreshes during onboarding Step 3, do they restart from Step 1?
- **In-progress operations**: If a probe is running and the user refreshes, what state do they return to?
- **Scroll positions**: The Master Plan notes "tabs are persistent (keep scroll position)" but the persistence mechanism isn't defined.

**Recommendation**: Add a persistence specification:
```
Persisted to localStorage:
- project (project name, model config, hypothesis)
- onboardingStep (resume from last step)
- activeTab (restore last tab)
- domainStates (resume pipeline progress)

Loaded from server on mount:
- messages (chat history)
- probeResults, scaffoldArtifacts, sweepResults
- file artifacts

Not persisted (reset on refresh):
- activeDomain (workspace plate closed)
- toasts (cleared)
- scroll positions (reset to top)
```

---

## F. Cofounder Pattern Deviations

### F.1 Unjustified Deviations

| Pattern | Cofounder Behavior | Harbor Spec | Assessment |
|:--------|:------------------|:------------|:-----------|
| **Tab indicator style** | Background pill (`bg: var(--foreground-10); border-radius: 4px`) sliding behind active tab text | Bottom-edge pill (`h-3px w-32px rounded-full bg-fg-80`) below active icon | **Deviation acknowledged but not justified.** Cofounder uses a background highlight; Harbor uses a bottom bar indicator. The Harbor approach is more standard for bottom tab bars (similar to iOS/Material), which may be intentional since it's a bottom bar (Cofounder's is a horizontal nav). Should be documented as intentional. |
| **Bottom nav layout** | Horizontal text tabs (`Home`, `Cofounder`, `Company`, `Tasks`, `Library`) at bottom with text labels only, `h-24px` items | Vertical icon+label columns, `h-48px` bar with 20px icons + 11px labels | **Justified**: Harbor's bottom bar is taller and uses icons, which is better for a dedicated mobile-first bottom navigation paradigm. Cofounder's is more of a text nav bar. |
| **Panel resize handle** | Has a `col-resize` drag handle between canvas and panel (8px wide, `cursor: col-resize`) | Not specified | **Missing feature.** Cofounder allows resizing the panel. Harbor's spec has a fixed 460px panel. Consider adding or justifying the omission. |
| **Three-column layout** | Canvas + Center column + Chat panel | Canvas + Right panel only (panel switches content via tabs) | **Justified**: Harbor collapses center column into the right panel tab system. Simpler for an eval-focused tool. |
| **React Flow** | Uses React Flow with transforms, zoom, pan | Does not use React Flow ("Not using ReactFlow transforms. Fixed 600x600 container") | **Justified and documented.** Harbor's canvas is static (no drag/rearrange needed). |
| **Theme toggle** | Has dark/light mode toggle (`☀/🌙`) | "Light Mode Only" | **Deviation justified**: Spec explicitly states "Light Mode Only" in the color system header. Reduces scope. |
| **Top bar style** | Transparent, floating over canvas | `bg-l100`, `shadow-outset-100` (Master) / `border-bottom: 1px solid var(--fg-5)` (Atomic) | **Deviation from Cofounder's transparent top bar.** Cofounder's top bar floats over the canvas; Harbor's has an explicit background. This is fine given Harbor's simpler canvas. |

### F.2 Cofounder Patterns That Should Be Used but Aren't Referenced

| Cofounder Pattern | Description | Harbor Relevance |
|:------------------|:------------|:-----------------|
| **Department CSS variable system** | Each department sets `--department-workspace-accent`, `--department-workspace-accent-soft`, `--department-workspace-glass`, etc. (10+ variables) | **Should adopt.** Harbor defines `--domain-accent` but doesn't implement the full soft/glass/raised/muted surface system. Adding `--domain-accent-soft` (18% opacity variant), `--domain-glass`, `--domain-raised` would enable richer workspace plate styling. |
| **"Not Setup" glow effect** | Departments that haven't been configured get a pulsing outer glow ring | **Should adopt for `untested` domains.** Currently untested nodes are just idle (subtle). A soft glow would draw attention to unconfigured domains. |
| **Browser preview cards** | Miniature browser window with traffic light dots, URL bar, and content preview | **Could adapt** for eval artifact previews in workspace plates (e.g., showing a miniature of the instruction.md or a generated spreadsheet). Lower priority. |
| **Agent configuration accordion** | Collapsible sections for system prompt, model/skills, integrations, danger zone | **Should adopt** for the Project tab. Currently the Project tab uses flat card sections. Accordion pattern would be more space-efficient and matches Cofounder. |
| **Workflow starter cards** | "Start an ops workflow" with suggested action chips | **Already partially adopted** as "Suggested Next" cards on Home tab. Could be enhanced with description text and multiple action buttons per card, matching Cofounder's richer format. |
| **Breadcrumb navigation** | `[org] > [department] > [agent]` in top bar when deep in a context | **Should adopt.** When a workspace plate is open, the top bar could show: `[Project Name] > [Reasoning & Logic] > [Probing]` to provide context. |
| **Section badge counts** | Accordion headers show counts (e.g., "Integrations 13") | **Should adopt** for Files tab section headers (e.g., "Artifacts 6") and Sweeps tab ("Sweep History 3"). |
| **Toast library** | Cofounder uses Sonner for toasts with swipe-to-dismiss support | **Not referenced.** Harbor defines custom toast CSS. Should either use Sonner for consistency or document why a custom implementation. |
| **`foreground-8`, `foreground-15`, `foreground-55`, `foreground-70`, `foreground-90`** | Full opacity scale in Cofounder | **Partially adopted.** Harbor defines `fg-5/10/20/30/40/50/60/80/100` but misses `8`, `15`, `55`, `70`, `90`. These are used in Cofounder for fine-grained depth control. Missing intermediate values limit design flexibility. |
| **`background-l200-90`** | 90% opacity variant of bg-l200 for glassmorphism | **Already adopted** in the composer input wrapper (Atomic 0.5.2: `opacity: 0.9`), but as an opacity property rather than a dedicated variable. Consider defining `--bg-l200-90` explicitly. |
| **Keyboard shortcuts in top bar** | Cofounder has `[📋] Open Roadmap`, `[🔍] Search agents`, `[+] Create menu`, `[📥] Inbox` | **Not adopted.** Harbor's top bar only has avatar, project name, model selector, and settings. Consider adding: roadmap shortcut (opens pipeline view), search, and inbox/notifications. |

---

## Summary of Critical Issues

### Must Fix (Blockers)

1. **`--bg-l-negative-50` vs `--bg-l-neg-50`** - Variable name mismatch will cause build failures
2. **`--fg-15` undefined** - Used in hypothesis card separator but never declared
3. **`--shadow-cta` value mismatch** - 3-layer vs 4-layer between Master and Atomic
4. **Status color inconsistency** - `#4CAF50`/`#66BB6A`/`#EF5350` (Master) vs `#16A34A`/`#DC2626` (Atomic)
5. **`mask-image: url('var(--step-icon-url)')` syntax error** - CSS `url()` cannot contain `var()`
6. **No streaming text specification** - Core interaction for chat-based app is undefined
7. **No cancel mechanism** - Users cannot abort long-running operations

### Should Fix (Quality)

8. **Blur-in duration mismatch** (200ms vs 300ms)
9. **Inactive tab color mismatch** (`fg-40` vs `fg-30`)
10. **Bottom bar border color mismatch** (`fg-10` vs `fg-5`)
11. **Connector width mismatch** (32px vs 24px)
12. **Missing markdown rendering styles** for chat messages
13. **Missing code syntax highlighting theme**
14. **Missing session persistence specification**
15. **Missing mobile touch interactions**
16. **Missing file upload flow**

### Nice to Have (Polish)

17. Adopt Cofounder's full domain CSS variable system (`accent-soft`, `glass`, `raised`)
18. Add "not tested" glow effect for untested domain nodes
19. Add breadcrumb navigation in top bar for deep contexts
20. Add intermediate foreground opacity values (`fg-8`, `fg-15`, `fg-55`, `fg-70`, `fg-90`)
21. Define pipeline stage transition animations (fanout grid replacement)
22. Add panel resize handle option
23. Specify multi-domain concurrent operation behavior

---

*End of audit report.*
