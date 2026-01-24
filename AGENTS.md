# Repository Guidelines

## Project Structure & Module Organization
- Root-only static app: `index.html`, `styles.css`, `app.js`, `version.json`.
- UI is rendered directly from `app.js`; no build system, bundler, or framework.
- `app.js` layers: domain (`Idea`, `Project`), data (`LocalStorageProjectRepository`, `FileSystemDataRepository`),
  use cases (`ProjectService`), UI (`ProjectIdeaUI`), visual utilities (`ThemeService`, `PolyBackground`).
- UI includes settings, log analytics (Chart.js), Gantt timeline, and update-check dialogs.

## Build, Test, and Development Commands
- No build step. Open `index.html` directly in a browser.
- Optional local server if you want a stable origin for browser APIs:
  - `python -m http.server` (open `http://localhost:8000/`).

## External Assets & Dependencies
- Fonts are loaded via Google Fonts in `styles.css`.
- Chart.js is lazy-loaded from CDN; lucide UMD is loaded in `index.html`.
- Icons are inline SVG; there are no local image assets.

## Coding Style & Naming Conventions
- Indentation: 2 spaces (HTML/CSS/JS).
- Naming: `camelCase` for variables/functions, `PascalCase` for classes, `kebab-case` for CSS classes.
- Keep layers separated (domain/data/use-case/UI) and keep UI logic in `ProjectIdeaUI`.
- When adding user-provided text to HTML, use `escapeHtml()` to avoid injection issues.
- Prefer small, readable helpers over large inline blocks.

## Data & Storage
- Project data: `project-idea-collection.v1` (LocalStorage).
- Theme preference: `project-idea-collection.theme` (LocalStorage).
- UI state: `project-idea-collection.ui` (LocalStorage) for filters, active project, data source, update checks, service monitor.
- Optional local-file data source uses the File System Access API; current file handle cached in IndexedDB
  (`project-idea-studio` → `fileHandles`).

## Versioning & Cache Busting
- Update the timestamp version in `index.html`, `app.js`, and `version.json` on every change.
- Keep the `?v=` query value in `index.html` synchronized with `APP_VERSION` in `app.js`.

## Testing Guidelines
- No automated tests configured.
- Manual checks to run after changes:
  - Create project, add/edit/delete ideas, drag to reorder.
  - Toggle done and confirm progress and log updates.
  - Open log dialog: filters + charts update.
  - Open Gantt timeline and category filters.
  - Export/import data; switch data source (LocalStorage vs local file).
  - Service monitor toggle + model usage refresh (if endpoints are available).
  - Reload to confirm finished timestamps clear but ideas persist (LocalStorage).
  - Verify light/dark toggle and background animation.

## Commit & Pull Request Guidelines
- No Git history is present; if you initialize Git, use clear, imperative messages (e.g., "Add idea edit dialog").
- Keep changes focused; include a short summary and screenshots for UI changes.
- Note any manual checks performed.

## Configuration & Data Notes
- The app is auth-free and demo-focused; avoid adding network calls unless explicitly required.
- Optional health check + usage endpoints default to `http://localhost:8080/health` and
  `http://localhost:8080/account-limits`.
