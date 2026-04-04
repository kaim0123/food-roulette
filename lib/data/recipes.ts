import type { RouletteItem } from "@/lib/roulette/types";

export const RECIPE_ITEMS: readonly RouletteItem[] = [
  { id: "curry", name: "カレーライス", categoryId: "western", icon: "🍛" },
  { id: "nanban", name: "チキン南蛮", categoryId: "western", icon: "🍗" },
  { id: "nikujaga", name: "肉じゃが", categoryId: "japanese", icon: "🍲" },
  { id: "sushi", name: "寿司", categoryId: "japanese", icon: "🍣" },
  { id: "tempura", name: "天ぷら", categoryId: "japanese", icon: "🍤" },
  { id: "ramen", name: "ラーメン", categoryId: "chinese", icon: "🍜" },
  { id: "gyoza", name: "餃子", categoryId: "chinese", icon: "🥟" },
  { id: "mabo", name: "麻婆豆腐", categoryId: "chinese", icon: "🌶️" },
  { id: "hamburger", name: "ハンバーグ", categoryId: "western", icon: "🥩" },
  { id: "pasta", name: "パスタ", categoryId: "western", icon: "🍝" },
  { id: "pizza", name: "ピザ", categoryId: "western", icon: "🍕" },
  { id: "bibimbap", name: "ビビンバ", categoryId: "korean", icon: "🍚" },
  { id: "samgyeopsal", name: "サムギョプサル", categoryId: "korean", icon: "🥓" },
  { id: "kimchi", name: "キムチ鍋", categoryId: "korean", icon: "🍲" },
  { id: "oyakodon", name: "親子丼", categoryId: "japanese", icon: "🍚" },
  { id: "tonkatsu", name: "とんかつ", categoryId: "japanese", icon: "🐖" },
  { id: "gyudon", name: "牛丼", categoryId: "japanese", icon: "🍚" },
];
