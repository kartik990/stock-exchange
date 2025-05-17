export type DbMessage =
  | {
      type: "TRADE_ADDED";
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
      type: "ORDER_ADDED";
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
      type: "ORDER_UPDATE";
      data: {
        orderId: string;
        market?: string;
        executedQty: number;
      };
    }
  | {
      type: "ORDER_CANCELLED";
      data: {
        orderId: string;
        filled_quantity: number;
      };
    }
  | {
      type: "TRANSACTION_ADDED";
      data: {
        kind: "deposit" | "withdraw";
        amount: string;
        userId: string;
      };
    }
  | {
      type: "SYNC_BALANCES";
      data: {
        [key: string]: {
          available: number;
          locked: number;
        };
      };
    };
