# Issue #05: データ定義（カテゴリ・レシピ・お店）

**難易度**: ★☆☆  
**目安時間**: 30分  
**学べること**: 定数データの定義、`as const`、型の活用

## やること

1. カテゴリデータを定義する（ジャンル、メインの型、エリア、キーワード）
2. レシピデータを定義する（16件）
3. お店データを定義する（12件）

## 対象ファイル

- `lib/roulette/cuisine-categories.ts` - ジャンル（和食/洋食/中華/韓国）
- `lib/roulette/meal-format-categories.ts` - メインの型（ご飯/麺/パン/鍋/その他）
- `lib/roulette/areas.ts` - エリア（渋谷/新宿/池袋/銀座）
- `lib/roulette/recipe-keywords.ts` - レシピのこだわりタグ
- `lib/roulette/shop-keywords.ts` - お店のこだわりタグ
- `lib/data/recipes.ts` - レシピ一覧
- `lib/data/shops.ts` - お店一覧

## 実装のポイント

### カテゴリの定義パターン

全てのカテゴリファイルは同じパターンで書く:

```tsx
import type { RouletteCategory } from "@/lib/roulette/types";

export const CUISINE_CATEGORIES: readonly RouletteCategory[] = [
  { id: "japanese", label: "和食" },
  { id: "western", label: "洋食" },
  // ...
];
```

- `readonly RouletteCategory[]` で中身を変更不可にする
- 定数は `UPPER_SNAKE_CASE` で命名するのが慣習

### レシピデータのポイント

```tsx
{
  id: "curry",              // ユニークなID
  name: "カレーライス",      // 表示名
  categoryId: "western",    // ← cuisine-categories の id と一致させる
  mealFormatId: "rice",     // ← meal-format-categories の id と一致させる
  keywordIds: ["one_pan", "spicy", "quick"],  // ← recipe-keywords の id
}
```

- 各IDは対応するカテゴリファイルの `id` と**完全に一致**させる必要がある
- 一致しないとフィルタリングで表示されなくなる

### お店データのポイント

- レシピと違い `mealFormatId` はなく、代わりに `areaId` がある
- `keywordIds` はお店の属性（デート向け、個室ありなど）

## 完了条件

- [ ] 7つのファイルが作成されている
- [ ] レシピ16件、お店12件のデータがある
- [ ] ID の整合性が取れている（カテゴリの id とデータの categoryId が一致）
- [ ] TypeScript エラーが出ない
