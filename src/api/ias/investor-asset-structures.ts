import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import normalizePair from 'api/normalizePair';
import { type InvestorAssetStructures } from '../types/investorAssetStructure';

export const useInvestorAssetStructuresQuery = () =>
  useQuery<InvestorAssetStructures>(
    ['ias'],
    async () => {
      const { data } = await axios.get<InvestorAssetStructures>(
        '/ias/investor-asset-structures',
      );
      return data.map(fpi => ({
        ...fpi,
        asset_bindings: fpi?.asset_bindings.map(ab => ({
          ...ab,
          asset: normalizePair(ab.asset),
        })),
        financial_product_instances: fpi?.financial_product_instances.map(
          fpi => ({
            ...fpi,
            asset_bindings: fpi.asset_bindings.map(ab => ({
              ...ab,
              asset: normalizePair(ab.asset),
            })),
          }),
        ),
      }));
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: (data?: InvestorAssetStructures) =>
        data?.[0] != null && data?.[0].financial_product_instances.length > 0
          ? 3000
          : false,
    },
  );
