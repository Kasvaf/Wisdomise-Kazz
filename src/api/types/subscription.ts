import { type Invoice } from 'modules/account/models';

export type PlanPeriod = 'MONTHLY' | 'YEARLY';
export type PaymentMethod = 'TOKEN' | 'CRYPTO' | 'FIAT' | 'MANUAL';

export interface SubscriptionItem {
  subscription_plan: SubscriptionPlan;
  // reason_to_create: 'TRIAL';
  payment_method: PaymentMethod;
  status:
    | 'active' // not-trial
    | 'past_due'
    | 'unpaid'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'paused';
  start_at: string; // UTC date/time
  end_at: string; // UTC date/time
  pending_invoice?: Invoice | null; // show pay-now button
  next_subs_item?: Omit<SubscriptionItem, 'next_subs_item'>;
}

export interface SubscriptionPlan {
  key: string;
  name: string;
  is_active: boolean;
  description: string;
  price: number;
  stripe_price_id: string;
  features: string[];
  periodicity: PlanPeriod;
  stripe_payment_link: string;
  metadata: SubscriptionPlanMetadata;
  wsdm_token_hold: number;
  level: number;
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
