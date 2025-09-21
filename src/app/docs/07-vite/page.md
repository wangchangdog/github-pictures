---
title: 4. Viteプロジェクトのセットアップ
nextjs:
  metadata:
    title: 4. Viteプロジェクトのセットアップ
    description: Viteは高速なビルドツールで、Reactプロジェクトのセットアップに最適です。
---
Viteは高速なビルドツールで、Reactプロジェクトのセットアップに最適です。

### プロジェクトのディレクトリに移動

```racket
mkdir ~/学籍番号
cd ~/学籍番号
```

### プロジェクトの作成

以下のコマンドを実行して、Viteを使用してReact + TypeScriptプロジェクトを作成します。

```bash
npm create vite@latest react-pokemon-zukan -- --template react-ts

```

### ディレクトリに移動して依存関係をインストール

```bash
cd react-pokemon-zukan
npm install

```

### ローカルリポジトリの設定

ターミナルで以下のコマンドを実行して、ローカルリポジトリをGitHubに接続します。

```bash
# https://github.com/<your-username>/react-pokemon-zukan.git にはリポジトリのURLが入ります
git init
git remote add origin https://github.com/<your-username>/react-pokemon-zukan.git

```

*注: `your-username`をあなたのGitHubユーザー名に置き換えてください。*

### Gitの設定

Gitのユーザー名とメールアドレスを設定します。

```bash
git config --local user.name "Your Name"
git config --local user.email "your.email@example.com"

```

### ターミナルからGitHubへのログイン

```jsx
gh auth logout 
gh auth login

```

下のスクショのように選択肢を選択

![スクリーンショット 2024-10-05 11.55.28.png](./assets/e3-82-b9-e3-82-af-e3-83-aa-e3-83-bc-e3-83-b3-e3-82-b7-e3-83-a7-e3-83-83-e3-83-88-2024-10-05-11-55-28.png)

何らかのキーを押すと以下の画面に飛ばされます。
GitHubにログインしていない場合はログインが求められます。

![スクリーンショット 2024-10-05 11.56.05.png](./assets/e3-82-b9-e3-82-af-e3-83-aa-e3-83-bc-e3-83-b3-e3-82-b7-e3-83-a7-e3-83-83-e3-83-88-2024-10-05-11-56-05.png)

Continue を押す

![スクリーンショット 2024-10-05 11.56.56.png](./assets/e3-82-b9-e3-82-af-e3-83-aa-e3-83-bc-e3-83-b3-e3-82-b7-e3-83-a7-e3-83-83-e3-83-88-2024-10-05-11-56-56.png)

### GitHubへの初回プッシュ

作成したプロジェクトをGitHubにプッシュします。

```bash
git add .
git commit -m "Set up Vite React TypeScript project"
git push -uf origin main

```

### プロジェクトの起動確認

開発サーバーを起動して、プロジェクトが正しくセットアップされているか確認します。

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスし、Viteのウェルカムページが表示されればOKです。

---

