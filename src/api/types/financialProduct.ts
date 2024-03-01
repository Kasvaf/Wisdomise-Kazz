export type MarketTypes = 'SPOT' | 'FUTURES';

export interface FinancialProductsResponse {
  count: number;
  next: any;
  previous: any;
  results: FinancialProduct[];
}

export interface InvestmentProtocol {
  key: string;
  name: string;
  logo_address: string;
  category: string;
  tvl_usd: number;
  max_apy: number;
  symbol: {
    symbol: string;
    name: string;
  };
  description: string;
  risk: 'High' | 'Medium' | 'Low';
}

export interface FinancialProduct {
  key: string;
  is_active: boolean;
  title: string;
  description: string;
  profile: Profile;
  asset_class: string;
  config: Config;
  market_names: MarketTypes[];
  subscribable: boolean;
  min_deposit: number;
  max_deposit: number;
  total_subscribers: number;
}

interface Profile {
  name: string;
  max_drawdown: string;
  expected_yield: string;
  return_risk_ratio: 'High' | 'Medium' | 'Low';
}

export interface Config {
  'no_withdraw'?: boolean;
  'assets': string;
  'market_type': string;
  'pnl_ai(%)': number;
  'sharpe_ai': number;
  'len_assets': number;
  'init_wealth': number;
  'pnl_hold(%)': number;
  'sharpe_hold': number;
  'CAGR_daily(%)': number;
  'time_delta_day': number;
  'CAGR_monthly(%)': number;
  'final_wealth_ai': number;
  'max_drawdown_ai': number;
  'CAGR_annually(%)': number;
  'final_wealth_hold': number;
  'max_drawdown_hold': number;
  'expected_return_realistic': number;
  'expected_return_calculated': number;
  'expected_return_conservative': number;
  'external_account_market_type'?: MarketTypes;
  'can_use_external_account'?: boolean;
  'subscription_level'?: number;
  'weight'?: number;
}
