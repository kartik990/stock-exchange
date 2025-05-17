import React, { useEffect, useRef } from "react";
import { createChart, CrosshairMode, IChartApi } from "lightweight-charts";
import { KLine } from "@/utils/types";

export default function CandlestickChart({ klines }: { klines: KLine[] }) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { color: "#0e0f14" },
        textColor: "#ffffff",
      },
      grid: {
        vertLines: { color: "#1e222d" },
        horzLines: { color: "#1e222d" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#6A7284",
          labelBackgroundColor: "#1e222d",
        },
        horzLine: {
          color: "#6A7284",
          labelBackgroundColor: "#1e222d",
        },
      },
      priceScale: {
        borderColor: "#1e222d",
      },
      timeScale: {
        borderColor: "#1e222d",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#22c55ebe",
      downColor: "#ef4444be",
      borderVisible: false,
      wickUpColor: "#22c55ebe",
      wickDownColor: "#ef4444be",
    });

    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
    });

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    let mounted = true;

    const setChartData = async () => {
      try {
        if (!mounted || !klines?.length) return;

        const candleData = klines.map((d) => ({
          time: Math.floor(new Date(d.bucket).getTime() / 1000),
          open: d.open,
          high: Math.max(+d.high, +d.open, +d.close),
          low: Math.min(+d.low, +d.open, +d.close),
          close: d.close,
          volume: d.volume,
        }));

        const volumeData = candleData.map((item) => ({
          time: item.time,
          value: item.volume,
          color: item.open <= item.close ? "#4ade8048" : "#f95b5b4e",
        }));

        candlestickSeries.setData(candleData);
        volumeSeries.setData(volumeData);

        const lastTimestamp = candleData[candleData.length - 1]?.time;
        if (lastTimestamp) {
          chart.timeScale().setVisibleRange({
            from: lastTimestamp - 8000,
            to: lastTimestamp,
          });
        }
      } catch (err) {
        console.error("Error fetching Kline data:", err);
      }
    };

    setChartData();

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [klines]);

  return (
    <div className="flex flex-col w-full h-full text-gray-200">
      <div ref={chartContainerRef} className="w-full h-[560px]" />
    </div>
  );
}
