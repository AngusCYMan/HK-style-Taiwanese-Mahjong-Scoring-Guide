import React from 'react';
import { CATEGORY_META } from '../types';
import { ITEM_BY_ID } from '../constants';

interface RulesPageProps {
  onJump: (code: string) => void;
}

const ItemChip: React.FC<{ id: string; onJump: (code: string) => void }> = ({ id, onJump }) => {
  const item = ITEM_BY_ID[id];
  if (!item) return null;
  const meta = CATEGORY_META[item.category];
  return (
    <a
      href={`#item-${item.code}`}
      className="chip"
      style={{ '--line': meta.color, '--line-ink': meta.ink } as React.CSSProperties}
      onClick={(e) => {
        e.preventDefault();
        onJump(item.code);
      }}
    >
      <span className="chip__code">{item.code}</span>
      {item.name}
    </a>
  );
};

type Relation = { head?: string[]; items: string[]; note: string };

const INCLUDES: Relation[] = [
  { head: ['p-6'], items: ['o-3', 'd-4'], note: '間間胡已包含對對胡及暗刻系列，只計間間胡。' },
  { head: ['b-7'], items: ['b-6', 'b-5'], note: '無字花大平胡已包含無字花、平胡（及無字、無花）。' },
  { head: ['b-6'], items: ['b-3', 'f-4'], note: '無字花已包含無字與無花。' },
  { head: ['t-1'], items: ['b-3'], note: '斷么本身已無番子，不另計無字。' },
  { head: ['o-5'], items: ['o-1', 'b-3'], note: '清一色已包含缺一門及無字。' },
  { head: ['o-4'], items: ['o-1'], note: '混一色已包含缺一門。' },
  { head: ['w-4'], items: ['w-3', 'w-2', 'w-1'], note: '大四喜不另計小四喜、大三風、小三風。' },
  { head: ['w-6'], items: ['w-5'], note: '大三元不另計小三元。' },
  { head: ['h-5', 'h-4'], items: ['h-3'], note: '大／小三兄弟不另計二兄弟。' },
  { head: ['h-7'], items: ['h-6'], note: '大三姊妹不另計小三姊妹。' },
  { items: [], note: '門清自摸已包含門清與自摸，不另分開計。（備註：本表未設門清／自摸番。）' }
];

const HIGHEST: Relation[] = [
  { items: ['d-1', 'd-2', 'd-3', 'd-4'], note: '暗刻系列：按暗刻數目計一項。' },
  { items: ['s-1', 's-2', 's-3'], note: '般高系列：同一組順子只計最高一級。' },
  { items: ['s-4', 's-5'], note: '相逢系列：同一組順子只計最高一級。' },
  { items: ['t-2', 't-3', 't-4', 't-5'], note: '么九系列：只計符合的最高一項。' },
  { items: ['x-1', 'x-2'], note: '帶X系列：只計一項。' },
  { items: ['dr-1', 'dr-2', 'dr-3', 'dr-4'], note: '龍系列：一條龍只計一種。' },
  { items: ['e-7', 'e-6'], note: '手牌張數：七只內不另計十只內。' },
  { items: ['e-8', 'e-9'], note: '求人：半求人與全求人只計一項。' },
  { items: ['e-4', 'e-5'], note: '一炮多響：雙響與三響只計一項。' },
  { items: ['e-12', 'e-10', 'e-11'], note: '天胡、地胡、人胡只計一項。' }
];

const EXCLUSIVE: Relation[] = [
  { items: ['o-1', 'b-3'], note: '缺一門與無字不可同時計算，僅取其一。' },
  { items: ['s-6', 's-7'], note: '四同順／五同順不再計二／三相逢或般高。' },
  { items: ['b-1', 'b-2', 'b-8'], note: '聽牌方式只計一種：獨獨、假獨、對碰三選一。' }
];

const FLOW = [
  {
    t: '確認有效牌數',
    d: '手牌 + 上／碰組數 × 3 + 食糊張 = 17 張。槓和花不計入。',
    en: 'Hand + melds × 3 + winning tile must total 17. Kongs and flowers do not count.'
  },
  {
    t: '檢查特殊牌型',
    d: '十三么、十六不搭、嚦咕嚦咕、花胡等，先看是否成立。',
    en: 'Check special patterns first (Thirteen Orphans, Sixteen Unrelated, Seven Pairs Plus One, Flower Wins).'
  },
  {
    t: '列出所有合法拆法',
    d: '標準糊型為 5 組 + 1 對；同一手牌可能有多於一種拆法。',
    en: 'List every valid reading: standard 5 sets + 1 pair, or a special pattern.'
  },
  {
    t: '每種拆法各自計牌型番',
    d: '組合番、順子／刻子番、么九、家人、暗刻、字牌刻子、聽牌方式，按「不重複計算」規則。',
    en: 'Score each reading on its own: combinations, honors pungs and wait type, applying the non-overlap rules.'
  },
  {
    t: '雙食？兩種相加，否則取最高',
    d: '如兩種不同糊型都成立（例如嚦咕嚦咕 + 標準糊型），兩者牌型番相加；否則只取番數最高的一種拆法。',
    en: 'If two different winning forms both hold, add them (Double Interpretation). Otherwise take the highest reading.',
    branch: true
  },
  {
    t: '加上與拆法無關的番',
    d: '花番（無花／爛花／正花）、特殊事件番（花上、槓上、搶槓等），只計一次。',
    en: 'Add flowers and special-event fan once; they do not depend on the reading.'
  },
  {
    t: '加底番 5 番',
    d: '所有食糊都有底番 5 番；大雞胡不計底番。',
    en: 'Add the 5-fan base. The Great Chicken Hu does not take the base.'
  },
  {
    t: '最後加莊家番',
    d: '莊家 +1，連莊按 N × 2 + 1 計。',
    en: 'Finally add dealer (+1) and consecutive-dealer (N × 2 + 1) fan.'
  }
];

const PAYMENTS = [
  { name: '追', en: 'Follow', cost: '1底', detail: '四家打同一隻牌' },
  { name: '一台花', en: 'Flower Set', cost: '1底', detail: '摸齊同系列四花' },
  { name: '圍骰', en: 'Dealer Triple', cost: '1底 × 3', detail: '莊家擲出圍骰' },
  { name: '詐胡', en: 'False Win', cost: '30番 × 3', detail: '詐胡者賠付全場' }
];

const Tiles: React.FC<{ tiles: string[] }> = ({ tiles }) => (
  <div className="tiles" aria-label={`${tiles.join(' ')} 萬`}>
    {tiles.map((t, i) => (
      <span key={i} className="tile" aria-hidden="true">{t}</span>
    ))}
    <span className="tile-suit" aria-hidden="true">萬</span>
  </div>
);

const RelationList: React.FC<{ list: Relation[]; onJump: (code: string) => void; arrow?: string; sep?: string }> = ({
  list,
  onJump,
  arrow = '包含',
  sep = '、'
}) => (
  <ul className="rel-list">
    {list.map((rel, idx) => (
      <li key={idx} className="rel">
        {(rel.head || rel.items.length > 0) && (
          <div className="rel__items">
            {rel.head?.map((id, i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="rel__sep">{sep}</span>}
                <ItemChip id={id} onJump={onJump} />
              </React.Fragment>
            ))}
            {rel.head && <span className="rel__sep">{arrow}</span>}
            {rel.items.map((id, i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="rel__sep">{sep}</span>}
                <ItemChip id={id} onJump={onJump} />
              </React.Fragment>
            ))}
          </div>
        )}
        <p className="rel__note">{rel.note}</p>
      </li>
    ))}
  </ul>
);

const RulesPage: React.FC<RulesPageProps> = ({ onJump }) => {
  return (
    <div className="rules">
      <section className="notice" aria-labelledby="notice-title">
        <div className="notice__head">
          <h2 id="notice-title">重要說明</h2>
          <span lang="en">Read first</span>
        </div>
        <dl className="notice__body">
          <div className="fact">
            <dt>有效牌數</dt>
            <dd>
              <span className="formula">
                <span className="token">手牌</span><span className="op">+</span>
                <span className="token">上／碰組數 × 3</span><span className="op">+</span>
                <span className="token">食糊張</span><span className="op">=</span>
                <span className="token">17 張</span>
              </span>
              <span className="en" lang="en">Kongs and flowers are not counted. 槓和花不計入。</span>
            </dd>
          </div>
          <div className="fact">
            <dt>底番</dt>
            <dd>
              所有食糊都有 <strong>5 番</strong> 底番（大雞胡除外）。
              <span className="en" lang="en">Every win takes a 5-fan base, except the Great Chicken Hu.</span>
            </dd>
          </div>
          <div className="fact">
            <dt>雙食</dt>
            <dd>
              一手牌同時成立兩種糊型時，<strong>兩種各自計番後相加</strong>，見下文。
              <span className="en" lang="en">When a hand is two valid winning forms at once, score each and add them.</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rules-section" aria-labelledby="flow-title">
        <div className="rules-section__head">
          <h2 id="flow-title">計番流程</h2>
          <span lang="en">Calculation flow</span>
        </div>
        <ol className="flow">
          {FLOW.map((step, idx) => (
            <li key={idx} className={step.branch ? 'is-branch' : undefined}>
              <span className="flow__n" aria-hidden="true">{idx + 1}</span>
              <div>
                <p className="flow__t">{step.t}</p>
                <p className="flow__d">
                  {step.d}
                  <span className="en" lang="en">{step.en}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rules-section" aria-labelledby="double-title">
        <div className="rules-section__head">
          <h2 id="double-title">雙食（一牌兩食）</h2>
          <span lang="en">Double Interpretation</span>
        </div>
        <p className="lead">
          食糊時手牌同時符合兩種不同糊型，每種糊型獨立計一次牌型番，然後相加。例如一手牌既可以嚦咕嚦咕（7對 + 1刻）食糊，又可以拆成標準 5 組 + 1 對食糊。
          <span className="en" lang="en">
            The hand satisfies two different winning forms. Score each form's hand fan independently, then add them.
          </span>
        </p>
        <div className="hand">
          <p className="hand__label">手牌（17 張，全萬子）</p>
          <Tiles tiles={['1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '8', '8', '9', '9', '9']} />
          <div className="readings">
            <div className="reading">
              <p className="reading__t">糊型 A：嚦咕嚦咕<span className="en" lang="en">Reading A</span></p>
              <div className="groups" aria-label="11 22 33 44 55 66 88 999">
                {['11', '22', '33', '44', '55', '66', '88', '999'].map((g) => <span key={g} className="group">{g}</span>)}
              </div>
              <p>7 對 + 1 刻。計嚦咕嚦咕，再加此糊型適用的其他牌型番（如聽牌方式、字牌）。</p>
            </div>
            <div className="reading">
              <p className="reading__t">糊型 B：標準 5 組 + 1 對<span className="en" lang="en">Reading B</span></p>
              <div className="groups" aria-label="123 123 456 456 999 88">
                {['123', '123', '456', '456', '999', '88'].map((g, i) => <span key={i} className="group">{g}</span>)}
              </div>
              <p>重新按順子、刻子計一次，例如兩組一般高，再加此糊型適用的其他牌型番。</p>
            </div>
          </div>
          <p className="total">
            總番 = 糊型 A 牌型番 + 糊型 B 牌型番 + 花番／事件番 + 底番 5 + 莊家番
            <small>花番、特殊事件、底番及莊家番與拆法無關，只計一次。</small>
          </p>
        </div>
      </section>

      <section className="rules-section" aria-labelledby="overlap-title">
        <div className="rules-section__head">
          <h2 id="overlap-title">不重複計算</h2>
          <span lang="en">Non-overlap rules</span>
        </div>
        <p className="lead">
          按任何一項可跳到番數表對應位置。
          <span className="en" lang="en">Tap an item to jump to it in the table.</span>
        </p>

        <div className="rel-group">
          <div className="rel-group__head">
            <span className="rel-tag">包含</span>
            <p>上層已包含下層，只計上層。</p>
          </div>
          <RelationList list={INCLUDES} onJump={onJump} />
        </div>

        <div className="rel-group">
          <div className="rel-group__head">
            <span className="rel-tag is-highest">取最高</span>
            <p>同一系列只計符合的最高一項。</p>
          </div>
          <RelationList list={HIGHEST} onJump={onJump} sep="→" />
        </div>

        <div className="rel-group">
          <div className="rel-group__head">
            <span className="rel-tag is-exclusive">不同計</span>
            <p>互相排斥，只可計其中一項。</p>
          </div>
          <RelationList list={EXCLUSIVE} onJump={onJump} />
        </div>

        <div className="rel-group">
          <div className="rel-group__head">
            <span className="rel-tag is-add">相加</span>
            <p>唯一可以把兩種拆法番數相加的情況。</p>
          </div>
          <RelationList list={[{ items: ['p-10'], note: '雙食：兩種糊型各自計牌型番後相加（見上文）。' }]} onJump={onJump} />
        </div>
      </section>

      <section className="rules-section" aria-labelledby="money-title">
        <div className="rules-section__head">
          <h2 id="money-title">計錢與即時付款</h2>
          <span lang="en">Settlement</span>
        </div>
        <div className="pay-grid">
          <div>
            <h3>計錢方法<span lang="en">Pay method</span></h3>
            <p className="formula">
              <span className="token">收入</span><span className="op">=</span>
              <span className="token">番數 × 每番金額</span><span className="op">+</span>
              <span className="token">底注</span>
            </p>
            <p className="en" lang="en">Income = fan × rate + base stake</p>
          </div>
          <div>
            <h3>拉注制度<span lang="en">Pull system</span></h3>
            <p>上一鋪胡出的，今鋪又胡出，上一鋪其他家輸了的錢要先乘 1.5 倍，再加上這鋪輸的錢。</p>
            <p className="en" lang="en">Repeat winner: losers' previous-hand amount × 1.5, plus this hand.</p>
          </div>
        </div>
        <table className="pay-table">
          <thead>
            <tr>
              <th scope="col">即時付款項目</th>
              <th scope="col">情況</th>
              <th scope="col">付款</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((p) => (
              <tr key={p.name}>
                <td><b>{p.name}</b><span className="en" lang="en">{p.en}</span></td>
                <td>{p.detail}</td>
                <td className="pay-cost">{p.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default RulesPage;
