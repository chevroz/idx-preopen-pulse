import React, { useState } from 'react';
import { MobileAlert } from '../hooks/useMobileNotifications';
import {
  Bell,
  X,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Send,
  Volume2,
  Trash2,
  ShieldCheck,
  Radio,
  ExternalLink,
  MessageSquare,
  Flame,
} from 'lucide-react';

interface MobilePushCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission: NotificationPermission;
  onRequestPermission: () => Promise<NotificationPermission>;
  alerts: MobileAlert[];
  onDispatchTestAlert: () => void;
  onClearAlerts: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MobilePushCenterModal: React.FC<MobilePushCenterModalProps> = ({
  isOpen,
  onClose,
  permission,
  onRequestPermission,
  alerts,
  onDispatchTestAlert,
  onClearAlerts,
  soundEnabled,
  onToggleSound,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'channels' | 'schedule'>('alerts');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestTelegram = () => {
    if (!telegramToken || !telegramChatId) {
      setTelegramStatus('Harap masukkan Bot Token dan Chat ID Telegram Anda.');
      return;
    }
    setTelegramStatus('Mengirim test push ke Telegram...');
    // Real call to Telegram Bot API directly from client or proxy
    fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: `🚨 *IDX PRE-OPEN TEST ALERT*\n\nBBRI: Cum Dividen Interim Rp84 hari ini!\nWIB Time: ${new Date().toLocaleTimeString('id-ID')} WIB\n\n_Terkirim dari IDX Pre-Open Terminal_`,
        parse_mode: 'Markdown',
      }),
    })
      .then((res) => {
        if (res.ok) {
          setTelegramStatus('✅ Sukses! Notifikasi Telegram terkirim ke HP Anda.');
        } else {
          setTelegramStatus('❌ Gagal mengirim. Periksa kembali Bot Token dan Chat ID.');
        }
      })
      .catch((err) => {
        setTelegramStatus('❌ Error jaringan: ' + err.message);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Pusat Push Notifikasi Mobile &amp; Real-Time Alerts
              </h2>
              <p className="text-xs text-slate-400">
                Kirim sinyal pasar penting langsung ke layar HP sebelum bursa buka
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Quick Banner */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Web Push Izin Browser:</span>
            {permission === 'granted' ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Aktif (Granted)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <AlertTriangle className="w-3 h-3" />
                {permission === 'denied' ? 'Diblokir Browser' : 'Belum Diizinkan'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {permission !== 'granted' && (
              <button
                onClick={onRequestPermission}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Izinkan Notifikasi
              </button>
            )}

            <button
              onClick={onDispatchTestAlert}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Tes Push HP Sekarang</span>
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-medium px-4">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Log Notifikasi ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'channels'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Saluran Mobile (Telegram &amp; Web Push)
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'schedule'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Jadwal Push Pre-Market
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Daftar notifikasi yang telah dikirimkan ke perangkat:</span>
                {alerts.length > 0 && (
                  <button
                    onClick={onClearAlerts}
                    className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Semua</span>
                  </button>
                )}
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Belum ada notifikasi. Klik tombol "Tes Push HP Sekarang" di atas untuk mencoba.
                </div>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">
                          {al.title}
                        </span>
                        {al.impact === 'HIGH' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                            HIGH
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{al.body}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {al.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="space-y-4 text-xs">
              {/* Channel 1: Web Push */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>1. Web Push PWA (Langsung ke Notifikasi Android &amp; iOS)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold text-[11px]">Recommended</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Cukup klik tombol <strong>"Install App"</strong> di kanan atas halaman atau "Add to Home Screen" di Safari iOS. PWA akan menerima Web Push Background notifications bahkan saat browser ditutup.
                </p>
              </div>

              {/* Channel 2: Telegram Bot API */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span>2. Telegram Bot Push (Paling Populer untuk Trader Indo)</span>
                  </div>
                  <span className="text-sky-400 font-semibold text-[11px]">0-Latency</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Telegram adalah media tercepat untuk menerima sinyal pre-market di Indonesia. Masukkan token bot Telegram pribadi Anda untuk menghubungkan notifikasi:
                </p>

                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 font-mono">Telegram Bot Token (dari @BotFather):</label>
                    <input
                      type="text"
                      value={telegramToken}
                      onChange={(e) => setTelegramToken(e.target.value)}
                      placeholder="123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
                      className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-mono">Chat ID Anda (dari @userinfobot):</label>
                    <input
                      type="text"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="e.g. 987654321"
                      className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {telegramStatus && (
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200">
                      {telegramStatus}
                    </div>
                  )}

                  <button
                    onClick={handleTestTelegram}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
                  >
                    Kirim Pesan Uji Coba ke Telegram HP
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-400 text-sm">07:00 WIB</span>
                <div>
                  <div className="font-bold text-white">Global Catalysts &amp; Wall Street Close</div>
                  <p className="text-slate-400 mt-0.5">
                    Ringkasan penutupan S&amp;P 500, pergerakan harga Nikel LME, Batu Bara Newcastle, CPO MDEX, dan kurs Jisdor Rupiah.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <span className="font-mono font-bold text-amber-400 text-sm">08:15 WIB</span>
                <div>
                  <div className="font-bold text-white">IDX Corporate Disclosures &amp; Dividen Alert</div>
                  <p className="text-slate-400 mt-0.5">
                    Pengumuman dividen interim, jadwal cum-date sesi 1, dan keterbukaan informasi emiten prioritas tinggi.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <span className="font-mono font-bold text-rose-400 text-sm">08:44 WIB</span>
                <div>
                  <div className="font-bold text-white">1-Minute Warning Pre-Opening Call</div>
                  <p className="text-slate-400 mt-0.5">
                    Notifikasi hitung mundur pembukaan antrian pre-opening session IDX (08:45 - 08:59 WIB).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <span className="font-mono font-bold text-sky-400 text-sm">Real-Time</span>
                <div>
                  <div className="font-bold text-white">Breaking News &amp; Unusual Market Activity (UMA)</div>
                  <p className="text-slate-400 mt-0.5">
                    Pengumuman suspensi, unsuspensi, atau berita aksi korporasi besar tak terduga.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Suara Bel: {soundEnabled ? 'Nyala' : 'Bisu'}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
