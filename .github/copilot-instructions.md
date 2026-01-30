# Project Idea Studio - Copilot Instructions

## Project Overview

Project Idea Studio is a zero-auth, browser-based idea tracker with LocalStorage persistence. It's a pure static web app with no build system or framework.

This repository contains two projects:
1. **Root** - The main Project Idea Studio web app (`index.html`, `app.js`, `styles.css`)
2. **project-idea-studio-video/** - Remotion video project for creating intro videos

## Development

### Running the Main App

**Option 1: Direct file access**
```bash
# Simply open index.html in a browser
```

**Option 2: Local server** (recommended for stable browser API origin)
```bash
python -m http.server
# Open http://localhost:8000/
```

No build step required - the app runs directly in the browser.

### Running the Video Project

```bash
cd project-idea-studio-video
npm install  # First time only
npm start    # Opens Remotion Studio at http://localhost:3000
```

**Build final video:**
```bash
cd project-idea-studio-video
npm run build  # Creates out/intro.mp4 (1920x1080, ~5-10MB)
```

## Architecture

### Main App (`app.js`)

Single-file layered architecture with clear separation of concerns:

1. **Domain Layer** - `Idea`, `Project` classes containing business logic
2. **Data Layer** - `LocalStorageProjectRepository` (LocalStorage), `FileSystemDataRepository` (File System Access API)
3. **Use Case Layer** - `ProjectService` orchestrates domain operations
4. **UI Layer** - `ProjectIdeaUI` manages all DOM interactions and rendering
5. **Visual Utilities** - `ThemeService` (light/dark mode), `PolyBackground` (canvas animation)

### Storage Architecture

**LocalStorage keys:**
- `project-idea-collection.v1` - Project and idea data
- `project-idea-collection.theme` - Theme preference (light/dark)
- `project-idea-collection.ui` - UI state (active project, filters, data source, update checks, service monitor)

**IndexedDB:**
- Database: `project-idea-studio`
- Object store: `fileHandles` - Caches File System Access API handles

**Data sources:**
- LocalStorage (default) - Browser's local storage
- Local File - Uses File System Access API for a user-selected JSON file

### Video Project Architecture

Built with Remotion (React-based video framework):
- TypeScript + React components
- Scene-based composition structure in `src/`
- Spring physics for natural animations
- @remotion/transitions for scene transitions

## Code Style & Conventions

### Indentation & Formatting
- 2-space indentation for HTML, CSS, and JavaScript
- No semicolons are required but used consistently in this codebase

### Naming Conventions
- `camelCase` for variables and functions
- `PascalCase` for classes (e.g., `ProjectService`, `ThemeService`)
- `kebab-case` for CSS classes

### Security
- **Always use `escapeHtml()`** when inserting user-provided text into HTML to prevent XSS
- Example: `innerHTML = escapeHtml(userInput)`

### Layer Separation
- Keep UI logic in `ProjectIdeaUI` class
- Domain logic stays in `Idea` and `Project` classes
- Data persistence handled by repository classes
- Prefer small, readable helper functions over large inline blocks

## Versioning & Cache Busting

**Critical:** Update version timestamp on every change to ensure browsers reload:

1. `index.html` - Update `?v=` query parameter in script tag
2. `app.js` - Update `APP_VERSION` constant
3. `version.json` - Update `version` field

All three must be synchronized with the same timestamp (format: `YYYYMMDDHHmmss`).

Example:
```javascript
// app.js
const APP_VERSION = "20260127155339";
```
```html
<!-- index.html -->
<script src="app.js?v=20260127155339"></script>
```
```json
// version.json
{"version": "20260127155339"}
```

## Testing

No automated tests are configured.

### Manual Testing Checklist

After making changes, verify:

**Core functionality:**
- Create project, add/edit/delete ideas, drag to reorder
- Toggle done status and confirm progress bar updates
- Pin/unpin projects and ideas

**Data persistence:**
- Reload page - finished timestamps should clear but ideas persist
- Export/import data
- Switch data source (LocalStorage vs local file)

**UI features:**
- Light/dark theme toggle and background animation work
- Open log dialog: filters and charts update correctly
- Open Gantt timeline and test category filters (CI/MP/SP/none)
- Settings dialog (update check interval, service monitor toggle)

**Service monitoring** (if backend available):
- Service monitor toggle functionality
- Model usage refresh (requires endpoints at `http://localhost:8080/health` and `/account-limits`)

## External Dependencies

### Main App
- **Google Fonts** - Loaded via `styles.css`
- **Chart.js** - Lazy-loaded from CDN for analytics charts
- **Lucide icons** - UMD build loaded in `index.html`
- **Prism.js** - Lazy-loaded for code syntax highlighting

All dependencies are loaded from CDN - no package manager required.

### Video Project
Standard npm dependencies defined in `project-idea-studio-video/package.json`.

## Configuration

### Network Endpoints (Optional)
The app is auth-free and works entirely offline. Optional endpoints for service monitoring:
- Health check: `http://localhost:8080/health`
- Account limits: `http://localhost:8080/account-limits`

Avoid adding network calls unless explicitly required for new features.

### Gantt Categories
Predefined categories for timeline view: `CI`, `MP`, `SP`
- Defined in `GANTT_CATEGORY_OPTIONS`
- Used for project categorization and filtering

## Key Features to Understand

1. **Dual Data Source Support** - Can use either LocalStorage or File System Access API
2. **Update Checking** - Background version checking against `version.json`
3. **Activity Logging** - Tracks idea completion with timestamps and analytics
4. **Drag & Drop Reordering** - Custom implementation for ideas and projects
5. **Theme System** - Persistent light/dark mode with animated background
6. **Service Monitor** - Optional integration for backend service health

## Tips for Common Tasks

### Adding UI Features
1. Add UI rendering in `ProjectIdeaUI` class methods
2. Use `escapeHtml()` for any user input
3. Update manual testing checklist in this file

### Modifying Data Schema
1. Update domain classes (`Idea`, `Project`)
2. Update `serializeProjects()` function
3. Consider migration strategy for existing user data
4. Update storage key if breaking changes (`project-idea-collection.v2`)

### Adding Video Scenes
1. Navigate to `project-idea-studio-video/src/`
2. Create new scene component following existing patterns
3. Add to composition in main video file
4. Use spring physics for animations (`@remotion/spring`)

### Working with Icons
- Main app: Inline SVG in `ICONS` constant
- Prefer Lucide icons (already loaded) for consistency
- Keep inline for performance (no HTTP requests)
