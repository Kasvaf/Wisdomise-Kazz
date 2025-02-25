export type MarketTypes = 'SPOT' | 'FUTURES';
export type PricesExchange = 'BINANCE' | 'STONFI' | 'RAYDIUM';

export interface Coin {
  abbreviation: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  categories?: null | Array<{
    name: string;
    slug: string;
  }>;
}

export interface MiniMarketData {
  current_price?: number | null;
  image?: string | null;
  price_change_24h?: number | null;
  price_change_percentage_24h?: number | null;
  market_cap?: number | null;
  market_cap_category?: string | null;
  total_supply?: number | null;
  circulating_supply?: number | null;
  low_24h?: number | null;
  high_24h?: number | null;
}

export interface MarketData extends MiniMarketData {
  id: string;
  ath?: number | null;
  atl?: number | null;
  roi?: number | null;
  ath_date?: string | null;
  atl_date?: string | null;
  max_supply?: number | null;
  last_updated?: string | null;
  total_volume?: number | null;
  market_cap_rank?: number | null;
  ath_change_percentage?: number | null;
  atl_change_percentage?: number | null;
  market_cap_change_24h?: number | null;
  fully_diluted_valuation?: number | null;
  market_cap_change_percentage_24h?: number | null;
}

export interface ExtendedMarketData extends MarketData {
  max_price_1_d?: number | null;
  max_price_7_d?: number | null;
  max_price_14_d?: number | null;
  max_price_21_d?: number | null;
  max_price_30_d?: number | null;
  min_price_1_d?: number | null;
  min_price_7_d?: number | null;
  min_price_14_d?: number | null;
  min_price_21_d?: number | null;
  min_price_30_d?: number | null;
  volume_change_percentage_24h?: number | null;
  price_history: Array<{
    related_at_date?: string | null;
    mean_price?: number | null;
  }>;
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

export interface Network {
  slug: string;
  name: string;
  icon_url: string;
}

export interface CoinNetwork {
  network: Network;
  contract_address: string;
  symbol_network_type: 'COIN' | 'TOKEN';
}

export interface Exchange {
  icon_url: string;
  name: string;
}

export interface Category {
  name: string;
  slug: string;
}

export interface CoinLabels {
  security_labels: string[];
  trend_labels: string[];
}

export interface CoinExchange {
  coin_ranking_rank: number;
  number_of_markets: number;
  price_in_btc: number;
  price_in_usd: number;
  volume_24h: number;
  volume_percentage: number;
  exchange: {
    id: number;
    name: string;
    key: string;
    is_active: boolean;
    icon_url: string;
    updated_at: string;
    created_at: string;
  };
}

export interface CoinDetails {
  symbol: Coin;
  related_at: string | null;
  data: null | {
    id: string;
    ath: number;
    atl: number;
    roi: null;
    image: string | null;
    low_24h: number;
    high_24h: number;
    max_price_1_d: number;
    max_price_7_d: number;
    max_price_14_d: number;
    max_price_21_d: number;
    max_price_30_d: number;
    min_price_1_d: number;
    min_price_7_d: number;
    min_price_14_d: number;
    min_price_21_d: number;
    min_price_30_d: number;
    ath_date: string;
    atl_date: string;
    market_cap: number;
    max_supply: number;
    last_updated: string;
    total_supply: number;
    total_volume: number;
    current_price: number;
    market_cap_rank: number;
    price_change_24h: number;
    circulating_supply: number;
    ath_change_percentage: number;
    atl_change_percentage: number;
    market_cap_change_24h: number;
    fully_diluted_valuation: number;
    price_change_percentage_24h: number;
    market_cap_change_percentage_24h: number;
    volume_change_percentage_24h: number;
    price_history: Array<{
      related_at_date: string;
      mean_price: number;
    }>;
  };
  exchanges: CoinExchange[];
  networks?: null | CoinNetwork[];
  symbol_labels?: null | string[];
  charts?: null | Array<{
    type: 'trading_view' | 'gecko_terminal';
    id: string;
    priority: number;
    url: string;
    embedUrl: string;
  }>;
  security_data?: null | Array<{
    symbol_security: NetworkSecurity;
  }>;
  community_data?: {
    preview_listing?: boolean | null;
    public_notice?: string | null;
    additional_notices?: null | string[];
    description?: string | null;
    links?: {
      chat_url?: string[] | null;
      homepage?: string[] | null;
      repos_url: {
        github?: string[] | null;
        bitbucket?: string[] | null;
      };
      whitepaper?: string | null;
      subreddit_url?: string | null;
      blockchain_site?: string[] | null;
      announcement_url?: string | null;
      facebook_username?: string | null;
      official_forum_url?: string[] | null;
      twitter_screen_name?: string | null;
      telegram_channel_identifier?: string | null;
      bitcointalk_thread_identifier?: string | null;
    };
    country_origin?: string | null;
    sentiment_votes_up_percentage?: number | null;
    sentiment_votes_down_percentage?: number | null;
    watchlist_portfolio_users?: number | null;
    community_data?: {
      facebook_likes?: number | null;
      twitter_followers?: number | null;
      reddit_subscribers?: number | null;
      reddit_average_posts_48h?: number | null;
      reddit_accounts_active_48h?: number | null;
      reddit_average_comments_48h?: number | null;
      telegram_channel_user_count?: number | null;
    };
    developer_data?: {
      forks?: number | null;
      stars?: number | null;
      subscribers?: number | null;
      total_issues?: number | null;
      closed_issues?: number | null;
      commit_count_4_weeks?: number | null;
      pull_requests_merged?: number | null;
      pull_request_contributors?: number | null;
      code_additions_deletions_4_weeks: {
        additions?: number | null;
        deletions?: number | null;
      };
      last_4_weeks_commit_activity_series: [];
    };
  };
}
