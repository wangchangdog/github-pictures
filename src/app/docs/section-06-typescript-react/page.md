---
title: 5. TypeScriptとReactの基本(説明のみ、ファイル追加は不要)
nextjs:
  metadata:
    title: 5. TypeScriptとReactの基本(説明のみ、ファイル追加は不要)
    description: TypeScriptはJavaScriptに型を追加した言語です。型を使用することで、コードの品質と保守性を向上させます。
---
### TypeScriptの基本

TypeScriptはJavaScriptに型を追加した言語です。型を使用することで、コードの品質と保守性を向上させます。

### 例: 型定義

```tsx
// 関数の引数と戻り値に型を定義
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const message: string = greet("ポケモンマスター");
console.log(message); // 出力: Hello, ポケモンマスター!

```

### Reactの基本

Reactはコンポーネントベースのライブラリで、ユーザーインターフェースを構築します。

### 関数コンポーネントの例

```tsx
import React from 'react';

type GreetingProps = {
  name: string;
};

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

export default Greeting;

```

### 使用例

```tsx
import React from 'react';
import Greeting from './Greeting';

const App: React.FC = () => {
  return (
    <div>
      <Greeting name="ポケモンマスター" />
    </div>
  );
};

export default App;

```

### JSXとTypeScriptの連携(例)

TypeScriptを使用すると、JSX内での型安全性が向上します。

```tsx
import React from 'react';

type PokemonProps = {
  id: number;
  name: string;
  image: string;
};

const PokemonCard: React.FC<PokemonProps> = ({ id, name, image }) => {
  return (
    <div className="pokemon-card">
      <img src={image} alt={name} />
      <h2>{id}. {name}</h2>
    </div>
  );
};

export default PokemonCard;

```

---

