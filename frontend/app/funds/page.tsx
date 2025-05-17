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
          className="fixed bg-[#00000056] flex justify-center items-center top-0 left-0 w-screen h-screen"
        >
          <div onClick={(e) => e.stopPropagation()}>
            {open == "add" ? (
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
      <div className="min-h-screen bg-gray-900 text-white p-6 space-y-8">
        <h1 className="text-3xl font-bold">Your Funds</h1>

        {/* INR Balance */}
        <div className="bg-gray-800 flex justify-between rounded-xl p-4 shadow-lg border border-gray-700">
          <div className="flex flex-col">
            <p className="text-sm text-gray-400 mb-1">INR Balance</p>
            <p className="text-xl font-semibold">
              Available: {balance?.available}
            </p>
            <p className="text-md text-gray-300">Locked: {balance?.locked}</p>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => {
                setOpen("add");
              }}
              className="bg-green-600 flex items-center gap-2 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
            >
              <IoIosAdd size={25} /> Add Funds
            </button>
            <button
              onClick={() => {
                setOpen("withdraw");
              }}
              className="bg-red-600 flex items-center gap-2 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
            >
              <IoMdRefresh size={20} /> Withdraw Funds
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full flex justify-center gap-2 items-center bg-red-800/20 text-red-400 border border-red-600 rounded-md px-4 py-4 my-4">
            <AlertCircleIcon /> <p className="font-semibold">{error}</p>
            <X
              className="ml-auto cursor-pointer"
              onClick={() => {
                setError(null);
              }}
            />
          </div>
        )}

        {/* Transactions */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
            Deposit & Withdrawal History
          </h2>
          <ul className="space-y-3">
            {transactions?.length ? (
              transactions.map((txn, idx) => (
                <li
                  key={idx}
                  className={`flex justify-between items-center p-4 rounded-lg border ${
                    txn.type === "deposit"
                      ? "bg-green-900/30 border-green-400 text-green-400"
                      : "bg-red-900/30 border-red-400 text-red-400"
                  }`}
                >
                  <div>
                    <p className="font-medium text-base">
                      {txn.type.toUpperCase()} - ₹{txn.amount.toFixed(2)}
                    </p>
                    <p className="text-xs mt-1 text-gray-300">
                      {new Date(txn.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs capitalize font-semibold px-2 py-1 rounded-full ${
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
