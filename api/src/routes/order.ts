import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER, CANCEL_ORDER, ON_RAMP, GET_OPEN_ORDERS } from "../types";
import { getPgClient } from "../utils/pgClient";

export const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
  const { market, price, quantity, side, userId } = req.body;
  //TODO: can u make the type of the response object right? Right now it is a union.
  const response = await RedisManager.getInstance().sendAndAwait({
    type: CREATE_ORDER,
    data: {
      market,
      price,
      quantity,
      side,
      userId,
    },
  });
  res.json(response.payload);
});

orderRouter.delete("/", async (req, res) => {
  const { orderId, market } = req.body;
  const response = await RedisManager.getInstance().sendAndAwait({
    type: CANCEL_ORDER,
    data: {
      orderId,
      market,
    },
  });
  res.json(response.payload);
});

orderRouter.get("/open", async (req, res) => {
  const response = await RedisManager.getInstance().sendAndAwait({
    type: GET_OPEN_ORDERS,
    data: {
      userId: req.query.userId as string,
      market: req.query.market as string,
    },
  });
  res.json(response.payload);
});

orderRouter.get("/", async (req, res) => {
  const { userId } = req.query;

  const pgClient = await getPgClient();

  const query = `SELECT * FROM orders WHERE user_id = $1 order by created_at DESC LIMIT 250`;

  const result = await pgClient.query(query, [userId]);

  res.json(result);
});
