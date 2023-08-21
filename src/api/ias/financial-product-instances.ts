import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'config/reactQuery';

export type FpiStatusMutationType = 'stop' | 'start' | 'pause' | 'resume';

export const useUpdateFPIStatusMutation = () =>
  useMutation<
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

export const useCreateFPIMutation = () =>
  useMutation<{ key: string }, unknown, string>(
    async fpKey => {
      const { data } = await axios.post('/ias/financial-product-instances', {
        financial_product: {
          key: fpKey,
        },
        // equity: 123, // 0-main_quote_equity (TODO: partial deposit)
      });
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['ias']);
      },
    },
  );
