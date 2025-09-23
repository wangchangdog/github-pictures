# Repository Guidelines

## Project Structure & Module Organization
Next.js 15 App Router documentation site. Source code lives in `src/`:
- `app/` — route segments and pages (docs at `src/app/docs/<slug>/page.md`).
- `components/` — reusable UI; `lib/` — nav/search helpers; `styles/` — Tailwind.
- `markdoc/` — Markdoc nodes/tags and FlexSearch config.
- Assets in `src/images`, `src/fonts`. Config in `next.config.mjs`, `tsconfig.json`.
- Migration tool: `scripts/migrate-raw-markdowns.mjs` (input in `raw_markdowns/`).

## Build, Test, and Development Commands
- `pnpm dev` — start dev server (http://localhost:3000/) with HMR.
- `pnpm build` — production build (types, lint, SSG, search index).
- `pnpm start` — serve built output locally.
- `pnpm lint` — run ESLint (strict; fails on errors).
- `pnpm migrate:docs` — regenerate `src/app/docs` from `raw_markdowns`.
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

## Docs (Markdoc) authoring

Location and routing
- Each doc lives at `src/app/docs/<slug>/page.md` and is routed to `/docs/<slug>`.
- The top page is `src/app/page.md` → `/`.

Front matter
- Put YAML front matter at the top of each page:
  - Required: `title`
  - Optional: `nextjs.metadata.description` for SEO/snippets

Headings and anchors
- Heading IDs are auto-generated with `src/lib/heading-slug.js`.
  - Japanese titles are translated/ローマ字化され、安定した slug になります（一部は `TITLE_SLUG_OVERRIDES` で固定）。
  - H1/H2 見出しと本文から検索用セクションが生成されます（`search.mjs`）。

Custom tags (Markdoc)
- `{% callout title="注意" type="note|warning" %}本文{% /callout %}`
  - `type` は `note` か `warning` のみ（他はエラー）。
- `{% figure src="/docs/<slug>/image.png" alt="説明" caption="キャプション" /%}`
- Grouped links:
  - `{% quick-links %} ... {% /quick-links %}` コンテナ
  - 子要素 `{% quick-link title="..." description="..." icon="book" href="/docs/..." /%}`

Code fences
- 通常の Markdown のコードブロック（```tsx など）を使用。内部で `Fence` コンポーネントに対応。

Images and assets
- 画像は `public/docs/<slug>/` に置き、`/docs/<slug>/<file>` で参照。
  - 例: `public/docs/section-12-pokemon-detail-screen/screen.png` → `/docs/section-12-pokemon-detail-screen/screen.png`

Search indexing behavior
- Webpack 時に `src/markdoc/search.mjs` がページを解析し、FlexSearch ドキュメントを構築。
- 検索はページごとのセクション（H1/H2＋本文）単位でヒットし、アンカー付き URL（`/docs/<slug>#<heading-id>`）へ遷移します。

Add a new doc page
1) `src/app/docs/<new-slug>/page.md` を作成し、front matter に `title` を記載。
2) 本文を Markdoc で執筆（見出し、コード、カスタムタグの利用可）。
3) 画像は `public/docs/<new-slug>/` に配置し、絶対パスで参照。
4) ナビを更新する場合は `src/lib/navigation.ts` にリンクを追加。
5) 開発サーバーで確認（`npm run dev`）。検索は dev/build いずれでも自動で反映。

Migration from raw markdowns
- 原稿が `raw_markdowns/` にある場合は `npm run migrate:docs` で `src/app/docs` を再生成可能。
- プレビューは `-- --dry-run`、全消しして再生成は `-- --clean`。

## Security & Configuration Tips
Do not commit secrets. Use `.env.local`. ESLint enforces `turbo/no-undeclared-env-vars`. When restructuring, keep `page.md` locations stable to preserve search.
