# Issue #06: プリセット設定ファイル

**難易度**: ★★☆  
**目安時間**: 20分  
**学べること**: 設定の集約、データとUIテキストの分離

## やること

1. レシピ用の設定オブジェクトを作る
2. お店用の設定オブジェクトを作る
3. バレルエクスポートファイルを作る

## 対象ファイル

- `lib/roulette/presets.ts`
- `components/roulette/index.ts`

## 設計の考え方

このアプリは「レシピルーレット」と「お店ルーレット」の2つの機能がありますが、
UIの構造はほぼ同じです。違うのは：

- 使うデータ（レシピ vs お店）
- フィルターの種類（メインの型 vs エリア）
- 画面に表示するテキスト

そこで、**設定オブジェクト（Config）**に全てまとめて、
同じコンポーネントに設定を渡すだけで両方動くようにしています。

```
レシピページ ──→ RouletteApp(config=recipeRouletteConfig)
お店ページ  ──→ RouletteApp(config=shopRouletteConfig)
```

## 実装のポイント

### presets.ts

```tsx
export const recipeRouletteConfig: RouletteAppConfig = {
  title: "晩ごはんスロット",
  categories: CUISINE_CATEGORIES,     // ← Issue #05 で作ったデータ
  mealFormats: MEAL_FORMAT_CATEGORIES, // レシピだけに存在
  keywords: RECIPE_KEYWORDS,
  items: RECIPE_ITEMS,
  copy: {
    categorySectionLabel: "ジャンルを選ぶ",
    // ... 各種UIテキスト
  },
};
```

- `copy` オブジェクトにUIテキストを集約することで、コンポーネントに日本語を直書きしない
- お店用は `mealFormats` の代わりに `areas` を設定する

### index.ts（バレルエクスポート）

```tsx
export { CategoryChips } from "@/components/roulette/category-chips";
export { RouletteApp } from "@/components/roulette/roulette-app";
// ...
```

- `import { RouletteApp } from "@/components/roulette"` と書けるようにする便利ファイル
- 後からコンポーネントが増えてもインポートパスが変わらない

## 完了条件

- [ ] `recipeRouletteConfig` と `shopRouletteConfig` が定義されている
- [ ] 両方とも `RouletteAppConfig` 型に合致している
- [ ] バレルエクスポートが設定されている
