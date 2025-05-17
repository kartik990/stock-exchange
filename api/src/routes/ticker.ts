import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { TICKER } from "../types";

export const tickerRouter = Router();

tickerRouter.get("/", async (req, res) => {
  const { symbol } = req.query;
  const response = await RedisManager.getInstance().sendAndAwait({
    type: TICKER,
    data: {
      market: symbol as string,
    },
  });

  res.json(response.payload);
});
