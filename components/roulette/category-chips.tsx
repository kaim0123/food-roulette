import type { RouletteCategory } from "@/lib/roulette/types";

type CategoryChipsProps = {
  categories: readonly RouletteCategory[];
  selected: ReadonlySet<string>;
  onToggle: (categoryId: string) => void;
  disabled?: boolean;
  sectionLabel: string;
  ariaLabel: string;
};

export function CategoryChips({
  categories,
  selected,
  onToggle,
  disabled,
  sectionLabel,
  ariaLabel,
}: CategoryChipsProps) {
  return (
    <section className="w-full px-4" aria-label={ariaLabel}>
      <p className="mb-3 text-sm font-medium text-zinc-600">{sectionLabel}</p>
      <div className="flex flex-wrap gap-2">
        {categories.map((g) => {
          const isOn = selected.has(g.id);
          return (
            <button
              key={g.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(g.id)}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                isOn
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-800",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
            >
              <span aria-hidden>{g.icon}</span>
              {g.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
