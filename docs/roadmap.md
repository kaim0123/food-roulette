# ロードマップ

更新日: 2026-04-08

## 0. 製品の方向性（将来像と学習方針）

- **将来像**:
  - Google アカウントでログインし、**自分専用のルーレット用データ**（料理・店など）を登録・管理できる。
  - 個人の候補から **「みんなと共有」** を選ぶと**申請状態**になり、**管理者（あなた）が承認**したものだけが、**ログインしていないユーザー向けの「みんなのルーレット」**の候補に混ざる（未承認は匿名ユーザーには出さない）。
- **2 つの抽選の読み分け（実装で押さえること）**:
  - **未ログイン**: 「公開プール」だけを参照（管理者が直接入れたデータ ＋ 承認済みのユーザー投稿）。
  - **ログイン済み**: まずは**自分のプライベート候補**だけを参照（共有の有無は別）。必要なら後から「公開プールも混ぜる」など拡張可能。
- **学習方針（ポートフォリオ）**: サインイン・ログインまわりは、**可能な限り自前のスクリプトで実装する**（OAuth 2.0 のリダイレクト、認可コード交換、セッションや HttpOnly Cookie、ID トークンの検証などを自分で組み立てる）。  
  - 目的は「動くだけ」より**フローを理解できること**。Auth 専用 BaaS に認証を丸投げする構成は、比較メモとしては残すが、**このプロジェクトの主路線ではない**。

初版の MVP では「単一管理者・**全員が見る共通データ**」から入り、その後 **ユーザー別データ** と **Google ログイン**、最後に **共有申請 → 管理者承認 → 公開プール** の順が安全（承認フローは権限モデルがはっきりしてからの方が実装しやすい）。

---

## 1. 結論（TypeScript + MySQL の再検討）

TypeScript（Node.js）で API を自作し、RDB を使う前提なら、次の順でおすすめです。

### A. 最有力: Vercel + Railway（初心者向け）

- Frontend（TypeScript）: Vercel Hobby（無料）
- Backend API（TypeScript/Node）+ DB: Railway（MySQL または PostgreSQL）
- 理由:
  - TS の Node API をそのまま載せやすい
  - DB を同一プロジェクトで管理しやすい
  - 学習コストと運用コストのバランスが良い
  - Next のプレビューデプロイやエッジ周りは Vercel が扱いやすい
- 想定:
  - ポートフォリオ規模なら低コスト運用しやすい

### A'. 代替: Railway のみ（フロント + API + DB）

- Frontend（Next.js など）も **Railway 上のサービスとしてデプロイ**できる（例: `output: 'standalone'` + `next start`）。静的エクスポートなら別構成も可。
- メリット: **請求・プロジェクトが一箇所**、デプロイの学習対象が Railway に集約される。
- デメリット: PR ごとのプレビューや CDN 最適化は Vercel ほど手厚くないことが多い。
- **DB の種類**: Railway では **MySQL と PostgreSQL で単価は変わらない**（RAM / CPU / ボリューム / 転送の従量が同じ考え方）。選び方は「チームや教材が MySQL なら MySQL」「エコシステムやテンプレの多さを取るなら PostgreSQL」が実務的。

### B. 次点: Render（Web Service + Private MySQL）

- Frontend: Vercel または Render Static Site
- Backend API: Render Web Service
- MySQL: Render の Private Service + Disk（自己運用寄り）
- 理由:
  - UI が分かりやすく、導入はしやすい
- 注意:
  - Render は MySQL マネージド DB 中心ではなく、運用責任が重め
  - DB バックアップはアプリ側で明示的に設計した方が安全

### C. 無料最優先: OCI Always Free

- API（TypeScript）: OCI VM 上の Node アプリ
- DB: MySQL HeatWave（Always Free 枠）
- 理由:
  - 理論上の月額を最小化できる
- 注意:
  - ネットワーク/VM 運用の難易度が高く、初心者には重い
  - トラブル対応の自己解決力が必要

### D. 比較メモ: Supabase（バックエンド寄りの別路線）

- **PostgreSQL 前提**（MySQL の置き換えにはならない）。Auth・Storage・Realtime が一体の BaaS。
- 料金は無料枠から始めやすく、小規模なら Railway の Hobby（月額サブスク + 利用枠）とトレードオフで比較する。
- **このロードマップとの関係**: データ保存と認証を早く揃えたい場合の選択肢。**ただし上記の学習方針（ログイン処理を自前で書く）とは優先が逆になりやすい**ので、「比較・副次」として知っておく程度でよい。

---

## 2. 料金と特徴（調査メモ）

最終料金は契約前に公式ページで再確認すること（価格改定があり得る）。

- Railway:
  - Free は月あたりの無料クレジットあり（小規模検証向け）。Hobby は **月 $5 のサブスク + 同額分までのリソース利用が枠に含まれる**イメージで、超過分は従量。CPU/RAM/Volume は使った分に応じて課金。
  - MySQL / PostgreSQL で**別料金プランはない**（消費リソースで決まる）。
  - 公式: https://railway.com/pricing / https://docs.railway.com/reference/pricing/plans
- Render:
  - MySQL は「Private Service + Disk」での運用（マネージド MySQL 前提ではない）
  - 小規模でも Web サービス料金 + Disk 料金を意識する必要あり
  - 公式: https://docs.render.com/deploy-mysql
- PlanetScale:
  - MySQL 互換（Vitess）で高機能だが、学習初期の最安運用よりは有料前提になりやすい
  - 公式: https://planetscale.com/pricing
- Supabase:
  - Postgres + 周辺機能。無料枠・Pro は公式で確認
  - 公式: https://supabase.com/pricing
- OCI Always Free:
  - Always Free に MySQL HeatWave が含まれる（条件あり）
  - 公式: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm

補足:

- TypeScript との相性（Node 実行基盤の単純さ）まで含めると、現時点の第一候補は **`Vercel + Railway`**。請求を一本化したい場合は **`Railway のみ`** も十分現実的。

---

## 3. 実装方針（初心者向け）

いきなり DB 接続をしない。先に「画面とロジック」を完成させる。

1. まず DB なしで完成させる（UI/抽選ロジック/画面遷移）
2. 次に擬似ログインを入れて認証フローを理解する
3. その後 MySQL を導入し、データ永続化
4. メール/ID + パスワードの本番相当ログイン（ハッシュ・セッション）を**自前で**組む
5. 管理 CRUD、デプロイ
6. **将来**: ユーザー別データ + **Google OAuth（自前）**
7. **その次**: 共有申請・管理者承認・公開プール（未ログイン抽選）

認証は「ライブラリに全部任せる」のではなく、**HTTP の流れとトークン/セッションの持ち方**が説明できるところまでをゴールにする（必要最小限のライブラリ利用は可）。

---

## 3.1 フェーズ全体像（再検討後）

| 段階 | 内容 |
| --- | --- |
| Phase 0–2 | 画面・ルーレット・擬似ログイン（DB なし） |
| Phase 3–5 | 共通 DB・管理者ログイン・管理 CRUD（**この時点のデータ = 未ログイン向けの土台**） |
| Phase 6 | デプロイ |
| Phase 7 | Google ログイン・**ユーザーごとのプライベート**候補 |
| Phase 8 | 「みんなと共有」申請・**管理者承認**・公開プールへ反映・未ログイン抽選のクエリ整理 |

**順序をこうした理由**: 承認キューと「誰が匿名に見せていいか」は、**管理者ロール**と **user_id 付き行**が既にあると実装・テストがしやすい。先に共有だけ作ると、所有権とクエリが曖昧になりやすい。

---

## 4. 段階タスク（DB なし -> MySQL -> デプロイ -> Google -> 共有承認）

## Phase 0: プロジェクト土台（半日）

- [ ] 画面一覧を決める（トップ、料理ルーレット、店ルーレット、管理ログイン、管理一覧。将来は「共有申請一覧（管理者）」も追加）
- [ ] ルーティングだけ先に作る（中身は空で OK）
- [ ] 共通レイアウト（ヘッダー/フッター）を作る
- [ ] 環境変数ファイルの置き場所だけ決める（まだ中身は空）

完了条件:

- ページ遷移が一通りできる

## Phase 1: DB なし版 MVP（1-2 日）

- [ ] ダミーデータを JSON で用意（料理と店舗を分離）
- [ ] 条件で絞り込み -> ランダム 1 件抽選を実装
- [ ] 候補 0 件時メッセージを実装
- [ ] 「もう一回回す」を実装
- [ ] 料理/店舗それぞれで同じ UX になるよう調整

完了条件:

- ログインなしで 2 種類のルーレットが動く

## Phase 2: 擬似ログイン（0.5-1 日）

- [ ] 管理画面への導線を追加
- [ ] 固定 ID/パスワードでログイン判定（コード内固定）
- [ ] 未ログイン時は管理ページを見せない
- [ ] ログアウトを実装

完了条件:

- 認証フローを理解し、画面遷移で守れる状態になる

注:

- この段階は練習用。まだ本番運用しない。

## Phase 3: MySQL 導入（1-2 日）

- [ ] ローカルに MySQL を立てる（Docker 推奨）
- [ ] スキーマ作成（初版は `admins`, `dishes`, `shops`。行は **プラットフォーム共通**＝未ログインでも使う想定。将来の `users` / `user_id` / 共有用カラムは設計メモだけでもよい）
- [ ] マイグレーション導入（例: Prisma/TypeORM/Knex のどれか 1 つ）
- [ ] JSON ダミーデータを DB へ移行（seed）
- [ ] ルーレット API を DB 参照へ差し替え

完了条件:

- DB 再起動後もデータが残り、抽選が動く

## Phase 4: ログイン本実装（1 日）

- [ ] admins テーブル利用（email/login_id, password_hash）
- [ ] パスワードを bcrypt でハッシュ保存
- [ ] セッション認証または HttpOnly Cookie ベースで認証（**自前のルートとミドルウェアで守る**）
- [ ] 認証ガード（管理 API を保護）
- [ ] ログイン失敗時のエラーメッセージ

完了条件:

- 平文パスワードが存在せず、管理 API が保護される

## Phase 5: 管理 CRUD（1-2 日）

- [ ] 料理の一覧/追加/編集/削除
- [ ] 店舗の一覧/追加/編集/削除
- [ ] is_active で表示 ON/OFF
- [ ] バリデーション（必須項目、文字数、数値範囲）

完了条件:

- 管理画面でデータ更新し、ルーレット側に反映される

## Phase 6: デプロイ（0.5-1 日）

- [ ] Frontend を **Vercel** にデプロイ（第一候補）**または** Frontend + API を **Railway のみ**でデプロイ
- [ ] Backend API（TS/Node）を Railway にデプロイ（Vercel 分割の場合）
- [ ] Railway で DB（MySQL または PostgreSQL）を作成し、`DATABASE_URL` を API に設定
- [ ] CORS/環境変数/接続先を本番用に設定
- [ ] 本番 admin ユーザーを 1 件作成
- [ ] 動作確認（ログイン、CRUD、抽選）

完了条件:

- URL を第三者に共有して、主要機能が安定動作する

## Phase 7: ユーザー別データ + Google ログイン（将来・学習重点）

**スコープを「プライベートのみ」に絞る。** 公開への混ぜ込みは Phase 8 で行う。

- [ ] `users` テーブル（Google の subject、表示名、メールなど必要最小限）
- [ ] `dishes` / `shops` に `user_id`（または同等の外部キー）を追加。`user_id IS NULL` は **Phase 3–5 のプラットフォーム共通行**（未ログイン抽選のベース）として残す
- [ ] ログイン中ユーザー向け API は **`user_id = 自分` の行だけ** CRUD・抽選（他ユーザーの行に触れない）
- [ ] Google OAuth 2.0（認可 URL 生成、コールバック、認可コード -> トークン交換、**自前で**セッションに紐づける）
- [ ] 管理者用ログイン（`admins`）は**承認 UI 用に残す**（Phase 8 で必須）
- [ ] 本番の OAuth クライアント ID/シークレット・リダイレクト URI を環境変数で管理

完了条件:

- Google でログインしたユーザー A と B で、それぞれ**自分の**候補だけが登録・抽選できる
- 未ログインの抽選は、引き続き **`user_id IS NULL` の共通行**のみ（ユーザー投稿はまだ混ぜない）

## Phase 8: 「みんなと共有」申請・管理者承認・公開プール（将来）

- [ ] `dishes` / `shops` に共有用の状態を追加（例: `share_status`: `private` | `pending` | `rejected` | `public`、および `share_requested_at`, `share_reviewed_at`, `share_reviewed_by_admin_id` など。**設計は好みでよいが「申請中 / 承認 / 却下」が分かること**）
- [ ] ログインユーザー向け UI: 自分の行に対して **「みんなと共有を申請」**（`pending` へ）。取り下げ・再申請の方針を決める
- [ ] 管理者画面: **承認待ち一覧**、**承認**（`public`）・**却下**（`rejected` + 理由任意）。**admin セッション必須**
- [ ] **未ログイン向け抽選 API**: `user_id IS NULL` の共通行 **または** `share_status = public` かつ `is_active` の行、のようにクエリを定義し直す
- [ ] ログイン済み抽選が「自分のみ / 公開も混ぜる」のどちらにするか決め、API を分けるかクエリを切り替える

完了条件:

- ユーザーが申請 → 管理者が承認した候補だけが、**ログインなしのルーレット**に出る
- 申請中・却下は匿名に出ない

---

## 5. 最初に作る最小テーブル例

### admins（Phase 3-5: 単一管理者・学習用）

- id
- login_id（or email）
- password_hash
- role
- created_at
- updated_at

### users（Phase 7: Google 連携・ユーザー別データ）

- id（内部 ID）
- google_sub（Google の `sub`、一意制約）
- email（任意・表示用）
- display_name（任意）
- created_at
- updated_at

### dishes

- id
- **user_id**（Phase 7 で追加。`NULL` = プラットフォーム共通＝未ログイン向けのベースデータ）
- name
- genre
- course_type
- cook_time_min
- budget_yen
- is_active
- **share_status**（Phase 8。ユーザー行のみ意味を持つ例: `private` / `pending` / `rejected` / `public`）
- **share_requested_at**, **share_reviewed_at**, **share_reviewed_by_admin_id**（Phase 8・必要に応じて）
- created_at
- updated_at

### shops

- id
- **user_id**（`dishes` と同じ考え方）
- name
- area
- genre
- budget_range
- is_active
- **share_status** ほか（`dishes` と揃える）
- created_at
- updated_at

---

## 6. 初心者向けの実装順序（迷ったらこれ）

1. ルーレット画面（DB なし）
2. 絞り込み + ランダム抽選
3. 擬似ログイン
4. MySQL 接続 + seed（共通行 = 未ログインの土台）
5. ログイン本実装（ハッシュ + セッション、**自前のガード**）
6. 管理 CRUD
7. デプロイ（Vercel + Railway または Railway のみ）
8. ユーザー別スキーマ + Google OAuth（**自前フロー**・プライベート抽選まで）
9. 共有申請・管理者承認・**未ログイン抽選クエリ**の更新（Phase 8）

---

## 7. つまずきやすいポイント

- 先に認証を完璧にしようとすると進まない
- DB 設計を凝りすぎると止まる（初版は列を最小限に）
- 本番用の環境変数とローカル用を混ぜると壊れる
- 「動く MVP -> 改善」の順番を守るのが最短
- Google ログインは OAuth の仕様理解が重い。**Phase 7 は Phase 6 が安定してから**にするとよい
- **公開プール**は「誰が見えるか」の境界なので、**Phase 8 まで未ログイン API をシンプルに保つ**（Phase 7 ではユーザー投稿を匿名に混ぜない）とバグが減る
- 承認後に**元行を `public` にする**か**公開用コピーを作る**かはトレードオフ（コピーは同期が面倒、フラグ 1 本はクエリが楽）。初版は **同一行に `share_status`** が扱いやすいことが多い
