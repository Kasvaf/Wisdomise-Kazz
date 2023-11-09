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

export interface SubscriptionPlan {
  id: string;
  key: string;
  name: string;
  is_active: boolean;
  description: string;
  price: number;
  trial_days: number;
  stripe_price_id: string;
  amount: number;
  features: string[];
  periodicity: PlanPeriod;
  stripe_payment_link: string;
  metadata: SubscriptionPlanMetadata;
  wsdm_token_hold: number;
}

interface SubscriptionPlanMetadata {
  activate_fp: boolean;
  view_signal_matrix: boolean;
  athena_questions_count: number;
  enable_signal_notifications: boolean;
  weekly_custom_notifications_count: number;
}
