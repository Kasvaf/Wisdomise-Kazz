export type AlertDataSource = 'market_data' | 'custom:coin_radar_notification';

export type AlertState = 'ACTIVE' | 'DISABLED' | 'SNOOZE';

export type AlertMessanger =
  | 'EMAIL'
  | 'TELEGRAM'
  | 'SLACK'
  | 'SMS'
  | 'DISCORD'
  | 'PUSH'
  | 'BROWSER';

export type AlertParams<D extends AlertDataSource> = D extends 'market_data'
  ? {
      base?: string;
      quote?: string;
      market_type?: 'SPOT' | 'FUTURES';
      market_name?: string;
    }
  : undefined;

type AlertCondition<D extends AlertDataSource> = D extends 'market_data'
  ? {
      field_name: 'last_price';
      threshold: string;
      operator: 'LESS' | 'GREATER' | 'EQUAL';
    }
  : undefined;

type AlertConfig<D extends AlertDataSource> = D extends 'market_data'
  ? {
      dnd_interval: number;
      one_time: boolean;
    }
  : undefined;

export interface RawAlert<D extends AlertDataSource> {
  key: string;
  data_source: {
    name: AlertDataSource;
  };
  state: AlertState;
  params: Array<{
    field_name: keyof AlertParams<D>;
    value: string | boolean | number;
  }>;
  conditions: Array<AlertCondition<D>>;
  messengers: AlertMessanger[];
  config: AlertConfig<D>;
  created_at?: string;
  updated_at?: string;
}

export interface Alert<D extends AlertDataSource> {
  key?: string;
  dataSource: AlertDataSource;
  params: AlertParams<D>;
  condition: AlertCondition<D>;
  messengers: AlertMessanger[];
  config: AlertConfig<D>;
  state: AlertState;
  createdAt?: string;
  updatedAt?: string;
}
