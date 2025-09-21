---
title: 2. 開発環境の準備
nextjs:
  metadata:
    title: 2. 開発環境の準備
    description: 開発には以下のツールが必要です。Mac環境を前提としています。
---
### 必要なツールの確認

開発には以下のツールが必要です。Mac環境を前提としています。

1. **Node.js**: JavaScriptランタイム。最新のLTSバージョンをインストールしてください。
    - [Node.jsダウンロードページ](https://nodejs.org/)
2. **Git**: バージョン管理システム。Macには通常プリインストールされていますが、確認してください。
    
    ```bash
    git --version
    
    ```
    
3. **コードエディタ**: Visual Studio Codeを推奨します。
    - [Visual Studio Codeダウンロードページ](https://code.visualstudio.com/)

### Node.jsのインストール確認

ターミナルを開き、以下のコマンドでNode.jsがインストールされているか確認します。

```bash
node -v

```

バージョンが表示されればOKです。インストールされていない場合は、[Node.jsの公式サイト](https://nodejs.org/)からインストールしてください。

### プロジェクトディレクトリの作成

Macのユーザー名は仮に、「ktc」とします。学籍番号を仮に「25A31G0014」とすると、以下のようにディレクトリを作成します。

```bash
mkdir /Users/ktc/25A31G0014
cd /Users/ktc/25A31G0014

```

---

