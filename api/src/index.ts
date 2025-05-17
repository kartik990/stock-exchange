import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/order";
import { depthRouter } from "./routes/depth";
import { tradesRouter } from "./routes/trades";
import { klineRouter } from "./routes/kline";
import { tickerRouter } from "./routes/ticker";
import { portfolioRouter } from "./routes/portfolio";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/order", orderRouter);
app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/trades", tradesRouter);
app.use("/api/v1/portfolio", portfolioRouter);
app.use("/api/v1/klines", klineRouter);
app.use("/api/v1/ticker", tickerRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
