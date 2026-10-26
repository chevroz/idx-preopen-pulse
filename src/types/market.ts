export type SentimentType = 'bullish' | 'bearish' | 'neutral';

export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type SectorType =
  | 'Banking & Finance'
  | 'Mining & Energy'
  | 'Technology & Telco'
  | 'Consumer Goods'
  | 'Infrastructure & Utilities'
  | 'Macro & Policy';

export interface MarketNewsItem {
  id: string;
  title: string;
  summary: string;
  source: 'Bisnis.com' | 'Kontan' | 'CNBC Indonesia' | 'IDX Disclosure' | 'Bloomberg Technoz' | 'Investor Daily';
  sourceUrl?: string;
  publishedAt: string; // ISO string
  publishedTimeStr: string; // e.g. "07:42 WIB"
  tickers: string[]; // e.g. ['BBCA', 'BMRI']
  sentiment: SentimentType;
  impact: ImpactLevel;
  sector: SectorType;
  category: 'Breaking' | 'Corporate Action' | 'Earnings' | 'Commodity Catalyst' | 'Macro Policy' | 'Foreign Flow';
  readTime: string;
  keyTakeaways: string[];
  isFeatured?: boolean;
}

export interface MacroIndicator {
  symbol: string;
  name: string;
  value: string;
  change: string;
  changePercent: number;
  isPositive: boolean;
  category: 'Index' | 'Currency' | 'Commodity' | 'Global';
  note?: string;
}

export interface CorporateAction {
  id: string;
  ticker: string;
  companyName: string;
  type: 'Dividen Tunai' | 'RUPS' | 'Right Issue' | 'Stock Split' | 'Public Expose';
  date: string;
  timeStr: string;
  detail: string;
  yieldPercent?: number;
  amount?: string;
  cumDate?: string;
  exDate?: string;
  paymentDate?: string;
  recordingDate?: string;
  status?: 'CUM_TODAY' | 'EX_DATE' | 'UPCOMING';
}

export interface PreMarketBriefing {
  generatedAt: string;
  ihsgBias: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  biasReason: string;
  supportResistance: {
    support1: string;
    support2: string;
    pivot: string;
    resistance1: string;
    resistance2: string;
  };
  macroSummary: string;
  topCatalysts: {
    ticker: string;
    action: 'BUY WATCH' | 'HOLD' | 'PROFIT TAKE' | 'SPECULATIVE BUY';
    catalyst: string;
    sentiment: SentimentType;
  }[];
  watchSectors: {
    sector: string;
    bias: 'Overweight' | 'Neutral' | 'Underweight';
    drivers: string;
  }[];
  keyAdvice: string;
}

export interface MarketSessionInfo {
  currentTimeWIB: string;
  dateWIB: string;
  status: 'PRE_OPEN' | 'OPEN_SESSION_1' | 'BREAK' | 'OPEN_SESSION_2' | 'PRE_CLOSE' | 'CLOSED';
  statusLabel: string;
  nextEvent: string;
  secondsToNextEvent: number;
}
