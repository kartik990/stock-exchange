import { Trade } from "@/utils/types";
import React from "react";

interface TradesProps {
  trades: Trade[];
}

const Trades: React.FC<TradesProps> = ({ trades }) => {
  return (
    <div className="text-white px-2 w-full">
      <div className="flex justify-between mb-2 text-xs">
        <div className="text-white w-20">Price</div>
        <div className="text-slate-400 w-full text-center">Qty.</div>
        <div className="text-slate-400 pr-4">Time</div>
      </div>
      <div className="flex flex-col gap-1 text-sm overflow-y-auto custom-scroll max-h-[70vh]">
        {trades.map((trade, idx) => (
          <div key={idx} className="flex justify-between ">
            <div
              className={
                trade.side == "buy"
                  ? "text-green-400 w-20"
                  : "text-red-400 w-20"
              }
            >
              {trade.price.toFixed(2)}
            </div>
            <div className="w-10 text-right">{trade.quantity.toFixed(2)}</div>
            <div className="text-zinc-400 pr-2">
              {" "}
              {new Date(trade.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trades;
