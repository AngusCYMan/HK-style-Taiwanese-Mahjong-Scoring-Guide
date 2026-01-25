
import React from 'react';

const RulesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <section className="bg-blue-50 dark:bg-slate-900 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
          📌 重要說明 <span className="text-sm font-normal opacity-70">Important Info</span>
        </h2>
        <ul className="space-y-3 text-blue-900 dark:text-slate-300 list-disc ml-5 font-medium">
          <li><strong>有效牌數：</strong> 手牌 + 上/碰組數×3 + 胡牌 = 17張（<span className="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 px-1 rounded">槓和花不計入</span>）</li>
          <li><strong>底番：</strong> 所有胡牌都有 <strong>5番</strong> 基礎底番 (Base)</li>
        </ul>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
            <span>📖 計算流程</span>
            <span className="text-xs font-normal text-slate-400">Calculation Flow</span>
          </h3>
          <ol className="space-y-4">
            {[
              "檢查特殊牌型 (Check Special Patterns)",
              "分析標準組合 (Analyze 5 Groups + 1 Pair)",
              "計算各類組合番 (Calculate Chow/Pung/Family combos)",
              "選擇最高番數組合 (Select highest fan combo)",
              "加上特殊事件番 (Add Special Events)",
              "底番檢查 (Add Base)",
              "最後加上莊家番 (Add Dealer Bonuses)"
            ].map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <span className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
            <span>⚠️ 不重複計算</span>
            <span className="text-xs font-normal text-slate-400">Non-Overlap Rules</span>
          </h3>
          <ul className="space-y-4">
            {[
              { title: "缺一門 / 無字", desc: "兩者不可同時計算，僅取其一。" },
              { title: "四同順 / 五同順", desc: "不再計二/三相逢或般高。" },
              { title: "門清自摸", desc: "已包含門清與自摸，不另分開計。" },
              { title: "無字花", desc: "包含無字與無花。" }
            ].map((rule, idx) => (
              <li key={idx} className="group">
                <span className="block font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{rule.title}</span>
                <span className="text-sm text-slate-500 dark:text-slate-500">{rule.desc}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-2xl shadow-xl transition-colors">
        <h3 className="text-xl font-bold mb-8 text-indigo-300">💰 經濟規則與制度 <span className="text-sm font-normal text-slate-500">Economy</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="font-bold text-indigo-400 mb-4 uppercase tracking-wider text-sm">計錢方法 (Pay Method)</h4>
            <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-700">
              <p className="font-mono text-indigo-200 mb-2">收入 = (番數 × 每番金額) + 底注</p>
              <p className="text-slate-400 text-sm">Income = (Fan x Rate) + Base Stake</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-indigo-400 mb-4 uppercase tracking-wider text-sm">拉注制度 (Pull System)</h4>
            <p className="text-slate-300 leading-relaxed text-sm italic">
              上一鋪胡出的，今鋪又胡出，上一鋪其他家輸了錢要先乘 1.5 倍，再加上這鋪輸的錢。
              Winning streaks increase stakes by 1.5x for losers.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>💵 即時付款項目</span>
          <span className="text-xs font-normal text-slate-400">Instant Payments</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "追 (Follow)", cost: "1底", detail: "四家打同牌" },
            { name: "一台花 (Flower Set)", cost: "1底", detail: "摸齊同色四花" },
            { name: "圍骰 (Dealer Triple)", cost: "1底x3", detail: "莊家擲圍骰" },
            { name: "詐胡 (False Win)", cost: "30番x3", detail: "賠付全場" }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{item.cost}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RulesPage;
