import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type InvestorAssetStructures } from '../types/investorAssetStructure';

export const useInvestorAssetStructuresQuery = () =>
  useQuery<InvestorAssetStructures>(
    ['ias'],
    async () => {
      const { data } = await axios.get<InvestorAssetStructures>(
        '/ias/investor-asset-structures',
      );
      for (const ab of data[0]?.asset_bindings ?? []) {
        ab.name =
          ab.asset.type === 'SYMBOL'
            ? ab.asset.symbol.name
            : ab.asset.pair.base.name;
      }
      for (const fpi of data[0]?.financial_product_instances ?? []) {
        for (const ab of fpi.asset_bindings) {
          ab.name =
            ab.asset.type === 'SYMBOL'
              ? ab.asset.symbol.name
              : ab.asset.pair.base.name;
        }
      }
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: (data?: InvestorAssetStructures) =>
        data?.[0] != null && data?.[0].financial_product_instances.length > 0
          ? 3000
          : false,
    },
  );
