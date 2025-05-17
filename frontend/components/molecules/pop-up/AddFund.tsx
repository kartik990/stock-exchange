import React, { useState } from "react";
import { FaMoneyBillAlt } from "react-icons/fa";

const AddFund = ({
  handleDeposit,
  setOpen,
  setError,
}: {
  handleDeposit: (amount: number) => Promise<{
    success: boolean;
    message: string;
  }>;
  setOpen: React.Dispatch<React.SetStateAction<"add" | "withdraw" | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [amount, setAmount] = useState("");

  const handleAddFund = async () => {
    const { success, message } = await handleDeposit(+amount);

    if (!success && message) setError(message);

    setOpen(null);
  };

  return (
    <div className="w-[360px] mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add Funds</h2>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Amount
        </label>
        <input
          type="number"
          min="0"
          className="w-full border text-gray-700 border-gray-300 rounded-md p-2"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="absolute right-8 top-8">
          <label className="flex items-center gap-2 text-lg font-semibold text-green-600 mb-1">
            <FaMoneyBillAlt size={20} /> INR
          </label>
        </div>
      </div>

      <button
        onClick={handleAddFund}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
      >
        Deposit
      </button>
    </div>
  );
};

export default AddFund;
