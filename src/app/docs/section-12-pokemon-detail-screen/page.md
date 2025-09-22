---
title: 11. ポケモン詳細画面の作成
nextjs:
  metadata:
    title: 11. ポケモン詳細画面の作成
    description: src/components/PokemonTypeLabel.tsx を作成する。
---
### PokemonTypeLabelコンポーネント

`src/components/PokemonTypeLabel.tsx`  を作成する。

```tsx
// src/components/pokemonTypeLabel.tsx
// ポケモンのタイプのラベル
import { pokemonTypesMap } from '../pokemonTypesMap';

type PokemonTypeLabelProps = {
  type: string;
};

const PokemonTypeLabel: React.FC<PokemonTypeLabelProps> = ({ type }) => {
  const typeInfo = pokemonTypesMap.find((t) => t.jaType === type);
  return (
    <span 
      style={{
        backgroundColor: typeInfo?.color,
      }}
      key={type}
      className={`text-white px-3 py-1 rounded-full w-fit`}
    >
      {typeInfo?.jaType}
    </span>
  );
};

export default PokemonTypeLabel;
```

### PokemonDetailコンポーネントの実装

`src/pages/PokemonDetail.tsx`を編集します。

```tsx
// src/pages/PokemonDetail.tsx
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPokemonDetail } from '../api/pokemonDetail';
import PokemonTypeLabel from '../components/PokemonTypeLabel';
import { apiQueryKeys } from '../queryKeys';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: [apiQueryKeys.pokemon.detail(Number(id))],
    queryFn: () => fetchPokemonDetail(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    console.log(data);
  }, [data])

  if (isLoading) return <PokemonDetailSkeleton />;
  if (error instanceof Error) return <div>エラー: {error.message}</div>;
  if (!data) return <div>ポケモンが見つかりません</div>;

  return (
    <div className="p-4 max-w-[400px] m-auto">
      <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4">← 一覧に戻る</Link>
      <div className="mt-4 bg-white shadow-md rounded p-8 flex flex-col items-center gap-4">
        <img src={data.image} alt={data.japaneseName} className="w-40 h-40" />
        <h1 className="mt-4 text-2xl font-bold">{data.japaneseName} (#{data.id})</h1>
        <p className="mt-2 text-justify">{data.description}</p>
        <div className="grid grid-cols-2 gap-2">
          {data?.types?.map((type) => (
            <PokemonTypeLabel key={type} type={type} />
          ))}
        </div>
          <span className="w-fit whitespace-nowrap text-right">特性</span>
        <div className="flex gap-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            {data?.abilities?.map((ability) => (
              <span key={ability}>{ability}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-2 w-full">
          {data?.baseStats?.map((stat) => (
            <div key={stat.name} className="flex items-center">
              <span className="w-24 text-right mr-2">{stat.name}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 rounded-full h-4"
                  style={{ width: `${(stat.value / 255) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 w-8">{stat.value}</span>
            </div>
          ))}
          {/* 合計種族値 */}
          <div className="flex items-center">
            <span className="w-24 text-right mr-2">合計</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 rounded-full h-4"
                style={{ width: `${(data?.baseStats?.reduce((sum, stat) => sum + stat.value, 0) / 780) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 w-8">{data?.baseStats?.reduce((sum, stat) => sum + stat.value, 0)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        {/* 0は前へがないので非表示 */}
        {Number(id) !== 1 ? <Link to={`/pokemon/${Number(id) - 1}`} className="px-4 py-2 bg-blue-500 text-white rounded-md">前へ</Link> : <span />}
        <Link to={`/pokemon/${Number(id) + 1}`} className="px-4 py-2 bg-blue-500 text-white rounded-md">次へ</Link>
      </div>
    </div>
  );
};

const PokemonDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 max-w-[400px] m-auto">
      <div className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 w-24">
        <Skeleton />
      </div>
      <div className="mt-4 bg-white shadow-md rounded p-8 flex flex-col items-center gap-4">
        <Skeleton circle={true} width={160} height={160} />
        <Skeleton width={200} height={24} />
        <Skeleton width={300} height={60} />
        <div className="grid grid-cols-2 gap-2 w-full">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-2 w-full">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton width={60} height={20} />
              <div className="flex-1 ml-2">
                <Skeleton height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton width={80} height={36} />
        <Skeleton width={80} height={36} />
      </div>
    </div>
  );
};

export default PokemonDetail;

```

### スケルトンの実装

スケルトンを実装します。

スケルトンとは以下のようなローディング時に表示されるオブジェクトです

![スクリーンショット 2024-10-12 11.06.17.png](/docs/section-12-pokemon-detail-screen/screenshot-2024-10-12-11-06-17.png)

```bash
npm install react-loading-skeleton
```

### API関数の実装

`src/api/pokemonDetail.ts`を作成します。

```tsx
// src/api/pokemonDetail.ts
import { FlavorTextEntry, PokemonAbility, PokemonStat, PokemonType } from './pokemon.type';
import { Name } from './common.type';

type PokemonDetail = {
  id: number;
  name: string;
  japaneseName: string;
  image: string;
  types: string[];
  abilities: string[];
  description: string;
  baseStats: { name: string; value: number }[];
};

export const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) {
    throw new Error('ポケモンの詳細情報の取得に失敗しました');
  }
  const data = await response.json();

  // ポケモン種族情報を取得して日本語名を取得
  const speciesResponse = await fetch(data.species.url);
  if (!speciesResponse.ok) {
    throw new Error('ポケモン種族情報の取得に失敗しました');
  }
  const speciesData = await speciesResponse.json();
  const japaneseNameEntry = speciesData.names.find(
    (nameEntry: Name) => nameEntry.language.name === 'ja'
  );
  const japaneseName = japaneseNameEntry ? japaneseNameEntry.name : data.name;

  // タイプの日本語名を取得
  const types = await Promise.all(
    data.types.map(async (typeInfo: PokemonType) => {
      const typeResponse = await fetch(typeInfo.type.url);
      const typeData = await typeResponse.json();
      const japaneseType = typeData.names.find((name: Name) => name.language.name === 'ja');
      return japaneseType ? japaneseType.name : typeInfo.type.name;
    })
  );

  // 特性の日本語名を取得
  const abilities = await Promise.all(
    data.abilities.map(async (abilityInfo: PokemonAbility) => {
      const abilityResponse = await fetch(abilityInfo.ability.url);
      const abilityData = await abilityResponse.json();
      const japaneseAbility = abilityData.names.find((name: Name) => name.language.name === 'ja');
      return japaneseAbility ? japaneseAbility.name : abilityInfo.ability.name;
    })
  );

  // 種族値の取得
  const baseStats = await Promise.all(data.stats.map( async (stat: PokemonStat) => {
    // 日本語名を取得
    const japaneseStatData = await fetch(`https://pokeapi.co/api/v2/stat/${stat.stat.name}`);
    const japaneseStatDataJson = await japaneseStatData.json();
    return {
      name: japaneseStatDataJson.names.find((name: Name) => name.language.name === "ja-Hrkt").name,
      value: stat.base_stat,
    };
  }));

  console.log(baseStats);

  // 説明文の取得
  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry: FlavorTextEntry) => entry.language.name === 'ja'
  );
  const description = flavorTextEntry
    ? flavorTextEntry.flavor_text.replace(/\f/g, ' ')
    : '説明文がありません。';

  return {
    id: data.id,
    name: data.name,
    japaneseName,
    image: data.sprites.other['official-artwork'].front_default,
    types,
    abilities,
    description,
    baseStats,
  };
};

```

**説明**:

1. **ポケモン詳細の取得**: `https://pokeapi.co/api/v2/pokemon/{id}`エンドポイントからポケモンの基本情報を取得します。
2. **種族情報の取得**: 取得したポケモンデータの`species.url`を使用して、種族情報を取得します。
3. **日本語名の抽出**: `speciesData.names`配列から`language.name`が`ja-Hrkt`のエントリーを見つけ、その`name`を日本語名として使用します。
4. **説明文の抽出**: `speciesData.flavor_text_entries`配列から`language.name`が`ja-Hrkt`のエントリーを見つけ、その`flavor_text`を説明文として使用します。改行コード（`\\f`）をスペースに置換しています。

**参考**: 詳細な実装方法については、[Zennの記事](https://zenn.dev/h_aso/articles/2220c857f5b74c)を参照してください。

---

