import { RedisClientType, createClient } from "redis";
import {
  ORDER_ADDED,
  ORDER_CANCELLED,
  ORDER_UPDATE,
  SYNC_BALANCES,
  TRADE_ADDED,
  TRANSACTION_ADDED,
} from "./types";
import { WsMessage } from "./types/toWs";
import { MessageToApi } from "./types/toApi";

type DbMessage =
  | {
      type: typeof TRADE_ADDED;
      data: {
        id: string;
        isBuyerMaker: boolean;
        price: string;
        quantity: string;
        side: "buy" | "sell";
        quoteQuantity: string;
        timestamp: number;
        market: string;
        taker_user_id: string;
        maker_user_id: string;
      };
    }
  | {
      type: typeof ORDER_ADDED;
      data: {
        orderId: string;
        user_id: string;
        filled_quantity: number;
        market?: string;
        price?: string;
        quantity?: string;
        status?: string;
        side?: "buy" | "sell";
      };
    }
  | {
      type: typeof ORDER_UPDATE;
      data: {
        orderId: string;
        market?: string;
        executedQty: number;
      };
    }
  | {
      type: typeof ORDER_CANCELLED;
      data: {
        orderId: string;
        market?: string;
        filled_quantity: number;
        quantity?: string;
      };
    }
  | {
      type: typeof TRANSACTION_ADDED;
      data: {
        kind: "deposit" | "withdraw";
        amount: string;
        userId: string;
      };
    }
  | {
      type: typeof SYNC_BALANCES;
      data: {
        [key: string]: {
          available: number;
          locked: number;
        };
      };
    };

export class RedisManager {
  private client: RedisClientType;
  private static instance: RedisManager;

  constructor() {
    this.client = createClient();
    this.client.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public pushMessage(message: DbMessage) {
    this.client.lPush("db_processor", JSON.stringify(message));
  }

  public publishMessage(channel: string, message: WsMessage) {
    this.client.publish(channel, JSON.stringify(message));
  }

  public sendToApi(clientId: string, message: MessageToApi) {
    this.client.publish(clientId, JSON.stringify(message));
  }
}
