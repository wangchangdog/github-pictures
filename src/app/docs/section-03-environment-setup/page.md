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

{% callout title="注意" type="warning" %}
このコマンドはあなたの環境に依存します。必ず学籍番号を確認し、内容を理解したうえで実行してください。

Enter だけでは実行されません。

「このディレクトリを作成して移動します。よろしいですか？ [y/N] 」の後、yを押してください。
{% /callout %}

Macのユーザー名は**仮に**、「`ktc`」とします。
学籍番号を**仮に**「`25A00G0001`」とすると、
以下のようにディレクトリを作成します。

```bash
# 学籍番号を入力して実行（Enter だけでは中止されます）
set -eu
read -r -p "学籍番号（例: 25A00G0001）: " STUDENT_ID
case "$STUDENT_ID" in ''|*[!A-Za-z0-9]*) echo "英数字のみで入力してください"; exit 1;; esac

TARGET_DIR="$HOME/$STUDENT_ID"
echo "作成先: $TARGET_DIR"
read -r -p "このディレクトリを作成して移動します。よろしいですか？ [y/N]: " yn
[[ "$yn" =~ ^[Yy]$ ]] || { echo "中止しました"; exit 1; }

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"
```

---

