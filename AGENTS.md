# Repository Guidelines

## Project Structure & Module Organization
The project is a Next.js 15 documentation site using the App Router. Primary code lives in `src/`: `app/` contains route segments and layouts, `components/` houses reusable UI, `lib/` stores utilities (including search helpers), `styles/` includes Tailwind sources, and `markdoc/` defines content schemas plus search configuration. Static assets for the template sit under `src/images` and `src/fonts`. Type declarations live in `types.d.ts` and framework configuration is handled through `next.config.mjs` and `tsconfig.json`.

## Build, Test, and Development Commands
- `npm run dev` — start the development server at http://localhost:3000/ with hot reload.
- `npm run build` — create the production bundle; run before deployment.
- `npm run start` — serve the production build locally for smoke testing.
- `npm run lint` — execute the Next.js ESLint suite to enforce project rules.

## Coding Style & Naming Conventions
Formatting is enforced by Prettier (`singleQuote: true`, `semi: false`) with `prettier-plugin-tailwindcss` to normalize class order. Author React components as TypeScript modules; use PascalCase for component files and camelCase for helpers. Route segment folders in `src/app` follow kebab-case. Favor Tailwind utility classes for styling; add shared styles to `src/styles/tailwind.css` when utilities are insufficient.

## Testing Guidelines
No automated test harness is configured. When adding features, create focused tests using the Next.js testing stack you introduce (e.g., Playwright or Vitest) and document how to run them. At minimum, verify critical flows manually via `npm run dev` before submitting changes.

## Commit & Pull Request Guidelines
Write commits in the imperative mood (e.g., "Add search shortcut overlay") and keep related changes together. Pull requests should summarize scope, reference related issues, and include screenshots or GIFs for visual adjustments. Note whether linting and manual verification have been completed.

## Content & Search Notes
Markdoc content and front matter live in `src/markdoc`; changes here automatically feed the FlexSearch index. Update `src/markdoc/search.mjs` if you add new content types, and re-run `npm run build` to confirm indexing remains healthy.

## Active Specifications
- `apply-strict-eslint-errors` — Apply catfinder ESLint configurations to `.eslintrc.json` with error-level enforcement.
