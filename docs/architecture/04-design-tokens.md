# 04 - Design Tokens & Visual System

> CSS custom properties, color system, typography, spacing, animations.

---

## Color System

```css
:root {
  /* Base surfaces */
  --bg: #09090b;
  --bg-warm: #0d0d11;
  --bg-card: #111115;
  --bg-card-hover: #16161b;
  --bg-elevated: #1a1a1f;
  --bg-overlay: rgba(0, 0, 0, 0.7);

  /* Borders */
  --border: #1e1e24;
  --border-subtle: #15151a;
  --border-strong: #2a2a32;
  --border-focus: #7c5cfc;

  /* Text */
  --text-primary: #e4e4e7;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  --text-muted: #52525b;
  --text-inverse: #09090b;

  /* Brand accent */
  --accent: #7c5cfc;
  --accent-hover: #6b4fe6;
  --accent-muted: rgba(124, 92, 252, 0.15);
  --accent-glow: rgba(124, 92, 252, 0.3);

  /* Domain colors */
  --domain-instruction: #4087F2;
  --domain-reasoning: #8A72E5;
  --domain-safety: #F46746;
  --domain-knowledge: #80A740;
  --domain-calibration: #B16A27;
  --domain-multilingual: #3AAFA9;
  --domain-longcontext: #E8596C;
  --domain-tooluse: #6C63FF;

  /* Status colors */
  --status-success: #22c55e;
  --status-warning: #eab308;
  --status-error: #ef4444;
  --status-info: #3b82f6;
  --status-locked: #52525b;

  /* Milestone statuses */
  --milestone-locked: #52525b;
  --milestone-available: #a1a1aa;
  --milestone-in-progress: #7c5cfc;
  --milestone-completed: #22c55e;
  --milestone-failed: #ef4444;
  --milestone-skipped: #71717a;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;

  /* Typography */
  --font-sans: 'Inter', -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--accent-glow);

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;

  /* Layout */
  --topbar-height: 56px;
  --statusbar-height: 32px;
  --companion-width: 400px;
  --detail-panel-width: 480px;
  --canvas-grid-size: 20px;
}
```

## Canvas Node Dimensions

```css
/* Center model node */
--center-node-size: 160px;

/* Domain node */
--domain-node-width: 200px;
--domain-node-height: 80px;
--domain-node-radius: 300px; /* Distance from center in radial layout */

/* Milestone card */
--milestone-card-width: 248px;
--milestone-card-height: 72px;
--milestone-connector-width: 43px;

/* Agent activity node */
--agent-node-width: 180px;
--agent-node-height: 48px;
```

## Animations

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px var(--accent-glow); }
  50% { box-shadow: 0 0 20px var(--accent-glow); }
}

@keyframes node-appear {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes edge-flow {
  from { stroke-dashoffset: 20; }
  to { stroke-dashoffset: 0; }
}

@keyframes milestone-unlock {
  0% { opacity: 0.5; transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```
