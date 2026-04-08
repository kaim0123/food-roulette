"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RouletteItem } from "@/lib/roulette/types";

/** 1行（1候補）の高さ（px）。スクロール量の計算に使う */
const ROW_PX = 52;
/** リールの窓に同時に見える行数。3行 = 上・中央・下 */
const VISIBLE_ROWS = 3;

type SlotReelProps = {
  candidates: readonly RouletteItem[];
  spinToken: number;
  winner: RouletteItem | null;
  spinning: boolean;
  onSettled: () => void;
  emptyHint: string;
};

/**
 * スロットリールに流す候補リスト（ストリップ）を生成する。
 *
 * 仕組み:
 *   - winCenterIndex の位置に当選者を配置
 *   - それ以外はランダムな候補で埋める
 *   - 当選者の後ろに余白（+2 +8）を置くことで、止まった後にも下に要素が見える
 *
 * @param candidates - フィルタ済みの候補一覧
 * @param winner - 当選者（事前にランダム選出済み）
 * @param winCenterIndex - 当選者をストリップの何番目に置くか
 */
function buildStrip(
  candidates: readonly RouletteItem[],
  winner: RouletteItem,
  winCenterIndex: number,
): RouletteItem[] {
  const n = candidates.length;
  // 当選者の位置 + 下に見える2行 + 余裕の8行 = リール全体の長さ
  const total = winCenterIndex + 2 + 8;
  const strip: RouletteItem[] = [];
  for (let i = 0; i < total; i++) {
    if (i === winCenterIndex) {
      strip.push(winner);
      continue;
    }
    // 当選者以外の位置にはランダムな候補を配置（見た目の演出用）
    strip.push(candidates[Math.floor(Math.random() * n)]!);
  }
  strip[winCenterIndex] = winner;
  return strip;
}

export function SlotReel({
  candidates,
  spinToken,
  winner,
  spinning,
  onSettled,
  emptyHint,
}: SlotReelProps) {
  const [strip, setStrip] = useState<RouletteItem[]>([]);       // リールに表示する候補リスト
  const [offsetY, setOffsetY] = useState(0);                    // CSSのtranslateYに渡す値（px）
  const [transitionMs, setTransitionMs] = useState(0);          // CSSトランジションの時間（ms）。0=アニメなし
  const settledRef = useRef(false);                              // アニメ終了済みかどうか（二重通知防止用）
  const [reduceMotion, setReduceMotion] = useState(false);      // OS の「視差効果を減らす」設定

  // OS の「視差効果を減らす」設定を監視するエフェクト
  // macOS: システム環境設定 → アクセシビリティ → ディスプレイ → 視差効果を減らす
  // iOS: 設定 → アクセシビリティ → 動作 → 視差効果を減らす
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler); // クリーンアップ（メモリリーク防止）
  }, []);

  const preview = useMemo(() => {
    if (candidates.length === 0) return [];
    return [
      candidates[(candidates.length - 1) % candidates.length]!,
      candidates[0]!,
      candidates[1 % candidates.length]!,
    ];
  }, [candidates]);

  useEffect(() => {
    if (!spinning || !winner || candidates.length === 0) return;

    settledRef.current = false;

    // 当選者をストリップの何番目に置くか。18〜23の間でランダム化することで
    // 毎回スクロール量が微妙に変わり、自然な演出になる
    const MIN_WIN_INDEX = 18;
    const WIN_INDEX_RANGE = 6;
    const winCenterIndex = reduceMotion ? 2 : MIN_WIN_INDEX + Math.floor(Math.random() * WIN_INDEX_RANGE);
    const nextStrip = buildStrip(candidates, winner, winCenterIndex);
    setStrip(nextStrip);

    // 当選者がリール窓の中央に来るスクロール量を計算
    // -1 は「窓の1行目＝上端」ではなく「窓の2行目＝中央」に合わせるため
    const targetY = -(winCenterIndex - 1) * ROW_PX;

    // まず位置をリセット（アニメーションなしで先頭に戻す）
    setTransitionMs(0);
    setOffsetY(0);

    if (reduceMotion) {
      const t = window.setTimeout(() => {
        setOffsetY(targetY);
        settledRef.current = true;
        onSettled();
      }, 40);
      return () => window.clearTimeout(t);
    }

    // 30ms の遅延は、上の setOffsetY(0) がブラウザに反映されるのを待つため。
    // これがないと「リセット→移動」が1フレームで処理され、アニメーションが見えない
    const t = window.setTimeout(() => {
      setTransitionMs(2600); // 2.6秒かけてスクロール
      setOffsetY(targetY);   // 目標位置まで移動開始 → CSSトランジションが発火
    }, 30);

    return () => window.clearTimeout(t);
  }, [spinToken, spinning, winner, candidates, reduceMotion, onSettled]);

  const handleTransitionEnd = () => {
    if (!spinning || settledRef.current) return;
    settledRef.current = true;
    onSettled();
  };

  const rows = strip.length > 0 ? strip : preview;
  const showEmpty = candidates.length === 0;
  const isPreview = strip.length === 0 && !showEmpty;

  return (
    <div className="w-full px-4">
      <div
        className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-white px-2 shadow-md ring-1 ring-zinc-100"
        style={{ height: ROW_PX * VISIBLE_ROWS }}
      >
        {showEmpty ? (
          <p className="flex h-full items-center justify-center whitespace-pre-line text-center text-sm text-zinc-400">
            {emptyHint}
          </p>
        ) : (
          <>
            <div
              className="will-change-transform"
              style={{
                transform: `translateY(${offsetY}px)`,
                transition:
                  transitionMs > 0
                    ? `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
                    : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {rows.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className={[
                    "flex items-center border-b border-zinc-100 px-3 last:border-b-0",
                    isPreview && i === 1
                      ? "text-base font-semibold text-zinc-900"
                      : "text-sm font-medium text-zinc-500",
                  ].join(" ")}
                  style={{ height: ROW_PX }}
                >
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white via-transparent to-white"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.92) 100%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y border-zinc-200/60"
              style={{ height: ROW_PX }}
              aria-hidden
            />
          </>
        )}
      </div>
    </div>
  );
}
