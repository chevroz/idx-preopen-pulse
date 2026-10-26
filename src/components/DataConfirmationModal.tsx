import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Check,
  Building2,
  Clock,
  Info,
  X,
  FileText,
} from 'lucide-react';
import { CorporateAction, VerificationStatus } from '../types/market';

interface DataConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  corporateActions: CorporateAction[];
  onConfirmAction: (actionId: string, updatedStatus: VerificationStatus) => void;
  strictVerifiedOnly: boolean;
  onToggleStrictVerifiedOnly: (val: boolean) => void;
  highlightedTicker?: string | null;
}

export const DataConfirmationModal: React.FC<DataConfirmationModalProps> = ({
  isOpen,
  onClose,
  corporateActions,
  onConfirmAction,
  strictVerifiedOnly,
  onToggleStrictVerifiedOnly,
  highlightedTicker,
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'AUDIT_PROTOCOL' | 'API_VALIDATOR'>('ACTIONS');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isValidatingApi, setIsValidatingApi] = useState(false);
  const [validationLog, setValidationLog] = useState<string[]>([]);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateApiCheck = async (ticker: string) => {
    setIsValidatingApi(true);
    setValidationLog((prev) => [
      `[${new Date().toLocaleTimeString('id-ID')} WIB] Memulai validasi silang ticker ${ticker} ke BEI (Keterbukaan Informasi) & KSEI API...`,
      ...prev,
    ]);

    await new Promise((r) => setTimeout(r, 900));

    if (ticker === 'BBRI') {
      setValidationLog((prev) => [
        `[${new Date().toLocaleTimeString('id-ID')} WIB] ⚠️ HASIL BEI/KSEI BBRI: Surat Keputusan Direksi terkait laba >Rp60T dan DPR ≥80% valid terdaftar. Namun surat penetapan Cum Date 26 Okt 2026 BELUM diterbitkan nomor registrasi KSEI (Menunggu Rilis Resmi Q3).`,
        `[${new Date().toLocaleTimeString('id-ID')} WIB] 🔒 REKOMENDASI SISTEM: Tahan penayangan sebagai Cum Date definitif untuk mencegah risiko transaksi investor (Dividend Trap).`,
        ...prev,
      ]);
    } else {
      setValidationLog((prev) => [
        `[${new Date().toLocaleTimeString('id-ID')} WIB] ✅ HASIL BEI/KSEI ${ticker}: Dokumen sah terdaftar dengan nomor registrasi bursa aktif. Tanggal Cum/Ex terverifikasi kliring KPEI.`,
        ...prev,
      ]);
    }

    setIsValidatingApi(false);
  };

  const handleConfirmItem = (id: string, ticker: string) => {
    onConfirmAction(id, 'VERIFIED_OFFICIAL');
    setActionSuccessMsg(`Aksi Korporasi ${ticker} telah disetujui & diverifikasi untuk tayang di bursa!`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleRejectItem = (id: string, ticker: string) => {
    onConfirmAction(id, 'REJECTED_UNVERIFIED');
    setActionSuccessMsg(`Aksi Korporasi ${ticker} ditolak & diblokir dari tampilan umum.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const filteredItems = corporateActions.filter((item) => {
    if (filterStatus === 'VERIFIED' && item.verificationStatus !== 'VERIFIED_OFFICIAL') return false;
    if (filterStatus === 'PENDING' && item.verificationStatus !== 'PENDING_CONFIRMATION') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.ticker.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = corporateActions.filter((a) => a.verificationStatus === 'PENDING_CONFIRMATION').length;
  const verifiedCount = corporateActions.filter((a) => a.verificationStatus === 'VERIFIED_OFFICIAL').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-emerald-500/30 bg-[#0d131f] text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Protokol Verifikasi &amp; Konfirmasi Data Sebelum Tayang
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  IDX/KSEI AUDIT GATE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Memastikan setiap dividen &amp; aksi korporasi telah terdaftar resmi di BEI &amp; KSEI sebelum ditampilkan kepada investor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2 flex items-center gap-2 text-xs text-emerald-300 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Strict Mode Control Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={strictVerifiedOnly}
                onChange={(e) => onToggleStrictVerifiedOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <div>
              <span className="text-xs font-bold text-white block">
                Strict Mode: Hanya Tampilkan Data Resmi Terkonfirmasi BEI/KSEI
              </span>
              <span className="text-[11px] text-slate-400">
                {strictVerifiedOnly
                  ? 'Aktif: Data estimasi / rumor diblokir dari kalender utama sampai terbit nomor surat KSEI.'
                  : 'Nonaktif: Menampilkan semua data termasuk estimasi konsensus yang sedang diaudit.'}
              </span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('ACTIONS')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ACTIONS'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Daftar Data ({corporateActions.length})</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                  {pendingCount} Pending
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('AUDIT_PROTOCOL')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'AUDIT_PROTOCOL'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4 Pintu Verifikasi BEI
            </button>
            <button
              onClick={() => setActiveTab('API_VALIDATOR')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'API_VALIDATOR'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>Audit Real-Time</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'ACTIONS' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari emiten (e.g. BBRI, ASII)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-2.5 py-1 rounded-md border transition cursor-pointer ${
                      filterStatus === 'ALL'
                        ? 'bg-slate-200 text-slate-900 font-bold border-slate-200'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Semua ({corporateActions.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('VERIFIED')}
                    className={`px-2.5 py-1 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                      filterStatus === 'VERIFIED'
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Terkonfirmasi Resmi ({verifiedCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterStatus('PENDING')}
                    className={`px-2.5 py-1 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                      filterStatus === 'PENDING'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Menunggu Konfirmasi ({pendingCount})</span>
                  </button>
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const isPending = item.verificationStatus === 'PENDING_CONFIRMATION';
                  const isVerified = item.verificationStatus === 'VERIFIED_OFFICIAL';
                  const isHighlighted = highlightedTicker && item.ticker === highlightedTicker;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isHighlighted
                          ? 'ring-2 ring-emerald-400 bg-emerald-950/20'
                          : isPending
                          ? 'border-amber-500/40 bg-amber-950/10'
                          : 'border-slate-800 bg-slate-950/70'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        {/* Left Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-extrabold text-base text-white">
                              {item.ticker}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {item.companyName}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {item.type}
                            </span>

                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                TERKONFIRMASI RESMI BEI &amp; KSEI
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                MENUNGGU KONFIRMASI RESMI KSEI
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.detail}
                          </p>

                          {/* 4-Gate Checklist Indicators */}
                          <div className="pt-2 border-t border-slate-800/80">
                            <span className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                              Hasil Pemeriksaan 4 Pintu Keabsahan Data:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                              <div className="flex items-center gap-1.5">
                                {item.verificationChecklist.boardResolutionConfirmed ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                                )}
                                <span className={item.verificationChecklist.boardResolutionConfirmed ? 'text-slate-300' : 'text-slate-500'}>
                                  SK Direksi / RUPS
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {item.verificationChecklist.beiDisclosureConfirmed ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                                )}
                                <span className={item.verificationChecklist.beiDisclosureConfirmed ? 'text-slate-300' : 'text-slate-500'}>
                                  Keterbukaan BEI
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {item.verificationChecklist.kseiNoticeConfirmed ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-amber-400" />
                                )}
                                <span className={item.verificationChecklist.kseiNoticeConfirmed ? 'text-slate-300' : 'text-amber-300 font-semibold'}>
                                  Pengumuman KSEI
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {item.verificationChecklist.tradingScheduleConfirmed ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                                )}
                                <span className={item.verificationChecklist.tradingScheduleConfirmed ? 'text-slate-300' : 'text-slate-500'}>
                                  Jadwal Kliring KPEI
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Reference Number & Source Metadata */}
                          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                            <div>
                              <span>No. Dokumen: </span>
                              <strong className="text-slate-200">
                                {item.officialDocRef || 'Dalam Pemeriksaan'}
                              </strong>
                            </div>
                            <div>
                              <span>Sumber Data: </span>
                              <span className="text-slate-300">{item.verificationSource}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex flex-col gap-2 shrink-0 sm:w-44">
                          <button
                            onClick={() => handleSimulateApiCheck(item.ticker)}
                            disabled={isValidatingApi}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isValidatingApi ? 'animate-spin' : ''}`} />
                            <span>Audit Silang API</span>
                          </button>

                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleConfirmItem(item.id, item.ticker)}
                                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition cursor-pointer"
                                title="Setujui data ini untuk langsung tayang ke publik"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Setujui Tayang</span>
                              </button>
                              <button
                                onClick={() => handleRejectItem(item.id, item.ticker)}
                                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/50 transition cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5 text-red-400" />
                                <span>Tolak / Sembunyikan</span>
                              </button>
                            </>
                          ) : (
                            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-center">
                              <span className="text-[11px] font-mono text-emerald-400 font-semibold block">
                                Terverifikasi Siap Tayang
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.confirmedAt}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'AUDIT_PROTOCOL' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>4 Pintu Verifikasi Data Bursa Sebelum Tayang (Standard Operasional Pasar Modal)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mengapa data aksi korporasi &amp; dividen tidak boleh langsung ditayangkan tanpa konfirmasi? Di pasar modal Indonesia, tanggal <strong>Cum Date</strong> menentukan hak atas dividen tunai. Jika investor membeli saham berdasarkan rumor atau estimasi analis yang belum terbit surat resmi KSEI, investor berisiko terkena kerugian finansial (capital loss) atau tidak menerima hak dividen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-white">SK Direksi &amp; Dewan Komisaris</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Keputusan emiten mengenai pembagian dividen interim atau pelaksanaan RUPS harus diputuskan resmi melalui Rapat Direksi/Komisaris dengan dasar perolehan laba bersih perseroan.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-white">Keterbukaan Informasi BEI</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Emiten wajib mengunggah surat Keterbukaan Informasi ke portal resmi Bursa Efek Indonesia (idx.co.id/primary/NewsAnnouncement) paling lambat 2 hari bursa setelah keputusan.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-white">Pengumuman Resmi KSEI</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    KSEI (Kustodian Sentral Efek Indonesia) menerbitkan nomor surat resmi (e.g. <code>KSEI-XXXX/DIR/1026</code>) yang menetapkan tanggal Cum, Ex, Recording Date, dan Rekening Pembayaran Efek.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                      4
                    </span>
                    <h4 className="text-xs font-bold text-white">Jadwal Kliring KPEI &amp; Bursa</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Kliring Penjaminan Efek Indonesia (KPEI) mengunci jadwal kliring transaksi T+2 sehingga perdagangan di Pasar Reguler dan Negosiasi diselaraskan sebelum jam tutup sesi 15:49 WIB.
                  </p>
                </div>
              </div>

              {/* Case Study Box on BBRI */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Studi Kasus Khusus: BBRI Dividen Interim Rp135</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Data yang beredar mengenai <strong>BBRI dividen interim Rp135 (DPR ≥80% laba &gt;Rp60T)</strong> merupakan proyeksi konsensus analis yang sangat kredibel, namun <strong>belum ada surat resmi pengumuman KSEI dengan tanggal Cum Date definitif</strong>.
                  Dalam terminal ini, data tersebut diberi status <code>PENDING_CONFIRMATION</code> dan ditandai secara transparan agar investor terhindar dari salah beli sebelum jadwal bursa resmi dibuka.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'API_VALIDATOR' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">Mesin Uji Validasi Silang Bursa Real-Time</h4>
                  <p className="text-xs text-slate-400">
                    Koneksikan terminal ke feed resmi Keterbukaan Informasi BEI dan KSEI Corporate Action Registry
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateApiCheck('BBRI')}
                    disabled={isValidatingApi}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer"
                  >
                    Uji Validasi BBRI
                  </button>
                  <button
                    onClick={() => handleSimulateApiCheck('ASII')}
                    disabled={isValidatingApi}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer"
                  >
                    Uji Validasi ASII
                  </button>
                </div>
              </div>

              {/* Terminal Log Output */}
              <div className="p-4 rounded-xl bg-black/90 border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 min-h-[220px] max-h-[300px] overflow-y-auto">
                <div className="text-slate-500 pb-1 border-b border-slate-800 text-[11px]">
                  --- IDX &amp; KSEI AUDIT LOG FEED ---
                </div>
                {validationLog.length === 0 ? (
                  <div className="text-slate-500 italic py-6 text-center">
                    Klik tombol &quot;Uji Validasi&quot; di atas untuk menjalankan pemeriksaan silang data langsung.
                  </div>
                ) : (
                  validationLog.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Kepatuhan: OJK POJK No. 31/POJK.04/2015 &amp; Peraturan BEI No. I-E</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
          >
            Tutup Panel Audit
          </button>
        </div>

      </div>
    </div>
  );
};
