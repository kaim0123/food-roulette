# Issue #02: グローバルCSS・レイアウト

**難易度**: ★☆☆  
**目安時間**: 20分  
**学べること**: Tailwind CSS v4 の設定、Next.js のレイアウトシステム、Google Fonts

## やること

1. `globals.css` でカスタムCSS変数とテーマを定義する
2. `layout.tsx`（ルートレイアウト）を作る

## 対象ファイル

- `app/globals.css`
- `app/layout.tsx`

## 実装のポイント

### globals.css

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

- `@import "tailwindcss"` は Tailwind CSS v4 の書き方（v3 以前は `@tailwind base;` などだった）
- `@theme inline` ブロックで Tailwind のカスタムカラーやフォントを定義できる
- ダークモード用の色も `@media (prefers-color-scheme: dark)` で定義

### layout.tsx

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
```

- `next/font/google` で Google Fonts を最適化して読み込める
- `Metadata` は SEO 用のタイトル・説明文を設定する型
- `lang="ja"` を html タグに設定（日本語サイトなので）
- `pb-[calc(3.5rem+env(safe-area-inset-bottom))]` でフッターの高さ分だけ下に余白を取る
  - `env(safe-area-inset-bottom)` はiPhoneのホームバー領域の分

## ヒント

- レイアウトは `children` を受け取って共通部分（ヘッダー、フッター）を囲むもの
- フッター（Issue #03で作る）をここで読み込む

## 完了条件

- [ ] ページ全体に背景色・文字色が適用されている
- [ ] Google Fonts (Geist) が適用されている
- [ ] `<html lang="ja">` になっている
