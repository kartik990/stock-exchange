"use client";

import { usePathname } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button";
import { useRouter } from "next/navigation";

export const Appbar = () => {
  const route = usePathname();
  const router = useRouter();

  return (
    <div className="text-white border-b bg-gray-900 border-slate-700">
      <div className="flex justify-between items-center p-2">
        <div className="flex">
          <div
            className={`text-xl pl-4 flex flex-col justify-center cursor-pointer text-white`}
            onClick={() => router.push("/")}
          >
            Exchange
          </div>
          <div
            className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
              route.startsWith("/dashboard") ? "text-white" : "text-slate-500"
            }`}
            onClick={() => router.push("/")}
          >
            Dashboard
          </div>
          <div
            className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
              route.startsWith("/TATA_INR") ? "text-white" : "text-slate-500"
            }`}
            onClick={() => router.push("/TATA_INR")}
          >
            Trade
          </div>
          <div
            className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
              route.startsWith("/orders") ? "text-white" : "text-slate-500"
            }`}
            onClick={() => router.push("/orders")}
          >
            Orders
          </div>
          <div
            className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
              route.startsWith("/portfolio") ? "text-white" : "text-slate-500"
            }`}
            onClick={() => router.push("/portfolio")}
          >
            Portfolio
          </div>
          <div
            className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
              route.startsWith("/funds") ? "text-white" : "text-slate-500"
            }`}
            onClick={() => router.push("/funds")}
          >
            Funds
          </div>
        </div>
        <div className="flex">
          <div className="p-2 mr-2">
            <SuccessButton>Deposit</SuccessButton>
            <PrimaryButton>Withdraw</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
