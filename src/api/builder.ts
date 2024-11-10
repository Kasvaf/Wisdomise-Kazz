interface SignalPosition {
  type: 'long' | 'short';
  order_expires_at: string;
  suggested_action_expires_at: string;
}

// ----------------------------------------------------------------------------
export interface SignalItem {
  key: string;
  amount_ratio: number;
  price_exact?: number;
  price_ratio?: number;
  applied?: boolean;
  applied_at?: string | null;
}

// ----------------------------------------------------------------------------

export interface OpenOrderCondition {
  type: 'compare';
  op: '>=' | '<=';
  left: 'price';
  right: number;
}

export interface OpenOrderInput {
  key: string;
  amount?: number;
  price?: { value: number };
  order_type: 'limit' | 'market';
  condition:
    | OpenOrderCondition
    | {
        type: 'true';
      };
  applied?: boolean;
  applied_at?: string | null;
}

export interface OpenOrderResponse {
  key: string;
  amount?: number;
  price?: number;
  order_type: 'limit' | 'market';
  condition:
    | OpenOrderCondition
    | {
        type: 'true';
      };
  applied?: boolean;
  applied_at?: string | null;
}

export interface Signal {
  action: 'open' | 'close' | 'update';
  pair: string; // "BTC/USDT",
  leverage?: {
    value: number;
  };
  position: SignalPosition;
  stop_loss?: {
    items: SignalItem[];
  };
  take_profit?: {
    items: SignalItem[];
  };
  open_orders: {
    items: OpenOrderInput[];
  };
}
