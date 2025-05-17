export interface KLine {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  volume: string;
  bucket: string;
}

export interface Trade {
  side: "buy" | "sell";
  price: number;
  quantity: number;
  currency_code: string;
  time: number;
}

export interface Depth {
  bids: [string, string][];
  asks: [string, string][];
  lastUpdateId: string;
}

export interface Ticker {
  firstPrice: string;
  high: string;
  lastPrice: string;
  lastTradeKind: "buy" | "sell";
  low: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  trades: string;
  volume: string;
}

export interface Order {
  id: string; // UUID
  user_id: string; // UUID
  market: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
  filled_quantity: number;
  status: "open" | "partial" | "filled" | "cancelled";
  created_at: string;
}
