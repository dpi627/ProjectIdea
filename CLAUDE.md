# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This monorepo contains two apps:

- **Ophan** (`apps/web/`) — the primary app: a Svelte 5 + Vite + TypeScript rewrite of the legacy idea tracker. Uses IndexedDB for persistence. This is where active development happens.
- **Legacy** (`lagcy/`) — the original static HTML/CSS/JS app (Project Idea Studio). Kept as a reference. No build step.

## Development

**Ophan (primary):**
```bash
npm run dev        # starts Vite dev server at http://localhost:5173/
npm run build      # type-check all packages + build web app
npm run check      # svelte-check across all workspaces
npm run test:core  # run packages/core smoke tests
```

**Legacy (reference only):**
```bash
cd lagcy && python -m http.server
# Open http://localhost:8000/
# Or open lagcy/index.html directly in a browser
```

## Architecture

### Ophan (apps/web/)

Monorepo structure:
- `packages/core` — pure TypeScript domain & use-case helpers (no DOM/browser deps)
- `packages/storage` — IndexedDB adapter + legacy LocalStorage importer
- `apps/web/src/` — Svelte 5 UI

**State (`.svelte.ts` runes modules):**
- `lib/state/app.svelte.ts` — workspace data + all actions (`persist`, `addProject`, `addIdea`, etc.)
- `lib/state/ui.svelte.ts` — theme, panel collapsed state, category filter (persisted to `ophan.ui`)
- `lib/state/dialogs.svelte.ts` — dialog open/close state

**UI components** (`lib/components/`):
`Topbar`, `ProjectRail`, `IdeaPanel`, `CompletionPanel`, `ProjectDialog`, `ConfirmDialog`, `Toast`, `Skeleton`, `TrendChart`

**Storage keys:**
- `ophan.device-id` — device identifier
- `ophan.theme` — theme preference
- `ophan.ui` — panel collapsed state, category filter

**Layout:** 100dvh app-shell (`grid-template-rows: auto 1fr`), three-column workspace (left: projects, center: ideas, right: completed). Right panel collapsed by default. Each column scrolls independently.

### Legacy (lagcy/)

Single-file layered architecture in `lagcy/app.js`:
1. **Domain Layer** — `Idea`, `Project` classes
2. **Data Layer** — `LocalStorageProjectRepository`
3. **Use Case Layer** — `ProjectService`
4. **UI Layer** — `ProjectIdeaUI`
5. **Visual Utilities** — `ThemeService`, `PolyBackground`

**Storage keys:**
- `project-idea-collection.v1` — project/idea data
- `project-idea-collection.theme` — theme preference
- `project-idea-collection.ui` — UI state

## Code Style

- 2-space indentation
- `camelCase` for variables/functions, `PascalCase` for classes/components, `kebab-case` for CSS
- Svelte 5 runes mode only (`$state`, `$derived`, `$effect`, `onclick`) — no mixing with legacy `$:`/`on:` syntax
- Always use `escapeHtml()` when inserting user-provided text into HTML (legacy app)
- Keep `packages/core` browser-neutral (no DOM, IndexedDB, LocalStorage, Svelte)

## Manual Testing Checklist (Ophan)

After changes, verify:
- Create project, add/edit/delete ideas, drag to reorder
- Toggle done status, confirm progress bar + completion log updates
- Pin/unpin project and idea, confirm ordering
- Category filter chips (all/CI/MP/SP/NA) work
- Left/right panel collapse and state persists after reload
- Export JSON, import JSON, import legacy data
- Light/dark theme toggle
- ECharts trend chart loads only on first right-panel open
- `npm run check` passes with 0 errors
