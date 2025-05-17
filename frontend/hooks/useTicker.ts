import { getTicker } from "@/utils/httpClient";
import { SignalingManager } from "@/utils/SignalingManager";
import { Ticker } from "@/utils/types";
import { useEffect, useState } from "react";

const useTicker = (market: string | null | undefined) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    if (!market) return;

    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: any) => {
        setTicker(data);
      },
      `TICKER-${market}`
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker@${market}`],
    });

    getTicker(market).then((t) => setTicker(t));

    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker@${market}`],
      });

      SignalingManager.getInstance().deRegisterCallback(
        "depth",
        `TICKER-${market}`
      );
    };
  }, [market]);

  return { ticker };
};

export default useTicker;
