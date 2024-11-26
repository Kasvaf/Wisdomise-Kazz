export type AlertState = 'ACTIVE' | 'DISABLED' | 'SNOOZE';

export type AlertConditionOperator =
  | 'LESS'
  | 'GREATER'
  | 'EQUAL'
  | 'CONTAINS_OBJECT_EACH'
  | 'CONTAINS_EACH';

export type AlertMessenger =
  | 'EMAIL'
  | 'TELEGRAM'
  | 'SLACK'
  | 'SMS'
  | 'DISCORD'
  | 'PUSH'
  | 'BROWSER';

export interface BaseAlert {
  data_source?: string;
  key?: string;
  state: 'ACTIVE' | 'DISABLED' | 'SNOOZE';
  created_at?: string;
  updated_at?: string;
  messengers: AlertMessenger[];
  params: Array<{
    field_name: string;
    value: string | boolean | number;
  }>;
  conditions: Array<{
    field_name: string;
    threshold: string;
    operator: string;
  }>;
  config?: {
    dnd_interval?: number;
    one_time?: boolean;
  };
}

export interface MarketDataAlert extends BaseAlert {
  data_source: 'market_data';
  params: Array<{
    field_name: 'base' | 'quote';
    value: string;
  }>;
  conditions: Array<{
    field_name: 'last_price';
    threshold: string;
    operator: 'LESS' | 'GREATER' | 'EQUAL';
  }>;
}

export interface SocialRadarAlert extends BaseAlert {
  data_source: 'social_radar';
  params: [];
  conditions: Array<{
    field_name: 'networks_slug' | 'symbol.categories';
    threshold: string;
    operator: 'CONTAINS_OBJECT_EACH' | 'CONTAINS_EACH';
  }>;
}

export interface TechnicalRadarAlert extends BaseAlert {
  data_source: 'technical_radar';
  params: [];
  conditions: Array<{
    field_name: 'networks_slug' | 'symbol.categories';
    threshold: string;
    operator: 'CONTAINS_OBJECT_EACH' | 'CONTAINS_EACH';
  }>;
}

export interface SocialRadarDailyReportAlert extends BaseAlert {
  data_source: 'manual:social_radar_daily_report';
  params: [];
  conditions: [];
}

export type Alert =
  | SocialRadarDailyReportAlert
  | MarketDataAlert
  | SocialRadarAlert
  | TechnicalRadarAlert;
