# Task ID: 1

**Title:** Project Scaffolding: Next.js Config, Tailwind v4, ESLint, tsconfig

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Configure the foundational build toolchain for production quality.

Files to modify/create:
- next.config.ts: Enable strict mode, configure image domains, set output standalone for production
- tsconfig.json: strict: true, noUnusedLocals: true, noUnusedParameters: true, paths alias @/ → src/
- eslint.config.mjs: Next.js recommended + React hooks rules
- postcss.config.mjs: Tailwind v4 plugin
- tailwind.config.ts: Extend theme with design tokens (or use CSS-only approach for Tailwind v4)
- .env.example: Document all env vars (ANTHROPIC_API_KEY, etc.)
- src/app/layout.tsx: HTML lang='en', viewport meta, OG tags, font preloading
- src/lib/utils.ts: cn() utility (clsx + tailwind-merge or simple template literal helper)

The goal is that after this task, `npm run dev` starts clean, `npx tsc --noEmit` passes, and the app renders a blank page with correct HTML structure.

**Details:**

This task establishes the build pipeline. Every subsequent task depends on TypeScript compiling and the dev server running.

Specific configs:
- next.config.ts: reactStrictMode: true
- tsconfig paths: '@/*' → './src/*'
- Tailwind v4 uses CSS-based config with @theme directive, NOT tailwind.config.ts
- Create src/lib/utils.ts with cn() function for conditional class merging
- Create src/app/layout.tsx with <html lang='en'>, viewport meta tag, basic <body> structure

**Test Strategy:**

1. npm run dev starts without errors
2. npx tsc --noEmit exits 0
3. curl localhost:3000 returns 200
4. Browser shows blank page with correct <html lang='en'>

## Subtasks

### 1.1. Configure next.config.ts with strict mode

**Status:** pending  
**Dependencies:** None  

### 1.2. Set up tsconfig.json with strict + path aliases

**Status:** pending  
**Dependencies:** None  

### 1.3. Configure Tailwind v4 with CSS-based approach

**Status:** pending  
**Dependencies:** None  

### 1.4. Create src/lib/utils.ts with cn() utility

**Status:** pending  
**Dependencies:** None  

### 1.5. Create .env.example documenting all env vars

**Status:** pending  
**Dependencies:** None  

### 1.6. Set up src/app/layout.tsx with HTML shell, viewport, OG tags

**Status:** pending  
**Dependencies:** None  

