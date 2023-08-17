// old
export interface SimulateTradeData {
  coin: PointData[];
  aat: WealthData[];
}
export interface PointData {
  date: string;
  point: number;
}

export interface WealthData {
  date: string;
  wealth: number;
}

// old
export interface SimulateTradeQueryVariables {
  coin: string;
  start_date: string;
  end_date: string;
  pnl?: string;
  cash?: number;
  is_daily_basis: boolean;
}
