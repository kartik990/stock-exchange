"use client";
import CandlestickChart from "@/components/market/CandileStickChart";
import { MarketBar } from "@/components/market/MarketBar";
import { SwapUI } from "@/components/market/SwapUI";
import SkeletonBar from "@/components/atoms/SkeletonBar";
import Depth from "@/components/market/depth";
import DepthTableSkeleton from "@/components/molecules/Skeletons/TableSkeleton";
import useDepth from "@/hooks/useDepth";
import useTicker from "@/hooks/useTicker";
import useTrades from "@/hooks/useTrades";
import { useParams } from "next/navigation";
import MiddleSection from "./MiddleSection";
import { useChartData } from "@/hooks/useChartData";

export default function Market() {
  const { market } = useParams();

  const depth = useDepth(market as string);
  const { trades } = useTrades(market as string);
  const { ticker } = useTicker(market as string);
  const { klines, marketInfo } = useChartData();

  const { bids, asks } = depth;
  let currentMarketPrice = 0;
  if (bids?.length && asks?.length && bids[0][0] && asks[0][0]) {
    currentMarketPrice = (+bids[0][0] + +asks[0][0]) / 2;
  }

  return (
    <div className="flex flex-wrap bg-gray-950">
      <div className="flex w-full lg:w-[50%] flex-col">
        {ticker ? (
          <MarketBar
            ticker={ticker}
            marketInfo={marketInfo}
            currentMarketPrice={currentMarketPrice}
          />
        ) : (
          <div className="ml-2 h-[60px]">
            <SkeletonBar height="52px" width="50%" />
          </div>
        )}
        <div className="flex flex-1 border-y border-slate-800">
          <CandlestickChart klines={klines} />
        </div>
      </div>
      <div className="border-slate-800 border-l-2"></div>
      <div className="flex-1 lg:w-[25%]">
        <MiddleSection
          currentMarketPrice={currentMarketPrice}
          depth={depth}
          ticker={ticker}
          trades={trades}
        />
      </div>
      <div className="border-slate-800 border-l-2"></div>
      <div className="pb-10 md:pd-0 flex-1 lg:w-[25%] mt-2 sm:mt-0 border-slate-800 border-t-2 sm:border-0">
        <SwapUI
          market={market as string}
          currentMarketPrice={currentMarketPrice}
        />
      </div>
    </div>
  );
}
