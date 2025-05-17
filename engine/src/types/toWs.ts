//TODO: Can we share the types between the ws layer and the engine?

export type TickerUpdateMessage = {
  stream: string;
  data: {
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
    e: "ticker";
  };
};

export type DepthUpdateMessage = {
  stream: string;
  data: {
    b?: [string, string][];
    a?: [string, string][];
    e: "depth";
  };
};

export type TradeAddedMessage = {
  stream: string;
  data: {
    e: "trade";
    tradeId: number;
    maker: boolean;
    side: "buy" | "sell";
    price: number;
    qty: number;
    time: number; // symbol
    currency_code: string;
    market: string; // symbol
  };
};

export type WsMessage =
  | TickerUpdateMessage
  | DepthUpdateMessage
  | TradeAddedMessage;
