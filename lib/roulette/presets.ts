import { RECIPE_ITEMS } from "@/lib/data/recipes";
import { SHOP_ITEMS } from "@/lib/data/shops";
import { SHOP_AREAS } from "@/lib/roulette/areas";
import { CUISINE_CATEGORIES } from "@/lib/roulette/cuisine-categories";
import { MEAL_FORMAT_CATEGORIES } from "@/lib/roulette/meal-format-categories";
import { RECIPE_KEYWORDS } from "@/lib/roulette/recipe-keywords";
import { SHOP_KEYWORDS } from "@/lib/roulette/shop-keywords";
import type { RouletteAppConfig } from "@/lib/roulette/types";

export const recipeRouletteConfig: RouletteAppConfig = {
  title: "晩ごはんスロット",
  categories: CUISINE_CATEGORIES,
  mealFormats: MEAL_FORMAT_CATEGORIES,
  keywords: RECIPE_KEYWORDS,
  items: RECIPE_ITEMS,
  copy: {
    categorySectionLabel: "ジャンルを選ぶ",
    categorySectionAria: "レシピのジャンル選択",
    mealFormatSectionLabel: "メインの型を選ぶ",
    mealFormatSectionAria: "レシピのメインの型の選択",
    keywordSectionLabel: "こだわり（任意・複数選択はすべて満たすレシピ）",
    keywordSectionAria: "レシピのこだわりタグ選択",
    emptyReelText:
      "条件に合うレシピがありません。\nジャンル・メインの型・こだわりを変えてみてください",
    resultLead: "今日の晩ごはんは…",
    footerIdle: "条件を選んでスタート！",
    footerResult: "納得いかなければもう一度回そう",
  },
};

export const shopRouletteConfig: RouletteAppConfig = {
  title: "お店スロット",
  areas: SHOP_AREAS,
  categories: CUISINE_CATEGORIES,
  keywords: SHOP_KEYWORDS,
  items: SHOP_ITEMS,
  copy: {
    areaSectionLabel: "エリアを選ぶ",
    areaSectionAria: "お店のエリア選択",
    categorySectionLabel: "ジャンルを選ぶ",
    categorySectionAria: "お店のジャンル選択",
    keywordSectionLabel: "こだわり（任意・複数選択はすべて満たす店）",
    keywordSectionAria: "お店のこだわりタグ選択",
    emptyReelText: "条件に合うお店がありません。\nエリア・ジャンル・こだわりを変えてみてください",
    resultLead: "今日のお店は…",
    footerIdle: "条件を選んでスタート！",
    footerResult: "気に入らなければもう一度回そう",
  },
};
