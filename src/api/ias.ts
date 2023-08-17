import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from 'config/reactQuery';
import { type InvestorAssetStructures } from './types/investorAssetStructure';

export const useInvestorAssetStructuresQuery = () =>
  useQuery<InvestorAssetStructures>(
    ['ias'],
    async () => {
      const { data } = await axios.get<InvestorAssetStructures>(
        '/ias/investor-asset-structures',
      );
      data[0]?.asset_bindings.forEach(ab => {
        ab.name =
          ab.asset.type === 'SYMBOL'
            ? ab.asset.symbol.name
            : ab.asset.pair.base.name;
      });
      data[0]?.financial_product_instances.forEach(fpi => {
        fpi.asset_bindings.forEach(ab => {
          ab.name =
            ab.asset.type === 'SYMBOL'
              ? ab.asset.symbol.name
              : ab.asset.pair.base.name;
        });
      });
      return data;
    },
    {
      staleTime: Infinity,
      refetchInterval: (data?: InvestorAssetStructures) =>
        data?.[0] != null && data?.[0].financial_product_instances.length > 0
          ? 3000
          : false,
    },
  );

export const useUpdateFPIStatusMutation = () =>
  useMutation<
    unknown,
    unknown,
    { fpiKey: string; status: 'stop' | 'start' | 'pause' | 'resume' }
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
