import { Client } from "pg";

let pgClient: Client | null = null;
const MAX_RETRIES = 20;
const RETRY_DELAY_MS = 3000;

export async function getPgClient(): Promise<Client> {
  if (pgClient) {
    return pgClient;
  }

  pgClient = new Client({
    user: "postgres",
    host: "timescaledb",
    database: "timescaledb",
    password: "yourpassword",
    port: 5432,
  });

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await pgClient.connect();
      console.log("Successfully connected to TimescaleDB!");
      return pgClient;
    } catch (err: any) {
      console.error(
        `Attempt ${
          i + 1
        }/${MAX_RETRIES}: Failed to connect to TimescaleDB. Retrying in ${
          RETRY_DELAY_MS / 1000
        }s...`,
        err.message
      );

      if (pgClient) {
        await pgClient
          .end()
          .catch((e) =>
            console.error("Error ending client after failed connect:", e)
          );
      }

      pgClient = new Client({
        user: "postgres",
        host: "timescaledb",
        database: "timescaledb",
        password: "yourpassword",
        port: 5432,
      });

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  throw new Error(
    `Failed to connect to TimescaleDB after ${MAX_RETRIES} attempts.`
  );
}
