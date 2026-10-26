import React, { useState } from 'react';
import {
  X,
  Server,
  Cloud,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Zap,
  Globe,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface FreeHostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeHostingModal: React.FC<FreeHostingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'render' | 'vercel' | 'cloudrun' | 'github'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Panduan Deploy ke Layanan Hosting Gratis (100% Free Tier)
              </h2>
              <p className="text-xs text-slate-400">
                Langkah praktis mempublikasikan Dashboard &amp; Notifikasi HP tanpa biaya server
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

        {/* Platform Selection Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 text-xs font-mono overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedPlatform('vercel')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              selectedPlatform === 'vercel'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Vercel (100% Tanpa Kartu Kredit)</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('render')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              selectedPlatform === 'render'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>2. Render (Verifikasi Kartu)</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('cloudrun')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              selectedPlatform === 'cloudrun'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3. Cloudflare Pages / Netlify</span>
          </button>

          <button
            onClick={() => setSelectedPlatform('github')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              selectedPlatform === 'github'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>4. Cron Otomatis 08:15 (GitHub Actions)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Credit Card Alert & Immediate Solution Banner */}
          <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/30 flex items-start gap-3">
            <span className="text-base shrink-0">💳</span>
            <div className="space-y-1">
              <div className="font-bold text-amber-300 text-xs sm:text-sm">
                Render Meminta Kartu Kredit? Gunakan Vercel (100% Tanpa Kartu Kredit)!
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Render saat ini memberlakukan verifikasi kartu kredit untuk mencegah spam. Jika Anda <strong>tidak ingin memasukkan kartu kredit sama sekali</strong>, pilih tab <strong>Vercel</strong> atau <strong>Cloudflare Pages</strong> di bawah. Anda hanya butuh akun GitHub gratis tanpa kartu kredit sama sekali!
              </p>
            </div>
          </div>
          {selectedPlatform === 'render' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Kelebihan Render.com: Menjalankan Backend Express + Frontend PWA Bersama</span>
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Render menyediakan paket <strong>Free Web Service</strong> dengan sertifikat SSL gratis, custom domain, dan dukungan Dockerfile atau native Node.js. Cocok untuk menjalankan API server, Gemini AI proxy, dan PWA dalam satu URL gratis.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Langkah-Langkah Deploy di Render:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs leading-relaxed">
                  <li>Push kode repositori ini ke akun <strong>GitHub</strong> pribadi Anda.</li>
                  <li>Daftar/Masuk ke <a href="https://render.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Render.com</a> (gratis, bisa login via GitHub).</li>
                  <li>Klik tombol <strong>"New +"</strong> $\to$ pilih <strong>"Web Service"</strong>.</li>
                  <li>Pilih repositori GitHub aplikasi ini.</li>
                  <li>Isi konfigurasi berikut:
                    <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono space-y-1 text-slate-300">
                      <div><span className="text-slate-500">Name:</span> idx-preopen-pulse</div>
                      <div><span className="text-slate-500">Environment:</span> Node</div>
                      <div><span className="text-slate-500">Build Command:</span> <code className="text-emerald-400">npm run build</code></div>
                      <div><span className="text-slate-500">Start Command:</span> <code className="text-emerald-400">npm run start</code></div>
                      <div><span className="text-slate-500">Instance Type:</span> Free</div>
                    </div>
                  </li>
                  <li>Di bagian <strong>Environment Variables</strong>, tambahkan:
                    <div className="mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-400">
                      <code>GEMINI_API_KEY</code> = (Kunci API Anda)<br />
                      <code>NODE_ENV</code> = production
                    </div>
                  </li>
                  <li>Klik <strong>"Create Web Service"</strong>. Dalam 2-3 menit aplikasi Anda aktif di <code>https://idx-preopen-pulse.onrender.com</code>!</li>
                </ol>
              </div>
            </div>
          )}

          {/* Platform 2: Vercel */}
          {selectedPlatform === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-950/20">
                <div className="font-bold text-sky-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Kelebihan Vercel: Loading Instan di Edge Global &amp; PWA Super Cepat</span>
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Vercel menyediakan paket <strong>Hobby Free Tier</strong> tanpa batas masa aktif. File konfigurasi <code>vercel.json</code> sudah kami sediakan di dalam repositori ini.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Langkah-Langkah Deploy di Vercel:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs leading-relaxed">
                  <li>Push proyek ke GitHub.</li>
                  <li>Buka <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">Vercel.com</a> $\to$ klik <strong>"Add New..." $\to$ Project</strong>.</li>
                  <li>Pilih repositori Anda. Vercel otomatis mendeteksi Framework Preset <strong>Vite</strong>.</li>
                  <li>Build Command: <code>npm run build</code>, Output Directory: <code>dist</code>.</li>
                  <li>Tambahkan Environment Variable jika diinginkan (misal <code>GEMINI_API_KEY</code>).</li>
                  <li>Klik <strong>Deploy</strong>. Selesai dalam 30 detik! Buka web di smartphone dan klik "Install App" untuk Web Push.</li>
                </ol>

                <div className="mt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>File vercel.json (Sudah Disediakan):</span>
                    <button
                      onClick={() => handleCopy(`{\n  "buildCommand": "npm run build",\n  "outputDirectory": "dist",\n  "framework": "vite"\n}`, 'vercel-cfg')}
                      className="flex items-center gap-1 text-slate-300 hover:text-white"
                    >
                      {copiedKey === 'vercel-cfg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'vercel-cfg' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-emerald-300">
{`{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Platform 3: Google Cloud Run */}
          {selectedPlatform === 'cloudrun' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
                <div className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Kelebihan Google Cloud Run: Free Tier 2 Juta Request / Bulan</span>
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Google Cloud Run gratis untuk 2.000.000 panggilan per bulan dan 360.000 GB-detik komputasi. Menggunakan <code>Dockerfile</code> multi-stage yang telah kami buatkan.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Satu Perintah Deploy dengan Google Cloud CLI:
                </h4>
                <div className="relative">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-indigo-300 overflow-x-auto">
{`gcloud run deploy idx-preopen-pulse \\
  --source . \\
  --region asia-southeast2 \\
  --allow-unauthenticated \\
  --set-env-vars GEMINI_API_KEY=YOUR_KEY`}
                  </pre>
                  <button
                    onClick={() => handleCopy(`gcloud run deploy idx-preopen-pulse --source . --region asia-southeast2 --allow-unauthenticated`, 'gcloud-cmd')}
                    className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {copiedKey === 'gcloud-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Region <code>asia-southeast2</code> (Jakarta) memberikan latensi paling rendah ke pengguna bursa di Indonesia (&lt;15 ms).
                </p>
              </div>
            </div>
          )}

          {/* Platform 4: GitHub Actions Cron */}
          {selectedPlatform === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20">
                <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Kelebihan GitHub Actions: Serverless Cron Otomatis Gratis Selamanya</span>
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Tidak perlu membayar server 24 jam hanya untuk mengirim push pagi. GitHub Actions gratis 2.000 menit/bulan untuk mengeksekusi script pengirim push tepat pukul <strong>08:15 WIB</strong> setiap hari bursa (Senin-Jumat).
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>File Workflow: <code>.github/workflows/daily-premarket-cron.yml</code></span>
                  <button
                    onClick={() => handleCopy(`name: Daily IDX Pre-Market Mobile Push\non:\n  schedule:\n    - cron: '15 1 * * 1-5'\njobs:\n  run:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4`, 'cron-yml')}
                    className="flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'cron-yml' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'cron-yml' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-1">
                  <div><strong>Jadwal Cron:</strong> <code>15 1 * * 1-5</code></div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    * <code>01:15 UTC</code> tepat sama dengan <code>08:15 WIB</code> (Waktu Indonesia Barat UTC+7).<br />
                    * Berjalan otomatis Senin sampai Jumat sebelum pre-opening IDX 08:45 WIB.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Semua opsi di atas telah teruji bebas biaya (100% Free Tier)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
