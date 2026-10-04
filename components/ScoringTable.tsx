import React from 'react';
import { CATEGORY_META, LIMIT_FAN, ScoringCategory } from '../types';
import { CodedItem } from '../constants';
import { lineId } from './StripMap';

interface FanPlateProps {
  fan: number | string;
}

export const FanPlate: React.FC<FanPlateProps> = ({ fan }) => {
  const isNumber = typeof fan === 'number';
  const isLimit = isNumber && fan >= LIMIT_FAN;
  return (
    <div className={`fan-plate${isLimit ? ' is-limit' : ''}`} aria-label={`${fan} 番`}>
      <b className={isNumber ? undefined : 'is-formula'}>{fan}</b>
      <span aria-hidden="true">番</span>
    </div>
  );
};

interface ScoringTableProps {
  category: ScoringCategory;
  items: CodedItem[];
}

const ScoringTable: React.FC<ScoringTableProps> = ({ category, items }) => {
  const meta = CATEGORY_META[category];
  const headingId = `${lineId(category)}-title`;

  return (
    <section
      id={lineId(category)}
      className="line"
      aria-labelledby={headingId}
      data-category={category}
      style={{ '--line': meta.color, '--line-ink': meta.ink } as React.CSSProperties}
    >
      <div className="line__bar" aria-hidden="true" />
      <header className="line__head">
        <span className="roundel" aria-hidden="true">{meta.code}</span>
        <div>
          <h2 className="line__title" id={headingId}>{category}</h2>
          <p className="line__en" lang="en">{meta.nameEn}</p>
        </div>
        <span className="line__count">{items.length} 項</span>
      </header>
      <ol className="stops">
        {items.map((item) => (
          <li key={item.id} id={`item-${item.code}`} className="stop">
            <span className="stop__dot" aria-hidden="true" />
            <div className="stop__body">
              <div className="stop__name-row">
                <h3 className="stop__name">{item.name}</h3>
                <span className="stop__name-en" lang="en">{item.nameEn}</span>
              </div>
              <p className="stop__desc">{item.description}</p>
              <p className="stop__desc-en" lang="en">{item.descriptionEn}</p>
              {item.example && <span className="stop__example">例：{item.example}</span>}
              <div className="stop__code">{item.code}</div>
            </div>
            <FanPlate fan={item.fan} />
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ScoringTable;
