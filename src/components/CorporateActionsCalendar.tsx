import React, { useState } from 'react';
import { CorporateAction } from '../types/market';
import {
  Calendar,
  DollarSign,
  Users,
  Split,
  Radio,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface CorporateActionsCalendarProps {
  corporateActions: CorporateAction[];
  onDispatchPush: (title: string, body: string, ticker: string, impact: 'HIGH' | 'MEDIUM' | 'LOW') => void;
}

export const CorporateActionsCalendar: React.FC<CorporateActionsCalendarProps> = ({
  corporateActions,
  onDispatchPush,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [sentId, setSentId] = useState<string | null>(null);

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

  const filteredActions = corporateActions.filter((item) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'Dividen') return item.type === 'Dividen Tunai';
    if (filterType === 'RUPS') return item.type === 'RUPS';
    if (filterType === 'Lainnya') return item.type !== 'Dividen Tunai' && item.type !== 'RUPS';
    return true;
  });

  const handlePushClick = (item: CorporateAction) => {
    onDispatchPush(
      `📅 ${item.ticker} ${item.type}`,
      `${item.detail} (${item.timeStr})`,
      item.ticker,
      'HIGH'
    );
    setSentId(item.id);
    setTimeout(() => setSentId(null), 2500);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-lg space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Kalender Aksi Korporasi &amp; Dividen Terkini (Terverifikasi BEI)
            </h3>
            <p className="text-xs text-slate-400">
              Jadwal resmi keterbukaan informasi bursa: ASII (Rp98), UNTR (Rp667), HEXA (Rp705), AALI (Rp84) &amp; RUPSLB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cum-Date Pasar Reguler Tutup 15:49 WIB</span>
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
            filterType === 'ALL'
              ? 'bg-slate-200 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Semua Aksi ({corporateActions.length})
        </button>
        <button
          onClick={() => setFilterType('Dividen')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filterType === 'Dividen'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dividen Tunai ({corporateActions.filter((c) => c.type === 'Dividen Tunai').length})</span>
        </button>
        <button
          onClick={() => setFilterType('RUPS')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filterType === 'RUPS'
              ? 'bg-indigo-500 text-white font-bold shadow-xs'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>RUPS &amp; RUPSLB ({corporateActions.filter((c) => c.type === 'RUPS').length})</span>
        </button>
        <button
          onClick={() => setFilterType('Lainnya')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filterType === 'Lainnya'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Split className="w-3.5 h-3.5 text-amber-400" />
          <span>Right Issue &amp; Pubex ({corporateActions.filter((c) => c.type !== 'Dividen Tunai' && c.type !== 'RUPS').length})</span>
        </button>
      </div>

      {/* Grid of Corporate Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredActions.map((item) => {
          const isSent = sentId === item.id;
          const isCumToday = item.status === 'CUM_TODAY';

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between p-3.5 sm:p-4 rounded-xl border transition-all ${
                isCumToday
                  ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 shadow-md ring-1 ring-emerald-500/30'
                  : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-950'
              }`}
            >
              <div>
                {/* Top Row: Ticker, Type, and Time Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base text-white tracking-wider">
                          {item.ticker}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            item.type === 'Dividen Tunai'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.type === 'RUPS'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium line-clamp-1">
                        {item.companyName}
                      </div>
                    </div>
                  </div>

                  {isCumToday ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      <Clock className="w-3 h-3" />
                      CUM DATE HARI INI
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {item.timeStr}
                    </span>
                  )}
                </div>

                {/* Detail Description */}
                <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                  {item.detail}
                </p>

                {/* Structured Dividend Dates Breakdown if applicable */}
                {item.cumDate && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[10px] font-mono">
                    <div>
                      <div className="text-slate-500">Cum Date:</div>
                      <div className="font-bold text-emerald-300 truncate">{item.cumDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Ex Date:</div>
                      <div className="font-bold text-slate-300 truncate">{item.exDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Payment:</div>
                      <div className="font-bold text-teal-300 truncate">{item.paymentDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Yield / Saham:</div>
                      <div className="font-bold text-amber-300 truncate">
                        {item.yieldPercent ? `~${item.yieldPercent}%` : item.amount}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Date & Push Reminder Button */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  🗓️ Tanggal: <strong className="text-slate-200">{item.date}</strong>
                </span>

                <button
                  onClick={() => handlePushClick(item)}
                  disabled={isSent}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isSent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
                  }`}
                  title="Kirim pengingat aksi korporasi ke HP"
                >
                  {isSent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Reminder Terkirim!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 text-emerald-400" />
                      <span>Setel Pengingat HP</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
