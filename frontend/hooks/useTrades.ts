import { getTrades } from "@/utils/httpClient";
import { SignalingManager } from "@/utils/SignalingManager";
import { Trade } from "@/utils/types";
import { useEffect, useState } from "react";

type wsTradeData = {
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

const useTrades = (market: string | null | undefined) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!market) return;

    SignalingManager.getInstance().registerCallback(
      "trade",
      (data: wsTradeData) => {
        setTrades((prev) => {
          const nwTrades = [...prev];

          nwTrades.unshift({
            price: data.price,
            currency_code: data.currency_code,
            side: data.side,
            time: data.time,
            quantity: data.qty,
          });

          if (nwTrades.length > 250) nwTrades.pop();

          return nwTrades;
        });
      },
      `trade-${market}`
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`trade@${market}`],
    });

    getTrades(market).then(setTrades);

    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`trade@${market}`],
      });
      SignalingManager.getInstance().deRegisterCallback(
        "trade",
        `trade-${market}`
      );
    };
  }, [market]);

  return { trades };
};

export default useTrades;
