---
title: 10. ポケモン一覧画面の作成
nextjs:
  metadata:
    title: 10. ポケモン一覧画面の作成
    description: src/pages/PokemonList.tsxを編集します。
---
### ディレクトリ構成

`src/pages/PokemonList.tsx`を編集します。

### PokemonListコンポーネントの実装

```tsx
// src/pages/PokemonList.tsx
import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiQueryKeys } from '../queryKeys';
import { fetchPokemonListWithJapaneseNames, PokemonWithJapaneseName } from '../api/pokemonWithJapaneseName';
import PokemonCard from '../components/PokemonCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PokemonList: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [apiQueryKeys.pokemon.list()],
    queryFn: ({ pageParam = 0 }) => fetchPokemonListWithJapaneseNames(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length * 20;
      }
      return undefined;
    },
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <PokemonListSkeleton />;
  if (status === 'error') return <div>エラーが発生しました</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.pages.map((page) =>
          page.results.map((pokemon: PokemonWithJapaneseName) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))
        )}
      </div>
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isFetchingNextPage ? <Loader /> : hasNextPage ? '続きを読み込む' : ''}
      </div>
    </div>
  );
};

// ローダーコンポーネント
const Loader: React.FC = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
);

const PokemonListSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(18)].map((_, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <Skeleton height={120} />
            <Skeleton width={80} height={20} className="mt-2" />
            <Skeleton width={100} height={16} className="mt-1" />
          </div>
        ))}
      </div>
      <div className="h-10 flex items-center justify-center">
        <Skeleton width={100} height={20} />
      </div>
    </div>
  );
};

export default PokemonList;

```

### API関数の実装

`src/api/pokemonWithJapaneseName.ts`を作成し、API連携の処理を集約します（前述のセクション8を参照）。

### PokemonCardコンポーネントの実装(componentsフォルダ)

`src/components/PokemonCard.tsx`を作成します。

```tsx
// src/components/PokemonCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export type PokemonDetail = {
  name: string;
  url: string;
  japaneseName: string;
  number: string;
}

type PokemonCardProps = {
  pokemon: PokemonDetail;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <Link to={`/pokemon/${id}`}>
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-xl transition-shadow">
        <p className="text-sm text-gray-500 mr-auto">No. {pokemon.number}</p>
        <img src={imageUrl} alt={pokemon.japaneseName} className="w-20 h-20" />
        <h2 className="mt-2 text-lg font-semibold">{pokemon.japaneseName}</h2>
      </div>
    </Link>
  );
};

export default PokemonCard;

```

---

