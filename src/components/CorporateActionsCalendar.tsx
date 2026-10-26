import React from 'react';
import { CorporateAction } from '../types/market';
import { Calendar, DollarSign, Users, Split, Radio, Send, AlertTriangle } from 'lucide-react';

interface CorporateActionsCalendarProps {
  corporateActions: CorporateAction[];
  onDispatchPush: (title: string, body: string, ticker: string, impact: 'HIGH' | 'MEDIUM' | 'LOW') => void;
}

export const CorporateActionsCalendar: React.FC<CorporateActionsCalendarProps> = ({
  corporateActions,
  onDispatchPush,
}) => {
  const getTypeIcon = (type: CorporateAction['type']) => {
    switch (type) {
      case 'Dividen Tunai':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'RUPS':
        return <Users className="w-4 h-4 text-indigo-400" />;
      case 'Stock Split':
      case 'Right Issue':
        return <Split className="w-4 h-4 text-amber-400" />;
      default:
        return <Radio className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Kalender Corporate Actions &amp; Dividen Hari Ini
          </h3>
        </div>
        <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Cum-date reguler berakhir pada penutupan bursa
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {corporateActions.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-950 transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-slate-800">
                    {getTypeIcon(item.type)}
                  </div>
                  <span className="font-mono font-extrabold text-sm text-white">
                    {item.ticker}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.type}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {item.timeStr}
                </span>
              </div>

              <div className="mt-1.5 text-xs text-slate-300 font-medium line-clamp-1">
                {item.companyName}
              </div>

              <p className="mt-1 text-xs text-slate-400 leading-snug">
                {item.detail}
              </p>

              {item.yieldPercent && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Indikasi Yield:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ~{item.yieldPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({item.amount})
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Jadwal: {item.date}
              </span>
              <button
                onClick={() =>
                  onDispatchPush(
                    `📅 ${item.ticker} ${item.type}`,
                    `${item.detail} (${item.timeStr})`,
                    item.ticker,
                    'HIGH'
                  )
                }
                className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Setel Reminder HP</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
