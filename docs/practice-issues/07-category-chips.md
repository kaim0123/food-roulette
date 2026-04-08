# Issue #07: CategoryChips コンポーネント

**難易度**: ★☆☆  
**目安時間**: 20分  
**学べること**: コンポーネントの Props 設計、条件付きスタイリング、`ReadonlySet`

## やること

1. トグルボタン（チップ）を横並びに表示するコンポーネントを作る

## 対象ファイル

- `components/roulette/category-chips.tsx`

## 完成イメージ

```
ジャンルを選ぶ
[■ 和食] [■ 洋食] [□ 中華] [■ 韓国]
         ↑選択中=黒 ↑未選択=白
```

## 実装のポイント

### Props の設計

```tsx
type CategoryChipsProps = {
  categories: readonly RouletteCategory[];  // 表示するチップ一覧
  selected: ReadonlySet<string>;            // 選択中のID集合
  onToggle: (categoryId: string) => void;   // クリック時のコールバック
  disabled?: boolean;                       // ルーレット回転中は操作不可
  sectionLabel: string;                     // セクション見出し
  ariaLabel: string;                        // アクセシビリティ用ラベル
};
```

- `ReadonlySet<string>`: 読み取り専用のSet。`selected.has(id)` で選択判定に使う
- `onToggle`: 親コンポーネントに「このIDが押されたよ」と伝えるだけ。
  選択/解除のロジックは親が持つ

### 条件付きスタイリング

```tsx
className={[
  "inline-flex items-center rounded-full border px-3 py-2",
  isOn
    ? "border-zinc-900 bg-zinc-900 text-white"   // 選択中: 黒背景・白文字
    : "border-zinc-200 bg-white text-zinc-800",   // 未選択: 白背景・黒文字
  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
].join(" ")}
```

- 配列で条件分岐 → `.join(" ")` で結合するパターン
- Tailwind では `clsx` や `cn` ユーティリティを使うことも多い

## 完了条件

- [ ] チップが横並びで表示される
- [ ] クリックで選択/解除を切り替えられる
- [ ] 選択中は黒背景、未選択は白背景
- [ ] `disabled` のときはクリック不可＋半透明
