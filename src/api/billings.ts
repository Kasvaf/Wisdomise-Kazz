import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import {
  type Invoice,
  type PaymentMethodsResponse,
} from 'modules/account/models';
import { type PageResponse } from './types/page';
import { type PlanPeriod, type SubscriptionPlan } from './types/subscription';

export const usePlansQuery = (periodicity?: PlanPeriod) =>
  useQuery(
    ['getPlans', periodicity],
    async ({ queryKey }) => {
      const [, periodicity] = queryKey;
      const params = new URLSearchParams();
      if (periodicity) {
        params.set('periodicity', periodicity);
      }
      const { data } = await axios.get<PageResponse<SubscriptionPlan>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/plans?${params.toString()}`,
      );
      return data;
    },
    { staleTime: Number.POSITIVE_INFINITY },
  );

export const useInvoicesQuery = () =>
  useQuery(
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

export const useStripePaymentMethodsQuery = () => {
  const firstPaymentMethod = useUserFirstPaymentMethod();
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
      enabled: firstPaymentMethod === 'FIAT',
    },
  );
};

interface UpdateSubscriptionRequest {
  price_id: string;
}

export const useSubscriptionMutation = () =>
  useMutation<unknown, unknown, UpdateSubscriptionRequest>(
    ['patchSubscription'],
    async body => {
      const { data } = await axios.patch<
        unknown,
        PaymentMethodsResponse,
        UpdateSubscriptionRequest
      >(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/subscriptions`,
        body,
      );
      return data;
    },
  );

interface SubmitCryptoPaymentVariables {
  amount_paid: number;
  subscription_plan_key: string;
  crypto_invoice: {
    transaction_id: string;
    symbol_name: string;
    network_name: string;
  };
}

export const useSubmitCryptoPayment = () =>
  useMutation<unknown, unknown, SubmitCryptoPaymentVariables>({
    mutationFn: async variables => {
      await axios.post(`${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/invoices`, {
        ...variables,
        payment_method: 'CRYPTO',
      });
    },
  });

export const useUserFirstPaymentMethod = () => {
  // this returns user's LAST payment method, but invoices are in reverse order
  const { data } = useInvoicesQuery();
  return data?.results.at(0)?.payment_method;
};

interface SubmitTokenPaymentVariables {
  amount_paid: number;
  subscription_plan_key: string;
}

export const useSubmitTokenPayment = () =>
  useMutation<unknown, unknown, SubmitTokenPaymentVariables>({
    mutationFn: async variables => {
      await axios.post(`${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/invoices`, {
        ...variables,
        payment_method: 'TOKEN',
      });
    },
  });
