---
title: 6. React Routerの導入
nextjs:
  metadata:
    title: 6. React Routerの導入
    description: React Routerを使用して、アプリケーション内でページ遷移を実現します。
---
React Routerを使用して、アプリケーション内でページ遷移を実現します。

### React Routerのインストール

```bash
npm install react-router-dom

```

### 基本的なルーティングの設定

`src/main.tsx`を編集して、`BrowserRouter`を追加します。

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

```

### ルートの定義

`src/App.tsx`を編集して、ルートを定義します。

```tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PokemonList from './pages/PokemonList';
import PokemonDetail from './pages/PokemonDetail';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PokemonList />} />
      <Route path="/pokemon/:id" element={<PokemonDetail />} />
    </Routes>
  );
};

export default App;

```

### ページコンポーネントの作成

`src/pages`ディレクトリを作成し、`PokemonList.tsx`と`PokemonDetail.tsx`を追加します。

```bash
mkdir src/pages
touch src/pages/PokemonList.tsx src/pages/PokemonDetail.tsx

```

今は仮のコンポーネントとして、

`PokemonList.tsx`と`PokemonDetail.tsx`には後述の内容を実装します。

`PokemonList.tsx` 

```tsx
const PokemonList: React.FC = () => {
    return (
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-blue-500">Reactポケモン図鑑リスト</h1>
      </div>
    )
}

export default PokemonList;
```

`PokemonDetail.tsx`

```tsx
const PokemonDetail: React.FC = () => {
    return (
      <div className="text-center mt-10 bg-slate-500">
        <h1 className="text-4xl font-bold text-blue-500">Reactポケモン図鑑詳細</h1>
        <div className="bg-slate-500">
          ここにポケモンの画像やステータスなどを表示する。
        </div>
      </div>
    )
}

export default PokemonDetail;
```

---

