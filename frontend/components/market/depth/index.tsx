"use client";

import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";

import TableHeader from "./TableHeader";
import { Ticker } from "@/utils/types";

interface DepthProps {
  selected: string;
  ticker: Ticker | null;
  depth: {
    asks: [string, string][] | undefined;
    bids: [string, string][] | undefined;
  };
  currentMarketPrice: number;
}

const Depth: React.FC<DepthProps> = ({
  selected,
  ticker,
  depth,
  currentMarketPrice,
}) => {
  const { bids, asks } = depth;

  return (
    <div>
      <TableHeader />
      {asks && selected != "bids" && (
        <AskTable asks={asks} selected={selected == "asks"} />
      )}
      <div className="flex items-center gap-3 mt-2 px-2">
        {ticker && (
          <div
            className={`font-medium text-[18px] ${
              ticker.lastTradeKind == "buy" ? "text-green-500" : "text-red-400"
            }`}
          >
            {ticker.lastPrice}
          </div>
        )}
        {currentMarketPrice > 0 && (
          <div className="text-slate-500">{currentMarketPrice.toFixed(2)}</div>
        )}
      </div>
      {bids && selected != "asks" && (
        <BidTable bids={bids} selected={selected == "bids"} />
      )}
    </div>
  );
};

export default Depth;
