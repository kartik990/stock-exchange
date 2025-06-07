import { Router } from "express";
import { getPgClient } from "../utils/pgClient";

export const klineRouter = Router();

klineRouter.get("/", async (req, res) => {
  const { market, interval, startTime, endTime } = req.query;

  const pgClient = await getPgClient();

  const query = `SELECT
      time_bucket('1 minute', time) AS bucket,
      first(price, time) AS open,
      max(price) AS high,
      min(price) AS low,
      last(price, time) AS close,
      sum(quantity) AS volume
    FROM fills

    GROUP BY bucket
    ORDER BY bucket;`;

  const query2 = `SELECT 
       MAX(price) AS high_price,
       MIN(price) AS low_price,
       SUM(quantity) AS total_volume
       FROM fills
       WHERE time >= NOW() - INTERVAL '1 hour'`;

  try {
    const klinesData = await pgClient.query(query);
    const marketInfo = await pgClient.query(query2);

    res.json({ klinesData, marketInfo });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
