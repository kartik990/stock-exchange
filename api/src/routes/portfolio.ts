import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_BALANCE, ON_RAMP } from "../types";
import { getPgClient } from "../utils/pgClient";

export const portfolioRouter = Router();

const pgClient = getPgClient();

portfolioRouter.get("/", async (req, res) => {
  const response = await RedisManager.getInstance().sendAndAwait({
    type: GET_BALANCE,
    data: {
      userId: req.query.userId as string,
    },
  });

  res.json(response.payload);
});

portfolioRouter.post("/", async (req, res) => {
  const { kind, amount, userId } = req.body as {
    kind: "deposit" | "withdraw";
    amount: string;
    userId: string;
  };

  const response = await RedisManager.getInstance().sendAndAwait({
    type: ON_RAMP,
    data: {
      userId,
      amount,
      kind,
    },
  });

  console.log(response.payload);

  res.json(response.payload);
});

portfolioRouter.get("/transactions", async (req, res) => {
  const { userId } = req.query;
  const query = `SELECT 
  id,
  'deposit' AS type,
  amount,
  status,
  created_at
  FROM deposits
  WHERE user_id = $1

  UNION ALL

  SELECT 
    id,
    'withdrawal' AS type,
    amount,
    status,
    created_at
  FROM withdrawals
  WHERE user_id = $1

  ORDER BY created_at DESC;`;

  try {
    const trans = await pgClient.query(query, [userId]);
    res.json(trans);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
