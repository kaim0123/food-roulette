# ロードマップ

更新日: 2026-04-01

## 1. 結論（TypeScript + MySQL の再検討）

TypeScript（Node.js）でAPIを自作し、MySQLを使う前提なら、次の順でおすすめです。

### A. 最有力: Vercel + Railway（初心者向け）

- Frontend（TypeScript）: Vercel Hobby（無料）
- Backend API（TypeScript/Node）+ MySQL: Railway
- 理由:
  - TSのNode APIをそのまま載せやすい
  - MySQLを同一プロジェクトで管理しやすい
  - 学習コストと運用コストのバランスが良い
- 想定:
  - ポートフォリオ規模なら低コスト運用しやすい

### B. 次点: Render（Web Service + Private MySQL）

- Frontend: VercelまたはRender Static Site
- Backend API: Render Web Service
- MySQL: RenderのPrivate Service + Disk（自己運用寄り）
- 理由:
  - UIが分かりやすく、導入はしやすい
- 注意:
  - RenderはMySQLマネージドDB中心ではなく、運用責任が重め
  - DBバックアップはアプリ側で明示的に設計した方が安全

### C. 無料最優先: OCI Always Free

- API（TypeScript）: OCI VM上のNodeアプリ
- DB: MySQL HeatWave（Always Free枠）
- 理由:
  - 理論上の月額を最小化できる
- 注意:
  - ネットワーク/VM運用の難易度が高く、初心者には重い
  - トラブル対応の自己解決力が必要

## 2. 料金と特徴（調査メモ）

最終料金は契約前に公式ページで再確認すること（価格改定があり得る）。

- Railway:
  - 30日トライアル後、低額プラン + 従量課金の構成
  - CPU/RAM/Volumeが秒課金で、個人開発で調整しやすい
  - 公式: https://railway.app/pricing
- Render:
  - MySQLは「Private Service + Disk」での運用（マネージドMySQL前提ではない）
  - 小規模でもWebサービス料金 + Disk料金を意識する必要あり
  - 公式: https://docs.render.com/deploy-mysql
- PlanetScale:
  - MySQL互換（Vitess）で高機能だが、学習初期の最安運用よりは有料前提になりやすい
  - 公式: https://planetscale.com/pricing
- OCI Always Free:
  - Always FreeにMySQL HeatWaveが含まれる（条件あり）
  - 公式: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm

補足:
- TypeScriptとの相性（Node実行基盤の単純さ）まで含めると、現時点の第一候補は `Vercel + Railway`。

## 3. 実装方針（初心者向け）

いきなりDB接続をしない。先に「画面とロジック」を完成させる。

1. まずDBなしで完成させる（UI/抽選ロジック/画面遷移）
2. 次に擬似ログインを入れて認証フローを理解する
3. その後MySQLを導入し、データ永続化
4. 最後に本番デプロイ

## 4. 段階タスク（DBなし -> MySQL）

## Phase 0: プロジェクト土台（半日）

- [ ] 画面一覧を決める（トップ、料理ルーレット、店ルーレット、管理ログイン、管理一覧）
- [ ] ルーティングだけ先に作る（中身は空でOK）
- [ ] 共通レイアウト（ヘッダー/フッター）を作る
- [ ] 環境変数ファイルの置き場所だけ決める（まだ中身は空）

完了条件:
- ページ遷移が一通りできる

## Phase 1: DBなし版MVP（1-2日）

- [ ] ダミーデータをJSONで用意（料理と店舗を分離）
- [ ] 条件で絞り込み -> ランダム1件抽選を実装
- [ ] 候補0件時メッセージを実装
- [ ] 「もう一回回す」を実装
- [ ] 料理/店舗それぞれで同じUXになるよう調整

完了条件:
- ログインなしで2種類のルーレットが動く

## Phase 2: 擬似ログイン（0.5-1日）

- [ ] 管理画面への導線を追加
- [ ] 固定ID/パスワードでログイン判定（コード内固定）
- [ ] 未ログイン時は管理ページを見せない
- [ ] ログアウトを実装

完了条件:
- 認証フローを理解し、画面遷移で守れる状態になる

注:
- この段階は練習用。まだ本番運用しない。

## Phase 3: MySQL導入（1-2日）

- [ ] ローカルにMySQLを立てる（Docker推奨）
- [ ] スキーマ作成（admins, dishes, shops）
- [ ] マイグレーション導入（例: Prisma/TypeORM/Knexのどれか1つ）
- [ ] JSONダミーデータをDBへ移行（seed）
- [ ] ルーレットAPIをDB参照へ差し替え

完了条件:
- DB再起動後もデータが残り、抽選が動く

## Phase 4: ログイン本実装（1日）

- [ ] adminsテーブル作成（email/login_id, password_hash）
- [ ] パスワードをbcryptでハッシュ保存
- [ ] セッション認証またはHttpOnly Cookieベースで認証
- [ ] 認証ガード（管理APIを保護）
- [ ] ログイン失敗時のエラーメッセージ

完了条件:
- 平文パスワードが存在せず、管理APIが保護される

## Phase 5: 管理CRUD（1-2日）

- [ ] 料理の一覧/追加/編集/削除
- [ ] 店舗の一覧/追加/編集/削除
- [ ] is_activeで表示ON/OFF
- [ ] バリデーション（必須項目、文字数、数値範囲）

完了条件:
- 管理画面でデータ更新し、ルーレット側に反映される

## Phase 6: デプロイ（0.5-1日）

- [ ] Frontend（TS）をVercelにデプロイ
- [ ] Backend API（TS/Node）をRailwayにデプロイ
- [ ] RailwayでMySQLを作成し、`DATABASE_URL` をAPIに設定
- [ ] CORS/環境変数/接続先を本番用に設定
- [ ] 本番adminユーザーを1件作成
- [ ] 動作確認（ログイン、CRUD、抽選）

完了条件:
- URLを第三者に共有して、主要機能が安定動作する

## 5. 最初に作る最小テーブル例

### admins

- id
- login_id（or email）
- password_hash
- role
- created_at
- updated_at

### dishes

- id
- name
- genre
- course_type
- cook_time_min
- budget_yen
- is_active
- created_at
- updated_at

### shops

- id
- name
- area
- genre
- budget_range
- is_active
- created_at
- updated_at

## 6. 初心者向けの実装順序（迷ったらこれ）

1. ルーレット画面（DBなし）
2. 絞り込み + ランダム抽選
3. 擬似ログイン
4. MySQL接続 + seed
5. ログイン本実装（ハッシュ + セッション）
6. 管理CRUD
7. デプロイ

## 7. つまずきやすいポイント

- 先に認証を完璧にしようとすると進まない
- DB設計を凝りすぎると止まる（初版は列を最小限に）
- 本番用の環境変数とローカル用を混ぜると壊れる
- 「動くMVP -> 改善」の順番を守るのが最短

