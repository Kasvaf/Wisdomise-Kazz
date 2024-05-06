export interface SignalsResponse {
  pairs: Pair[];
  strategies: Strategy[];
  last_positions: LastPosition[];
}

export interface Pair {
  name: string;
  title: string;
  base_name: string;
  quote_name: string;
  time_window_pnl: number;
  time_window_prices: number[];
}

export interface Strategy {
  name: string;
  title: string;
  resolution: string;
  position_sides: string[];
  premium: boolean;
  profile: {
    title: string;
    description: string;
    position_sides: string[];
    subscription_level: number;
  };
}

export interface LastPosition {
  strategy_name: string;
  pair_name: string;
  take_profit?: number | null;
  stop_loss?: number | null;
  entry_time: string;
  entry_price: number;
  exit_time?: string;
  pnl: number;
  subscription_level: number;
  position_side: 'LONG' | 'SHORT';
  suggested_action:
    | 'OPEN'
    | 'CLOSE'
    | 'NO_ACTION'
    | 'OPEN_DELAYED'
    | 'CLOSE_DELAYED';
}
