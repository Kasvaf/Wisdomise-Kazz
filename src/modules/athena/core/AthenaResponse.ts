export type AthenaResponse =
  | AthenaMessageEvent
  | AthenaTriggerEvent
  | AthenaTerminateEvent;

export interface AthenaMessageEvent {
  event: 'message';
  choices: [{ delta: { content: string } }];
}

export interface AthenaTriggerEvent {
  event: 'trigger';
  widgets: AthenaWidget[];
}

export interface AthenaTerminateEvent {
  event: 'terminate';
  key: string;
  answer: string;
  feedback: string;
  question: string;
  created_at: string;
  widgets: [AthenaWidget];
  context_sources: Array<{ url: string; description: string }>;
  subject: {
    category: string;
    symbols: string[];
  };
  following_questions: Array<{
    exact_text: string;
    interface_text: string;
    root_question_subject_category: string;
  }>;
}

interface NewsWidget {
  type: 'news';
  symbol: string;
  limit: number;
}

export interface SpoWidget {
  type: 'smart_crypto_portfolio';
  symbol?: string;
  settings?: { risk_type: 'low' | 'medium' | 'high' };
}

interface SignalMatrixWidget {
  type: 'last_positions';
  symbol?: string;
}

interface TrendingTweetsWidget {
  type: 'top_trending_tweets';
  symbol?: string;
}

interface TopCoinsWidget {
  type: 'top_trending_alt_coins';
  symbol?: string;
}

interface TopNftsWidget {
  type: 'top_trending_nfts';
  symbol?: string;
}

interface PassiveIncomeDeFiWidget {
  type: 'passive_income_defi';
  symbol?: string;
}

interface NoSpecificWidget {
  type: 'no_specific_widget';
  symbol?: string;
}

export interface TradingViewWidget {
  symbol: string;
  type: 'price_chart';
  settings: {
    allow_symbol_change?: boolean;
    autosize?: boolean;
    container_id?: 'tradingview_adde9';
    enable_publishing?: boolean;
    interval?: 'D';
    locale?: 'en';
    style?: '1';
    theme?: 'dark';
    timezone?: 'Etc/UTC';
    toolbar_bg?: '#f1f3f6';
  };
}

export type AthenaWidget =
  | SpoWidget
  | NewsWidget
  | TopNftsWidget
  | TopCoinsWidget
  | NoSpecificWidget
  | TradingViewWidget
  | SignalMatrixWidget
  | TrendingTweetsWidget
  | PassiveIncomeDeFiWidget;
