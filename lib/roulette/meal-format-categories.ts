import type { RouletteCategory } from "@/lib/roulette/types";

/** 案B: 主食・食べ方のイメージで絞り込む */
export const MEAL_FORMAT_CATEGORIES: readonly RouletteCategory[] = [
  { id: "rice", label: "ご飯もの" },
  { id: "noodles", label: "麺" },
  { id: "bread", label: "パン・粉もの" },
  { id: "nabe", label: "鍋・汁物" },
  { id: "other", label: "その他" },
];
