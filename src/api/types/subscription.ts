export type PlanPeriod = 'MONTHLY' | 'YEARLY';

export interface Subscription {
  object?: {
    object: string;
    status: 'trialing' | 'active' | 'inactive';
    trial_end: number;
    trial_start: number;
    canceled_at?: number;
    plan: {
      key?: string;
      name: string;
      metadata: {
        athena_questions_count: number;
        athena_daily_notifications_count: number;
      };
    };
  };
}

export interface SubscriptionPlan {
  key: string;
  is_active: boolean;
  name: string;
  description: string;
  price: number;
  periodicity: PlanPeriod;
  trial_days: number;
  features: string[];
  metadata: Record<string, unknown>;
  stripe_payment_link: string;
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
