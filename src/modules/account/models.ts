export interface Invoice {
  key: string;
  created_at: string;
  updated_at: string;
  stripe_id: string;
  status: string;
  amount_paid: number;
  data: {
    object: {
      id: string;
      tax: 0;
      paid: true;
      quote: null;
      total: number;
      charge: string;
      footer: null;
      number: string;
      object: 'invoice';
      status: string;
      created: number;
      currency: string;
      customer: string;
      discount: null;
      due_date: null;
      livemode: boolean;
      metadata: unknown;
      subtotal: number;
      attempted: true;
      discounts: [];
      rendering: null;
      amount_due: number;
      period_end: number;
      test_clock: null;
      amount_paid: number;
      application: null;
      description: null;
      invoice_pdf: string;
      account_name: string;
      auto_advance: false;
      effective_at: number;
      from_invoice: null;
      on_behalf_of: null;
      period_start: number;
      subscription: string;
      attempt_count: number;
      automatic_tax: {
        status: string;
        enabled: boolean;
      };
      custom_fields: null;
      customer_name: string;
      shipping_cost: null;
      transfer_data: null;
      billing_reason: string;
      customer_email: string;
      customer_phone: null;
      default_source: null;
      ending_balance: number;
      payment_intent: string;
      receipt_number: null;
      account_country: string;
      account_tax_ids: null;
      amount_shipping: number;
      latest_revision: null;
      amount_remaining: number;
      customer_address: {
        city: null;
        line1: null;
        line2: null;
        state: null;
        country: string;
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
      starting_balance: number;
      collection_method: 'charge_automatically';
      customer_shipping: null;
      default_tax_rates: [];
      rendering_options: null;
      total_tax_amounts: [
        {
          amount: 0;
          tax_rate: string;
          inclusive: false;
          taxable_amount: 0;
          taxability_reason: string;
        },
      ];
      hosted_invoice_url: string;
      status_transitions: {
        paid_at: number;
        voided_at: null;
        finalized_at: number;
        marked_uncollectible_at: null;
      };
      customer_tax_exempt: string;
      total_excluding_tax: number;
      next_payment_attempt: null;
      statement_descriptor: null;
      subscription_details: {
        metadata: unknown;
      };
      webhooks_delivered_at: null;
      application_fee_amount: null;
      default_payment_method: null;
      subtotal_excluding_tax: number;
      total_discount_amounts: [];
      last_finalization_error: null;
      pre_payment_credit_notes_amount: 0;
      post_payment_credit_notes_amount: 0;
    };
    previous_attributes: {
      paid: false;
      charge: null;
      status: string;
      attempted: false;
      amount_paid: 0;
      attempt_count: 0;
      amount_remaining: number;
      status_transitions: {
        paid_at: null;
      };
    };
  };
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
