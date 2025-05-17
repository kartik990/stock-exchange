import { Ticker, Trade } from "@/utils/types";
import React, { useState } from "react";
import Depth from "../depth";
import Trades from "../Trades";
import DepthTableSkeleton from "@/components/molecules/Skeletons/TableSkeleton";

const views = [
  {
    id: "bids",
    bid: true,
    ask: false,
  },
  {
    id: "asks",
    bid: false,
    ask: true,
  },
  {
    id: "both",
    bid: true,
    ask: true,
  },
];

interface MiddleSectionProps {
  ticker: Ticker | null;
  depth: {
    asks: [string, string][] | undefined;
    bids: [string, string][] | undefined;
  };
  currentMarketPrice: number;
  trades: Trade[];
}

const MiddleSection: React.FC<MiddleSectionProps> = ({
  currentMarketPrice,
  depth,
  ticker,
  trades,
}) => {
  const [activeTab, setActiveTab] = useState<string>("Book");
  const [selected, setSelected] = useState<string>("both");

  return (
    <div className="w-full">
      <div className="flex flex-row-reverse items-center justify-between px-3  border-b border-slate-800 py-2 h-[65px]">
        <div className="flex gap-0">
          {["Book", "Trades"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm
                ${
                  activeTab === tab
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-[#0d0d10] rounded">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => {
                setSelected(view.id);
                setActiveTab("Book");
              }}
              className={`
                p-2 rounded-md transition-colors ${
                  selected === view.id && "bg-slate-800"
                }
                `}
            >
              <div className="flex flex-col gap-[2px]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-[2px]">
                    <div
                      className={`w-3 h-[2px] ${
                        view.bid ? "bg-green-500 " : "bg-gray-600"
                      } rounded-sm`}
                    />
                    <div
                      className={`w-3 h-[2px] ${
                        view.ask ? "bg-red-500" : "bg-gray-600"
                      } rounded-sm`}
                    />
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="border-slate-800 border-b-2 mb-1"></div>
      {activeTab == "Book" ? (
        depth.bids && depth.asks ? (
          <Depth
            currentMarketPrice={currentMarketPrice}
            depth={depth}
            selected={selected}
            ticker={ticker}
          />
        ) : (
          <DepthTableSkeleton />
        )
      ) : (
        <Trades trades={trades} />
      )}
    </div>
  );
};

export default MiddleSection;
