import {
  CANCEL_ORDER,
  CREATE_ORDER,
  GET_DEPTH,
  TICKER,
  GET_OPEN_ORDERS,
  ON_RAMP,
  GET_BALANCE,
} from ".";

export type MessageToEngine =
  | {
      type: typeof CREATE_ORDER;
      data: {
        market: string;
        price?: string;
        quantity: string;
        side: "buy" | "sell";
        userId: string;
      };
    }
  | {
      type: typeof CANCEL_ORDER;
      data: {
        orderId: string;
        market: string;
      };
    }
  | {
      type: typeof ON_RAMP;
      data: {
        amount: string;
        userId: string;
        kind: "deposit" | "withdraw";
      };
    }
  | {
      type: typeof GET_DEPTH;
      data: {
        market: string;
      };
    }
  | {
      type: typeof GET_DEPTH;
      data: {
        market: string;
      };
    }
  | {
      type: typeof TICKER;
      data: {
        market: string;
      };
    }
  | {
      type: typeof GET_OPEN_ORDERS;
      data: {
        userId: string;
        market: string;
      };
    }
  | {
      type: typeof GET_BALANCE;
      data: {
        userId: string;
      };
    };
