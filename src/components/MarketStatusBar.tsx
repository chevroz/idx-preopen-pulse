import React from 'react';
import { MarketSessionInfo, MacroIndicator } from '../types/market';
import { TrendingUp, TrendingDown, Clock, ShieldAlert, Sparkles, DollarSign, Flame, Layers } from 'lucide-react';

interface MarketStatusBarProps {
  sessionInfo: MarketSessionInfo | null;
  macroIndicators: MacroIndicator[];
}

export const MarketStatusBar: React.FC<MarketStatusBarProps> = ({
  sessionInfo,
  macroIndicators,
}) => {
  // Format seconds to HH:MM:SS or MM:SS
  const formatCountdown = (sec: number) => {
    if (sec <= 0) return '00:00';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    if (hrs > 0) {
      return `${hrs}j ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    }
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PRE_OPEN':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400 animate-ping',
          label: 'FASE PRE-OPENING (08:45 - 08:59 WIB)',
          desc: 'Pasang order sebelum pembukaan pasar reguler',
        };
      case 'OPEN_SESSION_1':
      case 'OPEN_SESSION_2':
        return {
          bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          dot: 'bg-teal-400 animate-pulse',
          label: 'BURSA BUKA (SESI AKTIF)',
          desc: 'Perdagangan pasar reguler sedang berlangsung',
        };
      case 'BREAK':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: 'JEDA SIANG (ISHOMA)',
          desc: 'Pasar reguler ditutup sementara',
        };
      default:
        return {
          bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400',
          label: 'FASE PRE-MARKET PREPARATION',
          desc: 'Waktu krusial membaca berita & analisis sebelum 08:45 WIB',
        };
    }
  };

  const badge = getStatusBadge(sessionInfo?.status);

  return (
    <div className="w-full space-y-3">
      {/* Top Banner: Market Session & Countdown Hero Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-4 sm:p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Status info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${badge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                {badge.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {sessionInfo?.dateWIB || 'Jakarta Time (WIB UTC+7)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {badge.desc}
            </p>
          </div>

          {/* Countdown & Timing Clock */}
          <div className="flex items-center gap-3 sm:gap-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 sm:px-4 sm:py-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  Menuju {sessionInfo?.nextEvent?.split('(')[0]?.trim() || 'Pre-Opening'}
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300 tracking-wider">
                  {sessionInfo ? formatCountdown(sessionInfo.secondsToNextEvent) : '00:00:00'}
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-slate-800" />

            <div className="hidden sm:block text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Jam Jakarta (WIB)</div>
              <div className="text-sm font-semibold font-mono text-slate-200">
                {sessionInfo?.currentTimeWIB || '--:--:-- WIB'}
              </div>
            </div>
          </div>
        </div>

        {/* Mini Schedule Steps */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 grid grid-cols-2 xs:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className={`p-2 rounded-lg border transition ${sessionInfo?.status === 'CLOSED' ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' : 'bg-slate-950/40 border-slate-800/50 text-slate-400'}`}>
            <div className="font-semibold text-slate-200">06:00 - 08:44</div>
            <div className="text-[10px] truncate text-slate-400">Pre-Market Prep</div>
          </div>
          <div className={`p-2 rounded-lg border transition ${sessionInfo?.status === 'PRE_OPEN' ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300 shadow-xs' : 'bg-slate-950/40 border-slate-800/50 text-slate-400'}`}>
            <div className="font-semibold text-slate-200">08:45 - 08:59</div>
            <div className="text-[10px] truncate text-slate-400">Pre-Opening Call</div>
          </div>
          <div className={`p-2 rounded-lg border transition ${sessionInfo?.status === 'OPEN_SESSION_1' ? 'bg-teal-950/50 border-teal-500/60 text-teal-300' : 'bg-slate-950/40 border-slate-800/50 text-slate-400'}`}>
            <div className="font-semibold text-slate-200">09:00 - 12:00</div>
            <div className="text-[10px] truncate text-slate-400">Pasar Reguler Sesi 1</div>
          </div>
          <div className={`p-2 rounded-lg border transition ${sessionInfo?.status === 'OPEN_SESSION_2' ? 'bg-teal-950/50 border-teal-500/60 text-teal-300' : 'bg-slate-950/40 border-slate-800/50 text-slate-400'}`}>
            <div className="font-semibold text-slate-200">13:30 - 15:49</div>
            <div className="text-[10px] truncate text-slate-400">Pasar Reguler Sesi 2</div>
          </div>
        </div>
      </div>

      {/* Macro & Commodity Catalysts Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {macroIndicators.map((item) => (
          <div
            key={item.symbol}
            className="group relative overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900 p-3 transition shadow-xs hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono tracking-wider text-slate-300 group-hover:text-white">
                {item.symbol}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  item.changePercent >= 0
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {item.changePercent >= 0 ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                {item.changePercent >= 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
              </span>
            </div>

            <div className="mt-1.5">
              <div className="text-base sm:text-lg font-bold font-mono text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5" title={item.name}>
                {item.name}
              </div>
            </div>

            {item.note && (
              <div className="mt-2 pt-1.5 border-t border-slate-800/60 text-[9px] text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all">
                {item.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
