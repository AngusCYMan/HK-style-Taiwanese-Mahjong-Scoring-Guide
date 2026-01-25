
import React, { useState, useMemo, useEffect } from 'react';
import { ScoringItem, ScoringCategory } from './types';
import { SCORING_DATA } from './constants';
import ScoringTable from './components/ScoringTable';
import RulesPage from './components/RulesPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'rules'>('table');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const categoriesOrder = [
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

  const groupedData = useMemo(() => {
    const groups: Record<string, ScoringItem[]> = {};
    
    SCORING_DATA.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, []);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="bg-indigo-900 dark:bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <span className="text-3xl">🀄</span> 台灣麻雀（港式）
                </h1>
                <p className="text-indigo-200 dark:text-slate-400 text-xs md:text-sm mt-1">17張牌制 - 完整番數指南</p>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="md:hidden p-2 rounded-lg bg-indigo-800 dark:bg-slate-800 text-white"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="flex bg-indigo-800 dark:bg-slate-800 p-1 rounded-lg flex-grow md:flex-grow-0">
                <button
                  onClick={() => setActiveTab('table')}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md transition-all font-medium text-sm md:text-base ${
                    activeTab === 'table' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' : 'text-indigo-300 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  番數一覽 <span className="hidden md:inline">Table</span>
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md transition-all font-medium text-sm md:text-base ${
                    activeTab === 'rules' ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' : 'text-indigo-300 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  規則流程 <span className="hidden md:inline">Rules</span>
                </button>
              </nav>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="hidden md:block p-2 rounded-lg bg-indigo-800 dark:bg-slate-800 text-white hover:bg-indigo-700 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'table' ? (
          <div className="space-y-12">
            {categoriesOrder.map((category) => (
              groupedData[category] && (
                <ScoringTable 
                  key={category} 
                  title={category} 
                  items={groupedData[category]} 
                />
              )
            ))}
          </div>
        ) : (
          <RulesPage />
        )}
      </main>

      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-8 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-medium text-slate-300">🀄 港式台灣麻雀番數表 © 2025</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm">
            <span>最後更新：2025年1月25日</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
