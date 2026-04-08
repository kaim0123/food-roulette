# Issue #11: RouletteApp コンポーネント（メインロジック）

**難易度**: ★★★  
**目安時間**: 60分  
**学べること**: 複数の state 管理、useMemo でのフィルタリング、useCallback、Set の操作

## やること

1. 全てのコンポーネントを組み合わせてルーレットアプリのメインロジックを作る

## 対象ファイル

- `components/roulette/roulette-app.tsx`

## 画面の状態遷移（Phase）

```
  home（初期状態）
    │
    │ スタートボタン押下
    ▼
  spinning（回転中）
    │
    │ アニメーション終了（onSettled）
    ▼
  result（結果表示）
    │
    │ もう一回ボタン押下
    ▼
  spinning → result → ...（繰り返し）
```

## 実装のポイント（難しい部分を詳しく解説）

### State の全体像

```tsx
// --- フィルター状態 ---
const [selected, setSelected] = useState<Set<string>>();         // ジャンル
const [selectedMealFormats, setSelectedMealFormats] = useState<Set<string>>(); // メインの型
const [selectedAreas, setSelectedAreas] = useState<Set<string>>();  // エリア
const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(); // こだわり

// --- アプリ状態 ---
const [phase, setPhase] = useState<Phase>("home");     // 画面の状態
const [winner, setWinner] = useState<RouletteItem | null>(null);  // 当選者
const [spinToken, setSpinToken] = useState(0);         // スピン回数（useEffectのトリガー用）
```

- `Set<string>` を使うのは、`has()` で O(1)（一瞬）で存在確認できるため
  - 配列の `includes()` は O(n) で遅い
- `spinToken` は値自体に意味はなく、インクリメントすることで SlotReel の useEffect を再実行させるためのもの

### ラベル逆引きマップ

```tsx
const categoryLabelById = useMemo(
  () => Object.fromEntries(categories.map((c) => [c.id, c.label])),
  [categories],
);
// { "japanese": "和食", "western": "洋食", ... }
```

- `Object.fromEntries` で `[key, value]` の配列をオブジェクトに変換
- IDからラベルを引くときに使う（結果カードの表示用）
- `useMemo` でキャッシュして毎回計算しないようにする

### フィルタリングロジック（candidates）

```tsx
const candidates = useMemo(() => {
  return items.filter((item) => {
    // 1. ジャンルチェック: 選択中のジャンルに含まれるか？
    if (!selected.has(item.categoryId)) return false;

    // 2. メインの型チェック（レシピのみ）
    if (useMealFormat) {
      if (item.mealFormatId == null) return false;
      if (!selectedMealFormats.has(item.mealFormatId)) return false;
    }

    // 3. エリアチェック（お店のみ）
    if (useAreas) {
      if (item.areaId == null || !selectedAreas.has(item.areaId)) return false;
    }

    // 4. キーワードチェック（AND条件: 選択した全タグを持つもののみ）
    if (useKeywords && selectedKeywords.size > 0) {
      const tags = item.keywordIds ?? [];
      for (const kw of selectedKeywords) {
        if (!tags.includes(kw)) return false;  // 1つでも欠けたらNG
      }
    }

    return true;
  });
}, [/* 依存配列 */]);
```

- AND条件: 「辛め」AND「フライパン1つ」を選んだら、両方持つレシピだけ残る
- OR条件にすると候補が多すぎるため、ANDの方がユーザー体験が良い

### トグル処理（最低1つは残す）

```tsx
const toggleCategory = useCallback((id: string) => {
  setSelected((prev) => {
    const next = new Set(prev);       // Set をコピー（イミュータブルに更新）
    if (next.has(id)) {
      if (next.size <= 1) return prev; // ← 最後の1つは解除させない
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
}, []);
```

- 全カテゴリを解除すると候補が0件になってしまうので、最低1つは残す
- `useCallback` でメモ化（再描画のたびに関数を作り直さない）
- キーワードだけは0個でもOK（任意フィルターなので）

### スピン開始

```tsx
const startSpin = useCallback(() => {
  if (candidates.length === 0) return;
  const pick = candidates[Math.floor(Math.random() * candidates.length)]!;
  setWinner(pick);
  setSpinToken((t) => t + 1);  // ← これが変わると SlotReel の useEffect が発火
  setPhase("spinning");
}, [candidates]);
```

- ランダム選出はここで行う（アニメーション開始前に当選者が決まっている）

### 条件付きレンダリング

```tsx
{phase === "result" && winner ? (
  <ResultCard ... />       // 結果表示フェーズ: カードを表示
) : (
  <SlotReel ... />         // それ以外: リールを表示
)}
```

- phase に応じて「リール」と「結果カード」を切り替える

## 完了条件

- [ ] カテゴリチップでフィルタリングできる
- [ ] スタートボタンでルーレットが回る
- [ ] 結果が表示される
- [ ] 「もう一回」で再スピンできる
- [ ] 候補が0件のときスタートボタンが無効になる
- [ ] 回転中はチップが操作できない
