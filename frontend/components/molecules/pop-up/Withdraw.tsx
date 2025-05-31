import React, { useState } from "react";
import { FaMoneyBillAlt } from "react-icons/fa";

const WithdrawFund = ({
  handleWithdraw,
  setError,
  setOpen,
}: {
  handleWithdraw: (amount: number) => Promise<{
    success: boolean;
    message: string;
  }>;
  setOpen: React.Dispatch<React.SetStateAction<"add" | "withdraw" | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [amount, setAmount] = useState("");

  const handleWithdrawFund = async () => {
    const { success, message } = await handleWithdraw(+amount);
    if (!success && message) setError(message);

    setOpen(null);
  };

  return (
    <div className="w-[90vw] sm:w-[360px] mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Withdraw Funds</h2>

      <div className="relative">
        <div className="block text-sm font-medium text-gray-600 mb-1">
          Amount
        </div>
        <input
          type="number"
          min="0"
          className="w-full border text-gray-700 border-gray-300 rounded-md p-2"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="absolute right-8 top-8">
          <label className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-1">
            <FaMoneyBillAlt size={20} /> INR
          </label>
        </div>
      </div>

      <button
        onClick={handleWithdrawFund}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
      >
        Withdraw
      </button>
    </div>
  );
};

export default WithdrawFund;
