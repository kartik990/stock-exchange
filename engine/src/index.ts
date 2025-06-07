import { createClient } from "redis";
import { Engine } from "./trade/Engine";

async function main() {
  const engine = new Engine();
  const redisUrl = process.env.REDIS_URL || "localhost:6379";
  const redisClient = createClient({
    url: redisUrl,
  });

  await redisClient.connect();
  console.log("connected to redis");
  console.log("started to listen for messages...");

  while (true) {
    const response = await redisClient.rPop("messages" as string);
    if (!response) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      engine.process(JSON.parse(response));
    }
  }
}

main();
