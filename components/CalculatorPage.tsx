import React, { useMemo, useState } from 'react';
import './calculator.css';
import { CATEGORY_META } from '../types';
import { ITEM_BY_ID } from '../constants';
import { calculate, CalcEvents, CalcInput, EMPTY_EVENTS, FanLine, FlowerHu, Meld, MeldType, meldTiles, effectiveCount } from '../calculator/engine';
import { FLOWER_NAMES, HONOR_NAMES, SUIT_NAMES, WIND_NAMES, countsOf, isHonor, rankOf, sortTiles, suitOf, tileLabel } from '../calculator/tiles';

type Target = 'hand' | 'win' | MeldType;

const TARGETS: { id: Target; zh: string; en: string }[] = [
  { id: 'hand', zh: '手牌', en: 'Hand' },
  { id: 'win', zh: '食糊張', en: 'Winning tile' },
  { id: 'chow', zh: '上', en: 'Chow' },
  { id: 'pung', zh: '碰', en: 'Pung' },
  { id: 'kong', zh: '明槓', en: 'Kong' },
  { id: 'concealedKong', zh: '暗槓', en: 'Concealed kong' }
];

const EVENT_OPTIONS: { key: keyof CalcEvents; label: string }[] = [
  { key: 'winOnFlower', label: '花上食胡' },
  { key: 'winOnKong', label: '槓上食胡' },
  { key: 'robKong', label: '搶槓食胡' },
  { key: 'doubleWin', label: '雙響' },
  { key: 'tripleWin', label: '三響' },
  { key: 'heavenly', label: '天胡' },
  { key: 'earthly', label: '地胡' },
  { key: 'human', label: '人胡' }
];

const FLOWER_HU: { id: FlowerHu | null; label: string }[] = [
  { id: null, label: '唔係花胡' },
  { id: 'eight', label: '8隻花' },
  { id: 'oneStealsSeven', label: '1搶7' },
  { id: 'sevenStealsOne', label: '7搶1' }
];

const KEY_ROWS: { label: string; tiles: number[] }[] = [
  { label: '萬', tiles: Array.from({ length: 9 }, (_, i) => i) },
  { label: '筒', tiles: Array.from({ length: 9 }, (_, i) => 9 + i) },
  { label: '索', tiles: Array.from({ length: 9 }, (_, i) => 18 + i) },
  { label: '字', tiles: Array.from({ length: 7 }, (_, i) => 27 + i) }
];

const MELD_NAMES: Record<MeldType, string> = { chow: '上', pung: '碰', kong: '明槓', concealedKong: '暗槓' };

const m = (r: number) => r - 1;
const EXAMPLE: Pick<CalcInput, 'hand' | 'winTile' | 'melds'> = {
  hand: [m(1), m(1), m(2), m(2), m(3), m(3), m(4), m(4), m(5), m(5), m(6), m(6), m(8), m(9), m(9), m(9)],
  winTile: m(8),
  melds: []
};

const Tile: React.FC<{ tile: number; size?: 'sm' | 'md'; win?: boolean }> = ({ tile, size = 'md', win }) => (
  <span className={`mj mj--${size}${win ? ' mj--win' : ''}${isHonor(tile) ? ' mj--honor' : ''}`} aria-label={tileLabel(tile)}>
    {isHonor(tile) ? (
      <b>{HONOR_NAMES[tile - 27]}</b>
    ) : (
      <>
        <b>{rankOf(tile)}</b>
        <small>{SUIT_NAMES[suitOf(tile)]}</small>
      </>
    )}
  </span>
);

const Lines: React.FC<{ lines: FanLine[]; onJump: (code: string) => void }> = ({ lines, onJump }) => (
  <ul className="calc-lines">
    {lines.map((l, i) => {
      const item = ITEM_BY_ID[l.id];
      const meta = item ? CATEGORY_META[item.category] : null;
      return (
        <li key={`${l.id}-${i}`}>
          {l.code && meta ? (
            <a
              href={`#item-${l.code}`}
              className="chip calc-lines__chip"
              style={{ '--line': meta.color, '--line-ink': meta.ink } as React.CSSProperties}
              onClick={(e) => { e.preventDefault(); onJump(l.code!); }}
            >
              <span className="chip__code">{l.code}</span>
              {l.name}
            </a>
          ) : (
            <span className="calc-lines__plain">{l.name}</span>
          )}
          {l.times > 1 && <span className="calc-lines__times num">× {l.times}</span>}
          {l.note && <span className="calc-lines__note">{l.note}</span>}
          <span className="calc-lines__fan num">{l.fan}</span>
        </li>
      );
    })}
  </ul>
);

interface CalculatorPageProps {
  onJump: (code: string) => void;
}

const CalculatorPage: React.FC<CalculatorPageProps> = ({ onJump }) => {
  const [hand, setHand] = useState<number[]>([]);
  const [winTile, setWinTile] = useState<number | null>(null);
  const [melds, setMelds] = useState<Meld[]>([]);
  const [flowers, setFlowers] = useState<number[]>([]);
  const [selfDraw, setSelfDraw] = useState(false);
  const [seatWind, setSeatWind] = useState(0);
  const [dealer, setDealer] = useState(false);
  const [dealerStreak, setDealerStreak] = useState(0);
  const [events, setEvents] = useState<CalcEvents>({ ...EMPTY_EVENTS });
  const [flowerHu, setFlowerHu] = useState<FlowerHu | null>(null);
  const [greatChicken, setGreatChicken] = useState(false);
  const [target, setTarget] = useState<Target>('hand');

  const input: CalcInput = { hand, winTile, melds, flowers, selfDraw, seatWind, dealer, dealerStreak, events, flowerHu, greatChicken };
  const result = useMemo(() => calculate(input), [hand, winTile, melds, flowers, selfDraw, seatWind, dealer, dealerStreak, events, flowerHu, greatChicken]); // eslint-disable-line react-hooks/exhaustive-deps

  const used = countsOf([...hand, ...melds.flatMap(meldTiles), ...(winTile === null ? [] : [winTile])]);
  const effective = effectiveCount(input);

  const canPlace = (t: number): boolean => {
    switch (target) {
      case 'hand':
        return used[t] < 4 && hand.length < 16 - melds.length * 3;
      case 'win':
        return used[t] - (winTile === t ? 1 : 0) < 4;
      case 'chow':
        return !isHonor(t) && rankOf(t) <= 7 && used[t] < 4 && used[t + 1] < 4 && used[t + 2] < 4 && melds.length < 5;
      case 'pung':
        return used[t] <= 1 && melds.length < 5;
      default:
        return used[t] === 0 && melds.length < 5;
    }
  };

  const place = (t: number) => {
    if (!canPlace(t)) return;
    if (target === 'hand') setHand((h) => sortTiles([...h, t]));
    else if (target === 'win') { setWinTile(t); setTarget('hand'); }
    else setMelds((ms) => [...ms, { type: target, tile: t }]);
  };

  const removeHandTile = (idx: number) => setHand((h) => h.filter((_, i) => i !== idx));
  const toggleFlower = (f: number) => setFlowers((fs) => (fs.includes(f) ? fs.filter((x) => x !== f) : [...fs, f].sort()));
  const toggleEvent = (k: keyof CalcEvents) => setEvents((e) => ({ ...e, [k]: !e[k] }));

  const clearAll = () => {
    setHand([]); setWinTile(null); setMelds([]); setFlowers([]);
    setEvents({ ...EMPTY_EVENTS }); setFlowerHu(null); setGreatChicken(false); setTarget('hand');
  };
  const loadExample = () => {
    clearAll();
    setHand(EXAMPLE.hand); setWinTile(EXAMPLE.winTile); setMelds(EXAMPLE.melds);
  };

  const ok = result.status === 'ok';

  return (
    <div className="calc">
      <div className="calc__input">
        <section className="calc-block" aria-labelledby="calc-setup">
          <h2 id="calc-setup" className="calc-block__title">食糊情況<span lang="en">Setup</span></h2>
          <div className="calc-row">
            <span className="calc-row__label">食糊方式</span>
            <div className="plates plates--sm" role="group" aria-label="食糊方式">
              <button type="button" aria-pressed={!selfDraw} onClick={() => setSelfDraw(false)}><b>出沖</b><span lang="en">Discard</span></button>
              <button type="button" aria-pressed={selfDraw} onClick={() => setSelfDraw(true)}><b>自摸</b><span lang="en">Self-draw</span></button>
            </div>
          </div>
          <div className="calc-row">
            <span className="calc-row__label">門風</span>
            <div className="plates plates--sm" role="group" aria-label="門風">
              {WIND_NAMES.map((w, i) => (
                <button key={w} type="button" aria-pressed={seatWind === i} onClick={() => setSeatWind(i)}><b>{w}</b></button>
              ))}
            </div>
          </div>
          <div className="calc-row">
            <span className="calc-row__label">莊家</span>
            <div className="plates plates--sm" role="group" aria-label="莊家">
              <button type="button" aria-pressed={!dealer} onClick={() => { setDealer(false); setDealerStreak(0); }}><b>閒家</b></button>
              <button type="button" aria-pressed={dealer} onClick={() => setDealer(true)}><b>莊家</b></button>
            </div>
            <div className={`stepper${dealer ? '' : ' is-off'}`} aria-label="連莊">
              <span>連莊</span>
              <button type="button" disabled={!dealer || dealerStreak === 0} onClick={() => setDealerStreak((n) => n - 1)} aria-label="減少連莊">−</button>
              <b className="num">{dealerStreak}</b>
              <button type="button" disabled={!dealer} onClick={() => setDealerStreak((n) => n + 1)} aria-label="增加連莊">+</button>
            </div>
          </div>
        </section>

        <section className="calc-block" aria-labelledby="calc-hand">
          <div className="calc-block__head">
            <h2 id="calc-hand" className="calc-block__title">我嘅牌<span lang="en">Your hand</span></h2>
            <span className={`meter num${effective === 17 ? ' is-full' : ''}`}>有效牌數 {effective} / 17</span>
          </div>

          <div className="hand-row">
            <span className="hand-row__label">手牌 <span className="num">{hand.length}</span></span>
            <div className="hand-row__tiles">
              {hand.length === 0 && <span className="calc-empty">未有牌</span>}
              {hand.map((t, i) => (
                <button key={`${t}-${i}`} type="button" className="tile-btn" onClick={() => removeHandTile(i)} aria-label={`移除 ${tileLabel(t)}`}>
                  <Tile tile={t} size="sm" />
                </button>
              ))}
            </div>
          </div>
          <div className="hand-row">
            <span className="hand-row__label">食糊張</span>
            <div className="hand-row__tiles">
              {winTile === null ? (
                <button type="button" className="text-btn" onClick={() => setTarget('win')}>揀食糊張</button>
              ) : (
                <button type="button" className="tile-btn" onClick={() => setWinTile(null)} aria-label={`移除食糊張 ${tileLabel(winTile)}`}>
                  <Tile tile={winTile} size="sm" win />
                </button>
              )}
            </div>
          </div>
          <div className="hand-row">
            <span className="hand-row__label">落地 <span className="num">{melds.length}</span></span>
            <div className="hand-row__tiles">
              {melds.length === 0 && <span className="calc-empty">冇</span>}
              {melds.map((meld, i) => (
                <button key={i} type="button" className="meld" onClick={() => setMelds((ms) => ms.filter((_, j) => j !== i))} aria-label={`移除${MELD_NAMES[meld.type]} ${tileLabel(meld.tile)}`}>
                  <span className="meld__type">{MELD_NAMES[meld.type]}</span>
                  {meldTiles(meld).map((t, k) => <Tile key={k} tile={t} size="sm" />)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="calc-block" aria-labelledby="calc-tiles">
          <div className="calc-block__head">
            <h2 id="calc-tiles" className="calc-block__title">揀牌<span lang="en">Tiles</span></h2>
            <div className="calc-block__actions">
              <button type="button" className="text-btn" onClick={loadExample}>載入雙食例子</button>
              <button type="button" className="text-btn" onClick={clearAll}>清除</button>
            </div>
          </div>

          <div className="calc-row calc-row--wrap">
            <span className="calc-row__label">放入</span>
            <div className="targets" role="radiogroup" aria-label="放入">
              {TARGETS.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={target === t.id} onClick={() => setTarget(t.id)}>
                  {t.zh}
                </button>
              ))}
            </div>
          </div>
          <p className="calc-hint">
            {target === 'hand' && '撳牌加入手牌（唔包食糊張）。撳手牌可以移除。'}
            {target === 'win' && '撳一隻牌做食糊張。'}
            {target === 'chow' && '撳順子最細嗰隻，例如撳 3萬 = 345萬。'}
            {(target === 'pung' || target === 'kong' || target === 'concealedKong') && `撳一隻牌加入${MELD_NAMES[target]}。`}
          </p>

          <div className="keypad">
            {KEY_ROWS.map((row) => (
              <div className="keypad__row" key={row.label}>
                {row.tiles.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="keypad__key"
                    onClick={() => place(t)}
                    disabled={!canPlace(t)}
                    aria-label={`${tileLabel(t)}（已用 ${used[t]}）`}
                  >
                    <Tile tile={t} />
                    {used[t] > 0 && <span className="keypad__used num" aria-hidden="true">{used[t]}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="calc-row calc-row--wrap">
            <span className="calc-row__label">花</span>
            <div className="flowers">
              {FLOWER_NAMES.map((f, i) => (
                <button key={f} type="button" aria-pressed={flowers.includes(i)} onClick={() => toggleFlower(i)} className="flower">
                  <b>{f}</b><span className="num">{(i % 4) + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="calc-block" aria-labelledby="calc-events">
          <h2 id="calc-events" className="calc-block__title">特殊事件<span lang="en">Events</span></h2>
          <div className="checks">
            {EVENT_OPTIONS.map((o) => (
              <label key={o.key} className="check">
                <input type="checkbox" checked={events[o.key]} onChange={() => toggleEvent(o.key)} />
                <span>{o.label}</span>
              </label>
            ))}
            <label className="check">
              <input type="checkbox" checked={greatChicken} onChange={() => setGreatChicken((v) => !v)} />
              <span>大雞胡</span>
            </label>
          </div>
          <div className="calc-row calc-row--wrap">
            <span className="calc-row__label">花胡</span>
            <div className="plates plates--sm" role="group" aria-label="花胡">
              {FLOWER_HU.map((o) => (
                <button key={o.label} type="button" aria-pressed={flowerHu === o.id} onClick={() => setFlowerHu(o.id)}><b>{o.label}</b></button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <aside className="calc__result" aria-labelledby="calc-result" aria-live="polite">
        <div className="result">
          <div className="result__head">
            <h2 id="calc-result">計番結果</h2>
            <div className={`result__total${ok ? '' : ' is-pending'}`}>
              <b className="num">{ok ? result.total : '–'}</b>
              <span>番</span>
            </div>
          </div>

          {result.status === 'empty' && <p className="result__msg">揀牌之後會即時計番。可以撳「載入雙食例子」試吓。</p>}
          {(result.status === 'count' || result.status === 'invalid') && <p className="result__msg is-warn">{result.message}</p>}

          {ok && (
            <>
              {result.isDoubleEat && (
                <p className="result__double">
                  <span className="rel-tag is-add">雙食</span>
                  兩種糊型各自計番，再相加。
                </p>
              )}
              {result.counted.map((r, i) => (
                <div className="reading-card" key={i}>
                  <div className="reading-card__head">
                    <span>{result.isDoubleEat ? `糊型 ${i === 0 ? 'A' : 'B'}：` : ''}{r.label}</span>
                    <b className="num">{r.fan}</b>
                  </div>
                  {r.groups.length > 0 && (
                    <div className="groups">{r.groups.map((g, k) => <span key={k} className="group">{g}</span>)}</div>
                  )}
                  <Lines lines={r.lines} onJump={onJump} />
                </div>
              ))}
              {result.shared.length > 0 && (
                <div className="reading-card">
                  <div className="reading-card__head">
                    <span>共用番（只計一次）</span>
                    <b className="num">{result.shared.reduce((a, l) => a + l.fan, 0)}</b>
                  </div>
                  <Lines lines={result.shared} onJump={onJump} />
                </div>
              )}
              {result.waits.length > 0 && (
                <p className="result__waits">
                  聽 <span className="num">{result.waits.length}</span> 種：
                  {result.waits.map((t) => <Tile key={t} tile={t} size="sm" />)}
                </p>
              )}
              {result.others.length > 0 && (
                <details className="result__others">
                  <summary>其他拆法（不計）{result.others.length} 種</summary>
                  {result.others.map((r, i) => (
                    <div className="reading-card is-other" key={i}>
                      <div className="reading-card__head"><span>{r.label}</span><b className="num">{r.fan}</b></div>
                      {r.groups.length > 0 && <div className="groups">{r.groups.map((g, k) => <span key={k} className="group">{g}</span>)}</div>}
                    </div>
                  ))}
                </details>
              )}
            </>
          )}
        </div>
      </aside>

      <div className="calc-bar" aria-hidden={!ok}>
        <span>總番</span>
        <b className="num">{ok ? result.total : '–'}</b>
        <a href="#calc-result">明細</a>
      </div>
    </div>
  );
};

export default CalculatorPage;
