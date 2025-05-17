import { Router } from "express";
import { getPgClient } from "../utils/pgClient";

export const tradesRouter = Router();

const pgClient = getPgClient();

tradesRouter.get("/", async (req, res) => {
  const { market } = req.query;

  const query = `SELECT * FROM fills
                 ORDER BY time DESC
                 LIMIT 50`;

  try {
    const result = await pgClient.query(query);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
