# Repository Guidelines

## Project Structure & Module Organization
Next.js 15 App Router documentation site. Source code lives in `src/`:
- `app/` — route segments and pages (docs at `src/app/docs/<slug>/page.md`).
- `components/` — reusable UI; `lib/` — nav/search helpers; `styles/` — Tailwind.
- `markdoc/` — Markdoc nodes/tags and FlexSearch config.
- Assets in `src/images`, `src/fonts`. Config in `next.config.mjs`, `tsconfig.json`.
- Migration tool: `scripts/migrate-raw-markdowns.mjs` (input in `raw_markdowns/`).

## Build, Test, and Development Commands
- `npm run dev` — start dev server (http://localhost:3000/) with HMR.
- `npm run build` — production build (types, lint, SSG, search index).
- `npm run start` — serve built output locally.
- `npm run lint` — run ESLint (strict; fails on errors).
- `npm run migrate:docs` — regenerate `src/app/docs` from `raw_markdowns`.
  - Options: `-- --dry-run` preview, `-- --clean` rebuild the folder.

## Coding Style & Naming Conventions
- TypeScript + React. Components: PascalCase files; helpers: camelCase.
- Route segment folders in `src/app` use kebab-case.
- Tailwind utility-first; shared styles in `src/styles/tailwind.css`.
- Prettier (`singleQuote: true`, `semi: false`) + `prettier-plugin-tailwindcss`.
- ESLint (Next + TS + import + unicorn). Avoid `console`; prefer small, focused diffs.

## Testing Guidelines
No test harness included. If adding tests, prefer Playwright (e2e) or Vitest (unit). Document how to run them. At minimum, verify manually: navigation, search (`⌘K`/`Ctrl+K`), docs rendering, and build (`npm run build`).

## Commit & Pull Request Guidelines
- Commits: imperative mood (e.g., "Add search shortcut overlay").
- PRs: clear scope, linked issues, screenshots/GIFs for UI. State that `npm run lint` and manual checks passed. Keep unrelated changes out.

## Content & Search Notes
- Docs are Markdoc pages at `src/app/docs/<slug>/page.md` with front matter (`title`, optional `nextjs.metadata.description`).
- Search index is built from these pages via `src/markdoc/search.mjs`. If adding new content types, adjust the config and rerun `npm run build`.

## Security & Configuration Tips
Do not commit secrets. Use `.env.local`. ESLint enforces `turbo/no-undeclared-env-vars`. When restructuring, keep `page.md` locations stable to preserve search.
