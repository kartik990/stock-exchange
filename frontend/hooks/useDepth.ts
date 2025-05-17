import { getDepth } from "@/utils/httpClient";
import { SignalingManager } from "@/utils/SignalingManager";
import { useEffect, useState } from "react";

const useDepth = (market: string | null | undefined) => {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();

  useEffect(() => {
    if (!market) return;

    SignalingManager.getInstance().registerCallback(
      "depth",
      (data: any) => {
        if (data.bids.length < 4 || data.asks.length < 4) return;

        const bidsAfterSort = [...(data.bids || [])];
        const asksAfterSort = [...(data.asks || [])];

        bidsAfterSort.sort((x, y) => (Number(y[0]) > Number(x[0]) ? 1 : -1));
        asksAfterSort.sort((x, y) => (Number(y[0]) > Number(x[0]) ? -1 : 1));

        setBids(bidsAfterSort);
        setAsks(asksAfterSort);
      },
      `DEPTH-${market}`
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth@${market}`],
    });

    getDepth(market).then((d) => {
      setBids(d.bids.slice().sort((a, b) => +b[0] - +a[0]));
      setAsks(d.asks.slice().sort((a, b) => +a[0] - +b[0]));
    });

    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth@${market}`],
      });
      SignalingManager.getInstance().deRegisterCallback(
        "depth",
        `DEPTH-${market}`
      );
    };
  }, [market]);

  return { bids, asks };
};

export default useDepth;
