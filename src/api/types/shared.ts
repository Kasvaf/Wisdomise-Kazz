export interface Coin {
  abbreviation: string;
  name: string;
  slug?: string | null;
  logo_url?: string | null;
  categories?: null | Array<{
    name: string;
    slug: string;
  }>;
}

export interface MarketData {
  id: string;
  ath?: number | null;
  atl?: number | null;
  roi?: number | null;
  image?: string | null;
  low_24h?: number | null;
  ath_date?: string | null;
  atl_date?: string | null;
  high_24h?: number | null;
  market_cap?: number | null;
  max_supply?: number | null;
  last_updated?: string | null;
  total_supply?: number | null;
  total_volume?: number | null;
  current_price?: number | null;
  market_cap_rank?: number | null;
  price_change_24h?: number | null;
  circulating_supply?: number | null;
  ath_change_percentage?: number | null;
  atl_change_percentage?: number | null;
  market_cap_change_24h?: number | null;
  fully_diluted_valuation?: number | null;
  price_change_percentage_24h?: number | null;
  market_cap_change_percentage_24h?: number | null;
  market_cap_category?: string | null;
}

export interface NetworkSecurity {
  network_name: string;
  label: {
    risk: number;
    warning: number;
    trusted: boolean;
  };
  detail: {
    anti_whale_modifiable?: string | null;
    buy_tax?: string | null;
    can_take_back_ownership?: string | null;
    cannot_buy?: string | null;
    cannot_sell_all?: string | null;
    creator_address?: string | null;
    creator_balance?: string | null;
    creator_percent?: string | null;
    external_call?: string | null;
    hidden_owner?: string | null;
    holder_count?: string | null;
    honeypot_with_same_creator?: string | null;
    is_anti_whale?: string | null;
    is_blacklisted?: string | null;
    is_honeypot?: string | null;
    is_in_dex?: string | null;
    is_mintable?: string | null;
    is_open_source?: string | null;
    is_proxy?: string | null;
    is_whitelisted?: string | null;
    owner_address?: string | null;
    gas_abuse?: string | null;
    owner_balance?: string | null;
    owner_change_balance?: string | null;
    owner_percen?: string | null;
    personal_slippage_modifiable?: string | null;
    selfdestruct?: string | null;
    sell_tax?: string | null;
    slippage_modifiable?: string | null;
    token_name?: string | null;
    token_symbol?: string | null;
    total_supply?: string | null;
    trading_cooldown?: string | null;
    transfer_pausable?: string | null;
  };
}
