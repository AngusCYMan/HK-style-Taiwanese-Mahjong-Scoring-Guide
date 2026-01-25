
import React from 'react';
import { ScoringItem, CATEGORY_TRANSLATIONS } from '../types';

interface ScoringTableProps {
  title: string;
  items: ScoringItem[];
}

const ScoringTable: React.FC<ScoringTableProps> = ({ title, items }) => {
  const titleEn = CATEGORY_TRANSLATIONS[title as keyof typeof CATEGORY_TRANSLATIONS] || '';

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-slate-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          {title} <span className="text-sm font-normal opacity-80 ml-2">{titleEn}</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-24 text-center">番數 <br/><span className="text-[10px] font-normal">Fan</span></th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider min-w-[140px]">名稱 <br/><span className="text-[10px] font-normal">Name</span></th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">說明 <br/><span className="text-[10px] font-normal">Description</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className={`text-center font-bold text-lg ${Number(item.fan) >= 40 ? 'text-rose-600 dark:text-rose-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {item.fan}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-base">{item.name}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">{item.nameEn}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</span>
                    <span className="text-slate-400 dark:text-slate-600 text-xs italic">{item.descriptionEn}</span>
                    {item.example && (
                      <span className="text-slate-400 dark:text-slate-500 text-xs mt-1 italic">例：{item.example}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ScoringTable;
