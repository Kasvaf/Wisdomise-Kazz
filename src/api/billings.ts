import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import {
  type Invoice,
  type PaymentMethodsResponse,
} from 'modules/account/models';
import queryClient from 'config/reactQuery';
import { type PageResponse } from './types/page';
import {
  type PaymentMethod,
  type PlanPeriod,
  type SubscriptionPlan,
} from './types/subscription';
import { useAccountQuery } from './account';

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
    ['invoices'],
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

interface UpdateSubscriptionRequest {
  subscription_plan_key: string | null;
}

export const useSubscriptionMutation = () =>
  useMutation<unknown, unknown, UpdateSubscriptionRequest>({
    mutationKey: ['patchSubscription'],
    mutationFn: async body => {
      const { data } = await axios.patch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/subscription-item/subscription-plan`,
        body,
      );
      return data;
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(['account']),
        queryClient.invalidateQueries(['invoices']),
      ]),
  });

export const useChangePaymentMethodMutation = () => {
  return useMutation({
    mutationFn: async (variables: { payment_method: PaymentMethod }) => {
      await axios.patch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/subscription-item/payment-method`,
        variables,
      );
    },
    onSuccess: () => queryClient.invalidateQueries(['account']),
  });
};

/**
 * *********************** Crypto Payment ***********************
 */
interface SubmitCryptoPaymentVariables {
  invoice_key?: string;
  amount_paid?: number;
  subscription_plan_key?: string;
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

/**
 * *********************** Token Payment ***********************
 */
interface SubmitTokenPaymentVariables {
  amount_paid?: number;
  invoice_key?: string;
  subscription_plan_key?: string;
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

export const useInstantCancelMutation = () =>
  useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/subscription-item/cancel`,
      );
      await queryClient.invalidateQueries(['account']);
    },
  });

/**
 * *********************** Fiat Payment ***********************
 */

export const useStripePaymentMethodsQuery = () => {
  const account = useAccountQuery();
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
      enabled: !!account.data?.stripe_customer_id,
    },
  );
};
