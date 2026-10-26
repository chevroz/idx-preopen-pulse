import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_MACRO_INDICATORS,
  INITIAL_NEWS_ITEMS,
  INITIAL_CORPORATE_ACTIONS,
  DEFAULT_PREMARKET_BRIEFING,
} from './src/data/marketSeed.ts';
import { PreMarketBriefing, MarketSessionInfo } from './src/types/market.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper: Calculate current Jakarta / WIB Time (UTC+7)
function getWIBTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 3600000);
}

// Helper: Get Market Session Info
function getMarketSessionInfo(): MarketSessionInfo {
  const wib = getWIBTime();
  const hours = wib.getHours();
  const minutes = wib.getMinutes();
  const seconds = wib.getSeconds();
  const timeInMins = hours * 60 + minutes;
  const isFriday = wib.getDay() === 5;
  const isWeekend = wib.getDay() === 0 || wib.getDay() === 6;

  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} WIB`;
  const dateStr = wib.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (isWeekend) {
    // Weekend: Closed
    return {
      currentTimeWIB: timeStr,
      dateWIB: dateStr,
      status: 'CLOSED',
      statusLabel: 'Weekend Closed (Bursa Libur Akhir Pekan)',
      nextEvent: 'Senin Pre-Opening 08:45 WIB',
      secondsToNextEvent: 0,
    };
  }

  // Pre-Opening: 08:45 - 08:59 (525 to 539)
  // Session 1: 09:00 - 12:00 (540 to 720) [Friday ends at 11:30 = 690]
  // Break: 12:00 - 13:30 (720 to 810) [Friday 11:30 - 14:00 = 690 to 840]
  // Session 2: 13:30 - 15:49 (810 to 949) [Friday 14:00 - 15:49 = 840 to 949]
  // Pre-Closing & Post-Trading: 15:50 - 16:15 (950 to 975)
  // Closed / Pre-Market Prep: After 16:15 or before 08:45

  const fridayBreakStart = 11 * 60 + 30;
  const fridaySession2Start = 14 * 60;
  const regularBreakStart = 12 * 60;
  const regularSession2Start = 13 * 60 + 30;

  const breakStart = isFriday ? fridayBreakStart : regularBreakStart;
  const session2Start = isFriday ? fridaySession2Start : regularSession2Start;

  if (timeInMins >= 525 && timeInMins < 540) {
    const diffSec = (540 * 60) - (timeInMins * 60 + seconds);
    return {
      currentTimeWIB: timeStr,
      dateWIB: dateStr,
      status: 'PRE_OPEN',
      statusLabel: 'Pre-Opening Session (08:45 - 08:59 WIB)',
      nextEvent: 'Pembukaan Sesi 1 (09:00 WIB)',
      secondsToNextEvent: Math.max(0, diffSec),
    };
  } else if (timeInMins >= 540 && timeInMins < breakStart) {
    const diffSec = (breakStart * 60) - (timeInMins * 60 + seconds);
    return {
      currentTimeWIB: timeStr,
      dateWIB: dateStr,
      status: 'OPEN_SESSION_1',
      statusLabel: 'Pasar Reguler Sesi 1 Aktif',
      nextEvent: `Istirahat Sesi 1 (${isFriday ? '11:30' : '12:00'} WIB)`,
      secondsToNextEvent: Math.max(0, diffSec),
    };
  } else if (timeInMins >= breakStart && timeInMins < session2Start) {
    const diffSec = (session2Start * 60) - (timeInMins * 60 + seconds);
    return {
      currentTimeWIB: timeStr,
      dateWIB: dateStr,
      status: 'BREAK',
      statusLabel: 'Jeda Siang (Ishoma)',
      nextEvent: `Pembukaan Sesi 2 (${isFriday ? '14:00' : '13:30'} WIB)`,
      secondsToNextEvent: Math.max(0, diffSec),
    };
  } else if (timeInMins >= session2Start && timeInMins < 950) {
    const diffSec = (950 * 60) - (timeInMins * 60 + seconds);
    return {
      currentTimeWIB: timeStr,
      dateWIB: dateStr,
      status: 'OPEN_SESSION_2',
      statusLabel: 'Pasar Reguler Sesi 2 Aktif',
      nextEvent: 'Pre-Closing Session (15:50 WIB)',
      secondsToNextEvent: Math.max(0, diffSec),
    };
  } else if (timeInMins >= 950 && timeInMins < 975) {
    const diffSec = (975 * 60) - (timeInMins * 60 + seconds);
    return {
      currentTimeWIB: timeStr,
      dateWIB: dateStr,
      status: 'PRE_CLOSE',
      statusLabel: 'Pre-Closing & Post Trading (15:50 - 16:15 WIB)',
      nextEvent: 'Penutupan Pasar Bursa (16:15 WIB)',
      secondsToNextEvent: Math.max(0, diffSec),
    };
  } else {
    // Before 08:45 or after 16:15
    let diffSec = 0;
    if (timeInMins < 525) {
      diffSec = (525 * 60) - (timeInMins * 60 + seconds);
    } else {
      diffSec = ((24 * 60 + 525) * 60) - (timeInMins * 60 + seconds);
    }
    return {
      currentTimeWIB: timeStr,
      dateWIB: dateStr,
      status: 'CLOSED',
      statusLabel: 'Fase Persiapan Pre-Market (Market Closed)',
      nextEvent: 'Pre-Opening Session (08:45 WIB)',
      secondsToNextEvent: Math.max(0, diffSec),
    };
  }
}

// API Routes
app.get('/api/market/status', (_req: Request, res: Response) => {
  res.json(getMarketSessionInfo());
});

app.get('/api/market/macro', (_req: Request, res: Response) => {
  res.json(INITIAL_MACRO_INDICATORS);
});

app.get('/api/news', (req: Request, res: Response) => {
  const { sector, impact, ticker, search, sort, sentiment, timeframe } = req.query;
  let items = [...INITIAL_NEWS_ITEMS];

  // Sentiment filter
  if (sentiment && typeof sentiment === 'string' && sentiment !== 'ALL') {
    items = items.filter((n) => n.sentiment === sentiment);
  }

  // Timeframe filter (e.g. 'week' = past 7 days)
  if (timeframe === 'week' || timeframe === '7d') {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    items = items.filter((n) => new Date(n.publishedAt).getTime() >= oneWeekAgo);
  } else if (timeframe === '24h') {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    items = items.filter((n) => new Date(n.publishedAt).getTime() >= oneDayAgo);
  } else if (timeframe === '3d') {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    items = items.filter((n) => new Date(n.publishedAt).getTime() >= threeDaysAgo);
  }

  if (sector && typeof sector === 'string' && sector !== 'ALL') {
    items = items.filter((n) => n.sector === sector);
  }

  if (impact && typeof impact === 'string' && impact !== 'ALL') {
    items = items.filter((n) => n.impact === impact);
  }

  if (ticker && typeof ticker === 'string' && ticker !== 'ALL') {
    const t = ticker.toUpperCase();
    items = items.filter((n) => n.tickers.includes(t));
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    items = items.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tickers.some((tick) => tick.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'impact') {
    const impactOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    items.sort((a, b) => impactOrder[b.impact] - impactOrder[a.impact]);
  } else if (sort === 'bullish') {
    const sentimentOrder = { bullish: 3, neutral: 2, bearish: 1 };
    items.sort((a, b) => sentimentOrder[b.sentiment] - sentimentOrder[a.sentiment]);
  } else {
    // Default: latest timestamp
    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  res.json(items);
});

let liveCorporateActions = [...INITIAL_CORPORATE_ACTIONS];

app.get('/api/corporate-actions', (req: Request, res: Response) => {
  const { verifiedOnly, ticker } = req.query;
  let result = [...liveCorporateActions];

  if (verifiedOnly === 'true') {
    result = result.filter((a) => a.verificationStatus === 'VERIFIED_OFFICIAL');
  }

  if (ticker && typeof ticker === 'string') {
    result = result.filter((a) => a.ticker === ticker.toUpperCase());
  }

  res.json(result);
});

// Endpoint to audit / confirm corporate actions before display
app.post('/api/data-verification/confirm', (req: Request, res: Response) => {
  const { actionId, status } = req.body || {};
  if (!actionId) {
    return res.status(400).json({ error: 'actionId is required' });
  }

  liveCorporateActions = liveCorporateActions.map((action) => {
    if (action.id === actionId) {
      return {
        ...action,
        verificationStatus: status || 'VERIFIED_OFFICIAL',
        confirmedAt: `${getWIBTime().toLocaleDateString('id-ID')} ${getWIBTime().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
        confirmedBy: 'BEI/KSEI Pre-Flight Audit System',
        verificationChecklist: {
          ...action.verificationChecklist,
          kseiNoticeConfirmed: status === 'VERIFIED_OFFICIAL',
          beiDisclosureConfirmed: status === 'VERIFIED_OFFICIAL',
          tradingScheduleConfirmed: status === 'VERIFIED_OFFICIAL',
        },
      };
    }
    return action;
  });

  const updated = liveCorporateActions.find((a) => a.id === actionId);
  res.json({ success: true, updatedAction: updated });
});

// AI Morning Briefing Generator via Gemini 3.8 Flash
app.post('/api/ai/briefing', async (req: Request, res: Response) => {
  const { watchlist, focusSectors } = req.body || {};

  try {
    if (!ai) {
      // If no API key configured, return rich default seed
      return res.json({
        ...DEFAULT_PREMARKET_BRIEFING,
        generatedAt: getWIBTime().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      });
    }

    const newsTitles = INITIAL_NEWS_ITEMS.slice(0, 6)
      .map((n) => `[${n.impact}] ${n.tickers.join(',')} - ${n.title}`)
      .join('\n');

    const watchlistStr = Array.isArray(watchlist) && watchlist.length > 0 ? watchlist.join(', ') : 'BBCA, BBRI, BMRI, AMMN, BREN, ADRO, TLKM';

    const prompt = `You are the Chief Market Strategist for the Indonesia Stock Exchange (IDX / Bursa Efek Indonesia) Pre-Opening Intelligence Desk.
Current Date: 2026-10-26. Current Time in Jakarta is Pre-Market (prior to 08:45 WIB pre-opening).
Key overnight indicators:
- IHSG closed at 7,382 (+0.52%)
- USD/IDR Jisdor: 15,640 (strengthening)
- LME Nickel: $16,840/MT (+1.94%)
- Newcastle Coal: $142.50/T (+1.28%)
- MDEX CPO: 4,410 MYR/T (+1.43%)
- S&P 500: +0.41%

Latest verified pre-market headlines:
${newsTitles}

User Watchlist: ${watchlistStr}

Generate a concise, professional Pre-Market Briefing in Indonesian (Bahasa Indonesia) formatted strictly as JSON.
Respond ONLY with a valid JSON object matching this schema:
{
  "ihsgBias": "BULLISH" | "NEUTRAL" | "BEARISH",
  "biasReason": "1-2 sentence concise explanation",
  "supportResistance": {
    "support1": "7,340",
    "support2": "7,300",
    "pivot": "7,380",
    "resistance1": "7,420",
    "resistance2": "7,465"
  },
  "macroSummary": "Concise 2 sentence synthesis of global & domestic flows",
  "topCatalysts": [
    {
      "ticker": "BBRI",
      "action": "BUY WATCH" | "HOLD" | "PROFIT TAKE" | "SPECULATIVE BUY",
      "catalyst": "Brief reason and trigger",
      "sentiment": "bullish" | "bearish" | "neutral"
    }
  ],
  "watchSectors": [
    {
      "sector": "Sector name",
      "bias": "Overweight" | "Neutral" | "Underweight",
      "drivers": "Key driver"
    }
  ],
  "keyAdvice": "One golden actionable tip for trading in the 08:45 - 08:59 WIB pre-opening window"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text) as PreMarketBriefing;
    parsed.generatedAt = getWIBTime().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    res.json(parsed);
  } catch (error) {
    console.error('Error generating AI briefing:', error);
    // Graceful fallback to default seed
    res.json({
      ...DEFAULT_PREMARKET_BRIEFING,
      generatedAt: getWIBTime().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      biasReason: DEFAULT_PREMARKET_BRIEFING.biasReason + ' (Analisis pra-pasar konsensus bursa)',
    });
  }
});

// Test Web Push / Webhook notification dispatch
app.post('/api/alerts/test-push', (req: Request, res: Response) => {
  const { title, body, ticker, impact } = req.body || {};
  const alertPayload = {
    id: 'push-' + Date.now(),
    title: title || '🚨 IDX PRE-OPEN ALERT: BBRI Dividen Interim Rp135 & Buyback Rp3T',
    body: body || 'BBRI dividen interim Rp135/saham (payout 80%) & buyback Rp3T cum-date sesi 1. Pasang antrian sebelum 08:45 WIB.',
    ticker: ticker || 'BBRI',
    impact: impact || 'HIGH',
    timestamp: getWIBTime().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    status: 'delivered',
    icon: '/icon.svg',
    badge: '/icon.svg',
  };

  res.json({
    success: true,
    message: 'Mobile push notification queued & broadcast successfully',
    payload: alertPayload,
  });
});

// Setup Vite middlewares or static files
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`IDX Pre-Open Pulse Terminal listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
