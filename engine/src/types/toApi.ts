import { Order } from "../trade/Orderbook";

export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";
export const TICKERS = "TICKERS";

export const GET_DEPTH = "GET_DEPTH";

export type MessageToApi =
  | {
      type: "DEPTH";
      payload: {
        bids: [string, string][];
        asks: [string, string][];
      };
    }
  | {
      type: "TICKER";
      payload: {
        firstPrice: string;
        market: string;
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
      };
    }
  | {
      type: "ORDER_PLACED";
      payload: {
        orderId: string;
        executedQty: number;
        fills: {
          price: string;
          qty: number;
          tradeId: number;
        }[];
      };
    }
  | {
      type: "ORDER_CANCELLED";
      payload: {
        orderId: string;
        executedQty: number;
        remainingQty: number;
      };
    }
  | {
      type: "OPEN_ORDERS";
      payload: Order[];
    }
  | {
      type: "ON_RAMP";
      payload: {
        success: boolean;
        message?: string;
      };
    }
  | {
      type: "BALANCE";
      payload: {
        [key: string]: {
          available: number;
          locked: number;
        };
      };
    };
