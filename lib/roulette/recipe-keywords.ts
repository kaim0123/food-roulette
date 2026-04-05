import type { RouletteCategory } from "@/lib/roulette/types";

/** レシピのこだわり（食事制限・調理のしやすさなど。複数付与可） */
export const RECIPE_KEYWORDS: readonly RouletteCategory[] = [
  { id: "vegan", label: "ビーガン" },
  { id: "vegetarian", label: "ベジタリアン" },
  { id: "gluten_free", label: "グルテンフリー" },
  { id: "one_pan", label: "フライパン1つ" },
  { id: "quick", label: "手早い（15分目安）" },
  { id: "spicy", label: "辛め" },
  { id: "light", label: "さっぱり" },
];
