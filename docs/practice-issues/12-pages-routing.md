# Issue #12: ページ作成・ルーティング

**難易度**: ★☆☆  
**目安時間**: 15分  
**学べること**: Next.js App Router のルーティング、`redirect`

## やること

1. トップページ（`/` → `/recipe` にリダイレクト）
2. レシピページ（`/recipe`）
3. お店ページ（`/foodshop`）
4. ログインページ（`/login`）※プレースホルダー

## 対象ファイル

- `app/page.tsx`
- `app/recipe/page.tsx`
- `app/foodshop/page.tsx`
- `app/login/page.tsx`

## Next.js App Router のルーティング

```
app/
├── page.tsx           → /
├── recipe/
│   └── page.tsx       → /recipe
├── foodshop/
│   └── page.tsx       → /foodshop
└── login/
    └── page.tsx       → /login
```

- `app/` フォルダの中に `page.tsx` を置くと、そのフォルダ名がURLになる
- `page.tsx` という名前が必須（他の名前だとページとして認識されない）

## 実装のポイント

### リダイレクト（app/page.tsx）

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/recipe");
}
```

- `redirect()` はサーバーサイドで実行される
- `/` にアクセスすると自動で `/recipe` に飛ぶ

### レシピ・お店ページ

```tsx
import { RouletteApp } from "@/components/roulette";
import { recipeRouletteConfig } from "@/lib/roulette/presets";

export default function RecipePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-zinc-50 text-zinc-900">
      <RouletteApp config={recipeRouletteConfig} />
    </div>
  );
}
```

- ページコンポーネントは非常にシンプル
- 設定（config）を渡すだけで、同じ `RouletteApp` がレシピ用・お店用に切り替わる

### ログインページ（プレースホルダー）

```tsx
export default function LoginPage() {
  return <p className="p-4">ログイン</p>;
}
```

- 今は未実装なので、テキストだけ表示

## 完了条件

- [ ] `/` にアクセスすると `/recipe` にリダイレクトされる
- [ ] `/recipe` でレシピルーレットが表示される
- [ ] `/foodshop` でお店ルーレットが表示される
- [ ] `/login` でプレースホルダーが表示される
- [ ] フッターのタブでページ遷移できる
