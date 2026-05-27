# Harbor Eval Canvas

Visual AI evaluation creation platform. Build, probe, and validate model evaluations with precision.

Built with Next.js 16, React 19, TypeScript, Tailwind v4, and Zustand.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript 5
- **Styling**: Tailwind v4 + CSS Custom Properties design system
- **State**: Zustand with localStorage persistence
- **Icons**: Lucide React + custom SVG pipeline/domain icons
- **Fonts**: Figtree (UI), Mondwest (display), Departure Mono (data), EB Garamond (editorial)

## Getting Started

```bash
git clone https://github.com/JiwaniZakir/harbor-eval-canvas-v2.git
cd harbor-eval-canvas-v2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/                    # Next.js pages + layout + globals.css (design system)
├── components/
│   ├── ui/                 # Primitives: Button, Input, Badge, Card, Dialog, Spinner, etc.
│   ├── layout/             # TopBar, BottomNav, DetailPanel, ToastStack, ErrorBoundary
│   ├── canvas/             # RadialRing, WorkspacePlate, CanvasShell, EmptyCanvas
│   ├── panel/              # 5 tab components + ChatCards
│   └── studio/             # ProjectSetup wizard, CommandPalette
├── lib/
│   ├── types.ts            # All TypeScript interfaces + domain/pipeline constants
│   ├── utils.ts            # cn(), formatRelativeTime(), uid(), etc.
│   └── stores/             # 5 Zustand stores (project, domain, ui, agent, toast)
public/
├── eval-icons/             # 13 SVG icons (5 pipeline + 8 domain)
└── fonts/                  # Mondwest + Departure Mono woff2
```

## Design System

Single source of truth in `globals.css` (2,760 lines):

| Token | Example |
|-------|---------|
| Backgrounds | `--bg-l0: #FAFAF9` through `--bg-l200: #E7E5E4` |
| Foregrounds | `--fg-5` through `--fg-100` (15 opacity levels of `#1a1a1a`) |
| Domain Accents | 8 colors via `[data-domain]` attribute selectors |
| Radius | `--radius-xs: 4px` through `--radius-full: 9999px` |
| Shadows | 6 presets from inset-025 to outset-150 |
| Animations | 14 keyframes (pulseGlow, shimmer, cursorBlink, etc.) |

**Rule**: Components use ONLY CSS custom properties. No hardcoded colors.

## Components (29 total)

### UI Primitives (9)
Button (4 variants), Input, Textarea (auto-resize), Badge (6 variants), Card (3 variants), Dialog, Spinner, Switch, Skeleton

### Layout (5)
TopBar, BottomNav, DetailPanel (lazy tab routing), ToastStack, ErrorBoundary

### Canvas (4)
RadialRing (SVG + 8 domain nodes + 14 visual states), WorkspacePlate (pipeline strip + fan-outs), CanvasShell, EmptyCanvas

### Panel Tabs (5)
HomeTab, AgentTab (chat + composer), ProjectTab (settings + danger zone), FilesTab (tree + preview + upload), SweepsTab (pass@k + trials)

### Studio (2)
ProjectSetup (5-step wizard), CommandPaletteModal (Cmd+K)

### Specialized (4)
ChatCards (5 types), StreamingText, ErrorStates (3 variants), FileUpload

## State Stores

| Store | Persists | Purpose |
|-------|----------|---------|
| `project-store` | localStorage | Project name, model, progress |
| `domain-store` | localStorage | 8 domain states, artifacts, summaries |
| `ui-store` | No | Active tab, focused domain, global state |
| `agent-store` | No | Chat messages, tool calls, streaming |
| `toast-store` | No | Notification queue (max 3) |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1-5` | Switch tabs (Home, Agent, Project, Files, Sweeps) |
| `Cmd+K` | Command palette |
| `Escape` | Close palette/plate/dialog |

## License

MIT
