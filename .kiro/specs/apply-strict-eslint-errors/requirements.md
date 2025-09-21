# Requirements Document

## Project Description (Input)
/Users/kaperrine_dog/projects/corolab/vibe-coding/catfinder/packages/eslint-config/base.js
/Users/kaperrine_dog/projects/corolab/vibe-coding/catfinder/packages/eslint-config/next.js
このような、厳しめの ES lint rules を
.eslintrc.json に対して適用したい。
warningで日和見するのではなく、Errorを出すようにする。

## Requirements

### ゴール
- `react-pokemon-zukan-doc` リポジトリの `.eslintrc.json` を刷新し、catfinder `eslint-config` の厳格なルール群（`base.js` + `next.js`）を Next.js 15 ドキュメントサイトに適用する。
- 既存ルールの `warn` 水準をすべて `error` に引き上げ、lint 違反がビルド／CI を確実に失敗させる状態にする。

### 機能要件
- `.eslintrc.json` で catfinder 設定由来のルールセットを JSON 形式に移植し、Next.js App Router プロジェクトでも評価できるようにする。
- `next/core-web-vitals` 相当の Next.js ルールは保持しつつ、catfinder `next.js` で定義されている Node/Nest 向けルールのうち Next.js の SSR／API で有効なものを統合する。
- catfinder `base.js` 内で `only-warn` プラグインが行っている警告ダウングレード処理は採用せず、ルール定義を直接 `"error"` または `2` で記述する。
- catfinder 由来ルールで本プロジェクトに不整合がある場合は、理由とともにオーバーライド方針を requirements 内で明示する（例: NestJS 固有パスグループ）。
- 忽略パターン（`ignores`）は catfinder `base.js` をベースに、ドキュメントプロジェクトに必要な追加パターン（`src/markdoc/**` など）があれば列挙する。

### ルール厳格化
- catfinder `base.js` のすべての `warn` ルールを `error` に引き上げる。引き上げに伴い調整が必要なルールがあれば、変更理由と調整値を記録する。
- catfinder `next.js` の `import/order` や `n/*` 系ルールも `error` で適用し、Next.js クライアント／サーバー両方のエントリで破綻がないか確認する。
- `no-console` 等、基地設定で `warn` になっているルールを `error` に変更した場合の許容方針（例: ログを `logger` 経由に統一）を定義する。

### 依存関係・設定ファイル
- `.eslintrc.json` の更新に合わせて必要な npm パッケージ（`eslint-plugin-import`, `eslint-plugin-security`, `eslint-plugin-sonarjs`, `eslint-plugin-unicorn`, `eslint-plugin-n`, `globals`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-config-prettier`, など）を `devDependencies` として追加する要件を明記する。
- 既存の `next` ルールセットとの競合を避けるため、flat config ではなく `.eslintrc.json` 形式で動作するよう parser / parserOptions / plugins / settings を整理する。
- Prettier 連携（`eslint-config-prettier`）を維持し、Tailwind 並び順など既存スタイルガイドに影響しないことを条件とする。

### 運用・検証
- `npm run lint` が新しい設定で失敗するケースを確認し、最低 1 例以上の違反を修正した上で lint が成功することを手動検証する。
- 変更内容・導入パッケージ・lint コマンドの実行結果をドキュメント（README もしくはリリースノート）に追記する方針を確立する。
- 新しいルールによって頻発し得るエラーと推奨対応策（例: import 並び替え、`prefer-const`）を短くまとめ、開発者が参照できる場所を指定する。

### 非機能要件
- ESLint 実行時間が既存と比較して許容範囲（例: 2 倍未満）に収まることを確認する。
- 開発者体験を損なわないよう、権限の不要なスクリプト変更や見通しを requirements として制限する。

### オープン事項
- NestJS 専用パスグループ (`@nestjs/**` など) を Next.js プロジェクト向けにどう調整するか検討し、設計フェーズで確定させる。
- catfinder 設定内で `warn` だった複雑度・行数系ルール（`complexity`, `max-lines` など）を `error` にする場合の閾値再設定の要否を確認する。
