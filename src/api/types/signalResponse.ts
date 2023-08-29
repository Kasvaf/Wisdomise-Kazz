export interface SignalsResponse {
  pairs: Pair[];
  strategies: Strategy[];
  last_positions: LastPosition[];
}

interface Pair {
  name: string;
  title: string;
  base_name: string;
  quote_name: string;
  time_window_pnl: number;
  time_window_prices: number[];
}

interface Strategy {
  name: string;
  title: string;
  resolution: string;
  position_sides: string[];
  premium: boolean;
}

export interface LastPosition {
  strategy_name: string;
  pair_name: string;
  take_profit?: number;
  stop_loss: number;

  entry_time: string;
  entry_price?: number;

  exit_time?: string;
  exit_price?: number;

  pnl: number;
  position_side: 'SHORT' | 'LONG';
  suggested_action:
    | 'OPEN'
    | 'CLOSE'
    | 'NO_ACTION'
    | 'OPEN_DELAYED'
    | 'CLOSE_DELAYED';
}
