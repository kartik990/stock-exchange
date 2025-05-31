"use client";
import { Ticker } from "@/utils/types";
import { IndianRupeeIcon } from "lucide-react";

interface MarketBarProps {
  currentMarketPrice: number;
  ticker: Ticker | null;
  marketInfo: {
    high_price: number;
    low_price: number;
    total_volume: number;
  } | null;
}

export const MarketBar: React.FC<MarketBarProps> = ({
  ticker,
  marketInfo,
  currentMarketPrice,
}) => {
  const lastPrice = Number(ticker?.lastPrice || 0);
  const priceChange = Number(ticker?.priceChange || 0);
  const priceChangePercent = Number(ticker?.priceChangePercent || 0);
  const isPositive = priceChange >= 0;
  const priceChangeColor = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className="w-full border-b border-slate-800 bg-gray-900 text-white sm:h-[65px] py-2 sm:py-0 overflow-x-auto sm:overflow-visible">
      <div className="grid grid-cols-3 sm:mt-3 gap-y-4 sm:gap-0 sm:h-auto sm:flex items-center h-full px-4 sm:px-6 space-x-6 sm:space-x-10 whitespace-nowrap">
        {/* Last Price */}
        <div className="flex flex-col justify-center">
          <p
            className={`font-semibold flex items-center gap-1 tabular-nums ${
              ticker?.lastTradeKind === "buy"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            <IndianRupeeIcon className="w-4 h-4" />
            {lastPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1 tabular-nums">
            <IndianRupeeIcon className="w-3 h-3" />
            {currentMarketPrice.toFixed(2)}
          </p>
        </div>

        {/* 24H Change */}
        <div className="flex flex-col col-span-2">
          <p className="text-sm text-slate-400">24H Change</p>
          <p className={`text-sm font-medium tabular-nums ${priceChangeColor}`}>
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </p>
        </div>

        {/* High */}
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">1hr High</p>
          <p className="text-sm font-medium tabular-nums">
            {marketInfo?.high_price?.toFixed(2) ?? "--"}
          </p>
        </div>

        {/* Low */}
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">1hr Low</p>
          <p className="text-sm font-medium tabular-nums">
            {marketInfo?.low_price?.toFixed(2) ?? "--"}
          </p>
        </div>

        {/* Volume */}
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">1hr Volume</p>
          <p className="text-sm font-medium tabular-nums">
            {marketInfo?.total_volume?.toFixed(2) ?? "--"}
          </p>
        </div>
      </div>
    </div>
  );
};
