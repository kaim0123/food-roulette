# Issue #09: ResultCard コンポーネント

**難易度**: ★☆☆  
**目安時間**: 15分  
**学べること**: オプショナルな Props の扱い、表示データの組み立て

## やること

1. ルーレット結果を赤枠のカードで表示するコンポーネントを作る

## 対象ファイル

- `components/roulette/result-card.tsx`

## 完成イメージ

```
     今日の晩ごはんは…

  ┌─────────────────────┐
  │                     │
  │    カレーライス       │  ← 大きく表示
  │    洋食 · ご飯もの    │  ← カテゴリ・型
  │    フライパン1つ · 辛め │ ← キーワード
  │                     │
  └─────────────────────┘
       ↑ 赤いボーダー
```

## 実装のポイント

### メタ情報の組み立て

```tsx
const parts: string[] = [categoryLabel];
if (mealFormatLabel != null && mealFormatLabel !== "") {
  parts.push(mealFormatLabel);
}
if (areaLabel != null && areaLabel !== "") {
  parts.push(areaLabel);
}
const meta = parts.join(" · ");  // "洋食 · ご飯もの" のような文字列になる
```

- オプショナルな値（`mealFormatLabel`, `areaLabel`）は `null` チェックしてから追加
- ` · ` （中点）で区切って見やすくする

### null チェックと条件レンダリング

```tsx
{keywordLine != null ? (
  <p className="mt-1 text-xs text-zinc-400">{keywordLine}</p>
) : null}
```

- React では `条件 ? <表示> : null` で条件付き表示ができる
- `null` を返すと何も表示されない

## 完了条件

- [ ] 料理名が大きく中央に表示される
- [ ] カテゴリ・メインの型（またはエリア）が表示される
- [ ] キーワードがある場合のみ表示される
- [ ] 赤いボーダー (`border-red-500`) が表示される
