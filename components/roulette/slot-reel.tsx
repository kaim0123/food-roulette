"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RouletteItem } from "@/lib/roulette/types";

const ROW_PX = 52;
const VISIBLE_ROWS = 3;

type SlotReelProps = {
  candidates: readonly RouletteItem[];
  spinToken: number;
  winner: RouletteItem | null;
  spinning: boolean;
  onSettled: () => void;
  emptyHint: string;
};

function buildStrip(
  candidates: readonly RouletteItem[],
  winner: RouletteItem,
  winCenterIndex: number,
): RouletteItem[] {
  const n = candidates.length;
  const total = winCenterIndex + 2 + 8;
  const strip: RouletteItem[] = [];
  for (let i = 0; i < total; i++) {
    if (i === winCenterIndex) {
      strip.push(winner);
      continue;
    }
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
  const [strip, setStrip] = useState<RouletteItem[]>([]);
  const [offsetY, setOffsetY] = useState(0);
  const [transitionMs, setTransitionMs] = useState(0);
  const settledRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
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
    const winCenterIndex = reduceMotion ? 2 : 18 + Math.floor(Math.random() * 6);
    const nextStrip = buildStrip(candidates, winner, winCenterIndex);
    setStrip(nextStrip);

    const targetY = -(winCenterIndex - 1) * ROW_PX;
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

    const t = window.setTimeout(() => {
      setTransitionMs(2600);
      setOffsetY(targetY);
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
    <div className="flex w-full flex-col items-center gap-2 px-4">
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white px-2 shadow-md ring-1 ring-zinc-100"
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
                    "flex items-center gap-2 border-b border-zinc-100 px-3 last:border-b-0",
                    isPreview && i === 1
                      ? "text-base font-semibold text-zinc-900"
                      : "text-sm font-medium text-zinc-500",
                  ].join(" ")}
                  style={{ height: ROW_PX }}
                >
                  <span className="text-lg" aria-hidden>
                    {item.icon}
                  </span>
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
      <span className="text-lg text-red-500" aria-hidden>
        ▶
      </span>
    </div>
  );
}
