# ProjectIdea Copilot Instructions

## Project Overview

ProjectIdea currently contains two application surfaces:

- `lagcy/` is the legacy static Project Idea Studio app. It has no bundler and can be opened directly from `lagcy/index.html`.
- `apps/web/` is the new Ophan Svelte + TypeScript + Vite app.

Shared code lives in workspace packages:

- `packages/core/` contains browser-neutral domain models, data normalization, imports, exports, and pure helpers.
- `packages/storage/` contains browser persistence adapters such as IndexedDB and legacy LocalStorage import.

The Remotion intro-video project is separate and lives in `project-idea-studio-video/`.

## Commands

Install dependencies from the repository root:

```bash
npm install
```

Run the new Ophan app:

```bash
npm run dev
```

Validate the workspace:

```bash
npm run check
npm run build
npm run test:core
```

Smoke-check the legacy static app:

```bash
node --check lagcy/app.js
```

Run the legacy app directly by opening `lagcy/index.html`, or serve it with:

```bash
cd lagcy
python -m http.server
```

## Architecture Rules

- Keep `packages/core` free of DOM, IndexedDB, LocalStorage, Svelte, Google, Tauri, and other runtime dependencies.
- Keep persistence and browser storage in `packages/storage`.
- Keep Svelte UI and browser interaction in `apps/web`.
- Preserve compatibility with legacy exported JSON and legacy LocalStorage payloads.
- Do not change storage keys without an explicit migration plan.
- Avoid growing legacy `lagcy/app.js` unless a task explicitly targets the legacy app.

## Legacy App Notes

The legacy app is intentionally static:

- Runtime files are `lagcy/index.html`, `lagcy/styles.css`, `lagcy/app.js`, and `lagcy/version.json`.
- `lagcy/assets/intro.mp4` is used by the legacy splash video.
- External browser scripts are loaded from CDNs in `lagcy/index.html`.
- Chart.js, html2canvas, and Prism are lazy-loaded by `lagcy/app.js`.

For legacy runtime changes, keep these versions synchronized:

- `lagcy/index.html` cache-busting query values.
- `APP_VERSION` in `lagcy/app.js`.
- `version` in `lagcy/version.json`.

Use sortable timestamp versions such as `yyyyMMddHHmmss`.

## Ophan App Notes

Ophan is local-first:

- IndexedDB database: `ophan`
- Object store: `workspace`
- LocalStorage keys: `ophan.device-id`, `ophan.theme`, and `ophan.ui`

The first Ophan release intentionally omits legacy-only features such as technical documentation dialogs, service monitor, model usage monitor, auto-update dialogs, splash video, and the Remotion intro workflow.

## Code Style

- Use 2-space indentation for HTML, CSS, JS, TS, TSX, and Svelte files.
- Use `camelCase` for variables/functions, `PascalCase` for classes/components, and `kebab-case` for CSS classes.
- Use `escapeHtml()` before inserting user-provided text into legacy `innerHTML` strings.
- Prefer small, readable helpers over large inline blocks.
- Follow the existing Svelte 5 runes style in `apps/web`.

## GitHub Pages Deployment

The Pages workflow builds the Ophan app and deploys `apps/web/dist`.

If GitHub Pages still uses the old "Deploy from a branch" source, switch the repository Pages source to "GitHub Actions" so `.github/workflows/deploy-pages.yml` is the deployment path.
