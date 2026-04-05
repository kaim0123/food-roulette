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
  const {
    categories,
    mealFormats,
    areas,
    keywords: keywordOptions,
    items,
    copy,
    title,
  } = config;
  const useMealFormat = (mealFormats?.length ?? 0) > 0;
  const useAreas = (areas?.length ?? 0) > 0;
  const useKeywords = (keywordOptions?.length ?? 0) > 0;

  const categoryLabelById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.label])),
    [categories],
  );

  const mealFormatLabelById = useMemo(
    () =>
      mealFormats != null
        ? Object.fromEntries(mealFormats.map((m) => [m.id, m.label]))
        : {},
    [mealFormats],
  );

  const areaLabelById = useMemo(
    () =>
      areas != null
        ? Object.fromEntries(areas.map((a) => [a.id, a.label]))
        : {},
    [areas],
  );

  const keywordLabelById = useMemo(
    () =>
      keywordOptions != null
        ? Object.fromEntries(keywordOptions.map((k) => [k.id, k.label]))
        : {},
    [keywordOptions],
  );

  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(() =>
    areas != null && areas.length > 0 ? new Set(areas.map((a) => a.id)) : new Set(),
  );
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.id)),
  );
  const [selectedMealFormats, setSelectedMealFormats] = useState<Set<string>>(
    () =>
      new Set(
        mealFormats != null && mealFormats.length > 0
          ? mealFormats.map((m) => m.id)
          : [],
      ),
  );
  /** オン＝そのタグ必須（AND）。空ならキーワードでは絞らない */
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    () => new Set(),
  );
  const [phase, setPhase] = useState<Phase>("home");
  const [winner, setWinner] = useState<RouletteItem | null>(null);
  const [spinToken, setSpinToken] = useState(0);

  const candidates = useMemo(() => {
    return items.filter((item) => {
      if (!selected.has(item.categoryId)) return false;
      if (useMealFormat) {
        const mf = item.mealFormatId;
        if (mf == null) return false;
        if (!selectedMealFormats.has(mf)) return false;
      }
      if (useAreas) {
        const aid = item.areaId;
        if (aid == null || !selectedAreas.has(aid)) return false;
      }
      if (useKeywords && selectedKeywords.size > 0) {
        const tags = item.keywordIds ?? [];
        for (const kw of selectedKeywords) {
          if (!tags.includes(kw)) return false;
        }
      }
      return true;
    });
  }, [
    items,
    selected,
    selectedMealFormats,
    useMealFormat,
    useAreas,
    selectedAreas,
    useKeywords,
    selectedKeywords,
  ]);

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

  const toggleMealFormat = useCallback((id: string) => {
    setSelectedMealFormats((prev) => {
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

  const toggleArea = useCallback((id: string) => {
    setSelectedAreas((prev) => {
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

  const toggleKeyword = useCallback((id: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

  const chipsDisabled = phase === "spinning";
  const canStart = candidates.length > 0 && phase === "home";
  const canRetrySpin = candidates.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 pb-8 pt-2">
      <header className="flex w-full items-center justify-center py-1">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h1>
      </header>

      <div className="h-px w-full bg-zinc-200" aria-hidden />

      {useAreas && areas != null ? (
        <>
          <CategoryChips
            categories={areas}
            selected={selectedAreas}
            onToggle={toggleArea}
            disabled={chipsDisabled}
            sectionLabel={copy.areaSectionLabel ?? "エリアを選ぶ"}
            ariaLabel={copy.areaSectionAria ?? "エリアの選択"}
          />
          <div className="h-px w-full bg-zinc-200" aria-hidden />
        </>
      ) : null}

      <CategoryChips
        categories={categories}
        selected={selected}
        onToggle={toggleCategory}
        disabled={chipsDisabled}
        sectionLabel={copy.categorySectionLabel}
        ariaLabel={copy.categorySectionAria}
      />

      {useMealFormat && mealFormats != null ? (
        <>
          <div className="h-px w-full bg-zinc-200" aria-hidden />
          <CategoryChips
            categories={mealFormats}
            selected={selectedMealFormats}
            onToggle={toggleMealFormat}
            disabled={chipsDisabled}
            sectionLabel={copy.mealFormatSectionLabel ?? "メインの型を選ぶ"}
            ariaLabel={copy.mealFormatSectionAria ?? "メインの型の選択"}
          />
        </>
      ) : null}

      {useKeywords && keywordOptions != null ? (
        <>
          <div className="h-px w-full bg-zinc-200" aria-hidden />
          <CategoryChips
            categories={keywordOptions}
            selected={selectedKeywords}
            onToggle={toggleKeyword}
            disabled={chipsDisabled}
            sectionLabel={copy.keywordSectionLabel ?? "こだわり（任意）"}
            ariaLabel={copy.keywordSectionAria ?? "こだわりタグの選択"}
          />
        </>
      ) : null}

      <div className="h-px w-full bg-zinc-200" aria-hidden />

      {phase === "result" && winner ? (
        <ResultCard
          item={winner}
          categoryLabel={
            categoryLabelById[winner.categoryId] ?? winner.categoryId
          }
          mealFormatLabel={
            useMealFormat && winner.mealFormatId != null
              ? (mealFormatLabelById[winner.mealFormatId] ??
                winner.mealFormatId)
              : undefined
          }
          areaLabel={
            useAreas && winner.areaId != null
              ? (areaLabelById[winner.areaId] ?? winner.areaId)
              : undefined
          }
          keywordLabels={
            useKeywords &&
            winner.keywordIds != null &&
            winner.keywordIds.length > 0
              ? winner.keywordIds.map((id) => keywordLabelById[id] ?? id)
              : undefined
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
          <PrimaryActionButton
            variant="retry"
            onClick={startSpin}
            disabled={!canRetrySpin}
          />
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
