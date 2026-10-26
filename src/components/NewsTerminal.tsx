import React, { useState } from 'react';
import { MarketNewsItem, SectorType } from '../types/market';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Send,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Tag,
  Star,
  ChevronDown,
} from 'lucide-react';

interface NewsTerminalProps {
  newsItems: MarketNewsItem[];
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  onDispatchPush: (title: string, body: string, ticker: string, impact: 'HIGH' | 'MEDIUM' | 'LOW') => void;
}

export const NewsTerminal: React.FC<NewsTerminalProps> = ({
  newsItems,
  watchlist,
  onToggleWatchlist,
  onDispatchPush,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'impact' | 'time' | 'bullish'>('impact');
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);
  // Default to ONLY BULLISH and 1 WEEK (7 days) as requested!
  const [sentimentFilter, setSentimentFilter] = useState<'bullish' | 'ALL'>('bullish');
  const [timeWindow, setTimeWindow] = useState<'7d' | '24h' | '3d' | 'ALL'>('7d');
  const [sentAlertId, setSentAlertId] = useState<string | null>(null);
  const [activeNewsModal, setActiveNewsModal] = useState<MarketNewsItem | null>(null);

  // Available sectors
  const sectors: { id: string; label: string }[] = [
    { id: 'ALL', label: 'Semua Sektor' },
    { id: 'Banking & Finance', label: 'Perbankan (Big 4)' },
    { id: 'Mining & Energy', label: 'Tambang & Energi' },
    { id: 'Technology & Telco', label: 'Teknologi & Telko' },
    { id: 'Consumer Goods', label: 'Konsumer' },
    { id: 'Infrastructure & Utilities', label: 'Infrastruktur / EBT' },
    { id: 'Macro & Policy', label: 'Makro & BI-Rate' },
  ];

  // Filtering
  const filteredItems = newsItems.filter((item) => {
    // 1. Sentiment filter (Only Bullish by default)
    if (sentimentFilter !== 'ALL' && item.sentiment !== sentimentFilter) {
      return false;
    }

    // 2. Time Window filter (From a week before / 7 days)
    const itemTime = new Date(item.publishedAt).getTime();
    if (timeWindow === '7d') {
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (itemTime < oneWeekAgo) return false;
    } else if (timeWindow === '24h') {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (itemTime < oneDayAgo) return false;
    } else if (timeWindow === '3d') {
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      if (itemTime < threeDaysAgo) return false;
    }

    // 3. Sector filter
    if (selectedSector !== 'ALL' && item.sector !== selectedSector) {
      return false;
    }

    // 4. Watchlist filter
    if (onlyWatchlist) {
      const hasWatchlistTicker = item.tickers.some((t) => watchlist.includes(t));
      if (!hasWatchlistTicker) return false;
    }

    // 5. Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchTickers = item.tickers.some((t) => t.toLowerCase().includes(q));
      const matchTakeaways = item.keyTakeaways.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchTickers || matchTakeaways;
    }

    return true;
  });

  // Sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'impact') {
      const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (order[b.impact] !== order[a.impact]) {
        return order[b.impact] - order[a.impact];
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortBy === 'bullish') {
      const order = { bullish: 3, neutral: 2, bearish: 1 };
      if (order[b.sentiment] !== order[a.sentiment]) {
        return order[b.sentiment] - order[a.sentiment];
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else {
      // Latest time
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const handlePushClick = (item: MarketNewsItem) => {
    onDispatchPush(
      `${item.tickers.join('/')}: ${item.title.slice(0, 50)}...`,
      item.summary,
      item.tickers[0] || 'IHSG',
      item.impact
    );
    setSentAlertId(item.id);
    setTimeout(() => {
      setSentAlertId(null);
    }, 2500);
  };

  const getImpactBadge = (impact: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (impact) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Flame className="w-2.5 h-2.5" />
            Market Moving
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Medium Catalyst
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
            General News
          </span>
        );
    }
  };

  const getSentimentBadge = (sentiment: 'bullish' | 'bearish' | 'neutral') => {
    switch (sentiment) {
      case 'bullish':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            Bullish
          </span>
        );
      case 'bearish':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
            <TrendingDown className="w-3.5 h-3.5" />
            Bearish
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Minus className="w-3.5 h-3.5" />
            Netral
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls & Search Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode saham (e.g. BBRI, AMMN), dividen, atau kata kunci..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Urutkan:
            </span>
            <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSortBy('impact')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  sortBy === 'impact'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Market Moving (High)
              </button>
              <button
                onClick={() => setSortBy('time')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  sortBy === 'time'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Terbaru (WIB)
              </button>
              <button
                onClick={() => setSortBy('bullish')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  sortBy === 'bullish'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bullish First
              </button>
            </div>

            {/* Watchlist only toggle */}
            <button
              onClick={() => setOnlyWatchlist(!onlyWatchlist)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                onlyWatchlist
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Watchlist Saja ({watchlist.length})</span>
            </button>
          </div>
        </div>

        {/* Bullish & Timeframe Specific Controls (User Request Preset) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          {/* Sentiment Filter Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Sentimen:
            </span>
            <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSentimentFilter('bullish')}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                  sentimentFilter === 'bullish'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Hanya Bullish</span>
                <span className="text-[10px] bg-slate-900/30 text-emerald-950 px-1 rounded">Aktif</span>
              </button>
              <button
                onClick={() => setSentimentFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  sentimentFilter === 'ALL'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua Sentimen
              </button>
            </div>
          </div>

          {/* Timeframe Filter (1 Minggu / 7 Hari) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Periode Berita:
            </span>
            <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setTimeWindow('7d')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  timeWindow === '7d'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Minggu Terakhir
              </button>
              <button
                onClick={() => setTimeWindow('3d')}
                className={`px-2 py-1 rounded-md transition cursor-pointer ${
                  timeWindow === '3d'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3 Hari
              </button>
              <button
                onClick={() => setTimeWindow('24h')}
                className={`px-2 py-1 rounded-md transition cursor-pointer ${
                  timeWindow === '24h'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                24 Jam
              </button>
              <button
                onClick={() => setTimeWindow('ALL')}
                className={`px-2 py-1 rounded-md transition cursor-pointer ${
                  timeWindow === 'ALL'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
            </div>
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {sectors.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition cursor-pointer ${
                selectedSector === sec.id
                  ? 'bg-slate-200 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Bullish Filter Banner */}
      {sentimentFilter === 'bullish' && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>Hanya Berita Saham Bullish {timeWindow === '7d' ? '(1 Minggu Terakhir)' : `(Periode ${timeWindow})`}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {sortedItems.length} Saham Terpilih
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Katalis dividen, laba kuartalan, ekspansi bisnis, dan sentimen komoditas positif 7 hari ke belakang
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSentimentFilter('ALL');
              setTimeWindow('ALL');
            }}
            className="text-[11px] font-mono text-slate-400 hover:text-white underline cursor-pointer"
          >
            Tampilkan Semua Sentimen
          </button>
        </div>
      )}

      {/* News Items Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <div>
          Menampilkan <span className="font-bold text-white">{sortedItems.length}</span> berita pre-market terkurasi
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> High Impact
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Bullish
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Watchlist
          </span>
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {sortedItems.map((item) => {
          const isSent = sentAlertId === item.id;
          const containsWatchlist = item.tickers.some((t) => watchlist.includes(t));

          return (
            <div
              key={item.id}
              className={`group flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                item.impact === 'HIGH'
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              } ${containsWatchlist ? 'ring-1 ring-amber-500/30' : ''}`}
            >
              <div>
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/70 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {getImpactBadge(item.impact)}
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      {item.source}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.publishedTimeStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getSentimentBadge(item.sentiment)}
                  </div>
                </div>

                {/* Stock Tickers & Category */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {item.tickers.map((ticker) => {
                    const isWatched = watchlist.includes(ticker);
                    return (
                      <button
                        key={ticker}
                        onClick={() => onToggleWatchlist(ticker)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                          isWatched
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-950 border border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                        title={isWatched ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
                      >
                        <Star className={`w-3 h-3 ${isWatched ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                        <span>{ticker}</span>
                      </button>
                    );
                  })}
                  <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800/60">
                    {item.sector}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => setActiveNewsModal(item)}
                  className="mt-2.5 text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition cursor-pointer leading-snug"
                >
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                {/* Key Takeaways preview */}
                {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                      Poin Kunci Pra-Bursa:
                    </div>
                    {item.keyTakeaways.slice(0, 2).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span className="line-clamp-1">{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveNewsModal(item)}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>

                <div className="flex items-center gap-2">
                  {/* Push to mobile button */}
                  <button
                    onClick={() => handlePushClick(item)}
                    disabled={isSent}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isSent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
                    }`}
                    title="Kirim notifikasi instan ke HP / Mobile Device"
                  >
                    {isSent ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Push Terkirim!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Push ke HP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* News Detail Reader Modal */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {getImpactBadge(activeNewsModal.impact)}
                <span className="text-xs text-slate-400 font-mono">
                  {activeNewsModal.source} • {activeNewsModal.publishedTimeStr}
                </span>
              </div>
              <button
                onClick={() => setActiveNewsModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {activeNewsModal.tickers.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-slate-950 border border-slate-700 text-emerald-400">
                    {t}
                  </span>
                ))}
                <span className="text-xs text-slate-400">{activeNewsModal.sector}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400">{getSentimentBadge(activeNewsModal.sentiment)}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {activeNewsModal.title}
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed">
                {activeNewsModal.summary}
              </p>

              {/* Key Takeaways */}
              <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Analisa Dampak Pre-Market IDX:
                </div>
                {activeNewsModal.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Estimasi baca: {activeNewsModal.readTime}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handlePushClick(activeNewsModal);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Alert ke HP</span>
                </button>
                <button
                  onClick={() => setActiveNewsModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
