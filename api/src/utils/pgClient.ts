import { Client } from "pg";

let pgClient: Client | null = null;

export function getPgClient(): Client {
  if (!pgClient) {
    pgClient = new Client({
      user: "postgres",
      host: "localhost",
      database: "timescaledb",
      password: "yourpassword",
      port: 5432,
    });

    pgClient.connect().catch((err) => {
      console.error("Failed to connect to PostgreSQL:", err);
    });
  }

  return pgClient;
}
