export interface FinancialProductsReponse {
  count: number;
  next: any;
  previous: any;
  results: FinancialProduct[];
}

export interface FinancialProduct {
  key: string;
  is_active: boolean;
  title: string;
  description: string;
  profile: Profile;
  asset_class: string;
  config: Config;
  subscribable: boolean;
  min_deposit: number;
  max_deposit: number;
  total_subscribers: number;
  sp_bindings: SpBinding[];
}

interface Profile {
  name: string;
  max_drawdown: string;
  expected_yield: string;
  return_risk_ratio: string;
}

interface Config {
  assets: string;
  market_type: string;
  "pnl_ai(%)": number;
  sharpe_ai: number;
  len_assets: number;
  init_wealth: number;
  "pnl_hold(%)": number;
  sharpe_hold: number;
  "CAGR_daily(%)": number;
  time_delta_day: number;
  "CAGR_monthly(%)": number;
  final_wealth_ai: number;
  max_drawdown_ai: number;
  "CAGR_annually(%)": number;
  final_wealth_hold: number;
  max_drawdown_hold: number;
  expected_return_realistic: number;
  expected_return_calculated: number;
  expected_return_conservative: number;
}

interface SpBinding {
  strategy_product: StrategyProduct;
  weight: number;
}

interface StrategyProduct {
  key: string;
  title: string;
  strategy_name: string;
  market_name: string;
  quote: Quote;
  asset_bindings: AssetBinding[];
}

interface Quote {
  key: string;
  name: string;
}

interface AssetBinding {
  asset: Asset;
  share: number;
}

interface Asset {
  key: string;
  type: string;
  symbol: SSymbol;
}

interface SSymbol {
  key: string;
  name: string;
}
