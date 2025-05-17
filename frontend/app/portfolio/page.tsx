"use client";
import { getPortfolio } from "@/utils/httpClient";
import React, { useEffect } from "react";

const mockBalances = {
  INR: { available: 30000.0, locked: 20000.0 },
};

const mockHoldings = [
  {
    symbol: "TATA",
    available: 70,
    locked: 30,
    avgPrice: 120,
    currentPrice: 125,
  },
  {
    symbol: "INFY",
    available: 40,
    locked: 10,
    avgPrice: 1500,
    currentPrice: 1480,
  },
  {
    symbol: "RELIANCE",
    available: 15,
    locked: 5,
    avgPrice: 2500,
    currentPrice: 2600,
  },
];

const mockTradeHistory = [
  {
    symbol: "TATA",
    side: "buy",
    quantity: 50,
    price: 120,
    time: "2025-05-11 14:20",
  },
  {
    symbol: "INFY",
    side: "sell",
    quantity: 10,
    price: 1500,
    time: "2025-05-10 16:45",
  },
];

const mockTransactions = [
  { type: "deposit", amount: 10000, currency: "INR", time: "2025-05-09 12:00" },
  { type: "withdraw", amount: 5000, currency: "INR", time: "2025-05-08 09:30" },
];

export default function PortfolioPage() {
  useEffect(() => {
    getPortfolio("5");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold">Your Portfolio</h1>

      {/* Stock Holdings */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Stock Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Symbol</th>
                <th className="py-2">Available</th>
                <th className="py-2">Locked</th>
                <th className="py-2">Avg. Price</th>
                <th className="py-2">Current Price</th>
                <th className="py-2">PnL</th>
              </tr>
            </thead>
            <tbody>
              {mockHoldings.map((stock) => {
                const totalQty = stock.available + stock.locked;
                const pnl = (stock.currentPrice - stock.avgPrice) * totalQty;
                const pnlColor =
                  pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "";

                return (
                  <tr key={stock.symbol} className="border-b border-gray-700">
                    <td className="py-2">{stock.symbol}</td>
                    <td className="py-2">{stock.available}</td>
                    <td className="py-2">{stock.locked}</td>
                    <td className="py-2">{stock.avgPrice.toFixed(2)}</td>
                    <td className="py-2">{stock.currentPrice.toFixed(2)}</td>
                    <td className={`py-2 ${pnlColor}`}>{pnl.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade History */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Trade History</h2>
        <ul className="space-y-2">
          {mockTradeHistory.map((trade, idx) => (
            <li key={idx} className="text-sm">
              {trade.time} - {trade.side.toUpperCase()} {trade.quantity}{" "}
              {trade.symbol} @ {trade.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
