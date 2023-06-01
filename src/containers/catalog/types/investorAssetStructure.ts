export type InvestorAssetStructureResponse = [
  {
    key: string;
    type: string;
    investor: Investor;
    financial_product_instances: FinancialProductInstance[];
    main_exchange_account: MainExchangeAccount;
    asset_bindings: AssetBinding2[];
  } | null
];

interface Investor {
  key: string;
}

interface FinancialProductInstance {
  key: string;
  status: string;
  financial_product: FinancialProduct;
  asset_bindings: AssetBinding[];
}

interface FinancialProduct {
  key: string;
  title: string;
  asset_class: string;
}

interface AssetBinding {
  asset: Asset;
  equity: number;
  amount: number;
}

interface Asset {
  type: string;
  symbol: symbol;
}

interface Symbol {
  name: string;
}

interface MainExchangeAccount {
  key: string;
  exchange_market: ExchangeMarket;
  quote: Quote;
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

interface Quote {
  name: string;
}

interface AssetBinding2 {
  asset: Asset2;
  equity: number;
  amount: number;
}

interface Asset2 {
  type: string;
  symbol: Symbol2;
}

interface Symbol2 {
  name: string;
}
