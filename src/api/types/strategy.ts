export interface BareStrategyInfo {
  key: string;
  name: string;
  profile?:
    | {
        title: string;
      }
    | undefined;
}

export interface PairData {
  name: string;
  display_name: string;
  base: { name: string };
  quote: { name: string };
}

export interface PairDataFull extends PairData {
  time_window_pnl: number;
  time_window_prices: number[];
}
