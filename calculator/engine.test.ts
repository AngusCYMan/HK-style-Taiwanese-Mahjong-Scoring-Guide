/* Run: npm run test:calc */
import { calculate, CalcInput, EMPTY_EVENTS, Meld } from './engine';

const m = (r: number) => r - 1;
const p = (r: number) => 9 + r - 1;
const s = (r: number) => 18 + r - 1;
const E = 27, S = 28, W = 29, N = 30, C = 31, F = 32, P = 33;

const base = (hand: number[], winTile: number, extra: Partial<CalcInput> = {}): CalcInput => ({
  hand,
  winTile,
  melds: [],
  flowers: [],
  selfDraw: false,
  seatWind: 0,
  dealer: false,
  dealerStreak: 0,
  events: { ...EMPTY_EVENTS },
  flowerHu: null,
  greatChicken: false,
  ...extra
});

let failed = 0;
const check = (name: string, cond: boolean, detail?: unknown) => {
  if (cond) console.log(`  ok  ${name}`);
  else { failed++; console.log(`  FAIL ${name}`, detail ?? ''); }
};
const ids = (r: ReturnType<typeof calculate>) => r.counted.flatMap((x) => x.lines.map((l) => l.id));
const sharedIds = (r: ReturnType<typeof calculate>) => r.shared.map((l) => l.id);

// 1. 雙食: 萬 11 22 33 44 55 66 88 999, winning on 8萬 by discard.
{
  const r = calculate(base([m(1), m(1), m(2), m(2), m(3), m(3), m(4), m(4), m(5), m(5), m(6), m(6), m(8), m(9), m(9), m(9)], m(8)));
  console.log('雙食 example');
  check('status ok', r.status === 'ok', r.message);
  check('is 雙食', r.isDoubleEat);
  check('reading A is 嚦咕嚦咕', r.counted[0]?.kind === 'pairs');
  check('reading B is standard', r.counted[1]?.kind === 'standard');
  check('嚦咕嚦咕 counted', ids(r).includes('p-4'));
  check('清一色 in both readings', ids(r).filter((x) => x === 'o-5').length === 2);
  check('two 一般高 in standard', r.counted[1]?.lines.filter((l) => l.id === 's-1').length === 2, r.counted[1]?.lines);
  check('no 缺一門 with 清一色', !ids(r).includes('o-1'));
  check('base counted once', sharedIds(r).filter((x) => x === 'base').length === 1);
  check('total = A + B + shared', r.total === r.counted[0].fan + r.counted[1].fan + r.shared.reduce((a, l) => a + l.fan, 0));
}

// 2. 無字花大平胡: 123萬 345筒 567筒 234索 678索 + 99筒, two-sided win on 8索.
{
  const hand = [m(1), m(2), m(3), p(3), p(4), p(5), p(5), p(6), p(7), s(2), s(3), s(4), s(6), s(7), p(9), p(9)];
  const r = calculate(base(hand, s(8)));
  console.log('無字花大平胡');
  check('status ok', r.status === 'ok', r.message);
  check('無字花大平胡 counted', ids(r).includes('b-7'), ids(r));
  check('no 平胡 / 無字花 / 無字 separately', !['b-5', 'b-6', 'b-3'].some((x) => ids(r).includes(x)));
  check('no 無花 in shared', !sharedIds(r).includes('f-4'));
  check('no wait fan for two-sided win', !['b-1', 'b-2', 'b-8'].some((x) => ids(r).includes(x)));
}

// 3. 大四喜: 東東東 南南南 西西西 北北北 123萬 55萬, win on 5萬 (單釣).
{
  const hand = [E, E, E, S, S, S, W, W, W, N, N, N, m(1), m(2), m(3), m(5)];
  const r = calculate(base(hand, m(5)));
  console.log('大四喜');
  check('大四喜', ids(r).includes('w-4'));
  check('no 小四喜 / 大三風 / 小三風', !['w-3', 'w-2', 'w-1'].some((x) => ids(r).includes(x)));
  check('單釣 single wait = 獨獨', ids(r).includes('b-1'), r.waits);
  check('正風 once (東 seat)', r.counted[0].lines.find((l) => l.id === 'f-6')?.times === 1);
  check('非正風 x3', r.counted[0].lines.find((l) => l.id === 'f-2')?.times === 3);
  check('混一色', ids(r).includes('o-4'));
}

// 4. 十三么: all 13 orphans, pair of 中, plus 234索; win on 4索.
{
  const hand = [m(1), m(9), p(1), p(9), s(1), s(9), E, S, W, N, C, C, F, P, s(2), s(3)];
  const r = calculate(base(hand, s(4)));
  console.log('十三么');
  check('status ok', r.status === 'ok', r.message);
  check('十三么 counted', ids(r).includes('p-3'), ids(r));
}

// 5. Tile count errors.
{
  const r = calculate(base([m(1), m(2)], m(3)));
  console.log('count');
  check('count status', r.status === 'count');
  const over = calculate(base([m(1), m(1), m(1), m(1)], m(1)));
  check('five of a kind rejected', over.status === 'invalid');
}

// 6. 對碰 and 暗刻: 111萬 999筒 + 55索 77索 waiting, win 7索 by discard.
{
  const hand = [m(1), m(1), m(1), p(9), p(9), p(9), m(2), m(3), m(4), p(2), p(3), p(4), s(5), s(5), s(7), s(7)];
  const r = calculate(base(hand, s(7)));
  console.log('對碰');
  check('對碰 counted', ids(r).includes('b-8'), ids(r));
  check('discard pung not concealed: 二暗刻', ids(r).includes('d-1') && !ids(r).includes('d-2'), ids(r));
  check('三相逢? no; 二相逢 234萬/234筒', ids(r).includes('s-4'));
}

// 7. Melds: 3 exposed melds -> 七只內; dealer streak 2 -> 5番.
{
  const melds: Meld[] = [{ type: 'pung', tile: C }, { type: 'chow', tile: m(1) }, { type: 'pung', tile: F }];
  const hand = [P, P, s(2), s(3), s(4), m(7), m(8)];
  const r = calculate(base(hand, m(9), { melds, dealer: true, dealerStreak: 2, flowers: [0, 5] }));
  console.log('melds / dealer / flowers');
  check('status ok', r.status === 'ok', r.message);
  check('七只內', sharedIds(r).includes('e-6'));
  check('大三元 not (白 is pair) -> 小三元', ids(r).includes('w-5'));
  check('連莊 2 = 5番', r.shared.find((l) => l.id === 'b-10')?.fan === 5);
  check('正花 (春, seat 東) + 爛花 (蘭)', sharedIds(r).includes('f-5') && sharedIds(r).includes('f-1'));
}

// 8. 間間胡: 5 concealed pungs, self-drawn.
{
  const hand = [m(2), m(2), m(2), m(5), m(5), m(5), p(3), p(3), p(3), s(6), s(6), s(6), s(8), s(8), C, C];
  const r = calculate(base(hand, C, { selfDraw: true }));
  console.log('間間胡');
  check('間間胡', ids(r).includes('p-6'), ids(r));
  check('no 對對胡 / 五暗刻', !ids(r).includes('o-3') && !ids(r).includes('d-4'));
}

// 9. 花胡
{
  const r = calculate({ ...base([], 0), winTile: null, flowerHu: 'eight' });
  console.log('花胡');
  check('花胡 100 + base 5', r.total === 105, r.total);
}

if (failed) {
  console.log(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
