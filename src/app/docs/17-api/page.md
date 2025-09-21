---
title: 14. 状態管理とAPI連携(ここは読むだけ)
nextjs:
  metadata:
    title: 14. 状態管理とAPI連携(ここは読むだけ)
    description: ReactHooksの説明
---
ReactHooksの説明

### React Hooksの導入と解説

React Hooksは、関数コンポーネント内で状態管理や副作用を扱うための仕組みです。以下では、基本的なHooksの使い方とカスタムフックの作成方法を解説します。

### useStateとuseEffectの基本

```tsx
import React, { useState, useEffect } from 'react';

const Example: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>カウントアップ</button>
    </div>
  );
};

export default Example;

```

### カスタムフックの作成

共通のロジックをカスタムフックとして抽出することで、再利用性を高めます。

```tsx
// src/hooks/usePokemon.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { fetchPokemonListWithJapaneseNames } from '../api/pokemonWithJapaneseName';

export const usePokemonList = () => {
  return useQuery(queryKeys.pokemonList(), fetchPokemonListWithJapaneseNames);
};

```

### カスタムフックの使用例

```tsx
import React from 'react';
import { usePokemonList } from '../hooks/usePokemon';

const PokemonList: React.FC = () => {
  const { data, isLoading, error } = usePokemonList();

  if (isLoading) return <div>読み込み中...</div>;
  if (error instanceof Error) return <div>エラー: {error.message}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {data.map((pokemon) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;

```

---

