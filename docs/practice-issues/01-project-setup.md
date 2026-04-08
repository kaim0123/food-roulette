# Issue #01: プロジェクト初期セットアップ

**難易度**: ★☆☆  
**目安時間**: 15分  
**学べること**: Next.js プロジェクトの作り方、ディレクトリ構成

## やること

1. Next.js のプロジェクトを作成する
2. 必要なディレクトリを作る
3. 動作確認する

## 手順

### 1. プロジェクト作成

```bash
npx create-next-app@latest food-roulette-practice \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

> **ポイント**: `--app` は App Router を使う設定。`--src-dir=false` はルートに `app/` を置く構成。

### 2. ディレクトリ構成を作る

```
food-roulette-practice/
├── app/                ← ページ（ルーティング）
│   ├── recipe/
│   ├── foodshop/
│   └── login/
├── components/         ← UIコンポーネント
│   ├── roulette/
│   ├── layouts/
│   └── ui/
├── lib/                ← ロジック・データ・型定義
│   ├── roulette/
│   └── data/
└── public/             ← 静的ファイル
```

```bash
mkdir -p components/roulette components/layouts components/ui
mkdir -p lib/roulette lib/data
mkdir -p app/recipe app/foodshop app/login
```

### 3. 動作確認

```bash
npm run dev
```

http://localhost:3000 が表示されればOK。

## 完了条件

- [ ] `npm run dev` でエラーなく起動する
- [ ] 上記のディレクトリ構成ができている
