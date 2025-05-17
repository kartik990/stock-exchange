"use client";
import React from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const bannerImages = [
  "/images/banner1.png",
  "/images/banner2.jpg",
  "/images/banner3.png",
  "/images/banner4.png",
];

const marketList = [
  { symbol: "TATA/INR", price: 120.45, change: "+2.5%" },
  { symbol: "INFY/INR", price: 1480.0, change: "-1.3%" },
  { symbol: "RELIANCE/INR", price: 2600.0, change: "+0.9%" },
  { symbol: "HDFC/INR", price: 1750.3, change: "-0.4%" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-4 pb-8">
      <h1 className="text-[24px] font-bold mb-4">Welcome to Stock Exchange</h1>

      {/* Carousel */}
      <div className="rounded-xl mb-6 overflow-hidden shadow-xl shadow-gray-800 ">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          interval={4000}
        >
          {bannerImages.map((src, index) => (
            <div key={index}>
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                width={1200}
                height={400}
                className="w-full h-[40vh] object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="w-full bg-gray-900 mb-4 ">
        <div className="mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets, stocks, tokens..."
              className="w-full pl-5 pr-12 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Markets */}
      <div className="bg-gray-800 rounded-xl p-4 px-6 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Markets</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2">Pair</th>
              <th className="py-2">Last Price</th>
              <th className="py-2">24h Change</th>
            </tr>
          </thead>
          <tbody>
            {marketList.map((market, idx) => (
              <tr key={idx} className="border-b border-gray-700">
                <td className="py-2">{market.symbol}</td>
                <td className="py-2">{market.price.toFixed(2)}</td>
                <td
                  className={`py-2 ${
                    market.change.startsWith("-")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {market.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
