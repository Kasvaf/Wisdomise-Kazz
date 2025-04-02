import { type Invoice } from 'modules/account/models';

export type PlanPeriod = 'MONTHLY' | 'YEARLY';
export type PaymentMethod = 'TOKEN' | 'CRYPTO' | 'FIAT' | 'MANUAL' | 'WSDM';
export type SubscribtionStatus =
  | 'active'
  | 'past_due'
  | 'unpaid'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'paused';

export interface SubscriptionItem {
  subscription_plan: SubscriptionPlan;
  // reason_to_create: 'TRIAL';
  payment_method: PaymentMethod;
  status: SubscribtionStatus;
  start_at: string; // UTC date/time
  end_at: string; // UTC date/time
  pending_invoice?: Invoice | null; // show pay-now button
  cancel_at_period_end?: boolean; // user don't want to renew his plan
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
