# Issue #03: フッターナビゲーション

**難易度**: ★★☆  
**目安時間**: 40分  
**学べること**: SVGアイコン、レスポンシブデザイン、Next.js のルーティング、`usePathname`

## やること

1. 3つのSVGアイコンコンポーネントを作る（ごはん・お店・ユーザー）
2. スティッキーフッター（モバイルで画面下に固定）を作る
3. 現在のページに応じてアクティブ状態を切り替える

## 対象ファイル

- `components/layouts/footer.tsx`

## 設計

```
┌──────────────────────────────────────────┐
│  🍚 ごはん    │  🏪 お店    │  👤 ログイン  │  ← モバイル: 画面下に固定
└──────────────────────────────────────────┘
```

- モバイル: 画面下に固定 (`fixed inset-x-0 bottom-0`)
- デスクトップ: 通常の配置 (`md:static`)

## 実装のポイント

### SVGアイコン

```tsx
function IconBowl({ className }: { className?: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" ...>
      <path d="M4 11c0 4.5 3.6 8 8 8s8-3.5 8-8" />
      <path d="M4 11h16" />
    </svg>
  );
}
```

- SVGはHTMLの中に直接書ける。`<path d="...">` で図形を描く
- `aria-hidden` をつけると、スクリーンリーダーに無視される（装飾アイコンなので）

### usePathname

```tsx
"use client"; // ← ブラウザで動くコンポーネントに必要
import { usePathname } from "next/navigation";

const pathname = usePathname(); // 例: "/recipe"
```

- `usePathname()` で現在のURLパスを取得できる
- これを使ってアクティブなタブを判定する

### アクティブ状態の判定

```tsx
const items = [
  { href: "/recipe", label: "ごはん", match: (p: string) => p === "/recipe" || p.startsWith("/recipe/") },
  // ...
];
```

- `match` 関数で「このパスがアクティブか？」を判定
- `startsWith` を使うことでサブページ（`/recipe/123` など）でもアクティブになる

### Safe Area（iPhone対応）

```css
pb-[env(safe-area-inset-bottom)]
```

- iPhoneのホームバー（画面下の白い棒）の領域をよけるための設定
- `env(safe-area-inset-bottom)` はブラウザが自動で値を入れてくれるCSS関数

## 完了条件

- [ ] 3つのタブが表示される
- [ ] 現在のページのタブがオレンジ色になる
- [ ] タブをクリックでページ遷移する
- [ ] モバイルで画面下に固定されている
- [ ] デスクトップでは通常配置になる
