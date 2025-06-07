import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "timescaledb",
  database: "timescaledb",
  password: "yourpassword",
  port: 5432,
});
client.connect();

async function refreshViews() {
  await client.query("REFRESH MATERIALIZED VIEW klines_1minute");
  await client.query("REFRESH MATERIALIZED VIEW klines_1hour");
  await client.query("REFRESH MATERIALIZED VIEW klines_1day");

  console.log("Materialized views refreshed successfully");
}

refreshViews().catch(console.error);

setInterval(() => {
  refreshViews();
}, 1000 * 20);
