"use client";
import useTicker from "@/hooks/useTicker";
import { getHoldings } from "@/utils/httpClient";
import React, { useEffect, useState } from "react";

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<any[]>();

  const { ticker } = useTicker("TATA_INR");

  useEffect(() => {
    getHoldings("5").then((rows) => setHoldings(rows));
  }, []);

  const lastPrice = Number(ticker?.lastPrice);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 py-6 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Your Holdings</h1>

      {/* Stock Holdings */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Stock Holdings
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2 px-2">Symbol</th>
                <th className="py-2 px-2">Qty</th>
                <th className="py-2 px-2">Avg. Buy</th>
                <th className="py-2 px-2">Current</th>
                <th className="py-2 px-2">Invested</th>
                <th className="py-2 px-2">Market Value</th>
                <th className="py-2 px-2">PnL</th>
                <th className="py-2 px-2">PnL %</th>
              </tr>
            </thead>
            <tbody>
              {holdings?.length && lastPrice ? (
                holdings.map((h) => {
                  const marketVal = lastPrice * h.quantity;
                  const pnl = marketVal - h.total_invested;
                  const pnlPer = (pnl / h.total_invested) * 100;
                  const pnlColor =
                    pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "";

                  return (
                    <tr key={h.symbol} className="border-b border-gray-700">
                      <td className="py-2 px-2">{h.symbol.split("_")[0]}</td>
                      <td className="py-2 px-2">{h.quantity?.toFixed(2)}</td>
                      <td className="py-2 px-2">
                        {h.avg_buy_price?.toFixed(2)}
                      </td>
                      <td className="py-2 px-2">{lastPrice.toFixed(2)}</td>
                      <td className="py-2 px-2">
                        {h.total_invested?.toFixed(2)}
                      </td>
                      <td className="py-2 px-2">{marketVal.toFixed(2)}</td>
                      <td className={`py-2 px-2 ${pnlColor}`}>
                        {pnl.toFixed(2)}
                      </td>
                      <td className={`py-2 px-2 ${pnlColor}`}>
                        {pnlPer.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">
                    {holdings ? "No holdings available." : "Loading..."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
