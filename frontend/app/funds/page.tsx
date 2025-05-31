"use client";
import AddFund from "@/components/molecules/pop-up/AddFund";
import WithdrawFund from "@/components/molecules/pop-up/Withdraw";
import useBalance from "@/hooks/useBalance";
import { AlertCircleIcon, X } from "lucide-react";
import React, { useState } from "react";
import { IoIosAdd, IoMdRefresh } from "react-icons/io";

export default function FundsPage() {
  const { balance, transactions, handleDeposit, handleWithdraw } = useBalance();
  const [open, setOpen] = useState<"add" | "withdraw" | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed bg-[#00000056] flex justify-center items-center top-0 left-0 w-screen h-screen z-50"
        >
          <div onClick={(e) => e.stopPropagation()}>
            {open === "add" ? (
              <AddFund
                setOpen={setOpen}
                setError={setError}
                handleDeposit={handleDeposit}
              />
            ) : (
              <WithdrawFund
                setOpen={setOpen}
                setError={setError}
                handleWithdraw={handleWithdraw}
              />
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-900 text-white px-4 py-6 sm:px-6 md:px-12 lg:px-24 space-y-8 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Funds</h1>

        {/* INR Balance */}
        <div className="bg-gray-800 flex flex-col md:flex-row md:justify-between rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 gap-6 transition-all duration-300">
          <div className="flex flex-col">
            <p className="text-sm text-gray-400 mb-1">INR Balance</p>
            <p className="text-xl font-semibold">
              Available: ₹{balance?.available}
            </p>
            <p className="text-md text-gray-300">Locked: ₹{balance?.locked}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:items-center">
            <button
              onClick={() => setOpen("add")}
              className="bg-green-600 flex items-center justify-center gap-2 hover:bg-green-700 px-4 py-2 rounded-lg font-medium text-sm sm:text-lg "
            >
              <IoIosAdd size={22} /> Add Funds
            </button>
            <button
              onClick={() => setOpen("withdraw")}
              className="bg-red-600 flex items-center justify-center gap-2 hover:bg-red-700 px-4 py-2 rounded-lg font-medium text-sm sm:text-lg "
            >
              <IoMdRefresh size={20} /> Withdraw Funds
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full flex items-center gap-2 bg-red-800/20 text-red-400 border border-red-600 rounded-md px-4 py-3">
            <AlertCircleIcon className="min-w-[20px]" />
            <p className="font-semibold text-sm sm:text-base">{error}</p>
            <X
              className="ml-auto cursor-pointer hover:text-red-300"
              onClick={() => setError(null)}
            />
          </div>
        )}

        {/* Transactions */}
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-xl border border-gray-700 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
            Deposit & Withdrawal History
          </h2>
          <ul className="space-y-4">
            {transactions?.length ? (
              transactions.map((txn, idx) => (
                <li
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-4 rounded-lg border ${
                    txn.type === "deposit"
                      ? "bg-green-900/30 border-green-400 text-green-400"
                      : "bg-red-900/30 border-red-400 text-red-400"
                  }`}
                >
                  <div>
                    <p className="font-medium text-base sm:text-lg">
                      {txn.type.toUpperCase()} - ₹{txn.amount.toFixed(2)}
                    </p>
                    <p className="text-xs mt-1 text-gray-300">
                      {new Date(txn.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs capitalize font-semibold px-3 py-1 rounded-full ${
                      txn.status === "completed"
                        ? "bg-green-600 text-white"
                        : txn.status === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {txn.status}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center">
                No transactions found.
              </p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
