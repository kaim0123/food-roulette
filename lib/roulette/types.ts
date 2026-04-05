export type RouletteCategory = {
  id: string;
  label: string;
};

/** 1行＝スロットの1候補（レシピ名・店名など） */
export type RouletteItem = {
  id: string;
  name: string;
  categoryId: string;
  /** メインの型（ご飯・麺など）。`mealFormats` を使う設定でのみ指定 */
  mealFormatId?: string;
  /** エリア（`areas` がある設定のお店データ向け） */
  areaId?: string;
  /** こだわりタグ。`keywords` がある設定で絞り込み・表示に使う */
  keywordIds?: readonly string[];
};

export type RouletteCopy = {
  categorySectionLabel: string;
  categorySectionAria: string;
  /** `mealFormats` があるときのみ表示 */
  mealFormatSectionLabel?: string;
  mealFormatSectionAria?: string;
  /** `areas` があるときのみ表示 */
  areaSectionLabel?: string;
  areaSectionAria?: string;
  /** `keywords` があるときのみ表示 */
  keywordSectionLabel?: string;
  keywordSectionAria?: string;
  emptyReelText: string;
  resultLead: string;
  footerIdle: string;
  footerResult: string;
};

export type RouletteAppConfig = {
  title: string;
  categories: readonly RouletteCategory[];
  /** 省略時はジャンルだけで絞り込み（お店スロットなど） */
  mealFormats?: readonly RouletteCategory[];
  /** お店スロット用エリア */
  areas?: readonly RouletteCategory[];
  /**
   * こだわりタグのマスタ（店のシーン・レシピの食事制限など）。
   * 選択したタグはすべて付いた候補のみ（AND）。未選択ならキーワードでは絞らない。
   */
  keywords?: readonly RouletteCategory[];
  items: readonly RouletteItem[];
  copy: RouletteCopy;
};
