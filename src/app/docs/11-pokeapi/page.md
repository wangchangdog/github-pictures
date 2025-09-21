---
title: 8. PokeAPIの利用方法（更新）
nextjs:
  metadata:
    title: 8. PokeAPIの利用方法（更新）
    description: >-
      PokeAPIは、ポケモンに関するデータを提供するRESTful APIです。詳細なドキュメントは PokeAPI v2 Documentation
      を参照してください。
---
PokeAPIは、ポケモンに関するデータを提供するRESTful APIです。詳細なドキュメントは [PokeAPI v2 Documentation](https://pokeapi.co/docs/v2) を参照してください。

### PokeAPIのエンドポイント

- **ポケモン一覧**: `https://pokeapi.co/api/v2/pokemon?limit=100&offset=0`
- **ポケモン詳細**: `https://pokeapi.co/api/v2/pokemon/{id}`
- **ポケモン種族情報**: `https://pokeapi.co/api/v2/pokemon-species/{id}`

### APIデータの取得方法

以下に、`fetch`を使用してポケモン一覧を取得し、日本語名を取得する方法を示します。参考にした方法については、[Zennの記事](https://zenn.dev/h_aso/articles/2220c857f5b74c)を参照してください。

```tsx
mkdir src/api
touch src/api/pokemon.ts src/api/pokemonSpecies.ts src/api/pokemonWithJapaneseName.ts

```

### APIレスポンスの型定義

このままではAPIリクエストのレスポンスの型がないので、以下のように作成する

共通の型 `src/api/common.type.ts` 

```tsx
// src/api/common.type.ts

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface Name {
  name: string;
  language: NamedAPIResource;
}

export interface APIResource {
  url: string;
}
```

`src/api/pokemon.type.ts`  

```tsx
// src/api/pokemon.type.ts

import { Name, NamedAPIResource } from './common.type';

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface VersionDetail {
  rarity: number;
  version: NamedAPIResource;
}

export interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: VersionDetail[];
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: VersionDetail[];
}

export interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: VersionGameIndex[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: NamedAPIResource;
  stats: PokemonStat[];
  types: PokemonType[];
}

export interface TypeRelations {
  double_damage_from: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  no_damage_to: NamedAPIResource[];
}

export interface GenerationGameIndex {
  game_index: number;
  generation: NamedAPIResource;
}

export interface TypePokemon {
  slot: number;
  pokemon: NamedAPIResource;
}

export interface Type {
  id: number;
  name: string;
  damage_relations: TypeRelations;
  game_indices: GenerationGameIndex[];
  generation: NamedAPIResource;
  move_damage_class: NamedAPIResource;
  names: Name[];
  pokemon: TypePokemon[];
  moves: NamedAPIResource[];
}

// 他のタイプ関連の型も同様に定義
```

### 1. ポケモン一覧の取得

```tsx
// src/api/pokemon.ts
import { API_BASE_URL } from '../config';

export interface PokemonListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export const fetchPokemonList = async (offset: number = 20, limit: number = 20): Promise<PokemonListResult> => {
  const response = await fetch(`${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('ポケモン一覧の取得に失敗しました');
  }
  const data = await response.json();
  return data;
};

```

### 2. ポケモンの日本語名を取得する関数の作成

各ポケモンの`species.url`を使用して、日本語名を取得します。

```tsx
// src/api/pokemonSpecies.ts
type SpeciesName = {
  name: string;
  language: {
    name: string;
    url: string;
  };
};

type SpeciesData = {
  names: SpeciesName[];
};

export const fetchPokemonJapaneseName = async (speciesUrl: string): Promise<string> => {
  try {
    const response = await fetch(speciesUrl);
    if (!response.ok) {
    throw new Error('ポケモン種族情報の取得に失敗しました');
  }
    const data: SpeciesData = await response.json();
    const japaneseNameEntry = data.names.find(nameEntry => nameEntry.language.name === 'ja-Hrkt');
    return japaneseNameEntry ? japaneseNameEntry.name : data.names[0].name;
  } catch (error) {
    console.error('ポケモン種族情報の取得に失敗しました', error);
    return '名前不明';
  }
};

```

### 3. ポケモン一覧に日本語名を追加する

ポケモン一覧を取得した後、各ポケモンの日本語名を取得してデータに追加します。

```tsx
// src/api/pokemonWithJapaneseName.ts
import { INITIAL_POKEMON_LIST_LIMIT } from '../config';
import { fetchPokemonList, PokemonListResult } from './pokemon';
import { Pokemon } from './pokemon.type';
import { fetchPokemonJapaneseName } from './pokemonSpecies';

// ポケモンの日本語名を含む拡張情報を表す型
export type PokemonWithJapaneseName = {
  name: string;          // ポケモンの英語名
  url: string;           // ポケモンの詳細情報を取得するためのURL
  japaneseName: string;  // ポケモンの日本語名
  number: string;        // ポケモンの図鑑番号
};

// 日本語名を含むポケモンリストの結果を表す型
export type PokemonListWithJapaneseNames = {
  count: number;                         // 総ポケモン数
  next: string | null;                   // 次のページのURL（存在する場合）
  previous: string | null;               // 前のページのURL（存在する場合）
  results: PokemonWithJapaneseName[];    // ポケモンの詳細情報リスト
};

// 日本語名を含むポケモンリストを取得する関数
export const fetchPokemonListWithJapaneseNames = async (offset: number = 0, limit: number = INITIAL_POKEMON_LIST_LIMIT): Promise<PokemonListWithJapaneseNames> => {
  // 基本的なポケモンリストを取得
  const pokemonList: PokemonListResult = await fetchPokemonList(offset, limit);
  
  // 各ポケモンの詳細情報を取得し、日本語名を追加
  const updatedResults: PokemonWithJapaneseName[] = await Promise.all(
    pokemonList.results.map(async (pokemon) => {
      // ポケモン種族のURLを生成
      const speciesUrl = pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', 'https://pokeapi.co/api/v2/pokemon-species/');
      // 日本語名を取得
      const japaneseName = await fetchPokemonJapaneseName(speciesUrl);
      // ポケモンの詳細情報を取得
      const pokemonDetails: Pokemon = await fetch(pokemon.url).then(res => res.json());
      
      // 必要な情報を組み合わせて返す
      return {
        ...pokemon,
        japaneseName,
        number: pokemonDetails.id.toString(),
        types: pokemonDetails.types.map((t) => ({
          type: {
            name: t.type.name
          }
        })),
        abilities: pokemonDetails.abilities.map((a) => ({
          ability: {
            name: a.ability.name
          }
        }))
      };
    })
  );
  
  // 元のリスト情報と更新された結果を組み合わせて返す
  return { ...pokemonList, results: updatedResults };
};

```

**注意点**: ポケモンの数が多い場合、複数のAPIリクエストが発生するため、パフォーマンスに注意が必要です。必要に応じて、キャッシングやバッチ処理を検討してください。

### グローバルコンフィグを src/config.tsに作成

```tsx
// src/config.ts

const API_BASE_URL = 'https://pokeapi.co/api/v2';

const INITIAL_POKEMON_LIST_LIMIT = 40;

export { API_BASE_URL, INITIAL_POKEMON_LIST_LIMIT };
```

---

