# Repository Guidelines

## Project Structure & Module Organization
This repository uses a Vite-powered React app as the primary implementation, with a legacy static prototype at the repo root.

- `react-app/`: Main React application (Vite). Source code in `react-app/src`, static assets in `react-app/public`.
- `index.html`: Legacy static prototype entry (use only if explicitly needed).
- `css/`, `js/`: Legacy prototype styles and scripts (e.g., `css/style.css`, `js/main.js`).

## Build, Test, and Development Commands
Run commands from `react-app/` for the main app:

- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server.
- `npm run build`: create a production build.
- `npm run preview`: preview the production build locally.
- `npm run lint`: run ESLint for code quality.

Legacy prototype viewing (root directory) is optional:
- `open index.html` (macOS) or `python3 -m http.server 8080` for the static prototype.

## Coding Style & Naming Conventions
- React app: follow ESLint rules in `react-app/eslint.config.js`.
- Indentation: 2 spaces is typical in React files; keep existing style within each file.
- JavaScript/TypeScript: prefer `const`/`let`, camelCase for variables and functions.
- CSS: kebab-case class names; group related rules by component.
- UI text: keep Chinese labels consistent unless the UI is intentionally changed.

## Testing Guidelines
There are no automated tests configured. If you add tests, document the tool and the command to run them here (e.g., `npm test`).

## Commit & Pull Request Guidelines
This directory may not have a consistent Git history. If you initialize Git or contribute in a PR workflow, use short, imperative commit messages (e.g., "Add irrigation legend interactions"). For PRs, include a brief description, screenshots for UI changes, and the reason for any data or model tweaks.

## Configuration & Data Notes
If you migrate mock data from the legacy prototype, keep values and labels aligned with UI legends and status text. Store React data/state in `react-app/src` and avoid duplicating data across the legacy files.
