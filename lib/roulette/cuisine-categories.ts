import type { RouletteCategory } from "@/lib/roulette/types";

/** レシピ・お店の両方で使うジャンルチップ（和食・洋食・中華・韓国） */
export const CUISINE_CATEGORIES: readonly RouletteCategory[] = [
  { id: "japanese", label: "和食", icon: "🍣" },
  { id: "western", label: "洋食", icon: "🍖" },
  { id: "chinese", label: "中華", icon: "🥟" },
  { id: "korean", label: "韓国", icon: "🌶️" },
] as const;
