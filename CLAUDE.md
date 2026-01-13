# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Idea Studio - a zero-auth, browser-based idea tracker with LocalStorage persistence. Pure static web app with no build system or framework.

## Development

**Run locally:**
```bash
python -m http.server
# Open http://localhost:8000/
```

Or simply open `index.html` directly in a browser.

## Architecture

Single-file layered architecture in `app.js`:

1. **Domain Layer** - `Idea`, `Project` classes with business logic
2. **Data Layer** - `LocalStorageProjectRepository` handles persistence
3. **Use Case Layer** - `ProjectService` orchestrates domain operations
4. **UI Layer** - `ProjectIdeaUI` manages all DOM interactions and rendering
5. **Visual Utilities** - `ThemeService` (light/dark mode), `PolyBackground` (canvas animation)

**Storage keys:**
- `project-idea-collection.v1` - project/idea data
- `project-idea-collection.theme` - theme preference
- `project-idea-collection.ui` - UI state (active project, filters, etc.)

## Code Style

- 2-space indentation
- `camelCase` for variables/functions, `PascalCase` for classes, `kebab-case` for CSS
- Always use `escapeHtml()` when inserting user-provided text into HTML
- Keep layers separated - UI logic stays in `ProjectIdeaUI`

## Manual Testing Checklist

After changes, verify:
- Create project, add/edit/delete ideas, drag to reorder
- Toggle done status and confirm progress bar updates
- Reload page - finished timestamps should clear but ideas persist
- Light/dark theme toggle and background animation work
