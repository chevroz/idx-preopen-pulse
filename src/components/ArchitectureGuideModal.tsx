import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Cpu,
  Database,
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ArchitectureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureGuideModal: React.FC<ArchitectureGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const pythonCronSnippet = `# Automated IDX Pre-Market Dispatcher (Runs daily at 08:15 WIB via GitHub Actions / Cloud Cron)
import feedparser
import requests
import json
import os

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

FEEDS = [
    {"source": "IDX Keterbukaan", "url": "https://www.idx.co.id/id/berita/keterbukaan-informasi-rss"},
    {"source": "Bisnis.com Market", "url": "https://finansial.bisnis.com/rss"},
    {"source": "Kontan Investasi", "url": "https://investasi.kontan.co.id/rss"},
    {"source": "CNBC Indonesia", "url": "https://www.cnbcindonesia.com/market/rss"}
]

PRIORITY_TICKERS = ["BBCA", "BBRI", "BMRI", "BBNI", "TLKM", "ASII", "AMMN", "BREN", "ADRO", "ANTM"]

def fetch_and_score_news():
    alerts = []
    for f in FEEDS:
        parsed = feedparser.parse(f["url"])
        for entry in parsed.entries[:5]:
            matched = [t for t in PRIORITY_TICKERS if t in entry.title.upper()]
            is_high_impact = any(k in entry.title.lower() for k in ["dividen", "cum date", "laba", "smelter", "akuisisi", "rups"])
            if matched or is_high_impact:
                alerts.append({
                    "title": entry.title,
                    "link": entry.link,
                    "source": f["source"],
                    "tickers": matched,
                    "impact": "HIGH" if is_high_impact else "MEDIUM"
                })
    return alerts

def push_to_telegram(alerts):
    message = "🚨 *IDX PRE-MARKET INTELLIGENCE ALERT (08:15 WIB)*\\n\\n"
    for a in alerts[:6]:
        tag = f"[{'/'.join(a['tickers'])}] " if a['tickers'] else ""
        message += f"• *{tag}{a['title']}*\\n  _Sumber: {a['source']}_\\n\\n"
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": message, "parse_mode": "Markdown"})

if __name__ == "__main__":
    items = fetch_and_score_news()
    if items:
        push_to_telegram(items)
        print("Dispatched pre-market alerts to mobile successfully.")`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCronSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Blueprint &amp; Cara Terbaik: Pipeline Berita Pasar Modal Indonesia
              </h2>
              <p className="text-xs text-slate-400">
                Solusi arsitektur end-to-end dari sumber data bursa hingga push notifikasi HP
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Executive Answer */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
            <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ringkasan Eksekutif: 3 Pilar Utama Sistem Pra-Bursa Terbaik</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
              Untuk mendapatkan berita pasar Indonesia yang <strong>tersortir rapi sebelum bursa buka (08:45 WIB)</strong> dan <strong>terkirim otomatis ke HP</strong>, arsitektur terbaik mengombinasikan:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-white">1. Multi-Source Ingestion</div>
                <div className="text-slate-400 mt-1">Gabungan RSS resmi IDX, Kontan, Bisnis.com, dan komoditas global.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-white">2. AI Scoring &amp; Tagging</div>
                <div className="text-slate-400 mt-1">Filter otomatis berdasarkan kode saham (ticker) dan dampak penggerak pasar (High Impact).</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-white">3. PWA Web Push / Telegram</div>
                <div className="text-slate-400 mt-1">Pengiriman instan ke layar kunci smartphone pada jam 08:15 WIB.</div>
              </div>
            </div>
          </div>

          {/* 4-Layer Architecture Visual Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>4 Lapisan Arsitektur Pipeline Data</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Layer 1 */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between text-indigo-300 font-bold mb-1">
                  <span>Layer 1: Data Ingestion (Pukul 05:00 - 08:00 WIB)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">Data Sources</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Menarik feed dari sumber utama secara simultan:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400">
                  <li><strong>Keterbukaan Informasi BEI (idx.co.id):</strong> Laporan keuangan, jadwal dividen, aksi korporasi, UMA, dan suspensi.</li>
                  <li><strong>Media Finansial Domestik:</strong> RSS feed Bisnis.com, Kontan Investasi, CNBC Indonesia, Bloomberg Technoz.</li>
                  <li><strong>Katalis Makro &amp; Komoditas:</strong> Kurs JISDOR Bank Indonesia, LME Nikel, Newcastle Coal, MDEX CPO, serta indeks Wall Street.</li>
                </ul>
              </div>

              {/* Layer 2 */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                  <span>Layer 2: AI Parsing, Deduplikasi, &amp; Prioritas Dampak</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Gemini 3.8 Flash</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Mesin memproses ratusan headline dan mengelompokkannya:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400">
                  <li><strong>Ticker Extraction:</strong> Pencocokan otomatis 900+ emiten (misal deteksi "BBRI", "AMMN", "ADRO").</li>
                  <li><strong>Impact Ranking (High/Med/Low):</strong> Berita pembagian dividen &gt;2% atau lonjakan komoditas langsung dinaikkan ke urutan teratas.</li>
                  <li><strong>Sintesis Morning Brief:</strong> Menghasilkan 3 poin kunci dan level support/resistance IHSG sebelum 08:30 WIB.</li>
                </ul>
              </div>

              {/* Layer 3 */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between text-sky-300 font-bold mb-1">
                  <span>Layer 3: Delivery Channel ke Mobile Device</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">Push Notification</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Dua jalur pengiriman push tercepat dan paling andal:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400">
                  <li><strong>PWA Web Push:</strong> Aplikasi web mandiri yang dipasang ke home screen HP (menggunakan Service Worker &amp; VAPID keys).</li>
                  <li><strong>Telegram Bot API:</strong> Sangat disukai komunitas investor ritel Indonesia karena gratis, latensi nol (0 ms), dan mendukung formatting tebal serta link emiten.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Timeline Schedule */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Timeline Ideal Rutinitas Investor Pagi (WIB)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-400">06:00 - 07:30</div>
                <div className="text-white font-semibold mt-0.5">Global Overnight</div>
                <div className="text-slate-500 text-[11px] mt-1">Cek penutupan Wall St, komoditas emas/nikel/batu bara.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-400">07:30 - 08:30</div>
                <div className="text-white font-semibold mt-0.5">AI Morning Brief</div>
                <div className="text-slate-500 text-[11px] mt-1">Notifikasi push otomatis tiba di HP dengan daftar saham dividen &amp; katalis.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/40 bg-emerald-950/20">
                <div className="font-bold text-emerald-300">08:45 - 08:59</div>
                <div className="text-white font-semibold mt-0.5">Pre-Opening Call</div>
                <div className="text-slate-400 text-[11px] mt-1">Pasang order beli/jual di saham LQ45 sebelum open pasar reguler.</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-400">09:00 WIB</div>
                <div className="text-white font-semibold mt-0.5">Market Open</div>
                <div className="text-slate-500 text-[11px] mt-1">Eksekusi pasar reguler dimulai serentak.</div>
              </div>
            </div>
          </div>

          {/* Copyable Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2 font-mono">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Contoh Script Otomatisasi Python / Cloud Cron</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-300/90 leading-relaxed max-h-56">
              {pythonCronSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            Mengerti &amp; Kembali ke Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
