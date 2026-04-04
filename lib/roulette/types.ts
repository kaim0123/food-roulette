export type RouletteCategory = {
  id: string;
  label: string;
  icon: string;
};

/** 1行＝スロットの1候補（レシピ名・店名など） */
export type RouletteItem = {
  id: string;
  name: string;
  icon: string;
  categoryId: string;
};

export type RouletteCopy = {
  categorySectionLabel: string;
  categorySectionAria: string;
  emptyReelText: string;
  resultLead: string;
  footerIdle: string;
  footerResult: string;
};

export type RouletteAppConfig = {
  title: string;
  titleEmoji?: string;
  categories: readonly RouletteCategory[];
  items: readonly RouletteItem[];
  copy: RouletteCopy;
};
