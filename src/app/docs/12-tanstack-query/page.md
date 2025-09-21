---
title: 9. Tanstack Queryの導入
nextjs:
  metadata:
    title: 9. Tanstack Queryの導入
    description: Tanstack Query（旧称React Query）は、データフェッチングとキャッシングを効率的に管理するライブラリです。
---
### Tanstack Queryのインストール

Tanstack Query（旧称React Query）は、データフェッチングとキャッシングを効率的に管理するライブラリです。

```bash
npm install @tanstack/react-query

```

### Tanstack Queryの設定

`src/main.tsx`を編集して、`QueryClient`と`QueryClientProvider`を設定します。

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

```

### クエリキーの管理

クエリキーは、データのキャッシングと識別に使用されます。`src/queryKeys.ts`を作成し、クエリキーを管理します。

query-key-factoryを使用して、クエリキーの管理を効率化します。

```bash
npm install @lukemorales/query-key-factory
```

```tsx
// src/queryKeys.ts
import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory";

export const pokemonQueryKeys = createQueryKeys("pokemon", {
    list: () => ["list"],
    detail: (id: number) => ["detail", id],
});

export const apiQueryKeys = mergeQueryKeys(pokemonQueryKeys);
```

---

