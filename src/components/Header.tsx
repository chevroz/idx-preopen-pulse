import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { Bell, Volume2, VolumeX, BookOpen, Clock, Activity, Cloud, ShieldCheck } from 'lucide-react';
import { MarketSessionInfo } from '../types/market';

interface HeaderProps {
  sessionInfo: MarketSessionInfo | null;
  unreadAlertCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAlertsModal: () => void;
  onOpenGuideModal: () => void;
  onOpenFreeHostingModal: () => void;
  onOpenVerificationModal: () => void;
  pendingVerificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  sessionInfo,
  unreadAlertCount,
  soundEnabled,
  onToggleSound,
  onOpenAlertsModal,
  onOpenGuideModal,
  onOpenFreeHostingModal,
  onOpenVerificationModal,
  pendingVerificationCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white font-mono">
                IDX <span className="text-emerald-400">PRE-OPEN</span>
              </span>
              <span className="hidden xs:inline-flex px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                LIVE TERMINAL
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Bursa Efek Indonesia</span>
            </div>
          </div>
        </div>

        {/* Center Clock (Desktop & Tablet) */}
        {sessionInfo && (
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white tracking-wider">{sessionInfo.currentTimeWIB}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <span className="text-slate-400 text-[11px] truncate max-w-[200px]">
              {sessionInfo.nextEvent}
            </span>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Data Verification Button */}
          <button
            onClick={onOpenVerificationModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 text-xs font-medium transition cursor-pointer"
            title="Konfirmasi & Audit Data Sebelum Ditampilkan"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Audit Data</span>
            {pendingVerificationCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                {pendingVerificationCount}
              </span>
            )}
          </button>

          {/* Free Hosting Guide Button */}
          <button
            onClick={onOpenFreeHostingModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 text-xs font-medium transition cursor-pointer"
            title="Panduan Deploy ke Layanan Hosting Gratis"
          >
            <Cloud className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Free Hosting</span>
          </button>

          {/* Architecture / Best Way Guide Button */}
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 text-xs font-medium transition cursor-pointer"
            title="Panduan Arsitektur & Saluran Push Terbaik"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Best Way Guide</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title={soundEnabled ? 'Mute Alert Chime' : 'Enable Alert Chime'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Mobile Push Notification Center */}
          <button
            onClick={onOpenAlertsModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-medium transition cursor-pointer"
            title="Pusat Notifikasi & Push Mobile"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Alerts</span>
            {unreadAlertCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
