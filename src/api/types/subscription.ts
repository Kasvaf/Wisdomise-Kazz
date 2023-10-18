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
    plan: SubscriptionPlan;
  };
}

export interface SubscriptionPlan {
  key: string;
  name: string;
  is_active: boolean;
  description: string;
  price: number;
  periodicity: PlanPeriod;
  trial_days: number;
  features: string[];
  stripe_payment_link: string;
  metadata: {
    activate_fp: boolean;
    view_signal_matrix: boolean;
    athena_questions_count: number;
    athena_daily_notifications_count: number;
  };
  stripe_price_id: string;
  id: string;
  amount: number;
}

export interface SubscriptionPortal {
  id: string;
  object: string;
  configuration: string;
  created: number;
  customer: string;
  livemode: boolean;
  return_url: string;
  url: string;
}
