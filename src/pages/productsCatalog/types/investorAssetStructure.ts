export type InvestorAssetStructures = [
  {
    key: string;
    type: string;
    total_equity: number;
    investor: Investor;
    financial_product_instances: FinancialProductInstance[];
    main_exchange_account: MainExchangeAccount;
    asset_bindings: AssetBinding[];
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
  asset: SymbolAsset | PairAsset;
  equity: number;
  amount: number;
}

interface SymbolAsset {
  type: "SYMBOL";
  symbol: { name: string };
}

interface PairAsset {
  type: "PAIR";
  pair: {
    base: {
      name: string;
    };
    quote: Quote;
  };
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
