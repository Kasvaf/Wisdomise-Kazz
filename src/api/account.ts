import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type Account } from './types/UserInfoResponse';
import { type PageResponse } from './types/page';

export function useAccountQuery() {
  return useQuery<Account>(
    ['account'],
    async () => {
      const { data } = await axios.get<Account>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}
interface UserProfileUpdate {
  nickname: string | null;
  referrer_code: string;
  terms_and_conditions_accepted?: boolean;
  privacy_policy_accepted?: boolean;
}

export const useUserInfoMutation = () => {
  const queryClient = useQueryClient();
  return async (body: Partial<UserProfileUpdate>) => {
    const { data } = await axios.patch<UserProfileUpdate>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`,
      body,
    );
    await queryClient.invalidateQueries(['account']);
    return data;
  };
};

export const useResendVerificationEmailMutation = () => async () => {
  const { status } = await axios.post(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/verification_email/`,
  );
  return status >= 200 && status < 400;
};

interface AppDetail {
  key: string;
  name: string;
  frontend_url: string;
}

export function useAppsInfoQuery(appName?: string) {
  return useQuery(
    ['getApp', appName],
    async ({ queryKey }) => {
      const [, name] = queryKey;
      const { data } = await axios.get<PageResponse<AppDetail>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/apps${
          name ? 'name=' + name : ''
        }`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      retry: false,
    },
  );
}

export interface ReferralStatus {
  referral_code: string;
  referrer?: string;
  referred_users_count: number;
  active_referred_users_count: number;
  interval_days: number;
  interval_referred_users_count: number;
  interval_active_referred_users_count: number;
  wisdomise_referral_revenue: number;
  interval_wisdomise_referral_revenue: number;
  referral_revenue: number;
  interval_referral_revenue: number;
}

export function useReferralStatusQuery(intervalDays?: number) {
  return useQuery(
    ['getReferralStatus', intervalDays],
    async ({ queryKey }) => {
      const [, intervalDays] = queryKey;
      const { data } = await axios.get<ReferralStatus>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/referral-status${
          intervalDays ? '?interval_days=' + String(intervalDays) : ''
        }`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      retry: false,
    },
  );
}

export interface SetupIntentResponse {
  client_secret: string;
}

export function useStripeSetupIntentQuery() {
  return useQuery(
    ['getStripeSetupIntent'],
    async () => {
      const { data } = await axios.get<SetupIntentResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/setup-intent`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

export interface Invoice {
  key: '6bbb9163-c284-46b3-9c3a-fd837bcaea37';
  created_at: string;
  updated_at: '2023-10-10T07:28:19.160667Z';
  stripe_id: 'in_1NzaMUEtPI4IVpojbZ0BvNj9';
  status: string;
  amount_paid: number;
  data: {
    object: {
      id: 'in_1NzaMUEtPI4IVpojbZ0BvNj9';
      tax: 0;
      paid: true;
      lines: {
        url: '/v1/invoices/in_1NzaMUEtPI4IVpojbZ0BvNj9/lines';
        data: [
          {
            id: 'il_1NzaMUEtPI4IVpojoUDMmjiV';
            plan: {
              id: 'price_1NtoBTEtPI4IVpojJv9vSm2u';
              active: true;
              amount: 4999;
              object: 'plan';
              created: number;
              product: 'prod_OhCaaL5hvS6qpD';
              currency: 'usd';
              interval: 'month';
              livemode: false;
              metadata: {
                activate_fp: 'true';
                strategy_create: 'true';
                view_signal_matrix: 'true';
                strategy_use_cockpit: 'true';
                strategy_run_backtest: 'true';
                athena_questions_count: '50';
                enable_signal_notifications: 'true';
                athena_daily_notifications_count: '5';
              };
              nickname: null;
              tiers_mode: null;
              usage_type: 'licensed';
              amount_decimal: '4999';
              billing_scheme: 'per_unit';
              interval_count: 1;
              aggregate_usage: null;
              transform_usage: null;
              trial_period_days: null;
            };
            type: 'subscription';
            price: {
              id: 'price_1NtoBTEtPI4IVpojJv9vSm2u';
              type: 'recurring';
              active: true;
              object: 'price';
              created: number;
              product: 'prod_OhCaaL5hvS6qpD';
              currency: 'usd';
              livemode: false;
              metadata: {
                activate_fp: 'true';
                strategy_create: 'true';
                view_signal_matrix: 'true';
                strategy_use_cockpit: 'true';
                strategy_run_backtest: 'true';
                athena_questions_count: '50';
                enable_signal_notifications: 'true';
                athena_daily_notifications_count: '5';
              };
              nickname: null;
              recurring: {
                interval: 'month';
                usage_type: 'licensed';
                interval_count: 1;
                aggregate_usage: null;
                trial_period_days: null;
              };
              lookup_key: null;
              tiers_mode: null;
              unit_amount: 4999;
              tax_behavior: 'unspecified';
              billing_scheme: 'per_unit';
              custom_unit_amount: null;
              transform_quantity: null;
              unit_amount_decimal: '4999';
            };
            amount: 4999;
            object: 'line_item';
            period: {
              end: number;
              start: number;
            };
            currency: 'usd';
            livemode: false;
            metadata: unknown;
            quantity: 1;
            discounts: [];
            proration: false;
            tax_rates: [];
            description: '1 × Wisdomise Expert (at $49.99 / month)';
            tax_amounts: [
              {
                amount: 0;
                tax_rate: 'txr_1NcSa2EtPI4IVpojw8wiDlqz';
                inclusive: false;
                taxable_amount: 0;
                taxability_reason: 'not_collecting';
              },
            ];
            discountable: true;
            subscription: 'sub_1NzaMUEtPI4IVpojrh3QqLLb';
            discount_amounts: [];
            proration_details: {
              credited_items: null;
            };
            subscription_item: 'si_OnAhXTG5vp9chN';
            amount_excluding_tax: 4999;
            unit_amount_excluding_tax: '4999';
          },
        ];
        object: 'list';
        has_more: false;
        total_count: 1;
      };
      quote: null;
      total: 4999;
      charge: 'ch_3NzaMUEtPI4IVpoj19MYxY8N';
      footer: null;
      number: 'CC3B9168-0001';
      object: 'invoice';
      status: 'paid';
      created: number;
      currency: 'usd';
      customer: 'cus_OnAhPx0IpJ56pH';
      discount: null;
      due_date: null;
      livemode: false;
      metadata: unknown;
      subtotal: 4999;
      attempted: true;
      discounts: [];
      rendering: null;
      amount_due: 4999;
      period_end: number;
      test_clock: null;
      amount_paid: 4999;
      application: null;
      description: null;
      invoice_pdf: 'https://pay.stripe.com/invoice/acct_1NUl6ZEtPI4IVpoj/test_YWNjdF8xTlVsNlpFdFBJNElWcG9qLF9PbkFoemdUdVRkMnlSS05SRXA4Z1FUY2tlSzZlWGRrLDg3NDYzNjk40200k9lvMAoy/pdf?s=ap';
      account_name: 'Wisdomise AG';
      auto_advance: false;
      effective_at: number;
      from_invoice: null;
      on_behalf_of: null;
      period_start: number;
      subscription: 'sub_1NzaMUEtPI4IVpojrh3QqLLb';
      attempt_count: 1;
      automatic_tax: {
        status: 'complete';
        enabled: true;
      };
      custom_fields: null;
      customer_name: 'newplan';
      shipping_cost: null;
      transfer_data: null;
      billing_reason: 'subscription_create';
      customer_email: 'majid+newplan@wisdomise.io';
      customer_phone: null;
      default_source: null;
      ending_balance: 0;
      payment_intent: 'pi_3NzaMUEtPI4IVpoj10Sckcli';
      receipt_number: null;
      account_country: 'CH';
      account_tax_ids: null;
      amount_shipping: 0;
      latest_revision: null;
      amount_remaining: 0;
      customer_address: {
        city: null;
        line1: null;
        line2: null;
        state: null;
        country: 'FR';
        postal_code: null;
      };
      customer_tax_ids: [];
      paid_out_of_band: false;
      payment_settings: {
        default_mandate: null;
        payment_method_types: null;
        payment_method_options: null;
      };
      shipping_details: null;
      starting_balance: 0;
      collection_method: 'charge_automatically';
      customer_shipping: null;
      default_tax_rates: [];
      rendering_options: null;
      total_tax_amounts: [
        {
          amount: 0;
          tax_rate: 'txr_1NcSa2EtPI4IVpojw8wiDlqz';
          inclusive: false;
          taxable_amount: 0;
          taxability_reason: 'not_collecting';
        },
      ];
      hosted_invoice_url: 'https://invoice.stripe.com/i/acct_1NUl6ZEtPI4IVpoj/test_YWNjdF8xTlVsNlpFdFBJNElWcG9qLF9PbkFoemdUdVRkMnlSS05SRXA4Z1FUY2tlSzZlWGRrLDg3NDYzNjk40200k9lvMAoy?s=ap';
      status_transitions: {
        paid_at: number;
        voided_at: null;
        finalized_at: number;
        marked_uncollectible_at: null;
      };
      customer_tax_exempt: 'none';
      total_excluding_tax: 4999;
      next_payment_attempt: null;
      statement_descriptor: null;
      subscription_details: {
        metadata: unknown;
      };
      webhooks_delivered_at: null;
      application_fee_amount: null;
      default_payment_method: null;
      subtotal_excluding_tax: 4999;
      total_discount_amounts: [];
      last_finalization_error: null;
      pre_payment_credit_notes_amount: 0;
      post_payment_credit_notes_amount: 0;
    };
    previous_attributes: {
      paid: false;
      charge: null;
      status: 'open';
      attempted: false;
      amount_paid: 0;
      attempt_count: 0;
      amount_remaining: 4999;
      status_transitions: {
        paid_at: null;
      };
    };
  };
}

export function useInvoicesQuery() {
  return useQuery(
    ['getInvoices'],
    async () => {
      const { data } = await axios.get<PageResponse<Invoice>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/invoices`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

export interface PaymentMethodsResponse {
  object: 'list';
  data: Array<{
    id: 'pm_1NwlIbEtPI4IVpoj0EkybENG';
    object: 'payment_method';
    billing_details: {
      address: {
        city: null;
        country: 'FR';
        line1: null;
        line2: null;
        postal_code: null;
        state: null;
      };
      email: 'mohammad.mesbah@wisdomise.io';
      name: 'Mohi';
      phone: null;
    };
    card: {
      brand: 'visa';
      checks: {
        address_line1_check: null;
        address_postal_code_check: null;
        cvc_check: 'pass';
      };
      country: 'US';
      exp_month: 12;
      exp_year: 2025;
      fingerprint: 'NsnLMqSAmBG6Njy7';
      funding: 'credit';
      generated_from: null;
      last4: '4242';
      networks: {
        available: ['visa'];
        preferred: null;
      };
      three_d_secure_usage: {
        supported: true;
      };
      wallet: null;
    };
    created: number;
    customer: 'cus_OkFo9gEa7gJVmJ';
    livemode: false;
    metadata?: unknown;
    type: 'card';
  }>;
  has_more: false;
  url: '/v1/payment_methods';
}

export function usePaymentMethodsQuery() {
  return useQuery(
    ['getPaymentMethods'],
    async () => {
      const { data } = await axios.get<PaymentMethodsResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/payment-methods`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}
