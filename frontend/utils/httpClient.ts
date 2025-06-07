import axios from "axios";
import { Depth, KLine, Order, Ticker, Trade } from "./types";
import { UserBalance, UserTransaction } from "@/hooks/useBalance";

const BASE_URL = "http://localhost:3001/api/v1";

export async function login(email: string, password: string): Promise<any> {
  const response = await axios.post(
    `${BASE_URL}/auth/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return response.data.rows;
}

export async function register({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<UserBalance> {
  const response = await axios.post(
    `${BASE_URL}/auth/register`,
    {
      username,
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return response.data.rows;
}

export async function getOrders(userId: string): Promise<Order[]> {
  const response = await axios.get(`${BASE_URL}/order?userId=${userId}`);
  return response.data.rows;
}

export async function getPortfolio(userId: string): Promise<UserBalance> {
  const response = await axios.get(`${BASE_URL}/portfolio/?userId=${userId}`);
  return response.data;
}

export async function getTransactions(
  userId: string
): Promise<UserTransaction[]> {
  const response = await axios.get(
    `${BASE_URL}/portfolio/transactions?userId=${userId}`
  );
  return response.data?.rows;
}

export async function getHoldings(userId: string): Promise<UserTransaction[]> {
  const response = await axios.get(
    `${BASE_URL}/portfolio/holdings?userId=${userId}`
  );

  return response.data?.rows;
}

export async function addTransaction({
  amount,
  kind,
  userId,
}: {
  userId: string;
  amount: string;
  kind: "deposit" | "withdraw";
}): Promise<{ success: boolean; message: string }> {
  const response = await axios.post(`${BASE_URL}/portfolio`, {
    amount,
    kind,
    userId,
  });
  return response.data;
}

export async function getTicker(market: string): Promise<Ticker> {
  const response = await axios.get(`${BASE_URL}/ticker?symbol=${market}`);
  return response.data;
}

export async function placeOrder({
  market,
  price,
  quantity,
  side,
  userId,
}: {
  market: string;
  price: string;
  quantity: string;
  side: "sell" | "buy";
  userId: string;
}): Promise<Ticker> {
  const response = await axios.post(`${BASE_URL}/order`, {
    market,
    price,
    quantity,
    side,
    userId,
  });

  return response.data;
}

export async function getDepth(market: string): Promise<Depth> {
  const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
  return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
  return response.data.rows;
}

export async function getChartData(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<{ marketInfo: any; klines: KLine[] }> {
  const response = await axios.get(
    `${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
  );

  const klines: KLine[] = response.data.klinesData.rows;
  const marketInfo = response.data.marketInfo;
  const sortedKline = klines
    .slice()
    .sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));

  return {
    klines: sortedKline,
    marketInfo: marketInfo.rows?.[0],
  };
}
