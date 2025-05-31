const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "timescaledb",
  password: "yourpassword",
  port: 5432,
});

async function initializeDB() {
  await client.connect();

  // Drop existing for clean slate
  await client.query(`
    DROP TABLE IF EXISTS 
      orders, fills, balances, deposits, withdrawals, users CASCADE;
  `);

  // Users table
  await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Fills table (executed trades)
  await client.query(`
    CREATE TABLE fills (
      id SERIAL ,
      time TIMESTAMPTZ NOT NULL,
      market TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      quantity DOUBLE PRECISION NOT NULL,
      side TEXT CHECK (side IN ('buy', 'sell')) NOT NULL,
      taker_user_id TEXT,
      maker_user_id TEXT,
      PRIMARY KEY (id, time) 
    );
  `);

  await client.query(`SELECT create_hypertable('fills', 'time');`);

  // Orders table (open/closed orders)
  await client.query(`
    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      market TEXT NOT NULL,
      side TEXT CHECK (side IN ('buy', 'sell')) NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      quantity DOUBLE PRECISION NOT NULL,
      filled_quantity DOUBLE PRECISION DEFAULT 0,
      status TEXT CHECK (status IN ('open', 'partial', 'filled', 'cancelled')) DEFAULT 'open',
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  // Balances (available + locked)
  await client.query(`
    CREATE TABLE balances (
      user_id TEXT NOT NULL,
      available DOUBLE PRECISION DEFAULT 0,
      locked DOUBLE PRECISION DEFAULT 0,
      PRIMARY KEY (user_id)
    );
  `);

  // Deposits
  await client.query(`
    CREATE TABLE deposits (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount DOUBLE PRECISION NOT NULL,
      status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  // Withdrawals
  await client.query(`
    CREATE TABLE withdrawals (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount DOUBLE PRECISION NOT NULL,
      status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  // Candlestick materialized views
  const intervals = ["1 minute", "1 hour", "1 day"];
  for (const interval of intervals) {
    const viewName = `klines_${interval.replace(" ", "")}`;
    await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS ${viewName} AS
      SELECT
        time_bucket('${interval}', time) AS bucket,
        market,
        first(price, time) AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, time) AS close,
        sum(quantity) AS volume
      FROM fills
      GROUP BY bucket, market;
    `);
  }

  await client.end();
  console.log("✅ Exchange DB schema initialized.");
}

initializeDB().catch(console.error);
