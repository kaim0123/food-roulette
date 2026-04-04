import type { RouletteItem } from "@/lib/roulette/types";

type ResultCardProps = {
  item: RouletteItem;
  categoryLabel: string;
  leadText: string;
};

export function ResultCard({ item, categoryLabel, leadText }: ResultCardProps) {
  return (
    <div className="w-full max-w-sm px-4">
      <p className="mb-4 text-center text-lg text-zinc-700">{leadText}</p>
      <div className="rounded-2xl border-2 border-red-500 bg-white px-6 py-8 text-center shadow-sm">
        <div className="mb-2 text-4xl" aria-hidden>
          {item.icon}
        </div>
        <p className="text-2xl font-bold text-zinc-900">{item.name}</p>
        <p className="mt-2 text-sm text-zinc-500">{categoryLabel}</p>
      </div>
    </div>
  );
}
