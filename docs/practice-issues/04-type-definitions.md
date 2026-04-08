# Issue #04: 型定義（TypeScript）

**難易度**: ★☆☆  
**目安時間**: 15分  
**学べること**: TypeScript の型定義、`readonly`、オプショナルプロパティ

## やること

1. ルーレットで使う全ての型を定義する

## 対象ファイル

- `lib/roulette/types.ts`

## 型の全体像

```
RouletteAppConfig（アプリ設定）
├── categories: RouletteCategory[]    ← ジャンル（和食・洋食...）
├── mealFormats?: RouletteCategory[]  ← メインの型（ご飯・麺...）※レシピのみ
├── areas?: RouletteCategory[]        ← エリア（渋谷・新宿...）※お店のみ
├── keywords?: RouletteCategory[]     ← こだわりタグ
├── items: RouletteItem[]             ← 候補データ（レシピ or お店）
└── copy: RouletteCopy                ← 画面に表示する文言
```

## 実装のポイント

### RouletteCategory（カテゴリ）

```tsx
export type RouletteCategory = {
  id: string;    // 英語のID（"japanese", "rice" など）
  label: string; // 表示名（"和食", "ご飯もの" など）
};
```

- 最もシンプルな型。ID と表示名だけ

### RouletteItem（候補データ）

```tsx
export type RouletteItem = {
  id: string;
  name: string;
  categoryId: string;
  mealFormatId?: string;          // ← ? はオプショナル（なくてもOK）
  areaId?: string;
  keywordIds?: readonly string[]; // ← readonly で変更不可にする
};
```

- `?` をつけると「あってもなくてもいい」プロパティになる
- `readonly string[]` は配列の中身を変更できなくする安全策

### RouletteCopy（UI文言）

- 画面に表示するラベルやメッセージを集めた型
- コンポーネントに直接書かず、設定ファイルに切り出すことで再利用しやすくなる

### RouletteAppConfig（設定全体）

- 上記3つの型を組み合わせた「アプリ全体の設定」
- レシピ用とお店用で同じ型を使い回せる設計

## 完了条件

- [ ] 4つの型（`RouletteCategory`, `RouletteItem`, `RouletteCopy`, `RouletteAppConfig`）が定義できている
- [ ] TypeScript のエラーが出ない
