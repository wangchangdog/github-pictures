---
title: 15. テストとデバッグの仕方(参考)
nextjs:
  metadata:
    title: 15. テストとデバッグの仕方(参考)
    description: 開発中は、ブラウザの開発者ツールやReact DevToolsを活用してデバッグを行います。
---
### 開発ツールの活用

開発中は、ブラウザの開発者ツールやReact DevToolsを活用してデバッグを行います。

### エラーハンドリングの実装

API呼び出し時のエラーハンドリングを適切に行い、ユーザーにフィードバックを提供します。

```tsx
if (isLoading) return <div>読み込み中...</div>;
if (error instanceof Error) return <div>エラー: {error.message}</div>;

```

### コンポーネントのテスト

JestやReact Testing Libraryを使用して、コンポーネントのユニットテストを実装します。

**インストール**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest

```

**テストの例**

```tsx
// src/components/__tests__/PokemonCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import PokemonCard from '../PokemonCard';
import { BrowserRouter } from 'react-router-dom';

test('ポケモンカードが正しくレンダリングされる', () => {
  const pokemon = {
    name: 'bulbasaur',
    url: '<https://pokeapi.co/api/v2/pokemon/1/>',
    japaneseName: 'フシギダネ',
  };

  const { getByText, getByAltText } = render(
    <BrowserRouter>
      <PokemonCard pokemon={pokemon} />
    </BrowserRouter>
  );

  expect(getByText('フシギダネ')).toBeInTheDocument();
  expect(getByAltText('フシギダネ')).toBeInTheDocument();
});

```

**設定ファイルの追加**

Jestを使用するために、`jest.config.js`をプロジェクトルートに追加します。

```jsx
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

```

`jest.setup.js`を作成し、React Testing Libraryの設定を追加します。

```jsx
// jest.setup.js
import '@testing-library/jest-dom';

```

---

