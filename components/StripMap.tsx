import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CATEGORY_META, CATEGORY_ORDER, ScoringCategory } from '../types';

const LAST_LINE_KEY = 'lastLine';

export const lineId = (category: ScoringCategory) => `line-${CATEGORY_META[category].code.toLowerCase()}`;

const readLastLine = (): string | null => {
  try {
    return localStorage.getItem(LAST_LINE_KEY);
  } catch {
    return null;
  }
};

const writeLastLine = (code: string) => {
  try {
    localStorage.setItem(LAST_LINE_KEY, code);
  } catch {
    /* storage unavailable: the flag is a convenience only */
  }
};

interface StripMapProps {
  active: ScoringCategory;
}

const StripMap: React.FC<StripMapProps> = ({ active }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [train, setTrain] = useState<{ x: number; y: number } | null>(null);
  // The line the reader stopped at last visit; flagged until they move on.
  const [lastLine] = useState<string | null>(readLastLine);

  const activeCode = CATEGORY_META[active].code;

  // Only remember a line the reader actually moved to, not the default first line.
  const initialCode = useRef(activeCode);
  useEffect(() => {
    if (activeCode !== initialCode.current) {
      initialCode.current = '';
      writeLastLine(activeCode);
    }
  }, [activeCode]);

  useLayoutEffect(() => {
    const place = () => {
      const list = listRef.current;
      const dot = list?.querySelector<HTMLElement>(`[data-code="${activeCode}"] .station__dot`);
      if (!list || !dot) return;
      const listBox = list.getBoundingClientRect();
      const dotBox = dot.getBoundingClientRect();
      // Train ring is 40px, centred on the 30px dot.
      const half = (list.querySelector<HTMLElement>('.train')?.offsetWidth ?? 34) / 2;
      setTrain({
        x: dotBox.left + dotBox.width / 2 - listBox.left - half,
        y: dotBox.top + dotBox.height / 2 - listBox.top - half
      });

      const scroller = scrollerRef.current;
      if (scroller && scroller.scrollWidth > scroller.clientWidth) {
        const target = dotBox.left - scroller.getBoundingClientRect().left + scroller.scrollLeft - scroller.clientWidth / 2;
        scroller.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
      }
    };
    place();
    // Web fonts and layout shifts move the stations after first paint.
    const observer = new ResizeObserver(place);
    if (listRef.current) observer.observe(listRef.current);
    document.fonts?.ready.then(place);
    window.addEventListener('resize', place);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [activeCode]);

  return (
    <nav className="strip" aria-label="番種路線 Categories">
      <div className="strip__scroller" ref={scrollerRef}>
        <p className="strip__heading">
          番種路線<span>Lines</span>
        </p>
        <ol className="strip__list" ref={listRef}>
          <li className="strip__track" aria-hidden="true" />
          <li
            className="train"
            aria-hidden="true"
            style={{ transform: train ? `translate(${train.x}px, ${train.y}px)` : undefined, opacity: train ? 1 : 0 }}
          />
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category];
            const isActive = category === active;
            const showFlag = lastLine === meta.code && !isActive;
            return (
              <li
                key={category}
                className="station"
                data-code={meta.code}
                style={{ '--line': meta.color, '--line-ink': meta.ink } as React.CSSProperties}
              >
                <a href={`#${lineId(category)}`} aria-current={isActive ? 'true' : undefined}>
                  <span className="station__dot">{meta.code}</span>
                  <span className="station__text">
                    <span className="station__name">{category}</span>
                    <span className="station__en">{meta.nameEn}</span>
                  </span>
                </a>
                {showFlag && <span className="station__flag">上次</span>}
              </li>
            );
          })}
        </ol>
        <p className="strip__current" aria-live="polite">
          {active}
          <span className="en" lang="en">{CATEGORY_META[active].nameEn}</span>
        </p>
      </div>
    </nav>
  );
};

export default StripMap;
