import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';

export type FpiStatusMutationType = 'stop' | 'start' | 'pause' | 'resume';

export const useUpdateFPIStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    unknown,
    { fpiKey: string; status: FpiStatusMutationType }
  >(
    async data =>
      await axios.post(
        `/ias/financial-product-instances/${data.fpiKey}/${data.status}`,
      ),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['ias']);
      },
    },
  );
};

export const useCreateFPIMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    FinancialProductInstance,
    unknown,
    { fpKey: string; account?: string }
  >(
    async ({ fpKey, account }) => {
      const { data } = await axios.post<FinancialProductInstance>(
        '/ias/financial-product-instances',
        {
          financial_product: {
            key: fpKey,
          },
          external_account: account
            ? {
                key: account,
              }
            : undefined,
          // equity: 123, // 0-main_quote_equity (TODO: partial deposit)
        },
      );
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['ias']);
      },
    },
  );
};
