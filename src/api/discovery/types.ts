import { type Resolution } from 'shared/AdvancedChart/getCandlesCached';
import { type Coin } from '../types/shared';

export type PricesExchange = 'BINANCE' | 'STONFI' | 'RAYDIUM';

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
  pool_count?: number;
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

export interface CoinCommunityData {
  preview_listing?: boolean | null;
  public_notice?: string | null;
  additional_notices?: null | string[];
  description?: string | null;
  links?: {
    chat_url?: string[] | null;
    homepage?: string[] | null;
    repos_url?: null | {
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
}

export interface CoinChart {
  type: 'trading_view' | 'gecko_terminal';
  id: string;
  priority: number;
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
  charts?: null | CoinChart[];
  security_data?: null | Array<{
    symbol_security: NetworkSecurity;
  }>;
  community_data?: CoinCommunityData;
  symbol_pools?: Pool[] | null;
}

export interface Pool {
  address?: string | null;
  name?: string | null;
  market_cap_usd?: number | null;
  pool_created_at?: string | null;
  h24_volume_usd_liquidity?: number | null;
  h24_sells?: number | null;
  h24_buys?: number | null;
  dex?: string | null;
  // fdv_usd?: number | null;
  // reserve_in_usd?: number | null;
}

/* Whale Radar */
export interface WhaleCoin {
  rank: number;
  symbol: Coin;
  network_slugs: string[];
  total_buy_volume?: number | null;
  total_buy_number?: number | null;
  total_sell_volume?: number | null;
  total_sell_number?: number | null;
  total_transfer_volume?: number | null;
  total_holding_volume?: number | null;
  total_recent_trading_pnl?: number | null;
  market_data?: null | {
    current_price?: number | null;
    price_change_24h?: number | null;
    price_change_percentage_24h?: number | null;
    market_cap?: number | null;
    total_supply?: number | null;
    circulating_supply?: number | null;
  };
}

export type WhaleCoinsFilter = 'all' | 'buy' | 'sell' | 'total_volume' | 'hold';

export interface SingleWhale {
  holder_address: string;
  network_name: string;
  network_icon_url?: null | string;
  last_30_balance_updates?: null | Array<{
    related_at_date: string;
    balance_usdt: number;
  }>;
  last_30_days_in_out_flow?: null | Array<{
    related_at_date: string;
    today_in_flow: number;
    today_out_flow: number;
  }>;
  last_30_days_pnls?: null | Array<{
    related_at_date: string;
    total_profit_last_ndays?: number;
    recent_trading_pnl?: number;
  }>;
  recent_trading_pnl_percentage?: null | number;
  recent_trading_realized_pnl_percentage?: null | number;
  recent_trading_pnl?: null | number;
  recent_trading_realized_pnl?: null | number;
  total_recent_transfers?: null | number;
  total_recent_transfer_volume?: null | number;
  last_30_days_balance_change?: null | number;
  last_30_days_balance_change_percentage?: null | number;
  recent_trading_volume?: null | number;
  recent_trading_wins?: null | number;
  recent_trading_losses?: null | number;
  recent_average_trades_per_day?: null | number;
  recent_average_trade_duration_seconds?: null | number;
  recent_number_of_trades?: null | number;
  recent_largest_win?: null | number;
  recent_largest_loss?: null | number;
  total_profit_last_ndays?: null | number;
  total_profit_last_ndays_percent?: null | number;
  realized_profit_last_ndays?: null | number;
  realized_profit_last_ndays_percent?: null | number;
  unrealized_profit_last_ndays?: null | number;
  unrealized_profit_last_ndays_percent?: null | number;
  assets: Array<{
    amount?: null | number;
    label?: null | WhaleAssetLabel;
    total_recent_buys?: null | number;
    total_recent_sells?: null | number;
    total_recent_buy_volume?: null | number;
    total_recent_sell_volume?: null | number;
    total_recent_buy_amount?: null | number;
    total_recent_sell_amount?: null | number;
    total_recent_transfers?: null | number;
    total_recent_volume_transferred?: null | number;
    recent_avg_trade_duration_seconds?: null | number;
    recent_trading_pnl?: null | number;
    recent_trading_pnl_percentage?: null | number;
    total_profit_last_ndays?: null | number;
    total_profit_latst_ndays_percent?: null | number;
    realized_profit_last_ndays?: null | number;
    realized_profit_latst_ndays_percent?: null | number;
    unrealized_profit_last_ndays?: null | number;
    unrealized_profit_latst_ndays_percent?: null | number;
    market_data: MarketData;
    last_30_days_price_change?: null | number;
    worth?: null | number;
    symbol: Coin;
    recent_avg_cost?: null | number;
    recent_avg_sold?: null | number;
    remaining_percent?: null | number;
    symbol_labels?: null | string[];
    symbol_security?: null | {
      data: NetworkSecurity[];
    };
    networks?: null | CoinNetwork[];
  }>;
  scanner_link?: null | {
    name: string;
    url: string;
  };
}

export interface WhaleShort {
  rank: number;
  holder_address: string;
  network_name: string;
  network_icon_url: string;
  balance_usdt?: null | number;
  recent_transfer_volume?: null | number;
  recent_trading_volume?: null | number;
  recent_trading_pnl?: null | number;
  recent_trading_pnl_percentage?: null | number;
  total_profit_last_ndays?: null | number;
  total_profit_last_ndays_percent?: null | number;
  recent_trading_wins?: null | number;
  recent_trading_losses?: null | number;
  recent_total_buys?: null | number;
  recent_total_sells?: null | number;
  recent_in_flow?: null | number;
  recent_out_flow?: null | number;
  recent_average_trades_per_day?: null | number;
  recent_average_trade_duration_seconds?: null | number;
  realized_profit_last_ndays?: null | number;
  realized_profit_last_ndays_percent?: null | number;
  unrealized_profit_last_ndays?: null | number;
  unrealized_profit_last_ndays_percent?: null | number;
  total_trading_assets?: null | number;
  total_holding_assets?: null | number;
  top_assets: Array<{
    symbol: Coin;
    amount?: null | number;
    worth?: null | number;
    label?: null | string;
    recent_trading_pnl?: null | number;
    recent_trading_pnl_percentage?: null | number;
    total_profit_last_ndays?: null | number;
    total_profit_last_ndays_percent?: null | number;
  }>;
}

export type WhalesFilter =
  | 'all'
  | 'best_to_copy'
  | 'holders'
  | 'wealthy_wallets';

export type WhaleAssetLabel =
  | 'holding'
  | 'unloading'
  | 'loading'
  | 'new_investment'
  | 'exit_portfolio'
  | 'dust'
  | 'stable'
  | 'trading';

export interface WhaleRadarSentiment {
  total_buy_volume?: null | number;
  total_buy_number?: null | number;
  total_sell_volume?: null | number;
  total_sell_number?: null | number;
  chart_data?: null | Array<{
    buys_number?: null | number;
    sells_number?: null | number;
    price: number;
    related_at: string;
  }>;
  buy_percent?: null | number;
  sell_percent?: null | number;
  hold_percent?: null | number;
  wallet_count?: null | number;
  label_percents: Array<[WhaleAssetLabel, number]>;
}

export interface WhaleRadarCoin extends WhaleRadarSentiment {
  rank: number;
  symbol: Coin;
  total_transfer_volume: number;
  total_holding_volume: number;
  total_recent_trading_pnl: number;
  profitable: boolean;
  top_5_holders_info: Array<{
    address: string;
    network_name: string;
  }>;
  networks: CoinNetwork[];
  data?: null | MiniMarketData;
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  symbol_labels: string[];
}

export interface CoinWhale {
  holder_address: string;
  network_name: string;
  network_icon_url: string;
  asset: {
    id?: null | number;
    key?: null | string;
    is_active?: null | boolean;
    created_at?: null | string;
    updated_at?: null | string;
    holder_id?: null | number;
    coin_id?: null | string;
    related_at_date?: null | string;
    amount?: null | number;
    worth?: null | number;
    label?: null | WhaleAssetLabel;
    last_label_action_datetime?: string | null;
    total_recent_transfers?: null | number;
    total_recent_buys?: null | number;
    total_recent_buy_volume?: null | number;
    total_recent_buy_amount?: null | number;
    total_recent_sells?: null | number;
    total_recent_sell_volume?: null | number;
    total_recent_sell_amount?: null | number;
    total_profit_last_ndays?: null | number;
    total_profit_last_ndays_percent?: null | number;
    realized_profit_last_ndays?: null | number;
    realized_profit_last_ndays_percent?: null | number;
    unrealized_profit_last_ndays?: null | number;
    unrealized_profit_last_ndays_percent?: null | number;
    number_of_wins_last_ndays?: null | number;
    number_of_losses_last_ndays?: null | number;
    largest_win_last_ndays?: null | number;
    largest_loss_last_ndays?: null | number;
    avg_cost_last_ndays?: null | number;
    avg_sold_last_ndays?: null | number;
    remaining_percent?: null | number;
    updated_worth?: null | number;
    pnl?: null | number;
    pnl_percent?: null | number;
    recent_trading_pnl?: null | number;
    recent_trading_pnl_percentage?: null | number;
    total_recent_volume_transferred?: null | number;
  };
}

export interface WhaleTransaction {
  symbol_slug: string;
  transaction_type: 'Sent' | 'Received';
  amount?: number | null;
  price?: number | null;
  worth?: number | null;
  profit?: number | null;
  related_at_datetime: string;
  symbol?: Coin | null;
  coinstats_info?: Pick<Coin, 'abbreviation' | 'logo_url' | 'name'> | null;
  link?: null | {
    name: string;
    url: string;
  };
}

/* Technical Radar */
export interface RsiOvernessRow {
  candle_pair_name: string;
  candle_base_abbreviation: string;
  candle_base_slug?: string | null;
  rsi_value_1d: number | null;
  candle_related_at_1d: string | null;
  rsi_value_4h: number | null;
  candle_related_at_4h: string | null;
  rsi_value_1h: number | null;
  candle_related_at_1h: string | null;
  rsi_value_30m: number | null;
  candle_related_at_30m: string | null;
  rsi_value_15m: number | null;
  candle_related_at_15m: string | null;
  candle_base_name: string;
  price_change: number;
  price_change_percentage: number;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  market_cap_change_24h: number;
  image?: string | null;
}

export interface RsiDivergenceRow {
  candle_pair_name: string;
  candle_base_abbreviation: string;
  candle_base_slug?: string | null;
  candle_related_at: string;
  candle_resolution: string;
  divergence_length: string;
  candle_base_name: string;
  price_change: number;
  price_change_percentage: number;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  market_cap_change_24h: number;
  image?: string | null;
}

export type Indicator = 'rsi' | 'macd';

export type IndicatorHeatmap<I extends Indicator> = I extends 'rsi'
  ? {
      symbol: Coin;
      rsi_value: number;
      related_at: string;
      divergence_type: -1 | 1 | null;
      data?: null | MiniMarketData;
      networks?: null | CoinNetwork[];
    }
  : never;

export type IndicatorHeatmapResolution = '15m' | '30m' | '1h' | '4h' | '1d';

export type IndicatorConfirmationCombination =
  | 'rsi_bullish_divergence'
  | 'rsi_bearish_divergence'
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'macd_bullish_divergence'
  | 'macd_bearish_divergence'
  | 'macd_cross_up'
  | 'macd_cross_down';

export interface IndicatorConfirmationCore {
  symbol: Coin;
  data?: null | MiniMarketData;
  symbol_labels?: null | string[];
  symbol_security?: null | {
    data?: null | NetworkSecurity[];
  };
  networks?: null | CoinNetwork[];
  analysis?: null | string;
}

export interface RsiConfirmation {
  rsi_values?: null | Record<
    string,
    {
      value: number;
      related_at: string;
    }
  >;
  rsi_oversold_resolutions?: null | string[];
  rsi_overbought_resolutions?: null | string[];
  rsi_divergence_types?: null | Record<
    string,
    {
      type: -1 | 1 | null;
      related_at: string;
    }
  >;
  rsi_bearish_divergence_resolutions?: null | string[];
  rsi_bullish_divergence_resolutions?: null | string[];
}

export interface MacdConfirmation {
  macd_values?: null | Record<
    string,
    {
      value: number;
      related_at: string;
    }
  >;
  macd_cross_up_resolutions?: null | string[];
  macd_cross_down_resolutions?: null | string[];
  macd_divergence_types?: null | Record<
    string,
    {
      type: -1 | 1 | null;
      related_at: string;
    }
  >;
  macd_bearish_divergence_resolutions?: null | string[];
  macd_bullish_divergence_resolutions?: null | string[];
}

export type IndicatorConfirmation<I extends Indicator> = I extends 'rsi'
  ? RsiConfirmation
  : I extends 'macd'
    ? MacdConfirmation
    : IndicatorConfirmationCore;

export type IndicatorDivergenceTypes = Record<
  string,
  {
    type: -1 | 1 | null;
    related_at: string;
  }
>;

export type IndicatorValues = Record<
  string,
  {
    value: number;
    related_at: string;
  }
>;

export type TechnicalRadarCoin = IndicatorConfirmation<'macd'> &
  IndicatorConfirmation<'rsi'> & {
    rank: number;
    symbol: Coin;
    data?: null | MiniMarketData;
    networks_slug?: null | string[];
    networks?: null | CoinNetwork[];
    score?: number | null;
    rsi_score?: null | number;
    macd_score?: null | number;
    technical_sentiment: string;
    symbol_security?: null | {
      data?: null | NetworkSecurity[];
    };
    symbol_labels?: null | string[];
    sparkline?: null | {
      prices?: null | Array<{
        related_at: string;
        value: number;
      }>;
    };
    _highlighted?: boolean;
  };

export interface TechnicalRadarSentiment {
  macd_cross_normalized_score?: number | null;
  macd_divergence_normalized_score?: number | null;
  macd_score?: number | null;
  normalized_score?: number | null;
  rsi_divergence_normalized_score?: number | null;
  rsi_overness_normalized_score?: number | null;
  rsi_score?: number | null;
  technical_sentiment?: string | null;
  analysis?: null | string;
  sparkline?: null | {
    prices?: null | Array<{
      related_at: string;
      value: number;
    }>;
  };
  wise_score?: number | null;
}

/* Social Radar */
export interface SocialRadarInfo {
  long_count: number;
  short_count: number;
  analyzed_messages: number;
  signal_messages: number;
  gauge_measure: number;
  total_channels: number;
  telegram_radar: {
    long_count: number;
    short_count: number;
    signal_messages: number;
    analyzed_messages: number;
    gauge_tag: string;
    gauge_measure: number;
    total_channels: number;
  };
  reddit_radar: {
    long_count: number;
    short_count: number;
    signal_messages: number;
    analyzed_messages: number;
    gauge_tag: string;
    gauge_measure: number;
    total_channels: number;
  };
  gauge_tag: 'NOT SURE' | 'NEUTRAL' | 'LONG' | 'SHORT';
}

export interface CoinSignalAnalysis {
  call_time: string;
  updated_at: string;
  signal_length: string;
  current_pnl_percentage: number;
  average_signal: number;
  total_signals: number;
  trigger_price: number;
  current_price: number;
  max_profit_percentage: number;
  max_loss_percentage: number;
  real_pnl_percentage: number;
  max_price: number;
  min_price: number;
  sparkline?: null | {
    prices?: null | Array<{
      value: number;
      related_at: string;
    }>;
    indexes?: null | {
      first?: null | number;
      last?: null | number;
      max?: null | number;
      min?: null | number;
    };
  };
}

export interface SocialRadarSentiment {
  last_signal_related_at: string;
  first_signal_related_at: string;
  gauge_tag: 'LONG' | 'SHORT' | 'NEUTRAL' | 'NOT SURE';
  gauge_measure: -1 | 0 | 1;
  long_count: number;
  short_count: number;
  messages_count: number;
  symbol?: Coin;
  signals_analysis?: CoinSignalAnalysis;
  wise_score?: number;
  sources?: null | string[];
}
export interface SocialRadarCoin extends SocialRadarSentiment {
  rank: number;
  symbol_market_data: MarketData;
  symbol: Coin;
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  signals_analysis: CoinSignalAnalysis;
  symbol_labels?: null | string[];
  networks?: null | CoinNetwork[];
  exchanges_name?: null | string[];
  _highlighted?: boolean;
}

interface SocialMessageTemplate<S, O> {
  social_type: S;
  content: O;
  timestamp: number;
  id: string;
}

export interface TelegramMessage {
  key: string;
  related_at: string;
  channel_id: number;
  channel_title: string;
  channel_name: string;
  message_id: number;
  message_text: string;
  channel_weight: number;
  participants_count?: number | null;
  views?: number | null;
  forwards?: number | null;
  webpage_url?: string | null;
  photo_url?: string;
  channel_language: string;
}

export interface RedditMessage {
  post_id: string;
  subreddit: string;
  author: string;
  title: string;
  text: string;
  related_at: string;
  url: string;
  tag: string;
  ups: number;
  downs: number;
  thumbnail?: string;
  shared_link: null;
  score: number;
  num_subscribers: number;
  num_comments: number;
  top_comments: Array<{
    body: string;
    score: number;
    author: string;
    related_at: string;
  }>;
}

export type TwitterMessage = TwitterTweet;

export interface TradingViewIdeasMessage {
  id: number;
  key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  link: string;
  title: string;
  cover_image_link: string;
  author_updated_at: string;
  author_username: string;
  author_avatar_link: string;
  author_page_link: string;
  social_boost_score: number;
  total_comments: number;
  preview_text: string;
  symbol: number;
  side: 'Short' | 'Long';
  timeline_contents: Array<{
    content: string;
    created_at: string;
  }>;
}

export type SocialMessage =
  | SocialMessageTemplate<'telegram', TelegramMessage>
  | SocialMessageTemplate<'reddit', RedditMessage>
  | SocialMessageTemplate<'twitter', TwitterMessage>
  | SocialMessageTemplate<'trading_view', TradingViewIdeasMessage>;

/* Network Radar */
export interface NetworkRadarNCoinStates {
  mintable: boolean;
  freezable: boolean;
  burnt: boolean;
  rugged: boolean;
  safeTopHolders: boolean;
  hasLargeTxns: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  isNew: boolean;
}

export interface NCoinDeveloper {
  address: string;
  tokens: Array<{
    contract_address: string;
    creation_datetime: string;
    market_cap: number;
    symbol: null | Coin;
  }>;
}
export interface NetworkRadarNCoin {
  address: string;
  base_contract_address: string;
  base_symbol: Coin;
  quote_symbol: Coin;
  network: Network;
  creation_datetime: string;
  initial_liquidity: {
    native: number;
    usd: number;
  };
  base_symbol_security: {
    lp_is_burned: {
      status: string;
    };
    holders: Array<{
      account: string;
      balance: string;
    }>;
    mintable: {
      status: string;
    };
    freezable: {
      status: string;
    };
  };
  base_community_data: CoinCommunityData;
  update: {
    total_num_buys: number;
    total_num_sells: number;
    total_trading_volume: {
      native: number;
      usd: number;
    };
    liquidity: {
      native: number;
      usd: number;
    };
    liquidity_change?: {
      native: number;
      percent: number;
      usd: number;
    };
    base_market_data: {
      current_price: number;
      total_supply: number;
      market_cap: number;
    };
  };
  risks?: Array<{
    name?: string;
    description?: string;
    level?: 'warn' | 'danger';
    score?: number;
    value?: string;
  }>;
  risk_percent?: number;
  rugged?: boolean;
}

export interface NetworkRadarNCoinDetails extends NetworkRadarNCoin {
  dev: NCoinDeveloper;
  update: NetworkRadarNCoin['update'] & {
    resolution: string;
    num_buys: number;
    num_sells: number;
    buy_volume: {
      native: number;
      usd: number;
    };
    total_buy_volume: {
      native: number;
      usd: number;
    };
    sell_volume: {
      native: number;
      usd: number;
    };
    total_sell_volume: {
      native: number;
      usd: number;
    };
    trading_volume: {
      native: number;
      usd: number;
    };
    base_market_data: NetworkRadarNCoin['update']['base_market_data'] & {
      total_volume?: null | number;
      volume_24h?: null | number;
      price_change_24h?: null | number;
      liquidity?: null | {
        native: number;
        usd: number;
      };
      volume_1m?: null | number;
      volume_change_1m?: null | number;
      volume_5m?: null | number;
      volume_change_5m?: null | number;
      volume_1h?: null | number;
      volume_change_1h?: null | number;
      volume_1d?: null | number;
      volume_change_1d?: null | number;
    };
  };
  charts: CoinChart[];
  base_symbol_labels: string[];
  pools: Pool[];
}

/* Coin Radar */
export interface CoinRadarCoin {
  rank: number;
  social_radar_insight?: null | SocialRadarSentiment;
  technical_radar_insight?:
    | null
    | (RsiConfirmation & MacdConfirmation & TechnicalRadarSentiment);
  symbol: Coin;
  symbol_labels?: null | string[];
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  total_score?: null | number;
  networks?: null | CoinNetwork[];
  market_data?: MiniMarketData;
  _highlighted?: boolean;
}

/* Twitter Tracker */
export interface TwitterAccount {
  id: number;
  key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  username: string;
  followers_count: null | number;
  following_count: null | number;
  tweet_count: null | number;
  like_count: null | number;
}

export interface TwitterFollowedAccount {
  user_id: string;
  username: string;
  hide_from_list: boolean;
}

export interface TwitterTweet {
  user: TwitterAccount;
  tweet_id: string;
  related_at: string;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
  text?: null | string;
  language?: null | string;
  media: Array<{
    url: string;
    type: 'photo' | 'video';
    width: number;
    height: number;
  }>;
  quoted_tweet?: null | TwitterTweet;
  retweeted_tweet?: null | TwitterTweet;
  replied_tweet?: null | TwitterTweet;
}

/* Rest */
export interface DetailedCoin {
  symbol: Coin;
  symbol_community_links?: null | CoinCommunityData['links'];
  contract_address?: null | string;
  symbol_security?: null | NetworkSecurity;
  symbol_market_data?: {
    volume_24h?: null | number;
    market_cap?: null | number;
  };
  is_in_coingecko?: boolean | null;
  symbol_labels?: string[] | null;
  network_bindings?: CoinNetwork[];
}
export type RadarsMetcis = Record<
  'social_radar' | 'technical_radar',
  {
    time_horizon: string;
    event_type: unknown;
    max_average_win_rate?: number | null;
  }
>;

export interface TokenInsight {
  contract_address: string;
  created_at: string;
  total_supply: number;
  creator_balance: number;
  top_10_holders_holding_percentage: number;
  dev_holding_percentage: number;
  snipers_holding_percentage: number;
  lp_burned_percentage: number;
  total_holders: number;
  insiders_holding_percentage: number;
  bundlers_holding_percentage: number;
}

export interface CoinTopTraderHolder {
  network: string;
  wallet_address: string;
  token_address: string;
  related_at?: string | null;
  resolution: Resolution;
  num_buys: number;
  num_sells: number;
  num_inflows: number;
  num_outflows: number;
  num_win: number;
  num_loss: number;
  average_buy: number;
  volume_buys: number;
  volume_sells: number;
  realized_pnl: number;
  volume_inflow: number;
  volume_outflow: number;
  balance: number;
  balance_first: number;
  pnl: number;
}
export interface TwitterRelatedToken {
  smart_contract: string;
  name: string;
  abbreviation: string;
  slug: string;
  icon: string;
  description: string;
}
