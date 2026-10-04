import { ITEM_BY_ID } from '../constants';
import {
  TILE_KINDS,
  countsOf,
  flowerNumber,
  isDragon,
  isHonor,
  isTermOrHonor,
  isTerminal,
  isWind,
  rankOf,
  suitOf
} from './tiles';

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

export type MeldType = 'chow' | 'pung' | 'kong' | 'concealedKong';

export interface Meld {
  type: MeldType;
  /** For a chow, the lowest tile. */
  tile: number;
}

export type FlowerHu = 'eight' | 'oneStealsSeven' | 'sevenStealsOne';

export interface CalcEvents {
  winOnFlower: boolean; // 花上食胡
  winOnKong: boolean; // 槓上食胡
  robKong: boolean; // 搶槓食胡
  doubleWin: boolean; // 雙響
  tripleWin: boolean; // 三響
  heavenly: boolean; // 天胡
  earthly: boolean; // 地胡
  human: boolean; // 人胡
}

export interface CalcInput {
  /** Concealed tiles in hand, NOT including the winning tile. */
  hand: number[];
  winTile: number | null;
  melds: Meld[];
  /** Flower indices 0-7. */
  flowers: number[];
  selfDraw: boolean;
  /** 0 東 1 南 2 西 3 北 */
  seatWind: number;
  dealer: boolean;
  /** 連莊 N (0 = not on a streak). */
  dealerStreak: number;
  events: CalcEvents;
  flowerHu: FlowerHu | null;
  greatChicken: boolean;
}

/* ------------------------------------------------------------------ */
/* Output                                                              */
/* ------------------------------------------------------------------ */

export interface FanLine {
  /** Item id in SCORING_DATA, or a synthetic id for base fan. */
  id: string;
  name: string;
  code?: string;
  /** How many times the item applies (per flower, per pung...). */
  times: number;
  fan: number;
  note?: string;
}

export interface Reading {
  kind: 'standard' | 'pairs' | 'thirteen' | 'sixteen';
  label: string;
  /** Groups as display strings, e.g. ['123萬', '999萬', '88萬']. */
  groups: string[];
  lines: FanLine[];
  fan: number;
}

export interface CalcResult {
  status: 'empty' | 'count' | 'invalid' | 'ok';
  message?: string;
  effectiveTiles: number;
  /** Readings that are counted (two when 雙食). */
  counted: Reading[];
  /** Other valid readings, not counted. */
  others: Reading[];
  isDoubleEat: boolean;
  shared: FanLine[];
  total: number;
  waits: number[];
}

export const EMPTY_EVENTS: CalcEvents = {
  winOnFlower: false,
  winOnKong: false,
  robKong: false,
  doubleWin: false,
  tripleWin: false,
  heavenly: false,
  earthly: false,
  human: false
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const BASE_FAN = 5;

const fanOf = (id: string): number => {
  const fan = ITEM_BY_ID[id]?.fan;
  return typeof fan === 'number' ? fan : 0;
};

const line = (id: string, times = 1, fan?: number, note?: string): FanLine => {
  const item = ITEM_BY_ID[id];
  return {
    id,
    name: item?.name ?? id,
    code: item?.code,
    times,
    fan: fan ?? fanOf(id) * times,
    note
  };
};

const sum = (lines: FanLine[]) => lines.reduce((acc, l) => acc + l.fan, 0);

type GroupKind = 'pair' | 'pung' | 'chow';

interface Group {
  kind: GroupKind;
  tile: number;
  /** Concealed in hand (or 暗槓). */
  concealed: boolean;
  fromMeld: boolean;
  isKong: boolean;
}

const groupTiles = (g: Group): number[] =>
  g.kind === 'chow' ? [g.tile, g.tile + 1, g.tile + 2] : g.kind === 'pair' ? [g.tile, g.tile] : [g.tile, g.tile, g.tile];

const groupLabel = (g: Group) => {
  if (isHonor(g.tile)) {
    const name = ['東', '南', '西', '北', '中', '發', '白'][g.tile - 27];
    return name.repeat(g.kind === 'pair' ? 2 : g.isKong ? 4 : 3);
  }
  const suit = ['萬', '筒', '索'][suitOf(g.tile)];
  const r = rankOf(g.tile);
  const digits = g.kind === 'chow' ? `${r}${r + 1}${r + 2}` : String(r).repeat(g.kind === 'pair' ? 2 : g.isKong ? 4 : 3);
  return `${digits}${suit}`;
};

const meldToGroup = (m: Meld): Group => ({
  kind: m.type === 'chow' ? 'chow' : 'pung',
  tile: m.tile,
  concealed: m.type === 'concealedKong',
  fromMeld: true,
  isKong: m.type === 'kong' || m.type === 'concealedKong'
});

export const meldTiles = (m: Meld): number[] =>
  m.type === 'chow'
    ? [m.tile, m.tile + 1, m.tile + 2]
    : m.type === 'pung'
      ? [m.tile, m.tile, m.tile]
      : [m.tile, m.tile, m.tile, m.tile];

/** Every way to split `counts` into exactly `sets` sets plus one pair. */
const decompose = (counts: number[], sets: number): Group[][] => {
  const out: Group[][] = [];
  const total = counts.reduce((a, b) => a + b, 0);
  if (total !== sets * 3 + 2) return out;

  const walk = (c: number[], acc: Group[], needPair: boolean) => {
    let i = 0;
    while (i < TILE_KINDS && c[i] === 0) i++;
    if (i === TILE_KINDS) {
      if (!needPair) out.push([...acc]);
      return;
    }
    if (needPair && c[i] >= 2) {
      c[i] -= 2;
      acc.push({ kind: 'pair', tile: i, concealed: true, fromMeld: false, isKong: false });
      walk(c, acc, false);
      acc.pop();
      c[i] += 2;
    }
    if (c[i] >= 3) {
      c[i] -= 3;
      acc.push({ kind: 'pung', tile: i, concealed: true, fromMeld: false, isKong: false });
      walk(c, acc, needPair);
      acc.pop();
      c[i] += 3;
    }
    if (i < 27 && i % 9 <= 6 && c[i + 1] > 0 && c[i + 2] > 0) {
      c[i]--; c[i + 1]--; c[i + 2]--;
      acc.push({ kind: 'chow', tile: i, concealed: true, fromMeld: false, isKong: false });
      walk(c, acc, needPair);
      acc.pop();
      c[i]++; c[i + 1]++; c[i + 2]++;
    }
  };
  walk([...counts], [], true);
  return out;
};

/** 嚦咕嚦咕: 7 pairs + 1 pung over 17 concealed tiles. Returns the pung tile. */
const pairsForm = (counts: number[]): number | null => {
  if (counts.reduce((a, b) => a + b, 0) !== 17) return null;
  let pung: number | null = null;
  let pairs = 0;
  for (let t = 0; t < TILE_KINDS; t++) {
    const c = counts[t];
    if (c === 0) continue;
    if (c === 2) pairs += 1;
    else if (c === 4) pairs += 2;
    else if (c === 3 && pung === null) pung = t;
    else return null;
  }
  return pairs === 7 && pung !== null ? pung : null;
};

const ORPHANS = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];

/** 十三么: one of each orphan, one of them paired, plus one set (17 tiles). */
const thirteenForm = (counts: number[]): Group[] | null => {
  if (counts.reduce((a, b) => a + b, 0) !== 17) return null;
  if (ORPHANS.some((t) => counts[t] === 0)) return null;
  const rest = [...counts];
  ORPHANS.forEach((t) => rest[t]--);
  // Remaining 4 tiles: a pair of an orphan plus one set.
  for (const p of ORPHANS) {
    if (rest[p] < 1) continue;
    rest[p]--;
    // The 3 tiles left over must form one set.
    const left: number[] = [];
    rest.forEach((c, t) => { for (let k = 0; k < c; k++) left.push(t); });
    rest[p]++;
    if (left.length !== 3) continue;
    const [a, b, c] = left;
    if (a === b && b === c) return [{ kind: 'pung', tile: a, concealed: true, fromMeld: false, isKong: false }];
    if (a < 27 && suitOf(a) === suitOf(c) && b === a + 1 && c === a + 2) {
      return [{ kind: 'chow', tile: a, concealed: true, fromMeld: false, isKong: false }];
    }
  }
  return null;
};

/** 十六不搭: 16 mutually unrelated tiles + the winning tile pairing one of them. */
const sixteenForm = (counts: number[], winTile: number): boolean => {
  if (counts.reduce((a, b) => a + b, 0) !== 17) return false;
  if (counts[winTile] !== 2) return false;
  const distinct: number[] = [];
  for (let t = 0; t < TILE_KINDS; t++) {
    if (counts[t] > 2 || (counts[t] === 2 && t !== winTile)) return false;
    if (counts[t] > 0) distinct.push(t);
  }
  if (distinct.length !== 16) return false;
  for (let s = 0; s < 3; s++) {
    const ranks = distinct.filter((t) => suitOf(t) === s).map(rankOf);
    for (let i = 1; i < ranks.length; i++) if (ranks[i] - ranks[i - 1] < 3) return false;
  }
  return true;
};

/* ------------------------------------------------------------------ */
/* Whole-hand properties                                               */
/* ------------------------------------------------------------------ */

interface HandFacts {
  tiles: number[];
  suits: Set<number>;
  hasHonor: boolean;
  hasWind: boolean;
  hasDragon: boolean;
  hasTerminal: boolean;
  allTermHonor: boolean;
  allSimple: boolean;
  noFlowers: boolean;
}

const factsOf = (tiles: number[], flowers: number[]): HandFacts => {
  const suits = new Set<number>();
  tiles.forEach((t) => { if (!isHonor(t)) suits.add(suitOf(t)); });
  return {
    tiles,
    suits,
    hasHonor: tiles.some(isHonor),
    hasWind: tiles.some(isWind),
    hasDragon: tiles.some(isDragon),
    hasTerminal: tiles.some(isTerminal),
    allTermHonor: tiles.every(isTermOrHonor),
    allSimple: tiles.every((t) => !isTermOrHonor(t)),
    noFlowers: flowers.length === 0
  };
};

/** Colour, terminal and honour-presence items shared by every reading of a hand. */
const wholeHandLines = (f: HandFacts, allChows: boolean): FanLine[] => {
  const lines: FanLine[] = [];
  const oneSuit = f.suits.size === 1;

  // 混一色 / 清一色 include 缺一門; 清一色 also includes 無字.
  let missingSuitCounted = false;
  if (oneSuit && !f.hasHonor) lines.push(line('o-5'));
  else if (oneSuit && f.hasHonor) lines.push(line('o-4'));
  else if (f.suits.size === 2) {
    lines.push(line('o-1'));
    missingSuitCounted = true;
  }

  if (f.suits.size === 3 && f.hasWind && f.hasDragon) lines.push(line('o-2'));

  // 斷么 includes 無字.
  if (f.allSimple) lines.push(line('t-1'));

  // 無字 family.
  //  - 無字花大平胡 includes 無字花 and 平胡; 無字花 includes 無字 and 無花.
  //  - 無字 alone is not counted when 清一色, 斷么 or 缺一門 already counts
  //    (清一色 / 斷么 include it; 缺一門 and 無字 cannot both count).
  if (!f.hasHonor) {
    if (f.noFlowers) lines.push(line(allChows ? 'b-7' : 'b-6'));
    else if (!oneSuit && !f.allSimple && !missingSuitCounted) lines.push(line('b-3'));
  }

  // 混么 / 清么 (all terminals / honours).
  if (f.allTermHonor) {
    if (!f.hasHonor) lines.push(line('t-5'));
    else if (f.hasTerminal) lines.push(line('t-4'));
  }
  return lines;
};

/* ------------------------------------------------------------------ */
/* Waits                                                               */
/* ------------------------------------------------------------------ */

type WaitRole = 'pair' | 'pung' | 'closed' | 'edge' | 'open';

const roleOf = (g: Group, win: number): WaitRole => {
  if (g.kind === 'pair') return 'pair';
  if (g.kind === 'pung') return 'pung';
  const r = rankOf(g.tile);
  if (win === g.tile + 1) return 'closed';
  if ((r === 1 && win === g.tile + 2) || (r === 7 && win === g.tile)) return 'edge';
  return 'open';
};

const waitLine = (role: WaitRole, waits: number): FanLine | null => {
  if (waits === 1 && role !== 'open') return line('b-1');
  if (role === 'pung') return line('b-8');
  if (role === 'pair') return line('b-2');
  return null;
};

/* ------------------------------------------------------------------ */
/* Standard reading                                                    */
/* ------------------------------------------------------------------ */

const scoreStandard = (groups: Group[], ctx: ScoreContext, role: WaitRole | null): FanLine[] => {
  const lines: FanLine[] = [];
  const sets = groups.filter((g) => g.kind !== 'pair');
  const pair = groups.find((g) => g.kind === 'pair')!;
  const chows = sets.filter((g) => g.kind === 'chow');
  const pungs = sets.filter((g) => g.kind === 'pung');
  const allChows = chows.length === 5;

  lines.push(...wholeHandLines(ctx.facts, allChows));
  if (allChows && !lines.some((l) => l.id === 'b-7')) lines.push(line('b-5'));

  // 將眼
  if (!isHonor(pair.tile) && [2, 5, 8].includes(rankOf(pair.tile))) lines.push(line('b-4'));

  // Wait
  if (role) {
    const w = waitLine(role, ctx.waitCount);
    if (w) lines.push(w);
  }

  // Pungs: 對對胡 / 暗刻 / 間間胡
  const concealedPungs = pungs.filter((g) => g.concealed).length;
  if (pungs.length === 5 && concealedPungs === 5 && ctx.input.selfDraw) {
    lines.push(line('p-6'));
  } else {
    if (pungs.length === 5) lines.push(line('o-3'));
    const darkIds = ['', '', 'd-1', 'd-2', 'd-3', 'd-4'];
    if (concealedPungs >= 2) lines.push(line(darkIds[concealedPungs]));
  }

  // Honour pungs
  const seatTile = 27 + ctx.input.seatWind;
  const windPungs = pungs.filter((g) => isWind(g.tile));
  const dragonPungs = pungs.filter((g) => isDragon(g.tile));
  const seatPungs = windPungs.filter((g) => g.tile === seatTile).length;
  const otherWindPungs = windPungs.length - seatPungs;
  if (seatPungs) lines.push(line('f-6', seatPungs));
  if (otherWindPungs) lines.push(line('f-2', otherWindPungs));
  if (dragonPungs.length) lines.push(line('f-7', dragonPungs.length));

  // 暗槓
  const concealedKongs = ctx.input.melds.filter((m) => m.type === 'concealedKong').length;
  if (concealedKongs) lines.push(line('f-8', concealedKongs));

  // Winds and dragons series: highest only.
  const windPair = isWind(pair.tile);
  if (windPungs.length === 4) lines.push(line('w-4'));
  else if (windPungs.length === 3 && windPair) lines.push(line('w-3'));
  else if (windPungs.length === 3) lines.push(line('w-2'));
  else if (windPungs.length === 2 && windPair) lines.push(line('w-1'));
  if (dragonPungs.length === 3) lines.push(line('w-6'));
  else if (dragonPungs.length === 2 && isDragon(pair.tile)) lines.push(line('w-5'));

  // 全帶 / 帶X series (only when not already all terminals/honours).
  if (!ctx.facts.allTermHonor) {
    if (groups.every((g) => groupTiles(g).some(isTermOrHonor))) {
      lines.push(line(ctx.facts.hasHonor ? 't-2' : 't-3'));
    }
  }
  let bestX: FanLine | null = null;
  for (let x = 2; x <= 8; x++) {
    const suited = groups.filter((g) => !isHonor(g.tile));
    if (suited.length === 0) break;
    if (!suited.every((g) => groupTiles(g).some((t) => rankOf(t) === x))) continue;
    const honorGroups = groups.length - suited.length;
    const l = honorGroups === 0 ? line('x-2', 1, undefined, `X = ${x}`) : line('x-1', 1, undefined, `X = ${x}`);
    if (!bestX || l.fan > bestX.fan) bestX = l;
  }
  if (bestX) lines.push(bestX);

  // 龍 (1-9 straight): best single straight.
  let bestDragon: FanLine | null = null;
  const chowAt = (rank: number) => chows.filter((g) => rankOf(g.tile) === rank);
  for (const a of chowAt(1)) for (const b of chowAt(4)) for (const c of chowAt(7)) {
    const pure = suitOf(a.tile) === suitOf(b.tile) && suitOf(b.tile) === suitOf(c.tile);
    const exposed = [a, b, c].some((g) => g.fromMeld);
    const id = pure ? (exposed ? 'dr-2' : 'dr-4') : exposed ? 'dr-1' : 'dr-3';
    const l = line(id);
    if (!bestDragon || l.fan > bestDragon.fan) bestDragon = l;
  }
  if (bestDragon) lines.push(bestDragon);

  // Chow series
  for (let start = 1; start <= 7; start++) {
    const same = chowAt(start);
    if (same.length >= 5) { lines.push(line('s-7')); continue; }
    if (same.length === 4) { lines.push(line('s-6')); continue; }
    const bySuit = [0, 0, 0];
    same.forEach((g) => bySuit[suitOf(g.tile)]++);
    bySuit.forEach((k) => {
      if (k === 2) lines.push(line('s-1'));
      else if (k === 3) lines.push(line('s-2'));
    });
    const suitsHere = bySuit.filter((k) => k > 0).length;
    if (suitsHere === 2) lines.push(line('s-4'));
    else if (suitsHere === 3) lines.push(line('s-5'));
  }

  // Family: 老少
  for (let s = 0; s < 3; s++) {
    const lo = chows.filter((g) => suitOf(g.tile) === s && rankOf(g.tile) === 1).length;
    const hi = chows.filter((g) => suitOf(g.tile) === s && rankOf(g.tile) === 7).length;
    if (Math.min(lo, hi)) lines.push(line('h-1', Math.min(lo, hi)));
    const p1 = pungs.some((g) => g.tile === s * 9);
    const p9 = pungs.some((g) => g.tile === s * 9 + 8);
    if (p1 && p9) lines.push(line('h-2'));
  }

  // Family: 兄弟 (same number, different suits)
  const suitedPungs = pungs.filter((g) => !isHonor(g.tile));
  for (let r = 1; r <= 9; r++) {
    const suitsWith = new Set(suitedPungs.filter((g) => rankOf(g.tile) === r).map((g) => suitOf(g.tile)));
    if (suitsWith.size === 3) lines.push(line('h-5'));
    else if (suitsWith.size === 2) {
      const pairMatches = !isHonor(pair.tile) && rankOf(pair.tile) === r && !suitsWith.has(suitOf(pair.tile));
      lines.push(line(pairMatches ? 'h-4' : 'h-3'));
    }
  }

  // Family: 姊妹 (consecutive pungs, same suit)
  for (let s = 0; s < 3; s++) {
    const ranks = new Set(suitedPungs.filter((g) => suitOf(g.tile) === s).map((g) => rankOf(g.tile)));
    let big = false;
    for (let r = 1; r <= 7; r++) if (ranks.has(r) && ranks.has(r + 1) && ranks.has(r + 2)) big = true;
    if (big) { lines.push(line('h-7')); continue; }
    if (!isHonor(pair.tile) && suitOf(pair.tile) === s) {
      const pr = rankOf(pair.tile);
      for (let r = 1; r <= 7; r++) {
        const run = [r, r + 1, r + 2];
        if (!run.includes(pr)) continue;
        if (run.filter((x) => x !== pr).every((x) => ranks.has(x))) { lines.push(line('h-6')); break; }
      }
    }
  }

  return lines;
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

interface ScoreContext {
  input: CalcInput;
  facts: HandFacts;
  waitCount: number;
}

/** Concealed counts including the winning tile. */
const concealedCounts = (input: CalcInput) => countsOf(input.winTile === null ? input.hand : [...input.hand, input.winTile]);

/** Does the concealed part (with tile `win`) form any winning shape? */
const isWinning = (hand: number[], win: number, meldCount: number): boolean => {
  const counts = countsOf([...hand, win]);
  const sets = 5 - meldCount;
  if (decompose(counts, sets).length > 0) return true;
  if (meldCount === 0) {
    if (pairsForm(counts) !== null) return true;
    if (thirteenForm(counts)) return true;
    if (sixteenForm(counts, win)) return true;
  }
  return false;
};

export const allTiles = (input: CalcInput): number[] => {
  const tiles = [...input.hand, ...input.melds.flatMap(meldTiles)];
  if (input.winTile !== null) tiles.push(input.winTile);
  return tiles;
};

export const effectiveCount = (input: CalcInput) => input.hand.length + (input.winTile === null ? 0 : 1) + input.melds.length * 3;

const sharedLines = (input: CalcInput, anyNoHonorNoFlower: boolean): FanLine[] => {
  const lines: FanLine[] = [];

  // Flowers
  if (input.flowers.length === 0) {
    if (!anyNoHonorNoFlower) lines.push(line('f-4'));
  } else {
    const sets = [[0, 1, 2, 3], [4, 5, 6, 7]].filter((set) => set.every((f) => input.flowers.includes(f)));
    const inSet = new Set(sets.flat());
    if (sets.length) lines.push(line('f-9', sets.length));
    const loose = input.flowers.filter((f) => !inSet.has(f));
    const seat = loose.filter((f) => flowerNumber(f) === input.seatWind + 1).length;
    const mixed = loose.length - seat;
    if (seat) lines.push(line('f-5', seat));
    if (mixed) lines.push(line('f-1', mixed));
  }

  // Hand size and 求人
  const exposed = input.melds.filter((m) => m.type !== 'concealedKong').length;
  if (input.hand.length <= 7) lines.push(line('e-6'));
  else if (input.hand.length <= 10) lines.push(line('e-7'));
  if (exposed === 5) lines.push(line(input.selfDraw ? 'e-8' : 'e-9'));

  // Events
  const e = input.events;
  if (e.winOnFlower) lines.push(line('e-1'));
  if (e.winOnKong) lines.push(line('e-2'));
  if (e.robKong) lines.push(line('e-3'));
  if (e.tripleWin) lines.push(line('e-5'));
  else if (e.doubleWin) lines.push(line('e-4'));
  if (e.heavenly) lines.push(line('e-12'));
  else if (e.earthly) lines.push(line('e-10'));
  else if (e.human) lines.push(line('e-11'));

  return lines;
};

const dealerLines = (input: CalcInput): FanLine[] => {
  if (!input.dealer) return [];
  if (input.dealerStreak > 0) {
    return [line('b-10', 1, input.dealerStreak * 2 + 1, `連 ${input.dealerStreak}：${input.dealerStreak} × 2 + 1`)];
  }
  return [line('b-9')];
};

const baseLine = (): FanLine => ({ id: 'base', name: '底番', times: 1, fan: BASE_FAN });

export const calculate = (input: CalcInput): CalcResult => {
  const effective = effectiveCount(input);
  const empty: CalcResult = {
    status: 'empty',
    effectiveTiles: effective,
    counted: [],
    others: [],
    isDoubleEat: false,
    shared: [],
    total: 0,
    waits: []
  };

  // 花胡 needs no hand.
  if (input.flowerHu) {
    const id = input.flowerHu === 'eight' ? 'p-7' : input.flowerHu === 'sevenStealsOne' ? 'p-9' : 'p-8';
    const shared = [line(id), baseLine(), ...dealerLines(input)];
    return { ...empty, status: 'ok', shared, total: sum(shared) };
  }

  if (effective === 0) return empty;

  // Tile supply check (max 4 of each kind).
  const counts = countsOf(allTiles(input));
  const over = counts.findIndex((c) => c > 4);
  if (over >= 0) return { ...empty, status: 'invalid', message: '同一隻牌最多只有 4 隻。' };

  if (effective !== 17 || input.winTile === null) {
    return {
      ...empty,
      status: 'count',
      message: input.winTile === null ? '請揀食糊張。' : `有效牌數要等於 17 張，而家係 ${effective} 張。`
    };
  }

  const meldCount = input.melds.length;
  const win = input.winTile;
  const cc = concealedCounts(input);

  // Waits: every tile that would have completed the pre-win hand.
  const supply = countsOf(allTiles(input));
  supply[win]--;
  const waits: number[] = [];
  for (let t = 0; t < TILE_KINDS; t++) {
    if (supply[t] >= 4) continue;
    if (isWinning(input.hand, t, meldCount)) waits.push(t);
  }

  const facts = factsOf(allTiles(input), input.flowers);
  const ctx: ScoreContext = { input, facts, waitCount: waits.length };
  const meldGroups = input.melds.map(meldToGroup);

  // Standard readings: every decomposition x every group the winning tile can sit in.
  const standard: Reading[] = [];
  for (const groups of decompose(cc, 5 - meldCount)) {
    const holders = groups.filter((g) => groupTiles(g).includes(win));
    let best: Reading | null = null;
    for (const holder of holders) {
      const role = roleOf(holder, win);
      const placed = groups.map((g) =>
        g === holder && g.kind === 'pung' && !input.selfDraw ? { ...g, concealed: false } : g
      );
      const all = [...placed, ...meldGroups];
      const lines = scoreStandard(all, ctx, role);
      const reading: Reading = {
        kind: 'standard',
        label: '標準糊型（5組 + 1對）',
        groups: all.map(groupLabel),
        lines,
        fan: sum(lines)
      };
      if (!best || reading.fan > best.fan) best = reading;
    }
    if (best) standard.push(best);
  }
  standard.sort((a, b) => b.fan - a.fan);

  // Special readings (fully concealed only).
  const special: Reading[] = [];
  if (meldCount === 0) {
    const pung = pairsForm(cc);
    if (pung !== null) {
      const preCounts = countsOf(input.hand);
      const eightPairs = preCounts.every((c) => c === 0 || c === 2 || c === 4) && input.hand.length === 16;
      const lines: FanLine[] = [line(eightPairs ? 'p-5' : 'p-4')];
      lines.push(...wholeHandLines(facts, false));
      if (isWind(pung)) lines.push(line(pung === 27 + input.seatWind ? 'f-6' : 'f-2'));
      if (isDragon(pung)) lines.push(line('f-7'));
      if (!eightPairs) {
        const role: WaitRole = cc[win] === 3 && win === pung ? 'pung' : 'pair';
        const w = waitLine(role, waits.length);
        if (w) lines.push(w);
      }
      const groupsTxt: string[] = [];
      for (let t = 0; t < TILE_KINDS; t++) {
        if (t === pung) groupsTxt.push(groupLabel({ kind: 'pung', tile: t, concealed: true, fromMeld: false, isKong: false }));
        else for (let k = 0; k < cc[t] / 2; k++) groupsTxt.push(groupLabel({ kind: 'pair', tile: t, concealed: true, fromMeld: false, isKong: false }));
      }
      special.push({ kind: 'pairs', label: eightPairs ? '嚦咕嚦咕（8飛）' : '嚦咕嚦咕（7對 + 1刻）', groups: groupsTxt, lines, fan: sum(lines) });
    }
    if (thirteenForm(cc)) {
      const lines = [line('p-3')];
      special.push({ kind: 'thirteen', label: '十三么', groups: [], lines, fan: sum(lines) });
    }
    if (sixteenForm(cc, win)) {
      const lines = [line('p-2')];
      special.push({ kind: 'sixteen', label: '十六不搭', groups: [], lines, fan: sum(lines) });
    }
  }
  special.sort((a, b) => b.fan - a.fan);

  if (!standard.length && !special.length) {
    return { ...empty, status: 'invalid', message: '呢手牌未成糊：拆唔到 5 組 + 1 對，亦唔係特殊牌型。', waits };
  }

  // 雙食: a special form and a standard form both hold -> add both.
  let counted: Reading[];
  let isDoubleEat = false;
  if (standard.length && special.length && special[0].kind === 'pairs') {
    counted = [special[0], standard[0]];
    isDoubleEat = true;
  } else {
    const best = [...standard, ...special].sort((a, b) => b.fan - a.fan)[0];
    counted = [best];
  }
  const others = [...standard, ...special].filter((r) => !counted.includes(r));

  if (input.greatChicken) {
    const lines = [line('p-1')];
    counted = [{ kind: 'standard', label: '大雞胡', groups: counted[0].groups, lines, fan: sum(lines) }];
    isDoubleEat = false;
  }

  const noHonorNoFlower = counted.some((r) => r.lines.some((l) => l.id === 'b-6' || l.id === 'b-7'));
  const shared = [...sharedLines(input, noHonorNoFlower)];
  if (!input.greatChicken) shared.push(baseLine());
  shared.push(...dealerLines(input));

  const total = counted.reduce((acc, r) => acc + r.fan, 0) + sum(shared);
  return { status: 'ok', effectiveTiles: effective, counted, others, isDoubleEat, shared, total, waits };
};
