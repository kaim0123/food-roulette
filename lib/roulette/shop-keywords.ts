import type { RouletteCategory } from "@/lib/roulette/types";

/** シーン・禁煙・座席など、店の属性タグ（複数付与可） */
export const SHOP_KEYWORDS: readonly RouletteCategory[] = [
  { id: "date", label: "デート向け" },
  { id: "solo", label: "ひとり向け" },
  { id: "group", label: "グループ向け" },
  { id: "non_smoking", label: "禁煙" },
  { id: "private_room", label: "個室" },
  { id: "counter", label: "カウンター席" },
];
