import {
  addTransaction,
  getPortfolio,
  getTransactions,
} from "@/utils/httpClient";
import { useEffect, useState } from "react";

type TransactionType = "deposit" | "withdrawal";

export interface UserTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface UserBalance {
  [key: string]: {
    available: number;
    locked: number;
  };
}

const useBalance = () => {
  const userId = "5";

  const [balance, setBalance] = useState<{
    available: string;
    locked: string;
  } | null>();
  const [transactions, setTransactions] = useState<UserTransaction[] | null>();

  const handleDeposit = async (
    amount: number
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const { success, message } = await addTransaction({
      amount: amount.toString(),
      kind: "deposit",
      userId,
    });

    return { success, message };
  };

  const handleWithdraw = async (
    amount: number
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const { success, message } = await addTransaction({
      amount: amount.toString(),
      kind: "withdraw",
      userId,
    });

    return { success, message };
  };

  useEffect(() => {
    const fetch = async () => {
      getPortfolio(userId).then((res) => {
        setBalance({
          available: res["INR"].available.toFixed(2),
          locked: res["INR"].locked.toFixed(2),
        });
      });

      getTransactions(userId).then((rows) => {
        setTransactions(rows);
      });
    };

    fetch();

    const interval = setInterval(() => {
      fetch();
    }, 1000 * 10);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  return { balance, transactions, handleDeposit, handleWithdraw };
};

export default useBalance;
