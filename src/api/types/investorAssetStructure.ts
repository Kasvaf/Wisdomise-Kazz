import { type Config } from './financialProduct';
import { type RawPosition } from './signalResponse';
import { type SupportedPair } from './strategy';

export type InvestorAssetStructures = Array<{
  key: string;
  type: string;
  total_equity: number;
  pnl: number;
  net_deposit: number;
  working_capital: number;
  investor: Investor;
  financial_product_instances: FinancialProductInstance[];
  main_exchange_account?: MainExchangeAccount;
  asset_bindings: AssetBinding[];
}>;

interface Investor {
  key: string;
}

export interface FinancialProductInstance {
  key: string;
  status: 'DRAFT' | 'RUNNING' | 'PAUSED';
  financial_product: FinancialProduct;
  total_equity: number;
  total_equity_share: number;
  pnl: number;
  started_at: string;
  stopped_at: string;
  created_at: string;
  asset_bindings: AssetBinding[];
}

interface FinancialProduct {
  key: string;
  title: string;
  asset_class: string;
  config: Config;
}

export interface AssetBinding {
  asset: SupportedPair;
  equity: number;
  amount: number;
  share: number;
  name: string;
}

interface MainExchangeAccount {
  key: string;
  exchange_market: ExchangeMarket;
  quote: { name: string };
  quote_equity: number;
  total_equity: number;
}

interface ExchangeMarket {
  exchange: Exchange;
  market: Market;
}

interface Exchange {
  name: string;
}

interface Market {
  name: string;
}

export interface FpiPosition extends RawPosition {
  pair: SupportedPair;
  amount: number;
}
