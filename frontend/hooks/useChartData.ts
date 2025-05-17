import { getChartData } from "@/utils/httpClient";
import { KLine } from "@/utils/types";
import { useEffect, useState } from "react";

export const useChartData = () => {
  const [klines, setKlines] = useState<KLine[]>([]);
  const [marketInfo, setMarketInfo] = useState<{
    high_price: number;
    low_price: number;
    total_volume: number;
  } | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const { klines, marketInfo } = await getChartData("kk", "k", 1, 2);

      setKlines(klines);
      setMarketInfo(marketInfo);
    };

    const refetchInterval = setInterval(fetchChartData, 5000);

    return () => {
      clearInterval(refetchInterval);
    };
  }, []);

  return { klines, marketInfo };
};
