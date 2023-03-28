import { DatePnl } from './common';

export interface PostSimulatePortfolioQueryVariables {
  risk_type: string;
  start_date: string;
  end_date: string;
  pnl?: string;
  benchmark: string;
}

interface SpoStats {
  CAGRMonthly: number;
  CAGRWeekly: number;
  numberOfReBalancing: number;
  pnl: number;
  risk: number;
  sharpeRatio: number;
}

export interface PostSimulatePortfolioData {
  po_pnls: DatePnl[];
  benchmark_pnls: DatePnl[];
  stats: {
    EWP: SpoStats;
    SPO: SpoStats;
  };
  SPOProfitPercentage: number;
  benchmarkProfitPercentage: number;
}
