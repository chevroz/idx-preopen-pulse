import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MarketStatusBar } from './components/MarketStatusBar';
import { PremarketBriefingCard } from './components/PremarketBriefingCard';
import { NewsTerminal } from './components/NewsTerminal';
import { CorporateActionsCalendar } from './components/CorporateActionsCalendar';
import { MobilePushCenterModal } from './components/MobilePushCenterModal';
import { ArchitectureGuideModal } from './components/ArchitectureGuideModal';
import { FreeHostingModal } from './components/FreeHostingModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useMobileNotifications } from './hooks/useMobileNotifications';
import {
  MarketNewsItem,
  MacroIndicator,
  CorporateAction,
  PreMarketBriefing,
  MarketSessionInfo,
} from './types/market';
import {
  INITIAL_MACRO_INDICATORS,
  INITIAL_NEWS_ITEMS,
  INITIAL_CORPORATE_ACTIONS,
  DEFAULT_PREMARKET_BRIEFING,
} from './data/marketSeed';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [sessionInfo, setSessionInfo] = useState<MarketSessionInfo | null>(null);
  const [macroIndicators, setMacroIndicators] = useState<MacroIndicator[]>(INITIAL_MACRO_INDICATORS);
  const [newsItems, setNewsItems] = useState<MarketNewsItem[]>(INITIAL_NEWS_ITEMS);
  const [corporateActions, setCorporateActions] = useState<CorporateAction[]>(INITIAL_CORPORATE_ACTIONS);
  const [briefing, setBriefing] = useState<PreMarketBriefing>(DEFAULT_PREMARKET_BRIEFING);
  const [isRefreshingBriefing, setIsRefreshingBriefing] = useState(false);

  // User Watchlist stored in localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('idx_watchlist');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved watchlist', e);
      }
    }
    return ['BBCA', 'BBRI', 'BMRI', 'AMMN', 'BREN', 'ADRO'];
  });

  // Modal toggles
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isFreeHostingModalOpen, setIsFreeHostingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notification Hook
  const {
    permission,
    requestPermission,
    soundEnabled,
    setSoundEnabled,
    alerts,
    dispatchAlert,
    clearAlerts,
    unreadCount,
    markAllAsRead,
  } = useMobileNotifications();

  // Save watchlist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('idx_watchlist', JSON.stringify(watchlist));
      } catch (e) {
        console.warn('Failed to save watchlist', e);
      }
    }
  }, [watchlist]);

  const toggleWatchlist = (ticker: string) => {
    setWatchlist((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  // Poll market session status every second for live countdown
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/market/status');
        if (res.ok) {
          const data = await res.json();
          setSessionInfo(data);
        }
      } catch (err) {
        console.warn('Using client-side WIB clock fallback', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [macroRes, newsRes, caRes] = await Promise.all([
          fetch('/api/market/macro').catch(() => null),
          fetch('/api/news').catch(() => null),
          fetch('/api/corporate-actions').catch(() => null),
        ]);

        if (macroRes && macroRes.ok) {
          const d = await macroRes.json();
          setMacroIndicators(d);
        }
        if (newsRes && newsRes.ok) {
          const d = await newsRes.json();
          setNewsItems(d);
        }
        if (caRes && caRes.ok) {
          const d = await caRes.json();
          setCorporateActions(d);
        }
      } catch (e) {
        console.warn('Offline or API fallback active', e);
      }
    };

    fetchInitialData();
  }, []);

  // Refresh AI Briefing via Gemini API on server
  const handleRefreshBriefing = useCallback(async () => {
    setIsRefreshingBriefing(true);
    try {
      const res = await fetch('/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchlist }),
      });

      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
        showToast('Analisis pra-pasar Gemini 3.8 Flash berhasil diperbarui!');
      } else {
        showToast('Gagal memuat briefing AI, menggunakan data lokal.');
      }
    } catch (err) {
      console.error(err);
      showToast('Koneksi terputus, menampilkan analisa tersimpan.');
    } finally {
      setIsRefreshingBriefing(false);
    }
  }, [watchlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDispatchPush = (
    title: string,
    body: string,
    ticker: string,
    impact: 'HIGH' | 'MEDIUM' | 'LOW'
  ) => {
    dispatchAlert({ title, body, ticker, impact });
    showToast(`Push Alert terkirim: [${ticker}] ${title.slice(0, 30)}...`);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* App Header */}
      <Header
        sessionInfo={sessionInfo}
        unreadAlertCount={unreadCount}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenAlertsModal={() => {
          setIsAlertsModalOpen(true);
          markAllAsRead();
        }}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenFreeHostingModal={() => setIsFreeHostingModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Market Status, Countdown & Macro Indicators */}
        <MarketStatusBar
          sessionInfo={sessionInfo}
          macroIndicators={macroIndicators}
        />

        {/* Premarket Briefing Strategy Card */}
        <PremarketBriefingCard
          briefing={briefing}
          onRefresh={handleRefreshBriefing}
          isRefreshing={isRefreshingBriefing}
          watchlist={watchlist}
        />

        {/* Corporate Actions & Dividends Today */}
        <CorporateActionsCalendar
          corporateActions={corporateActions}
          onDispatchPush={handleDispatchPush}
        />

        {/* Sorted Pre-Market News Terminal */}
        <NewsTerminal
          newsItems={newsItems}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onDispatchPush={handleDispatchPush}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-slate-400">
              IDX Pre-Open Intelligence Terminal • Real-Time Mobile Push Engine
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsFreeHostingModalOpen(true)}
              className="text-teal-400 hover:underline transition cursor-pointer"
            >
              Free Hosting Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Arsitektur Pipeline
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAlertsModalOpen(true)}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Konfigurasi Push
            </button>
            <span>•</span>
            <span>Waktu Jakarta (WIB UTC+7)</span>
          </div>
        </div>
      </footer>

      {/* Mobile Alerts Center Modal */}
      <MobilePushCenterModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        permission={permission}
        onRequestPermission={requestPermission}
        alerts={alerts}
        onDispatchTestAlert={() =>
          handleDispatchPush(
            'BBRI: Cum Dividen Interim Rp84/Saham',
            'Cum date sesi reguler hari ini sebelum market tutup 15:49 WIB.',
            'BBRI',
            'HIGH'
          )
        }
        onClearAlerts={clearAlerts}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Architecture & Best Way Guide Modal */}
      <ArchitectureGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Free Hosting Guide Modal */}
      <FreeHostingModal
        isOpen={isFreeHostingModalOpen}
        onClose={() => setIsFreeHostingModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 p-3.5 text-xs text-emerald-300 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
