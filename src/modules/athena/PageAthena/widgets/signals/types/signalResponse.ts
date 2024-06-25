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
