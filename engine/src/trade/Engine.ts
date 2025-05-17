import fs from "fs";
import { RedisManager } from "../RedisManager";
import {
  ORDER_ADDED,
  ORDER_CANCELLED,
  ORDER_UPDATE,
  SYNC_BALANCES,
  TRADE_ADDED,
  TRANSACTION_ADDED,
} from "../types/index";
import {
  CANCEL_ORDER,
  CREATE_ORDER,
  GET_BALANCE,
  GET_DEPTH,
  GET_OPEN_ORDERS,
  MessageFromApi,
  ON_RAMP,
  TICKER,
} from "../types/fromApi";
import { Fill, Order, Orderbook } from "./Orderbook";
import { TickerUpdateMessage } from "../types/toWs";
import { v4 as uuid } from "uuid";

export const BASE_CURRENCY = "INR";

interface UserBalance {
  [key: string]: {
    available: number;
    locked: number;
  };
}

export class Engine {
  private orderbooks: Orderbook[] = [];
  private balances: Map<string, UserBalance> = new Map();

  constructor() {
    let snapshot = null;
    try {
      // snapshot = fs.readFileSync("./snapshot.json");
      snapshot = fs.readFileSync("./initalState.json");
    } catch (e) {
      console.log("No snapshot found");
    }

    if (snapshot) {
      const snapshotSnapshot = JSON.parse(snapshot.toString());
      this.orderbooks = snapshotSnapshot.orderbooks.map(
        (o: any) =>
          new Orderbook(
            o.baseAsset,
            o.bids,
            o.asks,
            o.lastTradeId,
            o.currentPrice
          )
      );
      this.balances = new Map(snapshotSnapshot.balances);
    } else {
      this.orderbooks = [new Orderbook(`TATA`, [], [], 0, 0)];
      this.setBaseBalances();
    }

    setInterval(() => {
      this.saveSnapshot();
    }, 1000 * 20);
  }

  saveSnapshot() {
    const snapshotSnapshot = {
      orderbooks: this.orderbooks.map((o) => o.getSnapshot()),
      balances: Array.from(this.balances.entries()),
    };

    fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotSnapshot));

    const userBalances: Record<string, { available: number; locked: number }> =
      {};

    this.balances.forEach((balanceByToken, userId) => {
      userBalances[userId] = balanceByToken["INR"];
    });

    RedisManager.getInstance().pushMessage({
      type: SYNC_BALANCES,
      data: userBalances,
    });
  }

  process({
    message,
    clientId,
  }: {
    message: MessageFromApi;
    clientId: string;
  }) {
    switch (message.type) {
      case CREATE_ORDER:
        try {
          // market order
          if (!message.data.price) {
            const currentPrice =
              this.orderbooks.find((o) => o.ticker() == message.data.market)
                ?.currentPrice || 0;

            message.data.price = (
              currentPrice + (message.data.side == "buy" ? 10 : -10)
            ).toString();
          }

          const { executedQty, fills, orderId } = this.createOrder(
            message.data.market,
            message.data.price,
            message.data.quantity,
            message.data.side,
            message.data.userId
          );

          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_PLACED",
            payload: {
              orderId,
              executedQty,
              fills,
            },
          });
        } catch (e) {
          console.log(e);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId: "",
              executedQty: 0,
              remainingQty: 0,
            },
          });
        }
        break;
      case CANCEL_ORDER:
        try {
          const orderId = message.data.orderId;
          const cancelMarket = message.data.market;
          const cancelOrderbook = this.orderbooks.find(
            (o) => o.ticker() === cancelMarket
          );
          const quoteAsset = cancelMarket.split("_")[1];
          if (!cancelOrderbook) {
            throw new Error("No orderbook found");
          }

          const order =
            cancelOrderbook.asks.find((o) => o.orderId === orderId) ||
            cancelOrderbook.bids.find((o) => o.orderId === orderId);
          if (!order) {
            console.log("No order found");
            throw new Error("No order found");
          }

          if (order.side === "buy") {
            const price = cancelOrderbook.cancelBid(order);
            const leftMoney = (order.quantity - order.filled) * order.price;

            const balance = this.balances.get(order.userId);

            if (balance) {
              balance[BASE_CURRENCY].available += leftMoney;
              balance[BASE_CURRENCY].locked -= leftMoney;
            }

            if (price) {
              this.sendUpdatedDepthAt(price.toString(), cancelMarket);
            }
          } else {
            const price = cancelOrderbook.cancelAsk(order);
            const leftQty = order.quantity - order.filled;

            const balance = this.balances.get(order.userId);

            if (balance) {
              balance[quoteAsset].available += leftQty;
              balance[quoteAsset].locked -= leftQty;
            }

            if (price) {
              this.sendUpdatedDepthAt(price.toString(), cancelMarket);
            }
          }

          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId,
              executedQty: order.filled,
              remainingQty: order.quantity - order.filled,
            },
          });

          RedisManager.getInstance().pushMessage({
            type: ORDER_CANCELLED,
            data: {
              orderId,
              filled_quantity: order.filled,
            },
          });
        } catch (e) {
          console.log("Error while cancelling order");
          console.log(e);
        }
        break;
      case GET_OPEN_ORDERS:
        try {
          const openOrderbook = this.orderbooks.find(
            (o) => o.ticker() === message.data.market
          );
          if (!openOrderbook) {
            throw new Error("No orderbook found");
          }
          const openOrders = openOrderbook.getOpenOrders(message.data.userId);

          RedisManager.getInstance().sendToApi(clientId, {
            type: "OPEN_ORDERS",
            payload: openOrders,
          });
        } catch (e) {
          console.log(e);
        }
        break;
      case ON_RAMP:
        const userId = message.data.userId;
        const kind = message.data.kind;
        const amount = Number(message.data.amount);

        const { success, message: msg } = this.onRamp(userId, amount, kind);

        console.log("vvl", success, msg, message);

        if (!success) {
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ON_RAMP",
            payload: {
              success: false,
              message: msg,
            },
          });

          return;
        }

        RedisManager.getInstance().pushMessage({
          type: TRANSACTION_ADDED,
          data: {
            amount: amount.toString(),
            kind,
            userId,
          },
        });

        RedisManager.getInstance().sendToApi(clientId, {
          type: "ON_RAMP",
          payload: {
            success: true,
          },
        });

        break;
      case GET_DEPTH:
        try {
          const market = message.data.market;
          const orderbook = this.orderbooks.find((o) => o.ticker() === market);

          if (!orderbook) {
            throw new Error("No orderbook found");
          }

          RedisManager.getInstance().sendToApi(clientId, {
            type: "DEPTH",
            payload: orderbook.getDepth(),
          });
        } catch (e) {
          console.log(e);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "DEPTH",
            payload: {
              bids: [],
              asks: [],
            },
          });
        }
        break;
      case TICKER:
        try {
          const market = message.data.market;
          const orderbook = this.orderbooks.find((o) => o.ticker() === market);
          const currentPrice = orderbook?.currentPrice?.toString();
          const lastTradeKind = orderbook?.lastTradeKind || "buy";

          RedisManager.getInstance().sendToApi(clientId, {
            type: "TICKER",
            payload: {
              firstPrice: "50",
              market: market,
              high: "50",
              lastPrice: currentPrice || "1000",
              lastTradeKind,
              low: "50",
              priceChange: "50",
              priceChangePercent: "50",
              quoteVolume: "50",
              symbol: "50",
              trades: "50",
              volume: "50",
            },
          });
        } catch (e) {
          console.log(e);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "TICKER",
            payload: {
              firstPrice: "-",
              market: "-",
              high: "-",
              lastTradeKind: "buy",
              lastPrice: "-",
              low: "-",
              priceChange: "-",
              priceChangePercent: "-",
              quoteVolume: "-",
              symbol: "-",
              trades: "-",
              volume: "-",
            },
          });
        }
        break;
      case GET_BALANCE:
        try {
          const userId = message.data.userId;
          const balances = this.balances.get(userId);

          RedisManager.getInstance().sendToApi(clientId, {
            type: "BALANCE",
            payload: balances || {
              INR: {
                available: 0,
                locked: 0,
              },
            },
          });
        } catch (e) {
          console.log(e);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "BALANCE",
            payload: {
              INR: {
                available: 0,
                locked: 0,
              },
            },
          });
        }
        break;
    }
  }

  addOrderbook(orderbook: Orderbook) {
    this.orderbooks.push(orderbook);
  }

  createOrder(
    market: string,
    price: string,
    quantity: string,
    side: "buy" | "sell",
    userId: string
  ) {
    const orderbook = this.orderbooks.find((o) => o.ticker() === market);
    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];

    if (!orderbook) {
      throw new Error("No orderbook found");
    }

    this.checkAndLockFunds(
      baseAsset,
      quoteAsset,
      side,
      userId,
      quoteAsset,
      price,
      quantity
    );

    const order: Order = {
      orderId: uuid(),
      price: Number(price),
      quantity: Number(quantity),
      filled: 0,
      side,
      userId,
    };

    const { fills, executedQty } = orderbook.addOrder(order);
    this.updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQty);

    this.createDbTrades({ fills, market, userId, side, executedQty, order });

    const book = this.orderbooks?.find((o) => o.ticker() == market);

    const lastPrice = book?.currentPrice;
    const lastTradeKind = book?.lastTradeKind || "buy";

    this.publishWsTickerUpdate(
      market,
      lastTradeKind,
      lastPrice ? "" + lastPrice : "1000"
    );
    this.publisWsDepthUpdates(market);
    this.publishWsTrades(fills, userId, market, side);
    return { executedQty, fills, orderId: order.orderId };
  }

  createDbTrades({
    executedQty,
    fills,
    market,
    side,
    order,
    userId,
  }: {
    fills: Fill[];
    market: string;
    userId: string;
    side: "buy" | "sell";
    order: Order;
    executedQty: number;
  }) {
    let finalTranPrice = 0;

    fills.forEach((fill) => {
      RedisManager.getInstance().pushMessage({
        type: TRADE_ADDED,
        data: {
          id: fill.tradeId.toString(),
          market: market,
          maker_user_id: fill.otherUserId,
          taker_user_id: userId,
          isBuyerMaker: fill.otherUserId === userId,
          side,
          price: fill.price,
          quantity: fill.qty
            .toString()
            .slice(0, fill.qty.toString().indexOf(".") + 3),
          quoteQuantity: (fill.qty * Number(fill.price)).toString(),
          timestamp: Date.now(),
        },
      });

      RedisManager.getInstance().pushMessage({
        type: ORDER_UPDATE,
        data: {
          orderId: fill.markerOrderId,
          market,
          executedQty: fill.qty,
        },
      });

      finalTranPrice += +fill.price * fill.qty;
    });

    RedisManager.getInstance().pushMessage({
      type: ORDER_ADDED,
      data: {
        orderId: order.orderId,
        market,
        side,
        status:
          executedQty == 0
            ? "open"
            : executedQty == order.quantity
            ? "filled"
            : "partial",
        user_id: userId,
        filled_quantity: executedQty,
        price: finalTranPrice.toString(),
        quantity: order.quantity.toString(),
      },
    });
  }

  publishWsTrades(
    fills: Fill[],
    userId: string,
    market: string,
    side: "buy" | "sell"
  ) {
    fills.forEach((fill) => {
      RedisManager.getInstance().publishMessage(`trade@${market}`, {
        stream: `trade@${market}`,
        data: {
          e: "trade",
          tradeId: fill.tradeId,
          maker: fill.otherUserId === userId, // TODO: Is this right?
          price: +fill.price,
          side,
          currency_code: market.split("_")[1],
          qty: Math.abs(
            +fill.qty.toString().slice(0, fill.qty.toString().indexOf(".") + 3)
          ),
          time: new Date().getTime(),
          market,
        },
      });
    });
  }

  sendUpdatedDepthAt(price: string, market: string) {
    const orderbook = this.orderbooks.find((o) => o.ticker() === market);
    if (!orderbook) {
      return;
    }
    const depth = orderbook.getDepth();
    const updatedBids = depth?.bids.filter((x) => x[0] === price);
    const updatedAsks = depth?.asks.filter((x) => x[0] === price);

    RedisManager.getInstance().publishMessage(`depth@${market}`, {
      stream: `depth@${market}`,
      data: {
        a: updatedAsks.length ? updatedAsks : [[price, "0"]],
        b: updatedBids.length ? updatedBids : [[price, "0"]],
        e: "depth",
      },
    });
  }

  publisWsDepthUpdates(market: string) {
    const orderbook = this.orderbooks.find((o) => o.ticker() === market);
    if (!orderbook) {
      return;
    }
    const depth = orderbook.getDepth();

    RedisManager.getInstance().publishMessage(`depth@${market}`, {
      stream: `depth@${market}`,
      data: {
        a: depth.asks,
        b: depth.bids,
        e: "depth",
      },
    });
  }

  publishWsTickerUpdate(
    market: string,
    lastTradeKind: "buy" | "sell",
    price: string
  ) {
    const stream = `ticker@${market}`;
    const message: TickerUpdateMessage = {
      stream,
      data: {
        firstPrice: "50",
        high: "50",
        lastPrice: price,
        lastTradeKind: lastTradeKind,
        low: "50",
        priceChange: "50",
        priceChangePercent: "50",
        quoteVolume: "50",
        symbol: "50",
        trades: "50",
        volume: "50",
        e: "ticker",
      },
    };

    RedisManager.getInstance().publishMessage(stream, message);
  }

  updateBalance(
    userId: string,
    baseAsset: string,
    quoteAsset: string,
    side: "buy" | "sell",
    fills: Fill[],
    executedQty: number
  ) {
    if (side === "buy") {
      fills.forEach((fill) => {
        const otherUserBalance = this.balances.get(fill.otherUserId);

        const userBalance = this.balances.get(userId);

        if (otherUserBalance) {
          // Update quote asset [ INR ] balance
          otherUserBalance[quoteAsset].available =
            otherUserBalance[quoteAsset].available + +fill.price * fill.qty;

          // Update base asset [ TATA ] balance
          otherUserBalance[baseAsset].locked =
            otherUserBalance[baseAsset].locked - fill.qty;
        }

        if (userBalance) {
          userBalance[quoteAsset].locked =
            userBalance[quoteAsset].locked - fill.qty * +fill.price;

          userBalance[baseAsset].available =
            userBalance[baseAsset].available + fill.qty;
        }
      });
    } else {
      fills.forEach((fill) => {
        const otherUserBalance = this.balances.get(fill.otherUserId);

        const userBalance = this.balances.get(userId);

        if (otherUserBalance) {
          // Update quote asset [ INR ] balance
          otherUserBalance[quoteAsset].locked =
            otherUserBalance[quoteAsset].locked - +fill.price * fill.qty;

          // Update base asset [ TATA ] balance
          otherUserBalance[baseAsset].available =
            otherUserBalance[baseAsset].available + fill.qty;
        }

        if (userBalance) {
          userBalance[quoteAsset].available =
            userBalance[quoteAsset].available + fill.qty * +fill.price;

          userBalance[baseAsset].locked =
            userBalance[baseAsset].locked - fill.qty;
        }
      });
    }
  }

  checkAndLockFunds(
    baseAsset: string,
    quoteAsset: string,
    side: "buy" | "sell",
    userId: string,
    asset: string,
    price: string,
    quantity: string
  ) {
    if (side === "buy") {
      const userBalance = this.balances.get(userId);

      if (!userBalance) {
        throw new Error(`No user found with this id: ${userId}`);
      }

      if (
        (userBalance[quoteAsset]?.available || 0) <
        Number(quantity) * Number(price)
      ) {
        throw new Error("Insufficient funds");
      }

      userBalance[quoteAsset].available =
        userBalance[quoteAsset].available - Number(quantity) * Number(price);

      userBalance[quoteAsset].locked =
        userBalance[quoteAsset].locked + Number(quantity) * Number(price);
    } else {
      const userBalance = this.balances.get(userId);

      if (!userBalance) {
        throw new Error(`No user found with this id: ${userId}`);
      }

      if ((userBalance[baseAsset]?.available || 0) < Number(quantity)) {
        throw new Error("Insufficient funds");
      }

      userBalance[baseAsset].available =
        userBalance[baseAsset].available - Number(quantity);

      userBalance[baseAsset].locked =
        userBalance[baseAsset].locked + Number(quantity);
    }
  }

  onRamp(userId: string, amount: number, kind: "deposit" | "withdraw") {
    const userBalance = this.balances.get(userId);
    if (!userBalance) {
      if (kind == "deposit") {
        this.balances.set(userId, {
          [BASE_CURRENCY]: {
            available: amount,
            locked: 0,
          },
        });

        return { success: true };
      } else {
        return { success: false, message: "No user found!" };
      }
    } else {
      if (kind == "deposit") {
        userBalance[BASE_CURRENCY].available += amount;
        return { success: true };
      } else {
        if (userBalance[BASE_CURRENCY].available >= amount) {
          userBalance[BASE_CURRENCY].available -= amount;
          return { success: true };
        } else {
          return { success: false, message: "Insufficient funds!" };
        }
      }
    }
  }

  setBaseBalances() {
    this.balances.set("1", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      TATA: {
        available: 10000000,
        locked: 0,
      },
    });

    this.balances.set("2", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      TATA: {
        available: 10000000,
        locked: 0,
      },
    });

    this.balances.set("5", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      TATA: {
        available: 10000000,
        locked: 0,
      },
    });
  }
}
