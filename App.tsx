import React, { useCallback, useEffect, useState } from 'react';
import { CATEGORY_ORDER, ScoringCategory } from './types';
import { GROUPED_ITEMS } from './constants';
import ScoringTable from './components/ScoringTable';
import RulesPage from './components/RulesPage';
import StripMap from './components/StripMap';
import CalculatorPage from './components/CalculatorPage';

type View = 'table' | 'rules' | 'calc';

const viewFromHash = (): View => (window.location.hash === '#rules' ? 'rules' : window.location.hash === '#calc' ? 'calc' : 'table');

const readTheme = (): boolean => document.documentElement.classList.contains('dark');

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>(viewFromHash);
  const [isDark, setIsDark] = useState<boolean>(readTheme);
  const [activeLine, setActiveLine] = useState<ScoringCategory>(CATEGORY_ORDER[0]);
  const [pendingJump, setPendingJump] = useState<string | null>(() => {
    const match = window.location.hash.match(/^#item-([A-Z]{2}-[0-9]{2})$/);
    return match ? match[1] : null;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      /* theme still applies for this visit */
    }
  }, [isDark]);

  // Track which line is under the strip map.
  useEffect(() => {
    if (view !== 'table') return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.line[data-category]'));
    const onScroll = () => {
      // A line counts as in view once its top passes the upper quarter below the sticky map.
      const strip = document.querySelector('.strip');
      const stripBottom = window.innerWidth >= 1024 ? 0 : strip?.getBoundingClientRect().bottom ?? 0;
      const probe = stripBottom + window.innerHeight * 0.25;
      let current = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top - probe <= 0) current = s;
      }
      // At the very bottom, the last line is the one being read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
      }
      const cat = current?.dataset.category as ScoringCategory | undefined;
      if (cat) setActiveLine(cat);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [view]);

  // Jump from a rule chip to its row in the table.
  useEffect(() => {
    if (view !== 'table' || !pendingJump) return;
    const el = document.getElementById(`item-${pendingJump}`);
    if (el) {
      el.scrollIntoView({ block: 'center' });
      el.classList.remove('is-target');
      void el.offsetWidth;
      el.classList.add('is-target');
    }
    setPendingJump(null);
  }, [view, pendingJump]);

  const jumpToItem = useCallback((code: string) => {
    history.replaceState(null, '', window.location.pathname);
    setPendingJump(code);
    setView('table');
  }, []);

  const switchView = (next: View) => {
    setView(next);
    history.replaceState(null, '', next === 'table' ? window.location.pathname : `#${next}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <header className="sign">
        <div className="sign__inner">
          <div>
            <h1 className="sign__title">
              台灣麻雀<small>（港式）</small>
            </h1>
            <p className="sign__sub" lang="en">Taiwan Mahjong, Hong Kong style · Scoring guide</p>
            <p className="sign__meta">17張牌制 · 本群規則</p>
          </div>
          <div className="sign__controls">
            <div className="plates" role="group" aria-label="View">
              <button type="button" aria-pressed={view === 'table'} onClick={() => switchView('table')}>
                <b>番數一覽</b>
                <span lang="en">Fan table</span>
              </button>
              <button type="button" aria-pressed={view === 'rules'} onClick={() => switchView('rules')}>
                <b>規則流程</b>
                <span lang="en">Rules</span>
              </button>
              <button type="button" aria-pressed={view === 'calc'} onClick={() => switchView('calc')}>
                <b>計番器</b>
                <span lang="en">Calculator</span>
              </button>
            </div>
            <button
              type="button"
              className="theme-btn"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? '切換淺色 Light mode' : '切換深色 Dark mode'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === 'table' ? (
          <div className="shell table-layout">
            <StripMap active={activeLine} />
            <div className="lines">
              {GROUPED_ITEMS.map(({ category, items }) => (
                <ScoringTable key={category} category={category} items={items} />
              ))}
            </div>
          </div>
        ) : view === 'rules' ? (
          <RulesPage onJump={jumpToItem} />
        ) : (
          <CalculatorPage onJump={jumpToItem} />
        )}
      </main>

      <footer className="foot">
        <b>港式台灣麻雀番數表</b> · 最後更新：2026年9月30日
      </footer>
    </>
  );
};

export default App;
