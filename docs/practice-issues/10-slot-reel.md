# Issue #10: SlotReel コンポーネント（アニメーション）

**難易度**: ★★★  
**目安時間**: 60分  
**学べること**: CSSアニメーション、`useEffect`、`useRef`、アクセシビリティ（prefers-reduced-motion）

## やること

1. スロットマシン風のリールアニメーションを作る
2. アクセシビリティ対応（モーション軽減設定への対応）

## 対象ファイル

- `components/roulette/slot-reel.tsx`

## 完成イメージ

```
  ┌───────────────────┐
  │   パスタ           │ ← 上下にフェードするオーバーレイ
  ├───────────────────┤
  │   カレーライス  ★   │ ← 中央の行 = 当選候補（回転中はスクロール）
  ├───────────────────┤
  │   ラーメン          │
  └───────────────────┘
       ↑ 3行分の窓
```

## 仕組みの全体像

```
1. ユーザーが「スタート」を押す
2. 親コンポーネントが候補からランダムに「当選者」を決める
3. buildStrip() で当選者を含むリストを作る
4. CSSの translateY でリストを上にスクロールさせる
5. 当選者が中央に来たところでアニメーション終了
6. 親に「終わったよ」と通知 → 結果カード表示に切り替わる
```

## 実装のポイント（難しい部分を詳しく解説）

### 定数

```tsx
const ROW_PX = 52;       // 1行の高さ（px）
const VISIBLE_ROWS = 3;  // 窓に見える行数
```

### buildStrip() - リールのデータを作る

```tsx
function buildStrip(
  candidates: readonly RouletteItem[],
  winner: RouletteItem,
  winCenterIndex: number,  // 当選者を何番目に置くか
): RouletteItem[] {
  const total = winCenterIndex + 2 + 8;  // 当選者の後に余白として10行分確保
  const strip: RouletteItem[] = [];
  for (let i = 0; i < total; i++) {
    if (i === winCenterIndex) {
      strip.push(winner);  // 当選者の位置に配置
    } else {
      // それ以外はランダムな候補で埋める
      strip.push(candidates[Math.floor(Math.random() * n)]!);
    }
  }
  return strip;
}
```

**考え方**: 長いリストを作って、それをCSSで上にスクロールさせる。
当選者が中央に来る位置で止める。

### アニメーションの流れ（useEffect内）

```tsx
useEffect(() => {
  // 1. 当選者の位置を決める（18〜23番目のどこか）
  const winCenterIndex = reduceMotion ? 2 : 18 + Math.floor(Math.random() * 6);
  //  └→ 18〜23: ランダムにすることで毎回スクロール量が変わり自然に見える
  //  └→ reduceMotion時は2（ほぼ動かさない）

  // 2. リールデータを作る
  const nextStrip = buildStrip(candidates, winner, winCenterIndex);

  // 3. スクロール先を計算（何ピクセル上に動かすか）
  const targetY = -(winCenterIndex - 1) * ROW_PX;
  //  └→ -1 しているのは窓の上端ではなく中央に合わせるため

  // 4. まず位置をリセット（アニメーションなし）
  setTransitionMs(0);
  setOffsetY(0);

  // 5. 次のフレームでアニメーション開始
  setTimeout(() => {
    setTransitionMs(2600);  // 2.6秒かけてスクロール
    setOffsetY(targetY);    // 目標位置まで移動
  }, 30);  // 30ms待つのはブラウザにリセットを反映させるため
}, [spinToken, ...]);
```

### CSSアニメーション

```tsx
style={{
  transform: `translateY(${offsetY}px)`,     // Y方向の移動
  transition: transitionMs > 0
    ? `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
    : "none",
}}
```

- `translateY`: 要素をY軸方向にずらす。マイナス値で上にスクロール
- `cubic-bezier(0.22, 1, 0.36, 1)`: イージング関数。最初は速く、最後はゆっくり減速する
  - これがスロットマシンの「だんだん止まる」感じを出す

### prefers-reduced-motion（アクセシビリティ）

```tsx
useEffect(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  setReduceMotion(mq.matches);
  // ...
}, []);
```

- OSの「視差効果を減らす」設定を検出する
- ONの場合はアニメーションをほぼスキップする（40msで即表示）
- アクセシビリティとして重要な配慮

### グラデーションオーバーレイ

```tsx
<div
  className="pointer-events-none absolute inset-0 z-10"
  style={{
    background: "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.92) 100%)",
  }}
/>
```

- 上端と下端を白くフェードさせて「窓」感を出す
- `pointer-events-none`: クリックを透過させる（下の要素が操作可能）

### プレビュー状態

```tsx
const preview = useMemo(() => {
  if (candidates.length === 0) return [];
  return [
    candidates[(candidates.length - 1) % candidates.length]!,
    candidates[0]!,
    candidates[1 % candidates.length]!,
  ];
}, [candidates]);
```

- スピン前に候補の最初の3件をプレビュー表示する
- 「こういうのが出ますよ」とユーザーに見せる

## 完了条件

- [ ] 3行分の窓が表示される
- [ ] スタートボタンで上方向にスクロールするアニメーションが動く
- [ ] アニメーション終了後に `onSettled` が呼ばれる
- [ ] 候補が0件のときは空メッセージが表示される
- [ ] OSの「視差効果を減らす」設定に対応している
- [ ] 上下に白いグラデーションがかかっている
