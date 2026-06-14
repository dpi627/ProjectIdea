# Repository Guidelines

## Project Structure & Module Organization
- Legacy root static app: `lagcy/index.html`, `lagcy/styles.css`, `lagcy/app.js`, `lagcy/version.json`.
- `lagcy/` is reference-only for future product work. Do not modify legacy files; all UI/product adjustments target the new Ophan app.
- New Ophan app: `apps/web/` is a Svelte + TypeScript + Vite app.
- Shared packages: `packages/core/` owns pure domain/data behavior; `packages/storage/` owns persistence adapters.
- Runtime asset: `lagcy/assets/intro.mp4` is used by the legacy splash video in `lagcy/index.html`.
- Video subproject: `project-idea-studio-video/` is a separate Remotion + React + TypeScript project for generating the legacy intro video.
- Legacy root app has no bundler or framework. UI is rendered directly from `app.js`.
- `app.js` layers: constants/helpers/icons, embedded tech-documentation snippets, domain (`Idea`, `Project`), data (`LocalStorageProjectRepository`, `FileSystemDataRepository`), use cases (`ProjectService`), UI (`ProjectIdeaUI`), visual utilities (`ThemeService`, `PolyBackground`).
- The `TECH_SNIPPETS` object intentionally contains code-looking strings for the in-app technical documentation; do not treat those as duplicate runtime definitions.
- UI includes settings, export/import, local-file storage, log analytics, charts, heatmaps, Gantt timeline, service monitor, model usage, update-check dialogs, theme switching, splash video, and background animation.

## Build, Test, and Development Commands
- Legacy root app has no build step. Open `lagcy/index.html` directly in a browser.
- Optional legacy local server for stable browser APIs:
  - `cd lagcy && python -m http.server` then open `http://localhost:8000/`.
- Ophan workspace commands:
  - `npm install`
  - `npm run dev` to run `apps/web`.
  - `npm run build` to type-check shared packages and build the web app.
  - `npm run check` to run package and Svelte checks.
- Root smoke checks:
  - `node --check lagcy/app.js`
  - Validate `lagcy/version.json` as JSON after version edits.
- Video project commands:
  - `cd project-idea-studio-video`
  - `npm start` to open Remotion Studio.
  - `npm run build` to render `out/intro.mp4`.

## External Assets & Dependencies
- Fonts are loaded from Google Fonts in `styles.css`.
- Root app loads external browser scripts in `lagcy/index.html`: lucide UMD, `lz-string`, D3, and Cal-Heatmap.
- Chart.js, html2canvas, and Prism are lazy-loaded from CDN by `app.js`.
- Root app uses inline SVG icons plus the local splash video asset. There are no local image assets.
- Avoid new network calls unless explicitly required. Existing optional endpoints default to `http://localhost:8080/health` and `http://localhost:8080/account-limits`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces for HTML, CSS, JS, TS, and TSX.
- Naming: `camelCase` for variables/functions, `PascalCase` for classes/components, `kebab-case` for CSS classes.
- Keep layers separated. Domain/data/use-case behavior should not be hidden inside UI rendering unless the current structure requires a small bridging method.
- Keep UI logic inside `ProjectIdeaUI` until a deliberate refactor extracts focused collaborators.
- When adding user-provided text to HTML strings, use `escapeHtml()` before assigning to `innerHTML`.
- Prefer small, readable helpers over large inline blocks.
- UI 設計請遵循 Design System 頁面
- Preserve existing static-app simplicity unless the task explicitly introduces a build step.

## Data & Storage
- Legacy project data: `project-idea-collection.v1` in LocalStorage.
- Legacy theme preference: `project-idea-collection.theme` in LocalStorage.
- Legacy UI state: `project-idea-collection.ui` in LocalStorage for filters, active project, data source, update checks, service monitor, model usage, tech topic, splash mode, and seed state.
- Legacy splash seen state: `project-idea-collection.splash-seen` in LocalStorage.
- Legacy optional local-file data source uses the File System Access API. The current file handle is cached in IndexedDB (`project-idea-studio` -> `fileHandles`).
- Ophan project data is local-first in IndexedDB (`ophan` -> `workspace`) with schema versioned `WorkspaceData`.
- Ophan device and theme preferences use LocalStorage keys `ophan.device-id` and `ophan.theme`.
- Ophan storage adapters should implement the `ProjectRepository` interface from `packages/core`.

## Versioning & Cache Busting
- For legacy root app/runtime changes, update the timestamp version in `lagcy/index.html`, `lagcy/app.js`, and `lagcy/version.json`.
- Keep the `?v=` query values in `lagcy/index.html` synchronized with `APP_VERSION` in `lagcy/app.js` and `version` in `lagcy/version.json`.
- Use a sortable timestamp format such as `yyyyMMddHHmmss`.

## Manual Testing Guidelines
- No automated root-app test suite is configured.
- Manual checks after root UI or data changes:
  - Create project, edit project metadata, delete project, and drag to reorder.
  - Add/edit/delete ideas, pin/unpin, drag to reorder, and move between todo/done.
  - Toggle done and confirm progress, finished timestamps, logs, and persisted order.
  - Open log dialog and verify search, project/date filters, Chart.js charts, and heatmaps.
  - Open Gantt timeline and verify range/category filters and export behavior.
  - Export/import data.
  - Switch data source between LocalStorage and local file, including migration prompts where relevant.
  - Service monitor toggle and model usage refresh if endpoints are available.
  - Reload to confirm data, UI state, theme, and splash behavior persist as expected.
  - Verify light/dark/system theme and background animation.
- For video changes, run Remotion preview or render and verify the produced video manually.

## Refactor Guidance
- Treat `ProjectIdeaUI` as the main risk area. It owns state hydration, event binding, rendering, dialogs, analytics, local-file switching, update checks, service monitor, and splash behavior.
- Prefer implementing retained behavior in Ophan packages/apps rather than continuing to grow legacy `app.js`.
- Keep `packages/core` browser-neutral and free of DOM, IndexedDB, LocalStorage, Google, or Tauri dependencies.
- Keep `packages/storage` as the boundary for IndexedDB, legacy LocalStorage import, future Google Sheets sync, and future Tauri storage.
- Keep serialized data shape backward compatible. Add migrations only when unavoidable.
- Avoid changing storage keys without an explicit migration plan.

## Commit & Pull Request Guidelines
- Git is present in this repository. Keep changes focused and use clear, imperative commit messages.
- Include a short summary and screenshots for UI changes.
- Note manual checks performed and any checks skipped.
