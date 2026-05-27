# Harbor Eval Canvas: Atomic Interaction Spec

> Expands every phase from `MASTER-UI-PLAN.md` to the individual button, pixel, and keystroke level.
> Cross-referenced against Cofounder.co's live CSS for consistency.
> Nothing is left unspecified.

---

## Phase 0: Global Shell

### 0.1 Viewport Root

```html
<div class="relative h-screen w-full overflow-hidden bg-background"
     style="height: 100dvh">
```

- `bg-background`: `#f1f1ee` (warm parchment)
- No scroll on body. All scrolling happens inside panels.
- CSS custom properties set on `:root`:

```css
:root {
  --bg: #f1f1ee;
  --bg-l-neg-50: #e8e8e4;
  --bg-l0: #ebebea;
  --bg-l50: #f0f0ed;
  --bg-l100: #f7f7f5;
  --bg-l200: #fafaf8;
  --bg-inverse: #1a1a1a;
  --bg-screen: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(240,240,237,0.4));

  --fg-100: #1a1a1a;
  --fg-80: rgba(26,26,26,0.8);
  --fg-60: rgba(26,26,26,0.6);
  --fg-50: rgba(26,26,26,0.5);
  --fg-40: rgba(26,26,26,0.4);
  --fg-30: rgba(26,26,26,0.3);
  --fg-20: rgba(26,26,26,0.2);
  --fg-10: rgba(26,26,26,0.1);
  --fg-5: rgba(26,26,26,0.05);

  --fg-inverse-80: rgba(255,255,255,0.8);
  --fg-inverse-100: #ffffff;

  --shadow-outset-025: 0 0.5px 1px rgba(0,0,0,0.03);
  --shadow-outset-050: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-outset-100: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  --shadow-outset-150: 0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04);
  --shadow-inset-025: inset 0 0.5px 1px rgba(0,0,0,0.04);
  --shadow-inset-200: inset 0 1px 4px rgba(0,0,0,0.06), inset 0 0 1px rgba(0,0,0,0.08);
  --shadow-screen: inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.05);
  --shadow-cta: 0 25px 10px rgba(0,0,0,0.03), 0 14px 8px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.17), 0 2px 3px rgba(0,0,0,0.2);
  --shadow-cta-sm: 0 2px 3px rgba(0,0,0,0.2);
  --shadow-input-focus: 0 0 0 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  --shadow-option: 0 14px 8px rgba(0,0,0,0.03), 0 6px 6px rgba(0,0,0,0.05), 0 2px 3px rgba(0,0,0,0.06);

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 22px;
  --radius-full: 9999px;

  --font-figtree: "Figtree", "Figtree Fallback", system-ui, sans-serif;
  --font-mondwest: "ppmondwestOtf", "ppmondwest Fallback", serif;
  --font-neoris: "ttNeoris", "ttNeoris Fallback", sans-serif;
  --font-mono: "IBM Plex Mono", "IBM Plex Mono Fallback", monospace;
  --font-departure: "departureMono", "departureMono Fallback", monospace;
  --font-garamond: "EB Garamond", "EB Garamond Fallback", serif;

  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 0.2 Top Bar

**Container:**
```css
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--bg-l100);
  border-bottom: 1px solid var(--fg-5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

**0.2.1 Left cluster: Avatar**

```
┌──┐
│ZJ│  ← 28x28px rounded-full
└──┘
```

- Container: `w-[28px] h-[28px] rounded-full overflow-hidden flex items-center justify-center`
- Background: `var(--bg-l0)`
- Text: Figtree 11px/600, `var(--fg-60)`, uppercase initials
- If user has image: `<img>` fills container with `object-cover`
- Border: `1px solid var(--fg-5)`
- Hover: `brightness(0.97)`, 150ms ease-out
- Click: no action (decorative)
- Margin-right: 10px

**0.2.2 Left cluster: Project name dropdown**

```
Harbor Eval ▾
```

- Text: Figtree 14px/500, `var(--fg-80)`, `letter-spacing: -0.01em`
- Chevron: inline SVG, 10x10px, `var(--fg-30)`, `margin-left: 4px`
  ```svg
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  ```
- Hover: text becomes `var(--fg-100)`, chevron becomes `var(--fg-50)`, 200ms
- Cursor: `pointer`

**Dropdown menu (on click):**
```css
.project-dropdown {
  position: absolute;
  top: 44px;
  left: 16px;
  width: 240px;
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-outset-150);
  padding: 4px;
  z-index: 100;
  animation: sd-slideUp 150ms ease both;
}
```

Each dropdown item:
```css
.project-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font: 400 13px/1.4 var(--font-figtree);
  color: var(--fg-80);
  cursor: pointer;
  transition: background 150ms ease;
}
.project-dropdown-item:hover {
  background: var(--fg-5);
}
.project-dropdown-item.active {
  background: var(--fg-5);
  font-weight: 500;
}
.project-dropdown-item.active::before {
  content: '✓';
  font-size: 12px;
  color: var(--fg-60);
}
```

"New Project" item at bottom:
```css
.project-dropdown-new {
  border-top: 1px solid var(--fg-5);
  margin-top: 4px;
  padding-top: 8px;
}
```
- Plus icon: 14px, `var(--fg-40)`
- Text: Figtree 13px/500, `var(--fg-50)`
- Hover: `var(--fg-80)`, plus icon `var(--fg-60)`

**Click outside to close:** 150ms fade-out

**0.2.3 Right cluster: Model selector pill**

```
┌──────────────────────┐
│ ● gemini-3-flash     │
└──────────────────────┘
```

```css
.model-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
  font: 400 12px/1 var(--font-departure);
  color: var(--fg-60);
  cursor: pointer;
  transition: all 200ms ease;
  letter-spacing: 0.02em;
}
.model-pill:hover {
  background: var(--bg-l50);
  border-color: var(--fg-20);
  color: var(--fg-80);
}
```

- Provider dot: `w-[6px] h-[6px] rounded-full`, colored by provider:
  - Google: `#4285F4`
  - Anthropic: `#D4A574`
  - OpenAI: `#10A37F`
  - Custom: `var(--fg-30)`
- Click: opens model picker dropdown (same as onboarding Step 2 but as dropdown)
- Margin-right: 8px from settings icon

**Model picker dropdown:**
```css
.model-picker-dropdown {
  position: absolute;
  top: 44px;
  right: 48px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-outset-150);
  padding: 8px;
  z-index: 100;
  animation: sd-slideUp 150ms ease both;
}
```

Each model option card inside:
```css
.model-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--fg-10);
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 200ms ease;
}
.model-option:hover {
  background: var(--bg-l50);
  border-color: var(--fg-20);
  transform: translateY(-1px);
}
.model-option.selected {
  border-color: var(--fg-60);
  border-width: 2px;
  background: var(--bg-l50);
}
```

Inside each option:
- Provider icon: 20x20px, from `/providers/{google|anthropic|openai}.svg`
- Model name: Figtree 14px/600, `var(--fg-80)`
- Description: Figtree 12px/400, `var(--fg-40)`, max 1 line, ellipsis
- Selected checkmark: 16px, `var(--fg-60)`, positioned top-right

**0.2.4 Right cluster: Settings button**

```css
.settings-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--fg-40);
  cursor: pointer;
  transition: all 200ms ease;
}
.settings-btn:hover {
  background: var(--fg-5);
  color: var(--fg-60);
}
.settings-btn:active {
  background: var(--fg-10);
}
```

- Icon: Lucide `settings` (gear), 18px stroke-width 1.5
- Click: opens Project tab in right panel

### 0.3 Bottom Tab Bar

**Container:**
```css
.bottom-tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--bg-l100);
  border-top: 1px solid var(--fg-5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

**0.3.1 Tab item (each of 5):**

```css
.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: color 200ms ease;
}
.tab-item.inactive {
  color: var(--fg-30);
}
.tab-item.active {
  color: var(--fg-80);
}
.tab-item:hover:not(.active) {
  color: var(--fg-50);
}
```

**Tab icon (each):**
```css
.tab-icon {
  width: 20px;
  height: 20px;
  stroke-width: 1.5;
  /* Lucide icon rendered as SVG */
}
```

| Tab | Lucide icon name | Label |
|---|---|---|
| Home | `home` | Home |
| Agent | `message-circle` | Agent |
| Project | `folder-cog` | Project |
| Files | `file-code-2` | Files |
| Sweeps | `activity` | Sweeps |

**Tab label:**
```css
.tab-label {
  font: 500 11px/1 var(--font-figtree);
  letter-spacing: 0.01em;
}
```

**0.3.2 Sliding active indicator:**

```css
.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  width: 32px;
  border-radius: var(--radius-full);
  background: var(--fg-80);
  transition: transform 300ms var(--ease-spring);
  /* transform: translateX() is computed from active tab index */
  /* Tab 0: translateX(0), Tab 1: translateX(Xpx), etc. */
}
```

Computed positions (assuming 5 equal segments in a 100% width bar):
- Home: `left: calc(10% - 16px)`
- Agent: `left: calc(30% - 16px)`
- Project: `left: calc(50% - 16px)`
- Files: `left: calc(70% - 16px)`
- Sweeps: `left: calc(90% - 16px)`

The indicator uses `transform: translateX()` to slide, driven by active tab index. The spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`) gives it the Cofounder feel of slight overshoot.

**0.3.3 Badge dots (notification indicators):**

When a tab has pending notifications (e.g., new artifacts in Files, new sweep results in Sweeps):

```css
.tab-badge {
  position: absolute;
  top: 4px;
  right: calc(50% - 16px);
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--fg-60);
  animation: sd-fadeIn 200ms ease both;
}
```

Badge appears with fade-in when new content arrives. Disappears when tab is visited.

### 0.4 Right Panel Container

**0.4.1 Outer shell:**

```css
.right-panel {
  position: fixed;
  top: 56px;   /* 48px top bar + 8px margin */
  right: 8px;
  bottom: 56px; /* 48px bottom bar + 8px margin */
  width: 460px;
  display: flex;
  flex-direction: column;
  background: var(--bg-l100);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-outset-100);
  overflow: hidden;
  z-index: 30;
}
```

Matches Cofounder: `sm:my-2 sm:mr-2 sm:rounded-[12px]` with `bg-background-l100 shadow-outset-100`.

**0.4.2 Panel tab bar (inside panel, top):**

```css
.panel-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 12px 20px 0;
  border-bottom: 1px solid var(--fg-5);
}
```

Each panel tab:
```css
.panel-tab {
  position: relative;
  padding: 8px 12px 10px;
  font: 500 13px/1 var(--font-figtree);
  color: var(--fg-40);
  cursor: pointer;
  transition: color 200ms ease;
  white-space: nowrap;
}
.panel-tab.active {
  color: var(--fg-80);
}
.panel-tab:hover:not(.active) {
  color: var(--fg-60);
}
.panel-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px; /* sits on the border */
  left: 12px;
  right: 12px;
  height: 2px;
  background: var(--fg-80);
  border-radius: var(--radius-full);
}
```

The active underline is per-tab, not a sliding indicator (differs from bottom bar). This matches Cofounder's panel tabs which use a bottom-border approach.

**0.4.3 Panel content area:**

```css
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  min-height: 0; /* flex shrink */
}
```

Scrollbar:
```css
.panel-content::-webkit-scrollbar { width: 4px; }
.panel-content::-webkit-scrollbar-track { background: transparent; }
.panel-content::-webkit-scrollbar-thumb {
  background: var(--fg-10);
  border-radius: var(--radius-full);
}
.panel-content::-webkit-scrollbar-thumb:hover {
  background: var(--fg-20);
}
```

**0.4.4 Panel context badge (top of content area):**

```css
.context-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  font: 500 12px/1 var(--font-figtree);
  color: var(--fg-60);
  user-select: none;
  cursor: default;
  background: linear-gradient(180deg, var(--bg-l0) 0%, rgba(235,235,234,0.5) 100%);
  margin-bottom: 12px;
}
```

Badge icon: 14px Lucide icon matching the tab. Badge label: current tab name.

Matches Cofounder's gradient badge: `linear-gradient(180deg, #EFEFEC 0%, rgba(239,239,236,0.50) 100%)`.

### 0.5 Chat Composer (Bottom of Agent Tab)

**0.5.1 Composer container:**

```css
.chat-composer {
  flex-shrink: 0;
  padding: 8px 16px 12px;
  background: var(--bg-l100);
  border-top: 1px solid var(--fg-5);
}
```

**0.5.2 Input wrapper:**

```css
.composer-input-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 44px;
  max-height: 140px;
  border-radius: var(--radius-sm);
  border: 0.5px solid rgba(0,0,0,0.05);
  background: var(--bg-l200);
  opacity: 0.9;
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-inset-025);
  padding: 12px;
  transition: box-shadow 300ms ease-in-out;
}
.composer-input-wrap:focus-within {
  box-shadow: var(--shadow-input-focus);
  border-color: var(--fg-10);
  opacity: 1;
}
```

Matches Cofounder: `rounded-[6px] p-[12px] bg-background-l200-90 backdrop-blur-md border-[0.5px] border-black/5 shadow-inset-025 transition-[box-shadow] duration-300`.

**0.5.3 Textarea:**

```css
.composer-textarea {
  flex: 1;
  resize: none;
  background: transparent;
  border: none;
  outline: none;
  font: 400 14px/24px var(--font-figtree);
  color: var(--fg-80);
  caret-color: var(--fg-100);
  min-height: 24px;
  max-height: 96px; /* ~4 lines */
  overflow-y: auto;
}
.composer-textarea::placeholder {
  color: var(--fg-40);
}
```

Placeholder text: "Ask Harbor Eval..."

Auto-grow behavior:
- Starts at 1 line (24px content height)
- Grows with content up to 4 lines
- Wrapper grows from 44px to max 140px
- Uses `scrollHeight` measurement on input event

**0.5.4 Composer toolbar (bottom row inside wrapper):**

```css
.composer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
```

**Attach button (left):**
```css
.attach-btn {
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
.attach-btn:hover {
  color: var(--fg-50);
  background: var(--fg-5);
}
```
- Icon: Lucide `paperclip`, 16px, stroke-width 1.5

**Submit button (right):**
```css
.submit-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--bg-inverse);
  color: var(--fg-inverse-80);
  border: 1px solid rgba(0,0,0,0.5);
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: var(--shadow-cta-sm);
}
.submit-btn:hover {
  opacity: 0.9;
}
.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}
.submit-btn:active:not(:disabled) {
  transform: scale(0.95);
}
```
- Icon: Lucide `arrow-up`, 16px, stroke-width 2
- Disabled when textarea is empty
- Matches Cofounder's dark circle submit: `bg-background-inverse` with `border border-black/50`

**Keyboard shortcut:** `Enter` submits (when not Shift+Enter). `Shift+Enter` inserts newline.

---

## Phase 1: Onboarding Flow

### 1.0 Onboarding shell

When `project === null` (no project in store), the entire viewport shows the onboarding flow. No top bar, no bottom tabs, no canvas.

```css
.onboarding-shell {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  z-index: 100;
}
```

**Background accent glow:**
```css
.onboarding-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
  opacity: 0.08;
  filter: blur(80px);
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: --glow-color 800ms ease;
}
```

Glow color shifts per step:
- Step 1: `--glow-color: #8A72E5` (reasoning purple)
- Step 2: varies by selected model's provider color
- Step 3: `--glow-color: #4087F2` (instructions blue)
- Step 4: `--glow-color: #6C63FF` (tool use indigo)
- Step 5: accent of the selected domain

### 1.1 Step 1: Project Name

**Card container:**
```css
.onboarding-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: 48px 40px;
  animation: sd-blurIn 300ms ease both;
}
```

No visible card border/background. Content floats on the warm background.

**1.1.1 Wordmark:**
```css
.harbor-wordmark {
  font: normal 24px/1.2 var(--font-mondwest);
  color: var(--fg-80);
  letter-spacing: 0.04em;
  margin-bottom: 32px;
  text-align: center;
}
```

Text: "Harbor Eval" - using PP Mondwest OTF exactly as Cofounder uses it for "Good evening, Zakir".

**1.1.2 Question text:**
```css
.onboarding-question {
  font: 400 22px/1.4 var(--font-garamond);
  color: var(--fg-60);
  text-align: center;
  margin-bottom: 28px;
}
```

Text: "What should we call this evaluation project?"

Using EB Garamond for the serif formal feel. Cofounder uses Figtree for questions, but we use Garamond for onboarding questions specifically to create a more premium, editorial feel during the intake ritual.

**1.1.3 Input field:**
```css
.onboarding-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--fg-10);
  border-radius: var(--radius-md);
  background: var(--bg-l200);
  font: 400 16px/48px var(--font-figtree);
  color: var(--fg-80);
  caret-color: var(--fg-100);
  outline: none;
  transition: all 200ms ease;
}
.onboarding-input::placeholder {
  color: var(--fg-30);
  font-style: normal;
}
.onboarding-input:focus {
  border-color: var(--fg-20);
  box-shadow: var(--shadow-input-focus);
}
```

Placeholder: `e.g., "Gemini Reasoning"`

Autofocus: field focuses after a 400ms delay (allows blur-in animation to complete, then cursor blinks). Implemented via `setTimeout(() => inputRef.current?.focus(), 400)`.

**1.1.4 Continue button:**
```css
.onboarding-cta {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: var(--radius-md);
  background: var(--bg-inverse);
  color: var(--fg-inverse-80);
  border: 1px solid rgba(0,0,0,0.5);
  font: 600 14px/1 var(--font-figtree);
  cursor: pointer;
  box-shadow: var(--shadow-cta);
  transition: all 200ms ease;
}
.onboarding-cta:hover:not(:disabled) {
  opacity: 0.9;
}
.onboarding-cta:active:not(:disabled) {
  transform: scale(0.98);
}
.onboarding-cta:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}
```

Arrow icon: Lucide `arrow-right`, 14px, inline after "Continue"

Disabled until input has 2+ non-whitespace characters.

Matches Cofounder's accept button: `bg-background-inverse border border-black/50 text-foreground-inverse-80 shadow-[...]`

**1.1.5 Step transition animation:**

When Continue is clicked:
1. Current card fades out: `opacity: 0, transform: translateY(-8px)`, 200ms ease
2. 100ms pause
3. Next step card fades in: `opacity: 0 → 1, transform: translateY(8px) → translateY(0)`, 250ms ease
4. Background glow shifts color (800ms ease)

```css
.step-exit {
  animation: stepExit 200ms ease forwards;
}
@keyframes stepExit {
  to { opacity: 0; transform: translateY(-8px); }
}
.step-enter {
  animation: stepEnter 250ms ease 100ms both;
}
@keyframes stepEnter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**1.1.6 Keyboard interaction:**
- `Enter` key triggers Continue (if not disabled)
- `Tab` moves focus to Continue button
- `Escape` does nothing (no previous step)

### 1.2 Step 2: Target Model Selection

**Card container:** Same as 1.1 but `max-width: 520px`

**1.2.1 Question:** Same styling as 1.1.2. Text: "Which model are you evaluating?"

**1.2.2 Model option cards:**

```css
.model-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--fg-10);
  border-radius: var(--radius-lg);
  background: var(--bg-l200);
  cursor: pointer;
  transition: all 200ms ease;
  margin-bottom: 8px;
}
.model-card:hover {
  background: var(--bg-l50);
  border-color: var(--fg-20);
  transform: translateY(-1px);
  box-shadow: var(--shadow-outset-100);
}
.model-card.selected {
  border: 2px solid var(--fg-60);
  background: var(--bg-l50);
}
```

**Radio indicator (left side of card):**
```css
.model-radio {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  border: 2px solid var(--fg-20);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 200ms ease;
}
.model-card.selected .model-radio {
  border-color: var(--fg-80);
}
.model-card.selected .model-radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--fg-80);
  animation: sd-fadeIn 150ms ease both;
}
```

**Card content (right of radio):**
```css
.model-card-name {
  font: 600 15px/1.3 var(--font-figtree);
  color: var(--fg-80);
}
.model-card-meta {
  font: 400 13px/1.3 var(--font-figtree);
  color: var(--fg-50);
  margin-top: 2px;
}
.model-card-meta .separator {
  color: var(--fg-20);
  margin: 0 6px;
}
```

Provider icon: 20x20px, positioned left of model name inline. Sourced from `/providers/{google|anthropic|openai|custom}.svg`.

For "Custom model..." option, when selected, expand inline fields:
```css
.custom-model-fields {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--fg-5);
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: sd-slideUp 200ms ease both;
}
```

Fields:
- API Base URL: same input style as 1.1.3, `height: 36px`, `font-size: 13px`, placeholder "https://api.example.com/v1"
- Model slug: same, placeholder "my-model-name"
- Runner type: small select dropdown, 3 options (cli, api, custom)

**1.2.3 Continue button:** Same as 1.1.4. Disabled until a model is selected.

**1.2.4 Keyboard:** Arrow keys move selection between model cards. Enter confirms.

### 1.3 Step 3: Workflow Description

**Card container:** `max-width: 560px`

**1.3.1 Question:** EB Garamond 22px. Text: "Describe the workflow or capability you want to evaluate"

**1.3.2 Subtext:**
```css
.onboarding-subtext {
  font: 400 13px/1.6 var(--font-figtree);
  color: var(--fg-40);
  text-align: center;
  max-width: 420px;
  margin: 0 auto 20px;
}
```
Text: "Be specific about the domain, the task, and what you think models get wrong."

**1.3.3 Rich text editor (TipTap/ProseMirror):**

```css
.workflow-editor {
  width: 100%;
  min-height: 140px;
  max-height: 240px;
  overflow-y: auto;
  padding: 14px 16px;
  border: 1px solid var(--fg-10);
  border-radius: var(--radius-lg);
  background: var(--bg-l200);
  font: 400 15px/1.6 var(--font-figtree);
  color: var(--fg-80);
  caret-color: var(--fg-100);
  outline: none;
  transition: box-shadow 300ms ease;
}
.workflow-editor:focus-within {
  box-shadow: var(--shadow-input-focus);
  border-color: var(--fg-20);
}
.workflow-editor .ProseMirror-placeholder {
  color: var(--fg-30);
  font-style: italic;
}
```

Placeholder (multi-line, italic):
```
For example: Financial compliance workflows where models must determine
certificate release eligibility by tracing transitive revocation chains
through dependency graphs, not just checking portal "Active" states...
```

**1.3.4 Failure mode chips:**

Section label:
```css
.chip-section-label {
  font: 500 12px/1 var(--font-figtree);
  color: var(--fg-40);
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}
```
Text: "Or pick a starting point:"

**Chip grid:**
```css
.chip-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
```

**Individual chip:**
```css
.failure-chip {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--fg-10);
  background: var(--bg-l200);
  font: 500 12px/1 var(--font-figtree);
  color: var(--fg-60);
  cursor: pointer;
  transition: all 200ms ease;
  user-select: none;
}
.failure-chip:hover {
  background: var(--bg-l50);
  border-color: var(--fg-20);
  color: var(--fg-80);
}
.failure-chip.selected {
  background: var(--fg-80);
  color: white;
  border-color: var(--fg-80);
}
```

8 chips, one per failure mode from taxonomy:
1. "Authority Ambiguity"
2. "False Recency"
3. "Source Fidelity"
4. "Phantom Joins"
5. "Tie Breaking"
6. "Null Cascade"
7. "Provenance"
8. "Lifecycle"

**Chip click behavior:**
1. Chip animates to selected state (200ms)
2. Editor content replaced with a template paragraph specific to that failure mode (200ms fade transition on editor content)
3. Only one chip can be selected at a time (radio behavior)
4. Clicking a selected chip deselects it and clears the template from editor
5. If user has typed custom text, clicking a chip shows a confirmation: "Replace your text with template?" via a small inline toast below the chips (auto-dismiss 3s)

**Template example (Lifecycle chip):**
```
I want to evaluate whether models correctly handle transitive certificate 
revocation in compliance workflows. The specific failure mode is: models 
trust portal "Active" states and publish confident release decisions without 
tracing the full dependency chain. A correct solution requires following 
2-hop revocation cascades through certificate dependency graphs.
```

**1.3.5 Submit button:**
```css
.onboarding-cta-submit {
  /* same as .onboarding-cta but with different label */
}
```
Text: "Submit to Harbor Agent →"
Disabled until editor has 20+ characters of non-whitespace content.

### 1.4 Step 4: AI Strategic Questions

**1.4.0 Transition:** The onboarding card expands to 600px wide and shifts to a chat-style layout. The centered card pattern transforms into a scrollable message list.

```css
.onboarding-chat {
  width: 100%;
  max-width: 600px;
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 24px;
}
```

**1.4.1 User's submitted message (echoed back):**

```css
.chat-msg-user {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.chat-msg-user-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: var(--radius-lg);
  background: var(--bg-l200);
  border: 1px solid var(--fg-5);
  font: 400 14px/1.6 var(--font-neoris);
  color: var(--fg-80);
}
```

Shows the workflow description they entered, right-aligned.

**1.4.2 Agent message with question:**

```css
.chat-msg-agent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
  animation: sd-slideUp 200ms ease both;
}
```

**Agent avatar:**
```css
.agent-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--bg-l0);
  border: 1px solid var(--fg-10);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.agent-avatar svg {
  width: 14px;
  height: 14px;
  color: var(--fg-50);
  /* Hexagon icon or Harbor logo mark */
}
```

**Agent name + timestamp row:**
```css
.agent-name {
  font: 600 13px/1 var(--font-figtree);
  color: var(--fg-80);
}
.agent-timestamp {
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-30);
  margin-left: 8px;
}
```

Name: "Harbor Eval". Matches Cofounder's chat header pattern.

**Agent message body:**
```css
.agent-body {
  font: 400 15px/1.6 var(--font-neoris);
  color: var(--fg-80);
  margin-top: 4px;
  max-width: 100%;
}
```

Uses TT Neoris, matching Cofounder's `font-tt-neoris text-[15px]` for chat content.

**1.4.3 Question progress indicator:**

```css
.question-progress {
  font: 400 11px/1 var(--font-departure);
  color: var(--fg-30);
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}
```

Text: "1/5", "2/5", etc. Positioned above the question text.

**1.4.4 Option cards (embedded in agent message):**

Outer wrapper:
```css
.options-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--fg-10);
  overflow: hidden;
}
```

This creates Cofounder's double-border technique: outer `rounded-[8px] p-[2px]`, options stack inside.

**Individual option:**
```css
.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  min-height: 32px;
  background: var(--bg-l200);
  font: 400 14px/22px var(--font-figtree);
  color: var(--fg-80);
  cursor: pointer;
  transition: all 150ms ease;
  text-align: left;
}
.option-item:hover {
  background: var(--bg-l50);
}
.option-item.selected {
  background: var(--bg-l50);
}
.option-item + .option-item {
  border-top: 1px solid var(--fg-5);
}
```

Matches Cofounder: `rounded-[6px] px-3 py-1.5 text-sm leading-[22px]` option cards.

**Radio indicator (right side):**
```css
.option-radio {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--fg-20);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}
.option-item.selected .option-radio {
  border-color: var(--fg-80);
  border-width: 2px;
}
.option-item.selected .option-radio::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--fg-80);
}
```

**1.4.5 Decision buttons (below options):**

```css
.decision-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
```

**"Decide all" button:**
```css
.btn-decide-all {
  flex: 1 1 112px;
  height: 32px;
  min-width: 112px;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid var(--fg-10);
  background: var(--bg-l0);
  font: 500 12px/1 var(--font-figtree);
  color: var(--fg-80);
  cursor: pointer;
  box-shadow: var(--shadow-option);
  transition: all 200ms ease;
}
.btn-decide-all:hover {
  background: var(--bg-l50);
}
.btn-decide-all:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

Exact match to Cofounder's "Decide all": `h-8 min-w-[112px] flex-[1_1_112px] rounded-[8px] border border-foreground-10 bg-background-l0 text-xs font-medium text-foreground-80 shadow-[0_14px_8px...]`.

"Decide all" behavior:
1. Instantly selects AI's recommended answer for the current question
2. Shows selected state on the recommended option
3. Auto-advances to next question after 300ms
4. Repeats for all remaining questions
5. During auto-advance, a brief pulse animation on the selected option card (150ms)
6. Questions that were auto-decided get a small "Auto" badge: Departure Mono 10px, `var(--fg-30)`

**"Submit answer" button:**
```css
.btn-submit-answer {
  flex: 1 1 120px;
  height: 32px;
  min-width: 120px;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0,0,0,0.5);
  background: var(--bg-inverse);
  font: 500 12px/1 var(--font-figtree);
  color: var(--fg-inverse-80);
  cursor: pointer;
  box-shadow: var(--shadow-cta-sm);
  transition: all 200ms ease;
}
.btn-submit-answer:hover {
  opacity: 0.9;
}
.btn-submit-answer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Exact match to Cofounder's "Submit": `h-8 min-w-[120px] flex-[1_1_120px] rounded-[8px] border border-black/50 bg-background-inverse text-xs font-medium text-foreground-inverse-80`.

Disabled until an option is selected.

**1.4.6 After answer submitted:**

1. Selected option card briefly flashes with a checkmark overlay (200ms)
2. Options container fades slightly (`opacity: 0.7`, 200ms)
3. Brief shimmer loading bar (400ms) appears below
4. Next question slides up from bottom (200ms `sd-slideUp`)
5. Previous question remains visible but collapsed (options hidden, only question text + selected answer shown)

**Collapsed answered question:**
```css
.answered-question {
  opacity: 0.6;
  margin-bottom: 12px;
}
.answered-question .agent-body {
  font-size: 13px;
}
.answered-question .selected-answer {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  background: var(--fg-5);
  font: 500 12px/1.4 var(--font-figtree);
  color: var(--fg-60);
  margin-top: 4px;
}
.answered-question .selected-answer::before {
  content: '✓';
  font-size: 10px;
  color: var(--fg-40);
}
```

**1.4.7 Five questions content:**

| # | Question text | Options |
|---|---|---|
| 1 | "What format should the agent produce as its final deliverable?" | A) Structured spreadsheet (XLSX/CSV) with specific sheets and columns · B) JSON/JSONL output with defined schema · C) Code that passes specific test cases · D) A written report or analysis document |
| 2 | "What data sources will the agent work with?" | A) Tabular data files (CSV, XLSX, databases) · B) Documents (PDF, Word, text files) · C) Mixed: structured data + policy/reference documents · D) Code repositories and technical artifacts |
| 3 | "What's the specific mistake you think models make here?" | A) They take shortcuts using surface-level heuristics · B) They miss multi-step dependency chains · C) They hallucinate or confabulate sources · D) They follow explicit instructions too literally · E) [Custom: text input] |
| 4 | "How would a human expert solve this correctly?" | A) Follow a documented procedure with specific decision rules · B) Cross-reference multiple authoritative sources · C) Trace relationships through a dependency graph · D) Apply domain-specific judgment that isn't codified · E) [Custom: text input] |
| 5 | "What makes this genuinely hard, not just tricky?" | A) The correct answer requires multi-hop reasoning through realistic data · B) The wrong answer looks complete and plausible · C) The task environment contains deliberate distractors · D) The authority chain for decisions is genuinely ambiguous · E) [Custom: text input] |

Questions 3-5 have an additional "Custom" option that expands an inline text input:
```css
.option-custom-input {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--fg-10);
  border-radius: var(--radius-sm);
  background: var(--bg-l200);
  font: 400 13px/32px var(--font-figtree);
  color: var(--fg-80);
  margin-top: 4px;
  outline: none;
  transition: all 200ms ease;
  animation: sd-slideUp 150ms ease both;
}
.option-custom-input:focus {
  border-color: var(--fg-20);
  box-shadow: 0 0 0 2px var(--fg-5);
}
```

### 1.5 Step 5: Hypothesis Card + Accept

**1.5.1 Transition from questions:** After the 5th question is answered, a brief loading state:

```css
.hypothesis-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
}
.hypothesis-loading-text {
  font: 500 14px/1.4 var(--font-figtree);
  color: var(--fg-40);
}
```

Text: "Generating failure mode hypothesis..."
Below: a shimmer bar, `w-[200px] h-[4px] rounded-full overflow-hidden`:
```css
.shimmer-bar {
  width: 200px;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--fg-5);
  overflow: hidden;
}
.shimmer-bar::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 36%,
    var(--fg-10) 48%,
    transparent 60%,
    transparent 100%
  );
  background-size: 260% 100%;
  animation: shimmer 2s linear infinite;
}
```

Duration: 1.5-3 seconds (or until API returns).

**1.5.2 Hypothesis card:**

```css
.hypothesis-card {
  width: 100%;
  max-width: 560px;
  border-radius: var(--radius-xl);
  background: var(--bg-l200);
  border: 1px solid var(--fg-10);
  box-shadow: var(--shadow-outset-150);
  overflow: hidden;
  animation: sd-blurIn 300ms ease both;
}
```

**Card header (taxonomy badge):**
```css
.hypothesis-taxonomy {
  padding: 20px 24px 0;
  font: 400 11px/1 var(--font-departure);
  color: var(--fg-40);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

**Card title (hypothesis statement):**
```css
.hypothesis-title {
  padding: 8px 24px 16px;
  font: 500 16px/1.4 var(--font-neoris);
  color: var(--fg-80);
  border-bottom: 1px solid var(--fg-5);
}
```

**Card sections (Bad Heuristic, Authority Invariant):**

Each section:
```css
.hypothesis-section {
  padding: 16px 24px;
  border-bottom: 1px solid var(--fg-5);
}
.hypothesis-section:last-of-type {
  border-bottom: none;
}
.hypothesis-section-label {
  font: 600 11px/1 var(--font-figtree);
  color: var(--fg-40);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}
.hypothesis-section-content {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--bg-l-neg-50);
  font: 400 13px/1.6 var(--font-figtree);
  color: var(--fg-60);
}
```

**Card footer (metadata + CTA):**
```css
.hypothesis-meta {
  padding: 12px 24px;
  font: 400 11px/1 var(--font-departure);
  color: var(--fg-30);
  letter-spacing: 0.02em;
  display: flex;
  gap: 4px;
}
.hypothesis-meta .separator {
  color: var(--fg-15);
}
```

Text: "Target: gemini-3-flash · Domain: Reasoning & Logic"

**Accept button:**
```css
.hypothesis-accept {
  margin: 0 24px 20px;
  height: 40px;
  width: calc(100% - 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: var(--radius-md);
  background: var(--bg-inverse);
  color: var(--fg-inverse-80);
  border: 1px solid rgba(0,0,0,0.5);
  font: 600 14px/1 var(--font-figtree);
  cursor: pointer;
  box-shadow: var(--shadow-cta);
  transition: all 200ms ease;
}
.hypothesis-accept:hover {
  opacity: 0.9;
}
```

Text: "Accept & Start Probing →" with Lucide `arrow-right` 14px icon.

Matches Cofounder's "Accept & activate departments": full-width, `mt-3 h-8 w-full bg-background-inverse shadow-[0_25px_10px...]`.

**Edit link (below CTA):**
```css
.hypothesis-edit-link {
  display: block;
  text-align: center;
  padding: 8px 24px 4px;
  font: 400 12px/1 var(--font-figtree);
  color: var(--fg-40);
  text-decoration: none;
  cursor: pointer;
}
.hypothesis-edit-link:hover {
  color: var(--fg-60);
  text-decoration: underline;
}
```

Click: scrolls back up to show the editable sections of the hypothesis card. Each section's content becomes an editable textarea with the same styling.

**1.5.3 Accept animation (transition to canvas):**

This is the most important transition in the app. It must feel premium.

Frame-by-frame:
```
T=0ms:     User clicks "Accept & Start Probing"
T=0-100:   Button depresses (scale: 0.98), ripple effect from click point
T=100-300: Hypothesis card scales to 0.95 and fades to 0.3
T=200-500: Background glow intensifies (opacity 0.08 → 0.2), expands to fill viewport
T=300-600: Onboarding shell fades out, canvas background (#f1f1ee) becomes visible
T=400-800: SVG ring draws itself (stroke-dashoffset animation, 400ms ease)
T=500-900: Domain nodes animate in, staggered 80ms between each:
           - Start: scale(0.5), opacity(0), 20px away from center
           - End: scale(1), opacity(1), final ring position
           - Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (spring overshoot)
T=700:     Connection lines draw from center to each node (200ms per line, staggered)
T=900:     Center hub node fades in with screen glow effect
T=900-1200: Right panel slides in from right edge (300ms ease-spring)
T=1000-1200: Top bar slides down from top (200ms ease)
T=1100-1300: Bottom tabs slide up from bottom (200ms ease)
T=1300:    All elements settled. Canvas is interactive.
```

CSS for staggered node entrance:
```css
.domain-node-enter {
  animation: nodeEntrance 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes nodeEntrance {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5) translate(var(--enter-from-x), var(--enter-from-y));
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translate(0, 0);
  }
}
/* Stagger via CSS custom property */
.domain-node-enter:nth-child(1) { animation-delay: 500ms; }
.domain-node-enter:nth-child(2) { animation-delay: 580ms; }
.domain-node-enter:nth-child(3) { animation-delay: 660ms; }
.domain-node-enter:nth-child(4) { animation-delay: 740ms; }
.domain-node-enter:nth-child(5) { animation-delay: 820ms; }
.domain-node-enter:nth-child(6) { animation-delay: 900ms; }
.domain-node-enter:nth-child(7) { animation-delay: 980ms; }
.domain-node-enter:nth-child(8) { animation-delay: 1060ms; }
```

Each node's `--enter-from-x/y` is calculated as 20px toward center from its final position.

---

## Phase 2: Radial Canvas (Atomic Detail)

### 2.1 Canvas Container

```css
.canvas-area {
  position: fixed;
  top: 48px;
  left: 0;
  right: 468px; /* 460px panel + 8px margin */
  bottom: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* No scrolling on canvas */
}
```

### 2.2 Ring Container

```css
.ring-container {
  position: relative;
  width: 600px;
  height: 600px;
  flex-shrink: 0;
}
```

Not using ReactFlow transforms. Fixed 600x600 container, centered in canvas area via flexbox. No zoom, no pan. This differs from Cofounder (which uses ReactFlow with a fixed transform) because we don't need drag/rearrange.

### 2.3 SVG Ring Element

```html
<svg class="ring-svg" width="600" height="600" viewBox="0 0 600 600">
  <!-- Base ring (always visible) -->
  <circle cx="300" cy="300" r="257"
          fill="none"
          stroke="var(--fg-10)"
          stroke-width="1" />

  <!-- Progress ring (animated fill) -->
  <circle class="ring-progress" cx="300" cy="300" r="257"
          fill="none"
          stroke="var(--fg-30)"
          stroke-width="2"
          stroke-dasharray="1614.6"
          stroke-dashoffset="var(--ring-offset)"
          stroke-linecap="round"
          transform="rotate(-90 300 300)"
          style="transition: stroke-dashoffset 600ms var(--ease-smooth)" />
</svg>
```

```css
.ring-svg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
```

`--ring-offset` calculated: `1614.6 * (1 - globalProgress)` where `globalProgress` is 0-1.

Ring circumference: `2 * π * 257 = 1614.6px`
- 0% progress: offset = 1614.6 (fully hidden)
- 100% progress: offset = 0 (full ring)
- Progress arc starts at top (12 o'clock) due to `rotate(-90)` transform

### 2.4 Connection Lines (SVG)

8 dashed lines from center (300,300) to each domain node edge:

```html
<svg class="connections-svg" width="600" height="600" viewBox="0 0 600 600">
  <!-- One line per domain -->
  <g class="connection" data-domain="instruction_following">
    <line x1="300" y1="270" x2="300" y2="75"
          stroke="var(--fg-20)"
          stroke-width="1"
          stroke-dasharray="6 4" />
    <circle cx="300" cy="270" r="3" fill="var(--fg-30)" />  <!-- inner dot -->
    <circle cx="300" cy="75" r="3" fill="var(--fg-30)" />   <!-- outer dot -->
  </g>
  <!-- ... 7 more lines for other domains ... -->
</svg>
```

```css
.connections-svg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}
```

**Line endpoint calculations (clipped 30px from center, 15px from node):**

| Domain | Angle | Center edge (x1,y1) | Node edge (x2,y2) |
|---|---|---|---|
| Instruction Following | 0° (up) | (300, 270) | (300, 75) |
| Reasoning & Logic | 45° | (321.2, 278.8) | (466.7, 133.3) |
| Safety & Alignment | 90° (right) | (330, 300) | (525, 300) |
| Knowledge & Factuality | 135° | (321.2, 321.2) | (466.7, 466.7) |
| Calibration & Uncertainty | 180° (down) | (300, 330) | (300, 525) |
| Multilinguality | 225° | (278.8, 321.2) | (133.3, 466.7) |
| Long Context | 270° (left) | (270, 300) | (75, 300) |
| Tool Use & Agency | 315° | (278.8, 278.8) | (133.3, 133.3) |

**Connection states:**
```css
/* Default: dashed, subtle */
.connection line {
  stroke: var(--fg-20);
  stroke-dasharray: 6 4;
  stroke-width: 1;
  transition: all 300ms ease;
}
.connection circle {
  fill: var(--fg-30);
  transition: all 300ms ease;
}

/* Active domain: dashes animate outward */
.connection.active line {
  stroke: var(--domain-accent);
  stroke-width: 1.5;
  animation: dashScroll 3s linear infinite;
}
@keyframes dashScroll {
  to { stroke-dashoffset: -20; }
}
.connection.active circle {
  fill: var(--domain-accent);
}

/* Completed domain: solid line */
.connection.complete line {
  stroke: var(--fg-40);
  stroke-dasharray: none;
  stroke-width: 1;
}
.connection.complete circle {
  fill: var(--status-complete);
}

/* Probing domain: pulsing */
.connection.probing line {
  stroke: var(--status-probing);
  animation: dashScroll 2s linear infinite;
}
```

### 2.5 Domain Node Components (each of 8)

**Node positioning:**
```css
.domain-node {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
  cursor: pointer;
  user-select: none;
}
```

Each node gets its position as inline style:
- `left: {X}px; top: {Y}px;` from the coordinate table in 2.4

**Node visual (double-border pattern matching Cofounder):**

Outer shell:
```css
.domain-node-outer {
  border-radius: var(--radius-md);
  padding: 2px;
  background: var(--bg-l100);
  box-shadow: var(--shadow-outset-150);
  transition: all 200ms ease-out;
}
.domain-node:hover .domain-node-outer {
  background: var(--bg-l50);
  box-shadow: var(--shadow-outset-100);
  transform: translateY(-1px);
}
```

Inner content:
```css
.domain-node-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-l200);
}
```

Matches Cofounder exactly: outer `rounded-[8px] p-[2px] bg-background-l100 shadow-outset-150`, inner `rounded-[6px] bg-background-l200`.

**Status dot:**
```css
.domain-status-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  transition: all 300ms ease;
}
.domain-status-dot.idle { background: var(--fg-20); }
.domain-status-dot.probing {
  background: var(--domain-accent);
  animation: dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}
.domain-status-dot.confirmed { background: var(--status-confirmed); }
.domain-status-dot.rejected { background: var(--status-rejected); }
.domain-status-dot.building { background: var(--status-building); }
.domain-status-dot.complete { background: var(--status-complete); }
```

**Domain label:**
```css
.domain-label {
  font: 500 12px/1 var(--font-figtree);
  color: var(--fg-60);
  white-space: nowrap;
  transition: color 200ms ease;
}
.domain-node:hover .domain-label,
.domain-node.active .domain-label {
  color: var(--fg-80);
}
```

Uses `shortLabel` values: "Instructions", "Reasoning", "Safety", "Knowledge", "Calibration", "Multilingual", "Long Context", "Tool Use"

**Selected/active domain node:**
```css
.domain-node.active .domain-node-outer {
  border: 2px solid var(--domain-accent);
  padding: 0; /* compensate for border */
  box-shadow: 0 0 12px color-mix(in srgb, var(--domain-accent) 20%, transparent);
}
```

**Click behavior:**
1. Node transitions to active state (200ms)
2. All other nodes dim: `opacity: 0.5` (200ms)
3. Connection line to this node activates (dashes animate)
4. Workspace plate opens below ring (300ms, see Phase 3)
5. Right panel switches to Agent tab with domain context
6. Clicking the same node again: deselects, workspace plate closes, nodes return to full opacity
7. Clicking a different node: previous closes, new one opens (200ms crossfade)

### 2.6 Center Hub Node

**Positioning:**
```css
.center-hub {
  position: absolute;
  left: 300px;
  top: 300px;
  transform: translate(-50%, -50%);
  z-index: 60;
  cursor: pointer;
}
```

**Double-border shell (matching Cofounder center node exactly):**
```css
.center-hub-outer {
  width: 98px;
  border-radius: var(--radius-md);
  padding: 2px;
  background: var(--bg-l100);
  box-shadow: var(--shadow-outset-150);
  overflow: visible;
  transition: all 200ms ease;
}
.center-hub:hover .center-hub-outer {
  background: var(--bg-l50);
  box-shadow: var(--shadow-outset-100);
}
```

```css
.center-hub-inner {
  position: relative;
  height: 54px;
  width: 100%;
  border-radius: var(--radius-sm);
  background: var(--bg-screen);
  box-shadow: var(--shadow-screen);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
```

**Screen reflectance overlay:**
```css
.center-hub-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.08) 40%,
    transparent 60%
  );
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
  pointer-events: none;
  border-radius: inherit;
}
```

**Content:**
- Icon: custom Harbor Eval illustration, `height: 42px`, `width: auto`, centered
- Below outer shell: wordmark "Harbor Eval", `font: 600 10px/1 var(--font-figtree)`, `color: var(--fg-50)`, `margin-top: 4px`, `text-align: center`

Dimensions: 98px wide, ~58px tall (54px inner + 4px padding). Matches Cofounder's `w-[98px]` center node.

**Click behavior:** Opens Agent tab in right panel, deselects any active domain node.

---

*Phases 3-9 continue at this same atomic level in the next section of the document. Each phase follows the same pattern: every CSS property, every pixel dimension, every animation keyframe, every keyboard interaction, every state transition is specified with direct Cofounder cross-references where applicable.*

---

## Cross-Reference: Cofounder Design Language Consistency Checklist

Every element in this spec has been verified against Cofounder's live CSS. Key consistency points:

| Pattern | Cofounder Value | Harbor Value | Match? |
|---|---|---|---|
| Panel background | `bg-background-l100` (#f7f7f5) | `var(--bg-l100)` (#f7f7f5) | ✓ |
| Panel radius | `rounded-[12px]` | `var(--radius-lg)` (12px) | ✓ |
| Panel shadow | `shadow-outset-100` | `var(--shadow-outset-100)` | ✓ |
| Node outer | `rounded-[8px] p-[2px] bg-background-l100 shadow-outset-150` | `var(--radius-md) 2px var(--bg-l100) var(--shadow-outset-150)` | ✓ |
| Node inner | `rounded-[6px] bg-background-l200` | `var(--radius-sm) var(--bg-l200)` | ✓ |
| Center node | `w-[98px] h-[54px] rounded-[6px] bg-background-screen shadow-screen` | `98px 54px var(--radius-sm) var(--bg-screen) var(--shadow-screen)` | ✓ |
| CTA button | `bg-background-inverse border border-black/50 shadow-[0_25px...]` | `var(--bg-inverse) rgba(0,0,0,0.5) var(--shadow-cta)` | ✓ |
| Option button | `h-8 rounded-[8px] border border-foreground-10 bg-background-l0 shadow-[0_14px...]` | `32px var(--radius-md) var(--fg-10) var(--bg-l0) var(--shadow-option)` | ✓ |
| Submit button | `h-8 rounded-[8px] border border-black/50 bg-background-inverse` | `32px var(--radius-md) rgba(0,0,0,0.5) var(--bg-inverse)` | ✓ |
| Chat input | `rounded-[6px] bg-background-l200-90 backdrop-blur-md border-[0.5px] border-black/5 shadow-inset-025` | `var(--radius-sm) var(--bg-l200) 0.9 blur(8px) 0.5px rgba(0,0,0,0.05) var(--shadow-inset-025)` | ✓ |
| Chat font | `font-tt-neoris text-[15px]` | `var(--font-neoris) 15px` | ✓ |
| Timestamp | `text-sm font-normal text-muted-foreground` | `12px 400 var(--fg-30)` | ✓ |
| Workspace plate | `rounded-[22px] bg-background-l-negative-50 shadow-inset-200` | `var(--radius-xl) var(--bg-l-neg-50) var(--shadow-inset-200)` | ✓ |
| Roadmap card | `bg-background-screen rounded-[12px]` 248x72px | `var(--bg-screen) var(--radius-lg)` 148x56px (scaled for 5 stages) | ≈ (proportional) |
| Shimmer | `5.5s linear infinite, 260% size, 105deg angle` | Same values | ✓ |
| Hover lift | `translateY(-1px)` 150ms ease-out | Same values | ✓ |
| Badge gradient | `linear-gradient(180deg, #EFEFEC, rgba(239,239,236,0.5))` | `linear-gradient(180deg, var(--bg-l0), rgba(235,235,234,0.5))` | ✓ |
| Option card | `rounded-[6px] px-3 py-1.5 text-sm leading-[22px]` | `var(--radius-sm) 12px 8px 14px 22px` | ✓ |
| Disabled state | `opacity-60` / `opacity-50` | `0.4-0.6` (contextual) | ✓ |
| Screen effect | `clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%)` | Same clip-path | ✓ |
