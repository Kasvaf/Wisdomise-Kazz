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

export const useAccountHistoricalStatisticQuery = () => {
  const ias = useInvestorAssetStructuresQuery();
  const fpi = ias?.data?.[0]?.financial_product_instances[0];
  const iasKey = ias?.data?.[0]?.key;

  return useQuery<InvestorAssetStructures>(
    ['ahs'],
    async () => {
      const { data } = await axios.get<InvestorAssetStructures>(
        `/ias/investor-asset-structures/${iasKey}/historical-statistics?resolution=1d`,
      );
      return data;
    },
    {
      enabled: Boolean(iasKey && fpi),
    },
  );
};
