import { type SubscriptionPlan } from 'api/types/subscription';

export interface Invoice {
  key: string;
  amount_paid: number;
  created_at: string;
  updated_at: string;
  due_date?: string;
  stripe_payment_link?: string;
  subscription_plan: SubscriptionPlan;
  status: 'paid' | 'open' | 'draft' | 'pending';
  payment_method: 'FIAT' | 'CRYPTO' | 'TOKEN' | 'MANUAL';
}

export interface PaymentMethodsResponse {
  object: 'list';
  data: PaymentMethod[];
  has_more: false;
  url: '/v1/payment_methods';
}

interface PaymentMethod {
  id: string;
  object: 'payment_method';
  billing_details: {
    address: {
      city: unknown;
      country: unknown;
      line1: unknown;
      line2: unknown;
      postal_code: unknown;
      state: unknown;
    };
    email: string;
    name: string;
    phone: unknown;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: unknown;
      address_postal_code_check: unknown;
      cvc_check: unknown;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: unknown;
    generated_from: unknown;
    last4: string;
    networks: {
      available: unknown;
      preferred: unknown;
    };
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: unknown;
  };
  created: number;
  customer: string;
  livemode: boolean;
  metadata?: unknown;
  type: string;
}
