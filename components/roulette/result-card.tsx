import type { RouletteItem } from "@/lib/roulette/types";

type ResultCardProps = {
  item: RouletteItem;
  categoryLabel: string;
  /** メインの型（案B）。未使用の設定では省略 */
  mealFormatLabel?: string;
  /** エリア（お店スロット） */
  areaLabel?: string;
  /** こだわりタグの表示用ラベル */
  keywordLabels?: readonly string[];
  leadText: string;
};

export function ResultCard({
  item,
  categoryLabel,
  mealFormatLabel,
  areaLabel,
  keywordLabels,
  leadText,
}: ResultCardProps) {
  const parts: string[] = [categoryLabel];
  if (mealFormatLabel != null && mealFormatLabel !== "") {
    parts.push(mealFormatLabel);
  }
  if (areaLabel != null && areaLabel !== "") {
    parts.push(areaLabel);
  }
  const meta = parts.join(" · ");
  const keywordLine =
    keywordLabels != null && keywordLabels.length > 0
      ? keywordLabels.join(" · ")
      : null;

  return (
    <div className="mx-auto w-full max-w-sm px-4">
      <p className="mb-4 text-center text-lg text-zinc-700">{leadText}</p>
      <div className="rounded-2xl border-2 border-red-500 bg-white px-6 py-8 text-center shadow-sm">
        <p className="text-2xl font-bold text-zinc-900">{item.name}</p>
        <p className="mt-2 text-sm text-zinc-500">{meta}</p>
        {keywordLine != null ? (
          <p className="mt-1 text-xs text-zinc-400">{keywordLine}</p>
        ) : null}
      </div>
    </div>
  );
}
