export type PlanPeriod = 'MONTHLY' | 'YEARLY';

export interface Subscription {
  object?: {
    object: string;
    status: 'trialing' | 'active' | 'inactive' | 'canceled';
    trial_end: number;
    trial_start: number;

    current_period_start?: number;
    current_period_end?: number;

    cancel_at?: number;
    canceled_at?: number;
    plan: {
      id: string;
      name: string;
      amount: number;
      metadata: SubscriptionPlanMetadata;
    };
  };
}
export interface SubscriptionItem {
  subscription_plan: SubscriptionPlan;
  next_subs_item?: any;
  // reason_to_create: 'TRIAL';
  payment_method: 'MANUAL' | 'FIAT' | 'CRYPTO' | 'TOKEN';
  status:
    | 'trialing' // trialed
    | 'active' // not-trial
    | 'past_due'
    | 'unpaid'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'paused';
  start_at: string; // UTC date/time
  end_at: string; // UTC date/time
}

export interface SubscriptionPlan {
  id: string;
  key: string;
  name: string;
  is_active: boolean;
  description: string;
  price: number;
  stripe_price_id: string;
  amount: number; // not from backend!!!
  features: string[];
  periodicity: PlanPeriod;
  stripe_payment_link: string;
  metadata: SubscriptionPlanMetadata;
  wsdm_token_hold: number;
}

interface SubscriptionPlanMetadata {
  activate_fp: boolean;
  strategy_create: boolean;
  view_signal_matrix: boolean;
  strategy_use_cockpit: boolean;
  strategy_run_backtest: boolean;
  athena_questions_count: number;
  enable_signal_notifications: boolean;
  weekly_custom_notifications_count: number;
}
