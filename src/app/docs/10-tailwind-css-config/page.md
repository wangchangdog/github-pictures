---
title: 7. Tailwind CSSの設定とグローバルconfigなどの追加
nextjs:
  metadata:
    title: 7. Tailwind CSSの設定とグローバルconfigなどの追加
    description: Tailwind CSSとは？
---
### Tailwind CSSのインストールと設定

[Tailwind CSSとは？](https://www.notion.so/Tailwind-CSS-1d224b6a67ce814695cae3fc4b261b1b?pvs=21) 

Tailwind CSSをプロジェクトに導入します。

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

```

`tailwind.config.js`を以下のように編集します。

```jsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

`src/index.css`を以下の内容に置き換えます。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

### Tailwind CSSの動作確認

`http://localhost:5173`  が動いているか確認し、Tailwind CSSが正しく動作するか確認します。

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

