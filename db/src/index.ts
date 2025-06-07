import { Client } from "pg";
import { createClient } from "redis";
import { DbMessage } from "./types";

const pgClient = new Client({
  user: "postgres",
  host: "timescaledb",
  database: "timescaledb",
  password: "yourpassword",
  port: 5432,
});

pgClient.connect();

async function main() {
  const redisUrl = process.env.REDIS_URL || "localhost:6379";
  const redisClient = createClient({
    url: redisUrl,
  });

  await redisClient.connect();
  console.log("✅ Connected to Redis");

  while (true) {
    const response = await redisClient.rPop("db_processor");
    if (response) {
      const data: DbMessage = JSON.parse(response);

      if (data.type === "TRADE_ADDED") {
        const { market, price, quantity, side, taker_user_id, maker_user_id } =
          data.data;

        const query = `
          INSERT INTO fills (time, market, price, quantity, side, taker_user_id, maker_user_id)
          VALUES (NOW(), $1, $2, $3, $4, $5, $6)
        `;
        const values = [
          market,
          price,
          quantity,
          side,
          taker_user_id,
          maker_user_id,
        ];

        try {
          await pgClient.query(query, values);
        } catch (e) {
          console.log("error in adding fills");
          console.log(e);
        }
      } else if (data.type === "ORDER_ADDED") {
        const {
          orderId,
          market,
          user_id,
          price,
          quantity,
          filled_quantity,
          side,
          status,
        } = data.data;

        const query = `
          INSERT INTO orders (
            id, user_id, market, price, quantity, filled_quantity, side, status, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `;
        const values = [
          orderId,
          user_id,
          market,
          price,
          quantity,
          filled_quantity,
          side,
          status,
        ];
        try {
          await pgClient.query(query, values);
        } catch (e) {
          console.log("error in adding order");
          console.log(e);
        }
      } else if (data.type == "ORDER_UPDATE") {
        const { executedQty, orderId, market } = data.data;

        const query = `
                      UPDATE orders
                      SET 
                        filled_quantity = filled_quantity + $1,
                        status = CASE
                          WHEN filled_quantity + $1 >= quantity THEN 'filled'
                          WHEN filled_quantity + $1 > 0 THEN 'partial'
                          ELSE status
                        END
                      WHERE id = $2
                        AND ($3::text IS NULL OR market = $3)
                      RETURNING *;
                      `;

        try {
          await pgClient.query(query, [executedQty, orderId, market]);
        } catch (e) {
          console.log("error in adding order");
          console.log(e);
        }
      } else if (data.type == "ORDER_CANCELLED") {
        const { filled_quantity, orderId } = data.data;

        const query = `
                      UPDATE orders
                      SET 
                        filled_quantity =  $1,
                        status = 'cancelled'
                      WHERE id = $2
                      `;

        try {
          await pgClient.query(query, [filled_quantity, orderId]);
        } catch (e) {
          console.log("error in adding order");
          console.log(e);
        }
      } else if (data.type == "SYNC_BALANCES") {
        const values = Object.entries(data.data).map(
          ([userId, { available, locked }]) => {
            return [userId, available.toFixed(2), locked.toFixed(2)];
          }
        );

        const placeholders = values
          .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
          .join(",");

        const flatValues = values.flat();

        try {
          await pgClient.query(
            `
                 INSERT INTO balances (user_id, available, locked)
                 VALUES ${placeholders}
                 ON CONFLICT (user_id) DO UPDATE
                 SET available = EXCLUDED.available,
                     locked = EXCLUDED.locked;
                 `,
            flatValues
          );
        } catch (e) {
          console.log("error in adding order");
          console.log(e);
        }
      } else if (data.type === "TRANSACTION_ADDED") {
        const { amount, kind, userId } = data.data;

        try {
          if (kind === "deposit") {
            await pgClient.query(
              `
              INSERT INTO deposits (user_id, amount, status, created_at)
              VALUES ($1, $2, 'completed', NOW())
              `,
              [userId, +amount]
            );
          } else if (kind === "withdraw") {
            await pgClient.query(
              `
              INSERT INTO withdrawals (user_id, amount, status, created_at)
              VALUES ($1, $2, 'completed', NOW())
              `,
              [userId, +amount]
            );
          }
        } catch (err) {
          console.error("Error inserting transaction:", err);
        }
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

main().catch((err) => {
  console.error("❌ Error in main:", err);
  process.exit(1);
});
