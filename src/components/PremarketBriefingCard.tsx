import React, { useState } from 'react';
import { PreMarketBriefing } from '../types/market';
import { Sparkles, RefreshCw, Volume2, VolumeX, TrendingUp, TrendingDown, Target, Shield, Compass, CheckCircle } from 'lucide-react';

interface PremarketBriefingCardProps {
  briefing: PreMarketBriefing;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  watchlist: string[];
}

export const PremarketBriefingCard: React.FC<PremarketBriefingCardProps> = ({
  briefing,
  onRefresh,
  isRefreshing,
  watchlist,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioBriefing = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Fitur Text-to-Speech tidak didukung pada browser ini.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narrative = `Selamat pagi investor. Berikut ringkasan pra-pembukaan bursa IDX.
Sentimen IHSG diperkirakan ${briefing.ihsgBias}. ${briefing.biasReason}
Level pivot berada di ${briefing.supportResistance.pivot}, dengan batas support ${briefing.supportResistance.support1} dan resistance ${briefing.supportResistance.resistance1}.
Katalis saham utama: ${briefing.topCatalysts.map((c) => `${c.ticker}, rekomendasi ${c.action}, ${c.catalyst}`).join('. ')}.
Tips pre-opening: ${briefing.keyAdvice}`;

    const utterance = new SpeechSynthesisUtterance(narrative);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const biasBadge =
    briefing.ihsgBias === 'BULLISH'
      ? {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: TrendingUp,
          label: 'BULLISH BIAS',
        }
      : briefing.ihsgBias === 'BEARISH'
      ? {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: TrendingDown,
          label: 'BEARISH BIAS',
        }
      : {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: Compass,
          label: 'NEUTRAL CONSOLIDATION',
        };

  const BiasIcon = biasBadge.icon;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                AI Pre-Market Strategy Briefing
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Update {briefing.generatedAt}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sintesis otomatis katalis global, komoditas, &amp; keterbukaan informasi IDX sebelum 08:45 WIB
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Audio voice player */}
          <button
            onClick={handleAudioBriefing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              isPlayingAudio
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 animate-pulse'
                : 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Dengarkan rangkuman suara pra-pasar"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlayingAudio ? 'Stop Suara' : 'Audio Brief'}</span>
          </button>

          {/* Regenerate AI */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 hover:text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
            title="Perbarui analisa dengan Gemini 3.8 Flash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Menganalisis...' : 'Regenerate AI'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Bias + Support Resistance + Macro */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bias Column */}
        <div className="space-y-2 rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Proyeksi Arah IHSG Hari Ini
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${biasBadge.bg}`}
            >
              <BiasIcon className="w-3.5 h-3.5" />
              {biasBadge.label}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {briefing.biasReason}
          </p>
        </div>

        {/* Support & Resistance Levels */}
        <div className="space-y-2 rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Level Kunci IHSG
            </span>
            <Target className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="grid grid-cols-5 gap-1 text-center font-mono pt-1">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-[9px] text-slate-400">S2</div>
              <div className="text-xs font-bold text-rose-400">{briefing.supportResistance.support2}</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-[9px] text-slate-400">S1</div>
              <div className="text-xs font-bold text-rose-300">{briefing.supportResistance.support1}</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-indigo-500/40">
              <div className="text-[9px] text-indigo-400 font-semibold">PIVOT</div>
              <div className="text-xs font-extrabold text-white">{briefing.supportResistance.pivot}</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-[9px] text-slate-400">R1</div>
              <div className="text-xs font-bold text-emerald-300">{briefing.supportResistance.resistance1}</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-[9px] text-slate-400">R2</div>
              <div className="text-xs font-bold text-emerald-400">{briefing.supportResistance.resistance2}</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Breakout di atas {briefing.supportResistance.resistance1} mengonfirmasi momentum kelanjutan rally.
          </p>
        </div>

        {/* Golden Rule Tip */}
        <div className="space-y-2 rounded-xl bg-gradient-to-br from-emerald-950/30 to-slate-950/60 border border-emerald-500/30 p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Golden Rule Pre-Opening (08:45 WIB)</span>
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
            "{briefing.keyAdvice}"
          </p>
          <div className="pt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <CheckCircle className="w-3 h-3" />
            <span>Prioritaskan likuiditas &amp; hindari fomo di menit awal 09:00</span>
          </div>
        </div>
      </div>

      {/* Top Pre-Market Stock Catalysts Watchlist */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Top Stock Catalysts &amp; Action Plan (Watchlist Anda: {watchlist.join(', ')})
          </div>
          <span className="text-[11px] text-slate-400">Sorted by immediate pre-open trigger</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {briefing.topCatalysts.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-950 p-3 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-white text-sm tracking-wider">
                  {cat.ticker}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    cat.action === 'BUY WATCH'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : cat.action === 'SPECULATIVE BUY'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : cat.action === 'PROFIT TAKE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {cat.action}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-3">
                {cat.catalyst}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
