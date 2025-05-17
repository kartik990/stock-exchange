import { Client } from "pg";
import { createClient } from "redis";
import { DbMessage } from "./types";

const pgClient = new Client({
  user: "postgres",
  host: "localhost",
  database: "timescaledb",
  password: "yourpassword",
  port: 5432,
});

// async function main() {
//   await pgClient.connect();
//   console.log("adding data");

//   const price = "50";
//   const timestamp = new Date();
//   const volume = 60;
//   const currency_code = "INR";
//   const query =
//     "INSERT INTO fills (time, price,volume,currency_code) VALUES ($1, $2, $3, $4)";
//   // TODO: How to add volume?
//   const values = [timestamp, price, volume, currency_code];
//   await pgClient.query(query, values);
// }

async function main() {
  await pgClient.connect();

  const from = new Date("2024-05-08T00:00:00Z");
  const to = new Date("2024-05-10T00:00:00Z");

  const query = `
    SELECT
      time_bucket('1 minute', time) AS bucket,
      first(price, time) AS open,
      max(price) AS high,
      min(price) AS low,
      last(price, time) AS close,
      sum(volume) AS volume
    FROM fills
    WHERE currency_code = $1 AND time BETWEEN $2 AND $3
    GROUP BY bucket
    ORDER BY bucket;
  `;

  const values = ["INR", from.toISOString(), to.toISOString()];

  try {
    const result = await pgClient.query(query, values);
    console.log("Candlestick Data:", result.rows);
  } catch (err) {
    console.error("Query Error:", err);
  } finally {
    await pgClient.end();
  }
}

main();
