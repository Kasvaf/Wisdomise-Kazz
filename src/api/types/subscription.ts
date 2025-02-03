import { type Invoice } from 'modules/account/models';

export type PlanPeriod = 'MONTHLY' | 'YEARLY';
export type PaymentMethod = 'TOKEN' | 'CRYPTO' | 'FIAT' | 'MANUAL' | 'WSDM';

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
    | 'paused'
    | 'trialing';
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
  stripe_payment_link?: string;
  wsdm_payment_link?: string;
  crypto_payment_link?: string;
  metadata?: null | SubscriptionPlanMetadata;
  wsdm_token_hold: number;
  level: number;
  token_hold_support?: boolean;
}

interface SubscriptionPlanMetadata {
  most_popular?: boolean;
}
