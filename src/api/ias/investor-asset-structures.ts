import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import normalizePair from 'api/normalizePair';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { type InvestorAssetStructures } from '../types/investorAssetStructure';

export const useInvestorAssetStructuresQuery = () => {
  const isLoggedIn = useIsLoggedIn();
  return useQuery<InvestorAssetStructures | null>(
    ['ias', isLoggedIn],
    async () => {
      if (!isLoggedIn) return null;

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
      refetchInterval: (data?: InvestorAssetStructures | null) =>
        data?.[0] != null && data?.[0]?.financial_product_instances.length > 0
          ? 3000
          : false,
    },
  );
};

export function useMainQuote() {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;
  return mea?.quote.name || '';
}
