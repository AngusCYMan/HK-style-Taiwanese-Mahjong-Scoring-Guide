/**
 * Tile model. Kinds are indexed 0-33:
 *   0-8   萬 1-9
 *   9-17  筒 1-9
 *   18-26 索 1-9
 *   27-30 東 南 西 北
 *   31-33 中 發 白
 * Flowers are indexed 0-7: 春 夏 秋 冬 梅 蘭 菊 竹 (numbers 1-4, twice).
 */

export const TILE_KINDS = 34;
export const SUIT_NAMES = ['萬', '筒', '索'] as const;
export const HONOR_NAMES = ['東', '南', '西', '北', '中', '發', '白'] as const;
export const WIND_NAMES = ['東', '南', '西', '北'] as const;
export const FLOWER_NAMES = ['春', '夏', '秋', '冬', '梅', '蘭', '菊', '竹'] as const;

export const isHonor = (t: number) => t >= 27;
export const isWind = (t: number) => t >= 27 && t <= 30;
export const isDragon = (t: number) => t >= 31;
export const suitOf = (t: number) => (t < 27 ? Math.floor(t / 9) : -1);
export const rankOf = (t: number) => (t < 27 ? (t % 9) + 1 : 0);
export const isTerminal = (t: number) => t < 27 && (t % 9 === 0 || t % 9 === 8);
export const isTermOrHonor = (t: number) => isTerminal(t) || isHonor(t);
export const tileOf = (suit: number, rank: number) => suit * 9 + rank - 1;

/** Short label for a tile, e.g. 5萬, 東. */
export const tileLabel = (t: number) => (t < 27 ? `${rankOf(t)}${SUIT_NAMES[suitOf(t)]}` : HONOR_NAMES[t - 27]);

/** Seat flower number 1-4 for a flower index. */
export const flowerNumber = (f: number) => (f % 4) + 1;

export const countsOf = (tiles: number[]) => {
  const counts = new Array<number>(TILE_KINDS).fill(0);
  for (const t of tiles) counts[t]++;
  return counts;
};

export const sortTiles = (tiles: number[]) => [...tiles].sort((a, b) => a - b);
