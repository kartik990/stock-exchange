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
  return (
    <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800 py-2 h-[65px]">
      <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
        <div className="flex items-center flex-row space-x-8 pl-4">
          <div className="flex flex-col h-full justify-center">
            <p
              className={`font-medium flex tabular-nums text-greenText text-md ${
                ticker?.lastTradeKind == "buy"
                  ? "text-green-500"
                  : "text-red-400"
              } `}
            >
              <IndianRupeeIcon className="w-4" />
              {Number(ticker?.lastPrice).toFixed(2)}
            </p>
            <p className="font-medium text-sm flex items-center gap-1 tabular-nums">
              <IndianRupeeIcon className="w-3" />{" "}
              {currentMarketPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className={`font-medium text-xs text-slate-400 `}>24H Change</p>
            <p
              className={` text-sm font-medium tabular-nums leading-5  text-greenText ${
                Number(ticker?.priceChange) > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Number(ticker?.priceChange) > 0 ? "+" : ""} {"216"}{" "}
              {Number("27")?.toFixed(2)}%
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-slate-400 text-sm">1hr High</p>
            <p className="font-medium tabular-nums leading-5 text-sm ">
              {marketInfo?.high_price?.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-slate-400 text-sm">1hr Low</p>
            <p className=" font-medium tabular-nums leading-5 text-sm ">
              {marketInfo?.low_price?.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left"
            data-rac=""
          >
            <div className="flex flex-col">
              <p className="font-medium text-slate-400 text-sm">1hr Volume</p>
              <p className="mt-1 font-medium tabular-nums leading-5 text-sm ">
                {marketInfo?.total_volume?.toFixed(2)}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
