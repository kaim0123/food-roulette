import { RECIPE_ITEMS } from "@/lib/data/recipes";
import { SHOP_ITEMS } from "@/lib/data/shops";
import { CUISINE_CATEGORIES } from "@/lib/roulette/cuisine-categories";
import type { RouletteAppConfig } from "@/lib/roulette/types";

export const recipeRouletteConfig: RouletteAppConfig = {
  title: "晩ごはんスロット",
  titleEmoji: "🍴",
  categories: CUISINE_CATEGORIES,
  items: RECIPE_ITEMS,
  copy: {
    categorySectionLabel: "ジャンルを選ぶ",
    categorySectionAria: "レシピのジャンル選択",
    emptyReelText: "ジャンルを選ぶと\nメニューが表示されます",
    resultLead: "今日の晩ごはんは…",
    footerIdle: "ジャンルを選んでスタート！",
    footerResult: "納得いかなければもう一度回そう",
  },
};

export const shopRouletteConfig: RouletteAppConfig = {
  title: "お店スロット",
  titleEmoji: "🏪",
  categories: CUISINE_CATEGORIES,
  items: SHOP_ITEMS,
  copy: {
    categorySectionLabel: "ジャンルを選ぶ",
    categorySectionAria: "お店のジャンル選択",
    emptyReelText: "ジャンルを選ぶと\nお店が表示されます",
    resultLead: "今日のお店は…",
    footerIdle: "ジャンルを選んでスタート！",
    footerResult: "気に入らなければもう一度回そう",
  },
};
