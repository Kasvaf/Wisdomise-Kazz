import { DatePnl } from './common';

export interface PostCoinPnlQueryVariables {
  coin: string;
  pnl?: string;
  start_date: string;
  end_date: string;
}

export interface PostCoinPnlData {
  pnl: DatePnl[];
  profitPercentage: number;
}
