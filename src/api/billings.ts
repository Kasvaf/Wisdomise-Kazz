import { useMutation, useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type Invoice } from 'modules/account/models';
import { queryClient } from 'config/reactQuery';
import { ofetch } from 'config/ofetch';
import { type PageResponse } from './types/page';
import { type PlanPeriod, type SubscriptionPlan } from './types/subscription';

export const usePlansQuery = (periodicity?: PlanPeriod) =>
  useQuery({
    queryKey: ['getPlans', periodicity],
    queryFn: async ({ queryKey }) => {
      const [, periodicity] = queryKey;
      const params = new URLSearchParams();
      if (periodicity) {
        params.set('periodicity', periodicity);
      }
      const data = await ofetch<PageResponse<SubscriptionPlan>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/plans?${params.toString()}`,
      );
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useInvoicesQuery = () =>
  useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const data = await ofetch<PageResponse<Invoice>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/invoices`,
      );
      return data;
    },

    staleTime: Number.POSITIVE_INFINITY,
  });

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
      await ofetch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/invoices`, {
        body: {
          ...variables,
          payment_method: 'CRYPTO',
        },
        method: 'post',
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
      await ofetch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/invoices`, {
        body: {
          ...variables,
          payment_method: 'TOKEN',
        },
        method: 'post',
      });
    },
  });

export const useInstantCancelMutation = () =>
  useMutation({
    mutationFn: async () => {
      await ofetch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/subscription-item/cancel`,
        {
          method: 'patch',
        },
      );
      await queryClient.invalidateQueries({ queryKey: ['account'] });
    },
  });

/**
 * *********************** Fiat Payment ***********************
 */
