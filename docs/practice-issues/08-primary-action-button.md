# Issue #08: PrimaryActionButton コンポーネント

**難易度**: ★☆☆  
**目安時間**: 10分  
**学べること**: シンプルなコンポーネント設計、`as const`

## やること

1. 「スタート！」「もう一回！」の2つの表示を切り替えられるボタンを作る

## 対象ファイル

- `components/roulette/primary-action-button.tsx`

## 完成イメージ

```
┌─────────────────────────────┐
│         スタート！            │  ← オレンジ色の丸ボタン
└─────────────────────────────┘
```

## 実装のポイント

### variant パターン

```tsx
type PrimaryActionButtonProps = {
  variant: "start" | "retry";  // ← 文字列リテラル型で2択に制限
  onClick: () => void;
  disabled?: boolean;
};

const copy = {
  start: "スタート！",
  retry: "もう一回！",
} as const;
```

- `variant` で見た目やテキストを切り替えるパターンはUIライブラリでよく使う
- `as const` をつけると、オブジェクトの値が文字列リテラル型になる
  - つけない: `{ start: string }` → つける: `{ start: "スタート！" }`

### Tailwind のクラス

```
rounded-full    → 角を完全に丸くする
bg-orange-500   → オレンジ色の背景
disabled:opacity-50 → disabled 時に半透明
```

## 完了条件

- [ ] `variant="start"` で「スタート！」と表示される
- [ ] `variant="retry"` で「もう一回！」と表示される
- [ ] `disabled` のとき半透明でクリック不可
- [ ] オレンジ色のフルwidth丸ボタン
