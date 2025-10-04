---
title: 7. Tailwind CSSの設定とグローバルconfigなどの追加
nextjs:
  metadata:
    title: 7. Tailwind CSSの設定とグローバルconfigなどの追加
    description: Tailwind CSSとは？
---
### Tailwind CSSのインストールと設定

[Tailwind CSSとは？](https://www.notion.so/Tailwind-CSS-1d224b6a67ce814695cae3fc4b261b1b?pvs=21)

Tailwind CSS v4では、追加のPostCSSプラグイン設定が不要になり、`tailwindcss`本体とViteプラグインだけでセットアップできます。

```bash
npm install tailwindcss @tailwindcss/vite
```

`vite.config.ts`（もしくは`vite.config.js`）にTailwindプラグインを読み込みます。既存のViteプラグインがある場合は配列に追加してください。

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

Tailwind v4では`tailwind.config.js`を用意する必要はありません。代わりにCSSファイルへ`@import "tailwindcss";`を追加し、必要に応じて`@theme`でカスタマイズします。

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --font-family-sans: "Noto Sans JP", "sans-serif";
  --color-brand: #ffcb05;
  --color-brand-dark: #b98c00;
}
```

この`src/index.css`（またはエントリCSS）を`main.tsx`などで読み込めばTailwindユーティリティが利用可能になります。

### Tailwind CSSの動作確認

開発サーバー（`npm run dev`や`pnpm dev`）を起動し、`http://localhost:5173` にアクセスしてTailwindのユーティリティクラスが効いているか確認しましょう。

### pokemonTypesMap.tsの作成

```tsx
// src/pokemonTypesMap.ts
// ポケモンのタイプと色を対応させる
export const pokemonTypesMap = [
  {
    type: 'normal',
    jaType: 'ノーマル',
    color: '#A8A878',
  },
  {
    type: 'fire',
    jaType: 'ほのお',
    color: '#F08030',
  },
  {
    type: 'water',
    jaType: 'みず',
    color: '#6890F0',
  },
  {
    type: 'electric',
    jaType: 'でんき',
    color: '#F8D030',
  },
  {
    type: 'grass',
    jaType: 'くさ',
    color: '#78C850',
  },
  {
    type: 'ice',
    jaType: 'こおり',
    color: '#98D8D8',
  },
  {
    type: 'fighting',
    jaType: 'かくとう',
    color: '#C03028',
  },
  {
    type: 'poison',
    jaType: 'どく',
    color: '#A040A0',
  },
  {
    type: 'ground',
    jaType: 'じめん',
    color: '#E0C068',
  },
  {
    type: 'flying',
    jaType: 'ひこう',
    color: '#A890F0',
  },
  {
    type: 'psychic',
    jaType: 'エスパー',
    color: '#F85888',
  },
  {
    type: 'bug',
    jaType: 'むし',
    color: '#A8B820',
  },
  {
    type: 'rock',
    jaType: 'いわ',
    color: '#B8A038',
  },
  {
    type: 'ghost',
    jaType: 'ゴースト',
    color: '#705898',
  },
  {
    type: 'dragon',
    jaType: 'ドラゴン',
    color: '#7038F8',
  },
  {
    type: 'dark',
    jaType: 'あく',
    color: '#705848',
  },
  {
    type: 'steel',
    jaType: 'はがね',
    color: '#B8B8D0',
  },
  {
    type: 'fairy',
    jaType: 'フェアリー',
    color: '#F0A0C0',
  }
]
```

---

