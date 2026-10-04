export interface ScoringItem {
  id: string;
  name: string;
  nameEn: string;
  fan: number | string;
  description: string;
  descriptionEn: string;
  example?: string;
  category: ScoringCategory;
}

export enum ScoringCategory {
  BASIC = '基礎牌型番',
  WORDS_FLOWER_KONG = '字・花・槓',
  TERMINALS_WITH_X = '么九／帶X系列',
  DRAGON_SERIES = '龍系列',
  CHOWS = '順子相關番',
  FAMILY = '家人番',
  CONCEALED_PUNGS = '暗刻系列',
  TRI_QUAD_WINDS = '三元四喜系列',
  OTHER_COMBOS = '其他組合番',
  SPECIAL_EVENTS = '特殊事件',
  SPECIAL_PATTERNS = '特殊牌型'
}

export interface CategoryMeta {
  /** Two-letter line code, prefixes every item code (e.g. BA-01). */
  code: string;
  nameEn: string;
  /** Line colour: marks the category only. */
  color: string;
  /** Text colour that reads on the line colour. */
  ink: string;
}

export const CATEGORY_ORDER: ScoringCategory[] = [
  ScoringCategory.BASIC,
  ScoringCategory.WORDS_FLOWER_KONG,
  ScoringCategory.TERMINALS_WITH_X,
  ScoringCategory.DRAGON_SERIES,
  ScoringCategory.CHOWS,
  ScoringCategory.FAMILY,
  ScoringCategory.CONCEALED_PUNGS,
  ScoringCategory.TRI_QUAD_WINDS,
  ScoringCategory.OTHER_COMBOS,
  ScoringCategory.SPECIAL_EVENTS,
  ScoringCategory.SPECIAL_PATTERNS
];

export const CATEGORY_META: Record<ScoringCategory, CategoryMeta> = {
  [ScoringCategory.BASIC]: { code: 'BA', nameEn: 'Basic Patterns', color: '#d6202b', ink: '#ffffff' },
  [ScoringCategory.WORDS_FLOWER_KONG]: { code: 'HF', nameEn: 'Honors / Flowers / Kongs', color: '#0071bc', ink: '#ffffff' },
  [ScoringCategory.TERMINALS_WITH_X]: { code: 'TX', nameEn: 'Terminals & With-X', color: '#00843d', ink: '#ffffff' },
  [ScoringCategory.DRAGON_SERIES]: { code: 'DR', nameEn: 'Dragon (Straight) Series', color: '#f47b20', ink: '#1b1b1b' },
  [ScoringCategory.CHOWS]: { code: 'CH', nameEn: 'Chow Series', color: '#7d4a9e', ink: '#ffffff' },
  [ScoringCategory.FAMILY]: { code: 'FA', nameEn: 'Family Series', color: '#5bb8e6', ink: '#1b1b1b' },
  [ScoringCategory.CONCEALED_PUNGS]: { code: 'CP', nameEn: 'Concealed Pungs', color: '#9a3b26', ink: '#ffffff' },
  [ScoringCategory.TRI_QUAD_WINDS]: { code: 'WD', nameEn: 'Dragons & Winds', color: '#00888a', ink: '#ffffff' },
  [ScoringCategory.OTHER_COMBOS]: { code: 'OC', nameEn: 'Other Combinations', color: '#e878b2', ink: '#1b1b1b' },
  [ScoringCategory.SPECIAL_EVENTS]: { code: 'EV', nameEn: 'Special Events', color: '#b6bd00', ink: '#1b1b1b' },
  [ScoringCategory.SPECIAL_PATTERNS]: { code: 'SP', nameEn: 'Special Patterns', color: '#8e959c', ink: '#111111' }
};

/** Numeric 番 at or above this prints on an inverted (limit-hand) plate. */
export const LIMIT_FAN = 40;
