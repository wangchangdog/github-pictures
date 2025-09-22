---
title: 13.  GitHub Pagesへのデプロイ (追加)
nextjs:
  metadata:
    title: 13.  GitHub Pagesへのデプロイ (追加)
    description: リポジトリの Settings → Pages からGitHub Pagesを有効化する。
---
### GitHub Pagesのセットアップ

リポジトリの Settings → Pages からGitHub Pagesを有効化する。

![スクリーンショット 2024-10-12 14.27.43.png](/docs/section-14-github-pages-deploy/screenshot-2024-10-12-14-27-43.png)

### baseUrlの変更

`vite.config.ts` の内容に baseを追加。

これは、GitHub Pagesでデプロイした場合のURLが [`https://ユーザー名.github.io/リポジトリ名`](https://ユーザー名.github.io/リポジトリ名) のような構造になっているためです。

```jsx
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/react-pokemon-zukan/',
}));
```

また、これに伴って、React Routerにも `basename`  のPropsを足してあげましょう。
`main.tsx` を以下のように書き換えてください。

`main.tsx` 

```jsx
**import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);**
```

### GitHub Actionsを使ったデプロイの設定

次に、プロジェクトのルートディレクトリに `.github/workflows/deploy.yml` を作成し、以下のように記述し、適切なコミットメッセージをつけてGitHubのリモートリポジトリにPushしましょう。
ちなみに、これはGitHub Actionsといい、GitHubのクラウド上でコマンド操作を可能にする仕組みです。チーム開発ではビルドチェックやテストなどによく利用されています。
また、アプリを公開することを「デプロイ」といいます。

`.github/workflows/deploy.yml`

```jsx
name: Deploy GitHub Pages

on:
  push:
    branches: ['main', 'master']

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm ci && npm run build
        env:
          PUBLIC_URL: /react-pokemon-zukan
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

リポジトリ名が `react-pokemon-zukan` となっていれば、
このGitHub Actionsは成功するはずなので、 GitHubリポジトリの Actionsのタブを見てみましょう。

以下のように、チェックマークがついていたら無事コマンドが通ってデプロイされています。

![スクリーンショット 2024-10-11 23.00.29.png](/docs/section-14-github-pages-deploy/screenshot-2024-10-11-23-00-29.png)

画面の [pages build and deployment](https://github.com/wangchangdog/react-pokemon-zukan/actions/runs/11293421349) のリンク（枠部分）に進む。

次に、deployのタブに進む

![スクリーンショット 2024-10-11 23.04.41.png](/docs/section-14-github-pages-deploy/screenshot-2024-10-11-23-04-41.png)

Complete jobの下の方にあるURLのリンクがデプロイ先のURLです。
これをクリックすると、アプリ画面が表示されるはずです。

![スクリーンショット 2024-10-11 23.06.24.png](/docs/section-14-github-pages-deploy/screenshot-2024-10-11-23-06-24.png)

アプリ画面

![スクリーンショット 2024-10-11 23.09.47.png](/docs/section-14-github-pages-deploy/screenshot-2024-10-11-23-09-47.png)

デプロイはこれで終わりです。

---

