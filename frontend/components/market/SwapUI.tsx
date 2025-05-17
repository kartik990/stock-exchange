"use client";
import { placeOrder } from "@/utils/httpClient";
import { IndianRupeeIcon, Layers2, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import NavButton from "../atoms/NavButton";
import { TabButton } from "../atoms/TabButton";
import useBalance from "@/hooks/useBalance";
import { useRouter } from "next/navigation";

export function SwapUI({
  market,
  currentMarketPrice,
}: {
  market: string;
  currentMarketPrice: number;
}) {
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [type, setType] = useState<"Limit" | "Market">("Limit");
  const [error, setError] = useState<string[]>([]);

  const { balance } = useBalance();

  const nav = useRouter();

  const handlePlaceOrder = async () => {
    let err = false;
    if (quantity.trim() == "") {
      setError((prev) => [...prev, "quantity"]);
      err = true;
    }

    if (type == "Limit" && amount.trim() == "") {
      setError((prev) => [...prev, "amount"]);
      err = true;
    }

    if (err) return;

    setLoading(true);

    try {
      await placeOrder({
        market,
        price: amount,
        quantity,
        side,
        userId: "5",
      });

      setOrderPlaced(true);
      setAmount("");
      setQuantity("");

      setInterval(() => {
        setOrderPlaced(false);
      }, 10000);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    setAmount("");
    setQuantity("");
    setError([]);
    setOrderPlaced(false);
  }, [side, type]);

  return (
    <div className="flex flex-col">
      <div className="flex  h-[65px]">
        <NavButton side="buy" activeTab={side} setActiveTab={setSide} />
        <NavButton side="sell" activeTab={side} setActiveTab={setSide} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="px-3">
          <div className="flex flex-row flex-0 gap-5 undefined">
            <TabButton originalType={"Limit"} type={type} setType={setType} />
            <TabButton originalType={"Market"} type={type} setType={setType} />
          </div>
        </div>
        <div className="flex flex-col px-3">
          <div className="flex flex-col flex-1 gap-3 text-baseTextHighEmphasis">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between flex-row">
                <p className="text-xs font-normal text-baseTextMedEmphasis">
                  Available Balance
                </p>
                <p className="font-medium text-xs text-baseTextHighEmphasis">
                  {balance?.available} INR
                </p>
              </div>
              <div className="flex items-center justify-between flex-row">
                <p className="text-xs font-normal text-baseTextMedEmphasis">
                  Current Price
                </p>
                <p className="font-medium text-xs text-baseTextHighEmphasis">
                  {currentMarketPrice.toFixed(2)} INR
                </p>
              </div>
            </div>
            {type != "Market" && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-normal text-baseTextMedEmphasis">
                  Price
                </p>
                <div className="flex flex-col relative">
                  <input
                    step="0.01"
                    placeholder="0"
                    className={`h-12 rounded-lg border-2 border-solid ${
                      error.includes("amount")
                        ? "border-red-600"
                        : "border-baseBorderLight"
                    } bg-[var(--background)] pr-12
                       text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis 
                      ring-0 transition focus:border-accentBlue focus:ring-0`}
                    type="text"
                    onChange={(e) => {
                      setError((prev) => prev.filter((e) => e != "amount"));
                      setAmount(e.target.value);
                    }}
                    value={amount}
                  />
                  <div className="flex flex-row absolute right-1 top-1 p-2">
                    <div className="relative">
                      <IndianRupeeIcon className="w-5" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-xs font-normal text-baseTextMedEmphasis">
              Quantity
            </p>
            <div className="flex flex-col relative">
              <input
                step="0.01"
                placeholder="0"
                className={`h-12 rounded-lg border-2 border-solid ${
                  error.includes("quantity")
                    ? "border-red-600"
                    : "border-baseBorderLight"
                } bg-[var(--background)] pr-12
                       text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis 
                      ring-0 transition focus:border-accentBlue focus:ring-0`}
                type="text"
                onChange={(e) => {
                  setError((prev) => prev.filter((e) => e != "quantity"));
                  setQuantity(e.target.value);
                }}
                value={quantity}
              />
              <div className="flex flex-row absolute right-1 top-1 p-2">
                <div className="relative">
                  <Layers2 className="w-5" />
                </div>
              </div>
            </div>
            <div className="flex justify-end flex-row mt-2 font-medium pr-2 text-sm text-baseTextMedEmphasis">
              {orderPlaced && (
                <div className="mr-auto">Order Placed Successfully!</div>
              )}
              {quantity && amount && type == "Limit" ? (
                <span>≈ {+amount * +quantity} INR</span>
              ) : quantity && currentMarketPrice && type == "Market" ? (
                <span>≈ {(+quantity * currentMarketPrice).toFixed(2)} INR</span>
              ) : (
                <span>≈ 0 INR</span>
              )}
            </div>
          </div>
          <button
            disabled={loading}
            onClick={handlePlaceOrder}
            type="button"
            className={`font-semibold flex justify-center items-center  focus:ring-blue-200 focus:none focus:outline-none text-center h-12 rounded-md text-base px-4 py-2 my-4 ${
              side == "buy"
                ? "bg-greenPrimaryButtonBackground"
                : "bg-red-500 text-white"
            }  active:scale-98`}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : side == "buy" ? (
              "Buy"
            ) : (
              "Sell"
            )}
          </button>
          <button
            onClick={() => nav.push("/orders")}
            type="button"
            className="text-sm mx-auto  mt-1 text-gray-200 hover:underline hover:scale-110 w-fit transition-all duration-200"
          >
            View All Orders →
          </button>
        </div>
      </div>
    </div>
  );
}
