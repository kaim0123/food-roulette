"use client";

import { useCallback, useMemo, useState } from "react";
import { CategoryChips } from "@/components/roulette/category-chips";
import { PrimaryActionButton } from "@/components/roulette/primary-action-button";
import { ResultCard } from "@/components/roulette/result-card";
import { SlotReel } from "@/components/roulette/slot-reel";
import type { RouletteAppConfig, RouletteItem } from "@/lib/roulette/types";

type Phase = "home" | "spinning" | "result";

type RouletteAppProps = {
  config: RouletteAppConfig;
};

export function RouletteApp({ config }: RouletteAppProps) {
  const { categories, items, copy, title, titleEmoji } = config;

  const categoryLabelById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.label])),
    [categories],
  );

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.id)),
  );
  const [phase, setPhase] = useState<Phase>("home");
  const [winner, setWinner] = useState<RouletteItem | null>(null);
  const [spinToken, setSpinToken] = useState(0);

  const candidates = useMemo(
    () => items.filter((item) => selected.has(item.categoryId)),
    [items, selected],
  );

  const toggleCategory = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 1) return prev;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const startSpin = useCallback(() => {
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)]!;
    setWinner(pick);
    setSpinToken((t) => t + 1);
    setPhase("spinning");
  }, [candidates]);

  const onReelSettled = useCallback(() => {
    setPhase("result");
  }, []);

  const retry = useCallback(() => {
    setPhase("home");
    setWinner(null);
  }, []);

  const chipsDisabled = phase === "spinning";
  const canStart = candidates.length > 0 && phase === "home";

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 pb-8 pt-2">
      <header className="flex w-full items-center justify-center gap-2 py-1">
        {titleEmoji ? (
          <span className="text-2xl" aria-hidden>
            {titleEmoji}
          </span>
        ) : null}
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h1>
      </header>

      <div className="h-px w-full bg-zinc-200" aria-hidden />

      <CategoryChips
        categories={categories}
        selected={selected}
        onToggle={toggleCategory}
        disabled={chipsDisabled}
        sectionLabel={copy.categorySectionLabel}
        ariaLabel={copy.categorySectionAria}
      />

      <div className="h-px w-full bg-zinc-200" aria-hidden />

      {phase === "result" && winner ? (
        <ResultCard
          item={winner}
          categoryLabel={
            categoryLabelById[winner.categoryId] ?? winner.categoryId
          }
          leadText={copy.resultLead}
        />
      ) : (
        <SlotReel
          candidates={candidates}
          spinToken={spinToken}
          winner={winner}
          spinning={phase === "spinning"}
          onSettled={onReelSettled}
          emptyHint={copy.emptyReelText}
        />
      )}

      <div className="flex flex-col items-center gap-3 px-4">
        {phase === "result" ? (
          <PrimaryActionButton variant="retry" onClick={retry} />
        ) : (
          <PrimaryActionButton
            variant="start"
            onClick={startSpin}
            disabled={!canStart}
          />
        )}
        <p className="text-center text-xs text-zinc-500">
          {phase === "result" ? copy.footerResult : copy.footerIdle}
        </p>
      </div>
    </div>
  );
}
